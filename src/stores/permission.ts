import type { RouteRecordRaw } from 'vue-router';
import useUserStore from './user';
import { useMenuStore } from './menu';

import { asyncRoutes } from '@/router';

export const usePermissionStore = defineStore('permission', () => {
  const userStore = useUserStore();
  const menuStore = useMenuStore();
  let accessMenuRoutes: RouteRecordRaw[] = [];
  const generateRoutes = async () => {
    const rolesName = computed(() =>
      userStore.state.roles.map((item) => item.name)
    );

    if (rolesName.value.includes('super_admin')) {
      accessMenuRoutes = asyncRoutes; // 添加了动态组件
      // 根据角色来生成一个菜单
      await menuStore.getAllMenuListByAdmin();
      return accessMenuRoutes;
    } else {
      return [];
    }
  };
  return {
    generateRoutes
  };
});
