<template>
  <component :is="componentType" v-bind="attrs">
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
import { isExternalLink } from '@/utils/validate';

const { to } = defineProps<{
  to: string;
}>();
const isExt = isExternalLink(to);
const componentType = computed(() => (isExt ? 'a' : 'router-link'));
const attrs = computed(() => {
  if (isExt) {
    return {
      href: to,
      target: '_blank',
      rel: 'noopener noreferrer'
    };
  } else {
    return {
      to
    };
  }
});
</script>

<style scoped></style>
