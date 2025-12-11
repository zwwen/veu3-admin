<template>
  <el-config-provider :size="store.size" :locale="locale">
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup lang="ts">
import { useAppStore } from './stores/app';

import { useGenerateTheme } from '@/hooks/useGenerateTheme';
const store = useAppStore();
useGenerateTheme(); // watch主题

// 引入中文语言包
import { zhCn } from 'element-plus/es/locales.mjs';
const locale = zhCn;
</script>

<style scoped></style>
