// 用户角色接口
import http from '@/api/config/request';
import type { IRole, IRoleResponseData, ApiResponse } from './type';

// 获取所有角色
export const getRoles = (
  params = { pageNum: 0, pageSize: 10 }
): Promise<ApiResponse<IRoleResponseData>> => {
  return http.get('/role', { params });
};

// 新增角色
export const addRole = (data: IRole): Promise<ApiResponse> => {
  return http.post('/role', data);
};

// 更新角色
export const updateRole = (
  id: number,
  data: Partial<IRole>
): Promise<ApiResponse> => {
  return http.put(`/role/${id}`, data);
};
// 删除角色
export const deleteRole = (id: number): Promise<ApiResponse> => {
  return http.delete(`/role/${id}`);
};
