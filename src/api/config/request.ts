import axios, {
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig
} from 'axios';
import { ElMessage, ElLoading } from 'element-plus';
import { getToken } from '@/utils/auth';
import useUserStore from '@/stores/user';

type ExtendedConfig = AxiosRequestConfig & {
  retry?: number; // 重试次数，默认 0
  retryDelay?: number; // 重试基准延迟 ms，默认 500
  showLoading?: boolean; // 是否显示全局 loading，默认 true
  loadingText?: string; // loading 文案
  silenceMsg?: boolean; // 是否静默不弹消息，默认 false
  requestKey?: string; // 可选请求唯一标识，用于取消/去重
};

const DEFAULT_RETRY = 0;
const DEFAULT_RETRY_DELAY = 500;
const DEFAULT_SHOW_LOADING = true;

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API as string,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
});

// 全局 loading 管理（计数器）
let loadingCount = 0;
let loadingInstance: ReturnType<typeof ElLoading.service> | null = null;
const showGlobalLoading = (text = '加载中...') => {
  if (loadingCount === 0) {
    loadingInstance = ElLoading.service({
      lock: true,
      text,
      background: 'rgba(0, 0, 0, 0.4)'
    });
  }
  loadingCount++;
};
const hideGlobalLoading = () => {
  loadingCount = Math.max(0, loadingCount - 1);
  if (loadingCount === 0 && loadingInstance) {
    loadingInstance.close();
    loadingInstance = null;
  }
};

// 记录正在进行的请求以便取消或去重
const controllerMap = new Map<string, AbortController>();

// 生成请求唯一 key（method + url + params/body）
const genRequestKey = (config: AxiosRequestConfig) => {
  const url = config.url || '';
  const method = (config.method || 'get').toLowerCase();
  const params = config.params ? JSON.stringify(config.params) : '';
  const data = config.data ? JSON.stringify(config.data) : '';
  return `${method}::${url}::${params}::${data}`;
};

// 请求拦截器：注入 token、处理 loading、创建 AbortController
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const extConfig = config as ExtendedConfig;
    const token = getToken();
    if (token) {
      config.headers = config.headers || {};
      (config.headers as any)['Authorization'] = `Bearer ${token}`;
    }

    const showLoading = extConfig.showLoading ?? DEFAULT_SHOW_LOADING;
    if (showLoading) {
      showGlobalLoading(extConfig.loadingText || '加载中...');
    }

    // 支持 AbortController 取消
    const controller = new AbortController();
    config.signal = controller.signal;
    const key =
      (extConfig.requestKey as string) ||
      genRequestKey(extConfig as AxiosRequestConfig);
    // 如果已有相同 key 的请求，可以先取消它（实现去重/覆盖）
    if (controllerMap.has(key)) {
      const prev = controllerMap.get(key)!;
      try {
        prev.abort();
      } catch (_) {}
      controllerMap.delete(key);
    }
    controllerMap.set(key, controller);
    // 把 key 放到 config 上，响应阶段会用于清理
    (config as any).__requestKey = key;

    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器：全局错误处理、重试逻辑、loading 隐藏、清理 controller map
