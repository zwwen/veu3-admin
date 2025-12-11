import type {
  IUserLoginData,
  IUsers,
  IUserQueryParams,
  IUserQuery,
  IRole,
  IUser
} from '@/api/type';
import {
  login as loginApi,
  getUsers as getUsersApi,
  addUser as addUserApi,
  updateUser as updateUserApi,
  deleteUser as deleteUserApi,
  getUserInfo as getUserInfoApi
} from '@/api/user';
import { setToken, removeToken } from '@/utils/auth';
import { useTagsView } from './tagsView';
export const useUserStore = defineStore('user', () => {
  const state = reactive({
    token: '' as string,
    users: [] as IUsers['users'],
    count: 0 as number,
    roles: [] as IRole[],
    userInfo: {} as IUser
  });
  const tagsViewStore = useTagsView();

  const login = async (data: IUserLoginData) => {
    try {
      const response = await loginApi(data);
      // console.log('登录接口返回数据', response);
      state.token = response.data.token;
      setToken(state.token);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const logout = () => {
    state.token = '';
    removeToken();
    // 还可以做一些清理工作，比如清除用户信息、tagsView等
    tagsViewStore.delAllView();
  };
  // 获取全部用户
  const getAllUsers = async (params: IUserQueryParams) => {
    try {
      const response = await getUsersApi(params);
      state.users = response.data.users;
      state.count = response.data.count;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  // 新增用户
  const addUser = async (data: IUserQuery) => {
    const { pageNum, pageSize, ...params } = data;
    try {
      await addUserApi(params);
      await getAllUsers({ pageNum, pageSize });
    } catch (error) {
      return Promise.reject(error);
    }
  };
  // 更新用户
  const updateUser = async (data: IUserQuery) => {
    const { pageNum, pageSize, ...params } = data;
    try {
      await updateUserApi(params.id, params);
      await getAllUsers({ pageNum, pageSize });
    } catch (error) {
      return Promise.reject(error);
    }
  };
  // 删除用户
  const deleteUser = async (data: IUserQuery) => {
    const { pageNum, pageSize, id } = data;
    try {
      await deleteUserApi(id);
      await getAllUsers({ pageNum, pageSize });
    } catch (error) {
      return Promise.reject(error);
    }
  };
  // 获取用户信息
  const getUserInfo = async () => {
    try {
      const { data } = await getUserInfoApi();
      const { roles, ...info } = data;
      state.roles = roles;
      state.userInfo = info as IUser;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  return {
    state,
    login,
    logout,
    getAllUsers,
    addUser,
    updateUser,
    deleteUser,
    getUserInfo
  };
});
export default useUserStore;
