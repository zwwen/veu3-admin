<template>
  <div class="navbar" flex>
    <hamburger
      :collapse="sidebar.opened"
      @toggleCollapse="toggleSidebar"
    ></hamburger>

    <breadcrumb></breadcrumb>
    <div flex justify-end flex-1 items-center gap-3 mr-20px>
      <screenfull></screenfull>
      <el-tooltip content="修改尺寸" placement="bottom">
        <size-select></size-select>
      </el-tooltip>

      <svg-icon
        icon-name="ant-design:setting-outlined"
        size-1.5em
        @click="openShowSetting"
      ></svg-icon>

      <avatar></avatar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app';

const { sidebar, toggleSidebar } = useAppStore();
const emit = defineEmits<{
  (event: 'showSetting', isShow: boolean): void;
}>();

const openShowSetting = () => {
  emit('showSetting', true);
};
</script>

<style scoped lang="scss">
.navbar {
  @apply h-[var(--navbar-height)];
}
</style>
