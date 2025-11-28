<template>
  <div class="app-wrapper">
    <!--  :style="{ backgroundColor: theme }" -->
    <div class="sidebar-container">
      <sidebar></sidebar>
    </div>
    <div class="main-container">
      <div class="header">
        <!-- 上边包含收缩菜单的导航条 -->
        <navbar @showSetting="openSetting"></navbar>
        <tags-view v-if="isShowTagsView"></tags-view>
      </div>
      <!-- 核心渲染区域 -->
      <div class="app-main">
        <app-main></app-main>
      </div>
    </div>
    <!-- 稍后会增加一个抽屉组件，根据navbar的内容来切换 -->

    <!-- 先封装一个抽屉组件 -->
    <right-panel v-model="setting" title="设置">
      <!-- 设置功能 -->
      <Settings></Settings>
    </right-panel>
  </div>
</template>

<script lang="ts" setup>
import { useSettingStore } from '@/stores/settings';
import varaibles from '@/style/variables.module.scss';

const setting = ref(false);
const openSetting = (payload: boolean) => {
  console.log(payload);
  setting.value = true;
};
const settingsStore = useSettingStore();
const isShowTagsView = computed(() => settingsStore.settings.tagsView);

const outerHeight = computed(() => {
  return (
    (isShowTagsView.value
      ? parseInt(varaibles.navBarHeight) + parseInt(varaibles.tagsViewHeight)
      : parseInt(varaibles.navBarHeight)) + 'px'
  );
});
// const theme = computed(() => settingsStore.settings.theme);
</script>

<style lang="scss" scoped>
.app-wrapper {
  @apply flex w-screen h-screen bg-gray-100;
  .app-main {
    @apply p-10px box-border overflow-hidden;
    height: calc(100vh - v-bind(outerHeight));
  }
  .sidebar-container {
    @apply bg-[var(--menu-bg)];
    /* 跨组件设置子组件的样式 */
    :deep(.sidebar-container-menu:not(.el-menu--collapse)) {
      @apply w-[var(--sidebar-width)];
    }
  }
  .main-container {
    @apply flex-1 flex flex-col overflow-hidden;
    .header {
      @apply h-84px bg-white shadow-md flex flex-col;

      .tags-view {
        @apply h-[var(--tagsview-height)] bg-gray-50;
      }
    }
  }
}
</style>
