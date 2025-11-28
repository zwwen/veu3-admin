<template>
  <el-breadcrumb separator="/" leading-50px ml-20px inline-block>
    <!-- s.path 可能是一个动态路由 也就是带有路由参数的导航 test/:id -->
    <el-breadcrumb-item v-for="(route, index) in list" :key="route.path">
      <span v-if="list.length - 1 === index">{{ route.meta?.title }}</span>
      <a v-else @click.prevent="handleLink(route)">{{ route.meta?.title }}</a>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import type { RouteLocationMatched } from 'vue-router';
import { compile } from 'path-to-regexp';
type PartialRouteLocationMatched = Partial<RouteLocationMatched>;
const routes = useRoute();
const router = useRouter();
const list = ref<PartialRouteLocationMatched[]>([]);

const getBreadCrumb = () => {
  // 根据当前路由路径 去匹配对应的菜单数据
  let matched = routes.matched.filter(
    (match) => match.meta.title
  ) as PartialRouteLocationMatched[];
  if (matched[0]?.path !== '/dashboard') {
    // 如果第一个不是dashboard 则手动添加dashboard
    matched = [
      {
        path: '/dashboard',
        meta: { title: 'dashboard' }
      },
      ...matched
      // {
      //   path: '/xxx',
      //   meta: { title: 'xxx' }
      // }
    ];
  }
  list.value = matched.filter((match) => match.meta?.breadcrumb !== false);
};
watch(() => routes.path, getBreadCrumb, { immediate: true });
// 需要根据面包屑导航 + 当前访问的路径去生成对应的跳转路径
const compilePath = (path: string) => {
  const params = routes.params;
  const toPath = compile(path)(params);
  // console.log('toPath:', toPath);
  return toPath;
};
const handleLink = (route: PartialRouteLocationMatched) => {
  const { path, redirect } = route;
  // console.log('handleLink', path);
  if (redirect) {
    return router.push(redirect as string);
  }
  router.push(compilePath(path!));
};
</script>

<style scoped></style>
