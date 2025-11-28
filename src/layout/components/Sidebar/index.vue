<template>
  <logo v-if="sidebarLogo" :collapse="sidebar.opened"></logo>
  <el-menu
    border-none
    class="sidebar-container-menu"
    :default-active="defaultActive"
    :background-color="varaibles.menuBg"
    :active-text-color="theme"
    :text-color="varaibles.menuText"
    :collapse="sidebar.opened"
  >
    <!-- 增加父路径属性 用于el-menu-item 渲染的时候拼接 -->
    <sidebar-item
      v-for="route in routes"
      :key="route.path"
      :item="route"
      :base-path="route.path"
    ></sidebar-item>
  </el-menu>
</template>

<script setup lang="ts">
import { routes } from '@/router/index';
import varaibles from '@/style/variables.module.scss';
import { useAppStore } from '@/stores/app';
import { useSettingStore } from '@/stores/settings';
const route = useRoute();
const defaultActive = computed(() => {
  return route.path;
});

const { sidebar } = useAppStore();
const settingsStore = useSettingStore();
const theme = computed(() => settingsStore.settings.theme);

const sidebarLogo = computed(() => settingsStore.settings.sidebarLogo);
</script>

<style scoped lang="scss"></style>
