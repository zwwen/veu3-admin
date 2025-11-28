<template>
  <div>Redirecting...</div>
</template>

<script setup lang="ts">
const route = useRoute();

const router = useRouter();
// 只是为了实现重定向功能
router.replace({
  path: '/' + route.params.path,
  query: route.query
});
</script>

<style scoped></style>