instance.interceptors.response.use(
  async (response: AxiosResponse) => {
    const config = response.config as ExtendedConfig;
    // 清理 controllerMap
    const key = (config as any).__requestKey as string | undefined;
    if (key && controllerMap.has(key)) controllerMap.delete(key);

    const showLoading = config.showLoading ?? DEFAULT_SHOW_LOADING;
    if (showLoading) hideGlobalLoading();
    const status = response.status;
    // 处理 HTTP 层成功（200 / 304 等）
    if (status === 200 || status === 304) {
      // 假设后端约定 { code: number, message: string, data: any }
      const resData = response.data || {};
      // 若后端无 code 字段，直接返回 data
      if (resData && typeof resData === 'object' && 'code' in resData) {
        if (resData.code !== 0) {
          if (!config.silenceMsg)
            ElMessage.error(resData.message || '请求出错');
          return Promise.reject(new Error(resData.message || '请求出错'));
        }
        return resData;
      }
      // 非约定格式，直接返回 response.data
      return resData;
    }
    // 非 200/304 的 http 状态也做统一提示
    let msg = `请求失败，HTTP 状态码: ${status}`;
    switch (status) {
      case 400:
        msg = '请求参数错误 (400)';
        break;
      case 401:
        msg = '未授权 (401)，请重新登录';
        break;
      case 403:
        msg = '禁止访问 (403)';
        break;
      case 404:
        msg = '资源未找到 (404)';
        break;
      case 500:
        msg = '服务器内部错误 (500)';
        break;
      case 502:
        msg = '网关错误 (502)';
        break;
      default:
        msg = `网络异常 (${status})`;
    }
    ElMessage.error(msg);
    // 对于 401 可做额外处理（清除 token 并跳转登录）
    if (status === 401) {
      try {
        // 根据项目实际 key 调整
        const userStore = useUserStore();
        userStore.logout();
      } catch (_) {}
      setTimeout(() => {
        window.location.href = '/login';
      }, 800);
    }
    return Promise.reject(new Error(msg));
  },
  async (error) => {
    const config = (error.config || {}) as ExtendedConfig;
    // 清理 controllerMap
    const key = (config as any).__requestKey as string | undefined;
    if (key && controllerMap.has(key)) controllerMap.delete(key);

    const showLoading = config.showLoading ?? DEFAULT_SHOW_LOADING;
    if (showLoading) hideGlobalLoading();

    // 取消请求，不做重试
    if (axios.isCancel(error) || error?.name === 'CanceledError') {
      return Promise.reject(new Error('请求已取消'));
    }

    // 重试逻辑（仅对网络错误或5xx错误生效）
    const shouldRetry = (() => {
      if (!config) return false;
      const status = error?.response?.status;
      // 网络错误（no response） 或 服务端错误 5xx
      return !error?.response || (status >= 500 && status < 600);
    })();

    const retries = config?.retry ?? DEFAULT_RETRY;
    const retryDelay = config?.retryDelay ?? DEFAULT_RETRY_DELAY;
    (config as any).__retryCount = (config as any).__retryCount || 0;

    if (shouldRetry && (config as any).__retryCount < retries) {
      (config as any).__retryCount += 1;
      const delay = retryDelay * Math.pow(2, (config as any).__retryCount - 1);
      await new Promise((r) => setTimeout(r, delay));
      // 创建新的 AbortController 并替换
      const controller = new AbortController();
      config.signal = controller.signal;
      const newKey = (config.requestKey as string) || genRequestKey(config);
      controllerMap.set(newKey, controller);
      (config as any).__requestKey = newKey;
      return instance(config);
    }

    // 最终错误处理
    // if (!config?.silenceMsg) {
    //   const msg =
    //     error?.response?.data?.message || error?.message || '网络异常';
    //   ElMessage.error(msg);
    // }
    // error.response 存在说明已收到服务端响应（但状态非 2xx）
    if (error && error.response) {
      const status = error.response.status;
      let msg =
        error.response.data?.message || error.message || `请求错误 (${status})`;
      switch (status) {
        case 400:
          msg = '请求参数错误 (400)';
          break;
        case 401:
          msg = '未授权 (401)，请重新登录';
          try {
            localStorage.removeItem('AccessToken');
          } catch (_) {}
          setTimeout(() => {
            window.location.href = '/login';
          }, 800);
          break;
        case 403:
          msg = '禁止访问 (403)';
          break;
        case 404:
          msg = '资源未找到 (404)';
          break;
        case 500:
          msg = '服务器内部错误 (500)';
          break;
        case 502:
          msg = '网关错误 (502)';
          break;
        default:
          msg =
            error.response.data?.message ||
            error.message ||
            `网络异常 (${status})`;
      }
      ElMessage.error(msg);
      return Promise.reject(error);
    }

    // 没有响应（如网络断开、跨域、超时等）
    if (error && error.request) {
      ElMessage.error('无响应，网络请求失败或请求被阻断');
    } else {
      ElMessage.error(error.message || '请求失败');
    }
    return Promise.reject(error);
  }
);

// 导出取消请求方法
export const cancelRequestByKey = (key: string) => {
  const controller = controllerMap.get(key);
  if (controller) {
    try {
      controller.abort();
    } catch (_) {}
    controllerMap.delete(key);
  }
};

export const cancelAllRequests = () => {
  controllerMap.forEach((controller) => {
    try {
      controller.abort();
    } catch (_) {}
  });
  controllerMap.clear();
};

// 简洁的请求封装，自动处理泛型与 ExtendedConfig
async function request<T = any>(config: ExtendedConfig): Promise<T> {
  const res = await instance.request(config);
  return res as T;
}

// 常用方法
export const http = {
  get<T = any>(url: string, config?: ExtendedConfig) {
    return request<T>({ ...(config || {}), url, method: 'get' });
  },
  delete<T = any>(url: string, config?: ExtendedConfig) {
    return request<T>({ ...(config || {}), url, method: 'delete' });
  },
  post<T = any>(url: string, data?: any, config?: ExtendedConfig) {
    return request<T>({ ...(config || {}), url, method: 'post', data });
  },
  put<T = any>(url: string, data?: any, config?: ExtendedConfig) {
    return request<T>({ ...(config || {}), url, method: 'put', data });
  },
  patch<T = any>(url: string, data?: any, config?: ExtendedConfig) {
    return request<T>({ ...(config || {}), url, method: 'patch', data });
  }
};

export default http;

/**
 * 
 * 使用示例（简短）：
    简单 GET：
      import http from '@/api/config/request';
      const res = await http.get('/user/list');
    POST 请求带数据：
      const res = await http.post('/user/create', { username: 'test', password: '123456' });
    自定义请求配置：
      const res = await http.get('/user/list', { showLoading: false, silenceMsg: true });

    带重试、关闭 loading：
      const res = await http.post('/upload', formData, { retry: 3, retryDelay: 500, showLoading: false });

    取消指定请求：
      import { cancelRequestByKey } from '@/api/config/request';
      cancelRequestByKey('post::/api/longtask::{}::{"task":1}');

    说明：
      每次请求会自动创建 AbortController，你也可通过 requestKey 自定义请求标识以便取消或去重。
      支持后端统一返回 { code, message, data } 的处理逻辑；若非该格式，直接返回响应体。
      重试为指数回退，默认不重试。
 */
