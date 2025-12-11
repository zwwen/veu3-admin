import http from './config/request';
import type { ApiResponse, MenuData } from './type';

// 获取所有菜单
export const getAllMenus = (): Promise<ApiResponse<MenuData[]>> => {
  return http.get('/access/menu');
};
// 添加菜单
export const addMenu = (
  data: Partial<MenuData>
): Promise<ApiResponse<MenuData>> => {
  return http.post(`/access/menu/`, data);
};
// 根据id更新菜单
export const updateMenuById = (
  id: number,
  data: Partial<MenuData>
): Promise<ApiResponse<MenuData[]>> => {
  return http.put(`/access/menu/${id}`, data);
};
// 根据id删除菜单
export const deleteMenuById = (
  id: number
): Promise<ApiResponse<MenuData[]>> => {
  return http.delete(`/access/menu/${id}`);
};

// 批量更新
export const updateBulkMenu = (
  data: Partial<MenuData>[]
): Promise<ApiResponse> => {
  return http.patch('/access/menu/update', { access: data });
};
