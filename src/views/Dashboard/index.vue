<template>
  <el-button @click="handle">按钮</el-button>
  <!-- 
  <div
    i-ant-design:aliwangwang-outlined
    text-current
    inline-block
    w-2em
    h-2em
    align-middle
  ></div>
  <div i-ant-design:aliwangwang-outlined icon-aliwangwang></div> -->
  <svg-icon
    icon-name="ant-design:aliwangwang-outlined"
    custom-class="text-blue w-2em h-2em"
    @click="handle"
  ></svg-icon>
  <svg-icon
    icon-name="token-branded:abt"
    custom-class="text-pink w-2em h-2em"
    @click="handle"
  ></svg-icon>
  <svg-icon
    icon-name="https://zishui.oss-cn-beijing.aliyuncs.com/BugFilled.svg"
    custom-class=" bg-red w-2em h-2em text-red"
    @click="handle"
  ></svg-icon>
  <el-input v-model="wordKey"></el-input>
</template>

<script setup lang="ts">
defineOptions({ name: 'Dashboard' });
const proxy = getCurrentInstance()?.proxy as any;
const handle = () => {
  proxy.$message.success('操作成功');
};
const wordKey = ref('');
</script>

<style scoped></style>
