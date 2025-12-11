import http from './config/request';
import type {
  IUserLoginData,
  ApiResponse,
  ILoginResponseData,
  IUserQueryParams,
  IUsers,
  IUser
} from './type';

// 用户登录接口
export const login = (
  data: IUserLoginData
): Promise<ApiResponse<ILoginResponseData>> => {
  return http.post('/user/logins', data);
};

// 获取用户列表
export const getUsers = (
  params: IUserQueryParams
): Promise<ApiResponse<IUsers>> => {
  const {
    pageNum = 0,
    pageSize = 10,
    username = '',
    status,
    mobile = ''
  } = params;
  return http.get('/user', {
    params: {
      pageNum,
      pageSize,
      username,
      status,
      mobile
    }
  });
};

// 删除用户
export const deleteUser = (id: number): Promise<ApiResponse> => {
  return http.delete(`/user/${id}`);
};

// 新增用户 也可以用来注册用户 没有传递密码时 后端可以设置默认密码
export const addUser = (data: IUser): Promise<ApiResponse> => {
  return http.post('/auth/register', data);
};

// 更新用户
export const updateUser = (id: number, data: IUser): Promise<ApiResponse> => {
  return http.put(`/user/${id}`, data);
};

// 获取用户信息
export const getUserInfo = (): Promise<ApiResponse<IUser>> => {
  return http.post('/user/info');
};
