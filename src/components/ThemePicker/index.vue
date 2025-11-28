<template>
  <el-color-picker v-model="theme" :predefine="predefineColors" />
</template>

<script lang="ts" setup>
import { useSettingStore } from '@/stores/settings';

const store = useSettingStore();

const theme = ref(store.settings.theme);
const predefineColors = [
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585'
];
watch(theme, (newValue) => {
  store.changeSetting({ key: 'theme', value: newValue });
});
</script>
