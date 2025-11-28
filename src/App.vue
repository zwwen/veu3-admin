<template>
  <el-config-provider :size="store.size">
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup lang="ts">
import { useAppStore } from './stores/app';

import { useGenerateTheme } from '@/hooks/useGenerateTheme';
const store = useAppStore();
useGenerateTheme(); // watch主题
</script>

<style scoped></style>
