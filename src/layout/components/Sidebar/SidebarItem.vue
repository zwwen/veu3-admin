<template>
  <template v-if="!item.meta?.hidden">
    <sidebar-item-link
      v-if="filterChildren.length <= 1 && !item.meta?.alwaysShow"
      :to="resolvePath(singleChildRoute?.path)"
    >
      <el-menu-item :index="resolvePath(singleChildRoute?.path)">
        <el-icon v-if="iconComponent">
          <svg-icon :icon-name="iconComponent" />
        </el-icon>
        <template #title>{{ singleChildRoute?.meta?.title }}</template>
      </el-menu-item>
    </sidebar-item-link>
    <el-sub-menu v-else :index="item.path">
      <template #title>
        <el-icon v-if="iconComponent">
          <svg-icon :icon-name="iconComponent" />
        </el-icon>
        <span>{{ item.meta?.title }}</span>
      </template>
      <sidebar-item
        v-for="child in filterChildren"
        :key="child.path"
        :item="child"
        :base-path="resolvePath(child.path)"
      ></sidebar-item>
    </el-sub-menu>
  </template>
</template>

<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router';
import path from 'path-browserify';
import { isExternalLink } from '@/utils/validate';
const { item, basePath } = defineProps<{
  item: RouteRecordRaw;
  basePath: string;
}>();
// 如果只有一个儿子，直接渲染这个儿子
// 如果菜单中对应的 children 有多个， 使用el-sub-menu 进行渲染
const filterChildren = computed(() =>
  (item.children || []).filter((child) => !child.meta?.hidden)
);

const singleChildRoute = computed(
  () =>
    filterChildren.value.length === 1
      ? filterChildren.value[0]
      : { ...item, path: '/' } // 将自己的路径置为空 防止重复拼接
);
// 要渲染的图标
const iconComponent = computed(() => singleChildRoute.value?.meta?.icon);
// 解析父路径加子路径 为完整路径 (用于 el-menu-item 的 index 属性 resolve 可以解析绝对路径和相对路径)
const resolvePath = (childPath: string = '') => {
  // console.log('basePath:', basePath);
  // console.log('childPath:', childPath);
  if (isExternalLink(childPath)) {
    return childPath;
  }
  return path.join(basePath, childPath);
};
</script>

<style scoped></style>
