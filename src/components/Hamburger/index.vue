<template>
  <div class="hamburger-container" @click="handleCollapse">
    <svg-icon
      icon-name="ant-design:menu-fold-outlined"
      custom-class="hamburger w-1.5em h-1.5em"
      :class="{ 'rotate-180': collapse }"
    ></svg-icon>
  </div>
</template>

<script setup lang="ts">
const { collapse } = defineProps({
  collapse: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits<{ (e: 'toggleCollapse'): void }>();
const handleCollapse = () => {
  emit('toggleCollapse');
};
</script>

<style scoped lang="scss">
.hamburger-container {
  @apply leading-[40px] float-left cursor-pointer pt-[10px] px-[10px] hover:(bg-black/5);
}
.hamburger {
  @apply transition-transform duration-300;
}
</style>
