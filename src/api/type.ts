// 通用API响应类型
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

// 错误响应类型
export interface ErrorResponse {
  code: number;
  message: string;
}

// 用户登录请求数据类型
export interface IUserLoginData {
  username: string;
  password: string;
}
// 登录响应数据类型
export interface ILoginResponseData {
  token: string;
}
// 角色类型
export interface IRole {
  id: number;
  name: string;
  isDefault: number;
  createdAt: string;
  updatedAt: string;
  description: string;
}

// 角色响应数据类型
export interface IRoleResponseData {
  roles: IRole[];
  count: number;
}
// 角色获取参数类型
export interface IRoleQueryParams {
  pageNum: number;
  pageSize: number;
}

// 用户类型
export interface IUser {
  id: number;
  username: string;
  email: string;
  mobile: string;
  isSuper: boolean;
  status: boolean;
  avatar: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  roles: IRole[];
  roleIds: number[]; // 修改用户信息的时候会用到，表示该用户拥有的角色ID列表，后端接口只需要id
}
// 用户响应数据类型
export interface IUsers {
  users: IUser[];
  count: number;
}
// 用户获取参数类型
export interface IUserQueryParams {
  pageNum?: number;
  pageSize?: number;
  username?: string;
  status?: boolean;
  mobile?: string;
}

export type IUserQuery = IUser & {
  pageNum?: number;
  pageSize?: number;
};

// 分页响应类型
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  pageNum: number;
  pageSize: number;
}

// 登录凭证类型
export interface LoginCredentials {
  username: string;
  password: string;
}

// 菜单数据类型
export interface MenuData {
  id: number;
  title: string;
  path: string;
  icon: string;
  name: string;
  sort_id: number;
  parent_id: number;
}

export interface ITreeItemData extends MenuData {
  children?: ITreeItemData[];
}

// 菜单及权限类型
export interface MenuItem {
  id: number;
  name: string;
}
