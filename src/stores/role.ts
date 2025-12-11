import type { IRoleResponseData, IRole, IRoleQueryParams } from '@/api/type';
import {
  getRoles as getRolesApi,
  addRole as addRoleApi,
  updateRole as updateRoleApi,
  deleteRole as deleteRoleApi
} from '@/api/role';
type WithRoleParams = IRole & IRoleQueryParams;
export const useRoleStore = defineStore('role', () => {
  const state = reactive<IRoleResponseData>({
    roles: [] as IRole[],
    count: 0
  });

  const getRoles = async (params: IRoleQueryParams) => {
    try {
      const { data } = await getRolesApi(params);
      state.roles = data.roles;
      state.count = data.count;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const addRole = async (data: WithRoleParams) => {
    const { pageNum, pageSize, ...roleData } = data;
    try {
      await addRoleApi(roleData);
      await getRoles({ pageNum, pageSize });
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const updateRole = async (data: WithRoleParams) => {
    const { pageNum, pageSize, ...roleData } = data;
    try {
      await updateRoleApi(roleData.id, roleData);
      await getRoles({ pageNum, pageSize });
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const deleteRole = async (data: WithRoleParams) => {
    const { pageNum, pageSize, id } = data;
    try {
      await deleteRoleApi(id);
      await getRoles({ pageNum, pageSize });
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return {
    state,
    getRoles,
    addRole,
    updateRole,
    deleteRole
  };
});
