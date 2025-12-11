// 鉴权及获取用户权限
import nProgress from 'nprogress';
import 'nprogress/nprogress.css';
import router from './router';
import { getToken } from './utils/auth';
import useUserStore from './stores/user';
import { usePermissionStore } from './stores/permission';
nProgress.configure({ showSpinner: false });
// 配置不需要做校验的路由白名单
const whiteList: string[] = ['/login', '/404'];
router.beforeEach(async (to) => {
  nProgress.start();
  const hasToken = getToken();
  const userStore = useUserStore();
  // const permissionStore = usePermissionStore();
  if (hasToken) {
    // 有token，也可能需要去验证token的有效性，就是拿token去请求用户信息接口

    if (to.path === '/login') {
      // 已登录且要跳转到登录页，直接重定向到首页
      nProgress.done();
      return {
        path: '/',
        replace: true
      };
    } else {
      // 有可能token是伪造的
      try {
        // 用token获取用户信息
        const hasRoles = userStore.state.roles.length > 0;
        if (hasRoles) {
          nProgress.done();
          return true;
        } else {
          // await userStore.getUserInfo();
          // // const roles = userStore.state.roles; // 用角色来生成菜单树
          // const routes = await permissionStore.generateRoutes();
          // routes.forEach(router.addRoute);
          // return router.push(to.path);
          nProgress.done();
        }
      } catch (error) {
        userStore.logout();
        nProgress.done();
        return {
          path: '/login',
          replace: true,
          query: {
            redirect: to.path,
            ...to.query
          }
        };
      }
    }
  } else {
    // 未登录
    if (whiteList.includes(to.path)) {
      // 在免登录白名单，直接进入
      nProgress.done();
      return true;
    } else {
      nProgress.done();
      // 重定向到登录页及携带当前页面路径和参数
      return {
        path: '/login',
        replace: true,
        query: {
          redirect: to.path,
          ...to.query
        }
      };
    }
  }
});
