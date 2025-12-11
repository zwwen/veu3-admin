import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw
} from 'vue-router';
import Layout from '@/layout/index.vue';
const constansRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard/index.vue'),
        meta: {
          title: 'Dashboard',
          icon: 'ant-design:dashboard-outlined',
          affix: true, // 固定在tagsview
          noCache: false // 不缓存该路由
        }
      }
    ]
  },
  {
    path: '/redirect',
    component: Layout,
    meta: {
      hidden: true
    },
    // 当跳转到  /redirect/a/b/c/d?query=1
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/Redirect/index.vue')
      }
    ]
  },

  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login/index.vue'),
    meta: { title: 'login', hidden: true }
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/NotFound/index.vue'),
    meta: { title: '404', hidden: true }
  }
];
export const asyncRoutes: RouteRecordRaw[] = [
  // {
  //   path: '/test',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index/:id',
  //       name: 'Test',
  //       component: () => import('@/views/test/index.vue'),
  //       meta: { title: 'test', icon: 'ant-design:file-text-outlined' }
  //     }
  //   ]
  // },
  {
    path: '/documentation',
    component: Layout,
    redirect: '/documentation/index',
    children: [
      {
        path: 'index',
        name: 'Documentation',
        component: () => import('@/views/Documentation/index.vue'),
        meta: {
          title: 'documentation',
          icon: 'ant-design:file-text-outlined'
        }
      }
    ]
  },
  {
    path: '/guide',
    component: Layout,
    redirect: '/guide/index',
    children: [
      {
        path: 'index',
        name: 'Guide',
        component: () => import('@/views/Guide/index.vue'),
        meta: { title: 'guide', icon: 'ant-design:compass-outlined' }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/menu',
    meta: {
      title: 'system',
      icon: 'ant-design:setting-outlined',
      alwaysShow: true, // 总是显示父文件夹
      breadcrumb: true // 面包屑显示
    },
    children: [
      {
        path: 'menu',
        name: 'Menu',
        component: () => import('@/views/System/menu/index.vue'),
        meta: {
          title: 'menu',
          icon: 'material-symbols:format-list-bulleted-add-rounded'
        }
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/System/user/index.vue'),
        meta: { title: 'user', icon: 'ant-design:user-outlined' }
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/System/role/index.vue'),
        meta: { title: 'role', icon: 'ant-design:property-safety-outlined' }
      }
    ]
  },
  {
    path: '/external-link',
    component: Layout,
    children: [
      {
        path: 'https://github.com/zwwen/veu3-admin',
        redirect: '/',
        meta: {
          title: 'externalLink',
          icon: 'ant-design:link-outlined'
        }
      }
    ]
  }
];
// 前端需要配置好所有的路由，然后根据用户的权限来获取后端的数据来动态添加异步路由
export const routes: RouteRecordRaw[] = [...constansRoutes, ...asyncRoutes];
const router = createRouter({
  history: createWebHistory(),
  routes
});
export default router;
