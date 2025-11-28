<template>
  <el-dropdown trigger="click">
    <span class="el-dropdown-link">
      <svg-icon
        custom-class="w-1.5em h-1.5em"
        icon-name="ant-design:font-size-outlined"
      ></svg-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          :disabled="item.value === store.size"
          v-for="item in sizeOptions"
          :key="item.label"
          @click="store.setSize(item.value as Size)"
        >
          {{ item.label }}</el-dropdown-item
        >
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import type { Size } from '@/plugins/element';
import { useAppStore } from '@/stores/app';
const store = useAppStore();
const sizeOptions = ref([
  {
    label: '中等',
    value: 'default'
  },
  {
    label: '偏大',
    value: 'large'
  },
  {
    label: '偏小',
    value: 'small'
  }
]);
</script>
