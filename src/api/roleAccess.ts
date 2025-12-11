import http from './config/request';
import type { ApiResponse } from '@/api/type';

export interface IRoleAccess {
  id: number;
  access_id: number;
  role_id: number;
}

export type IRoleAccessList = IRoleAccess[];

// 获取角色对应权限
export const getRoleAccess = (
  id: number
): Promise<ApiResponse<IRoleAccessList>> => {
  return http.get(`/role_access/${id}`);
};
// 给角色分配权限
export const allocRoleAccess = (
  id: number,
  data: number[]
): Promise<ApiResponse> => {
  return http.post(`/role_access/${id}`, {
    access: data
  });
};

export const getRoleAccessByRoles = (
  roles: number[]
): Promise<ApiResponse<any>> => {
  return http.post(`/role_access/role/access`, {
    roles
  });
};
