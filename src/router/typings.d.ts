import 'vue-router';
// 给模块添加额外类型，ts中的接口合并
declare module 'vue-router' {
  interface RouteMeta {
    icon?: string;
    title?: string;
    hidden?: boolean; // 是否在侧边栏隐藏该路由
    roles?: string[]; // 当前路由所需角色权限
    alwaysShow?: boolean; // 是否总是显示根路由
    breadcrumb?: boolean; // 是否在面包屑显示
    affix?: boolean; // 是否在tagsview固定显示
    noCache?: boolean; // 是否不缓存该路由
  }
}
