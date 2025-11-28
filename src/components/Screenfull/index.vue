<template>
  <!-- -->
  <svg-icon
    @click="handleClick"
    custom-class="w-1.5em h-1.5em"
    :icon-name="
      isFullScreen
        ? 'ant-design:fullscreen-exit-outlined'
        : 'ant-design:fullscreen-outlined'
    "
  ></svg-icon>
</template>

<script lang="ts" setup>
import screenfull from 'screenfull';
const isFullScreen = ref(false);
const { proxy } = getCurrentInstance()!;
function handleClick() {
  if (screenfull.isEnabled) {
    screenfull.toggle();
  } else {
    proxy!.$message('浏览器不支持全屏');
  }
}
function updateFullscreenStatus() {
  // 看是否是全屏，全屏就切换状态
  isFullScreen.value = screenfull.isFullscreen;
}
onMounted(() => {
  if (screenfull.isEnabled) {
    screenfull.on('change', updateFullscreenStatus);
  }
});
onBeforeUnmount(() => {
  if (screenfull.isEnabled) {
    screenfull.off('change', updateFullscreenStatus);
  }
});
</script>
