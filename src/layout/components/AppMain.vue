<template>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <keep-alive :include="inclueds">
        <component :is="Component" :key="$route.path" />
      </keep-alive>
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import { useTagsView } from '@/stores/tagsView';
const store = useTagsView();
const inclueds = computed(() => store.cacheViews as string[]);
</script>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  @apply transition-all duration-500 ease-in-out pos-absolute;
}
.fade-enter-from {
  @apply opacity-0 translate-x-[50px];
}
.fade-leave-to {
  @apply opacity-0 translate-x-[-50px];
}
</style>
