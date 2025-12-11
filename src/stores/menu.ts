import type { MenuData, ITreeItemData } from '@/api/type';
import {
  addMenu,
  deleteMenuById,
  updateMenuById,
  getAllMenus as getAllMenusApi,
  updateBulkMenu as updateBulkMenuApi
} from './../api/menu';
import { generateTree } from '@/utils/generateTree';
import { getRoleAccessByRoles } from '@/api/roleAccess';
export interface IMenuState {
  menuList: Array<MenuData>;
  menuTreeData: ReturnType<typeof generateTree>;
  authMenuList: MenuData[];
  authMenuTreeData: ITreeItemData[];
}
export const useMenuStore = defineStore('menu', () => {
  const state = reactive<IMenuState>({
    menuList: [],
    menuTreeData: [],
    authMenuList: [], // 侧边菜单需要的
    authMenuTreeData: []
  });
  const getAllMenus = async () => {
    try {
      const { data } = await getAllMenusApi();
      state.menuList = data;
      state.menuTreeData = generateTree(data);
    } catch (error) {
      return Promise.reject(error);
    }
  };
  const appendMenu = async (menu: ITreeItemData) => {
    try {
      const { data } = await addMenu(menu);
      state.menuList.push({ ...data });
      state.menuTreeData = generateTree(state.menuList);
      return true;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  const removeMenu = async (data: ITreeItemData) => {
    try {
      await deleteMenuById(data.id);
      const idx = state.menuList.findIndex((menu) => menu.id === data.id);
      state.menuList.splice(idx, 1);
      state.menuTreeData = generateTree(state.menuList);
      return true;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  const updateBulkMenu = async () => {
    // 更新sort_id
    state.menuTreeData.forEach((menu, index) => (menu.sort_id = index));
    // 删除子节点children
    const menus = state.menuTreeData.map((menu) => {
      const temp = { ...menu };
      delete temp.children;
      return temp;
    });
    try {
      // 批量更新
      await updateBulkMenuApi(menus);
      return true;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  const updateMenu = async (data: Partial<MenuData>) => {
    try {
      await updateMenuById(Number(data.id), data);
      await getAllMenus();
      return true;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const getAllMenuListByAdmin = async () => {
    try {
      const { data } = await getAllMenusApi();
      state.authMenuList = data;
      state.authMenuTreeData = generateTree(data, true);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const getMenuListByRoles = async (roles: number[]) => {
    const res = await getRoleAccessByRoles(roles);
    if (res.code == 0) {
      const { data } = res;
      const access = data.access;
      state.authMenuList = access;
      state.authMenuTreeData = generateTree(access, true);
    }
  };

  return {
    state,
    getAllMenus,
    appendMenu,
    removeMenu,
    updateBulkMenu,
    updateMenu,
    getAllMenuListByAdmin,
    getMenuListByRoles
  };
});
