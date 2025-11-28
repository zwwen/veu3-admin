<template>
  <IconifyIcon
    v-if="!iconSrc"
    :icon="iconName"
    :class="svgClass"
    v-bind="$attrs"
  />
  <img v-else :src="iconName" :class="svgClass" v-bind="$attrs" />
  <!-- <div
    v-else
    :style="styleExternalIcon"
    :class="svgClass"
    bg-current
    v-bind="$attrs"
  ></div> -->
</template>

<script setup lang="ts">
import { Icon as IconifyIcon } from '@iconify/vue';
import { isExternalLink } from '@/utils/validate';

// const { iconName, customClass = '' } = defineProps<{
//   iconName: string;
//   customClass?: string;
// }>();

const { iconName, customClass = '' } = defineProps({
  iconName: {
    type: String,
    default: ''
  },
  customClass: {
    type: String,
    default: ''
  }
});

const iconSrc = computed(() => isExternalLink(iconName));
const svgClass = computed(() => (customClass ? `icon ${customClass}` : 'icon'));
// 通过 mask 渲染 svg 图标 兼容性不好
// const styleExternalIcon = computed(() => ({
//   mask: `url(${iconName}) no-repeat 50% 50%`,
//   '-webkit-mask': `url(${iconName}) no-repeat 50% 50%`,
//   'mask-size': 'cover'
// }));
</script>

<style scoped lang="scss"></style>
