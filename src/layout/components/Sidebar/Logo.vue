<template>
  <div class="sidebar-logo-container" :class="{ collapse }">
    <transition name="logo-fade">
      <router-link to="/" :key="collapse ? 'a' : 'b'" class="sidebar-logo">
        <img :src="logo" alt="" />
        <h1 v-if="!collapse" class="sidebar-logo-title">Vue3 admin</h1>
      </router-link>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import logo from '@/assets/vue.svg';
defineProps({
  collapse: {
    type: Boolean
  }
});
</script>

<style scoped lang="scss">
.sidebar-logo {
  @apply w-full h-60px lead-60px flex items-center justify-center;
}
.sidebar-logo-title {
  @apply inline-block text-20px text-white mx-10px;
}

.logo-fade-enter-from,
.logo-fade-leave-to {
  @apply opacity-0;
}
.logo-fade-enter-active {
  @apply transition-opacity duration-150;
}
</style>
