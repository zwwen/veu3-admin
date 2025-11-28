<template>
  <div class="login-container">
    <el-form
      class="login-form"
      ref="form"
      :rules="loginRules"
      :model="loginForm"
    >
      <div class="admin-logo">
        <img class="logo" src="../../assets/vue.svg" alt="logo" size-80px />
        <h1 class="name">Vue3 Admin</h1>
      </div>
      <el-form-item prop="username">
        <el-input placeholder="请输入用户名" v-model="loginForm.username">
          <template #prepend>
            <span class="svg-container">
              <svg-icon icon-name="ant-design:user-outlined"></svg-icon>
            </span>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          type="password"
          placeholder="请输入密码"
          autocomplete="on"
          show-password
          v-model="loginForm.password"
          prop="password"
        >
          <template #prepend>
            <span class="svg-container">
              <svg-icon icon-name="ant-design:lock-outlined"></svg-icon>
            </span>
          </template>
        </el-input>
      </el-form-item>

      <!-- 登录按钮 -->
      <el-button type="primary" @click="handleLogin" w-full mb-30px
        >登录</el-button
      >
    </el-form>
  </div>
</template>

<script lang="ts" setup>
const router = useRouter();
const loginState = reactive({
  loginForm: {
    username: '',
    password: ''
  },
  loginRules: {
    username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
    password: [{ required: true, trigger: 'blur', message: '请输入密码' }]
  }
});

const { loginForm, loginRules } = loginState;

const handleLogin = () => {
  router.push('/');
};
</script>

<style scoped lang="scss">
.login-container {
  @apply min-h-screen w-full flex flex-col justify-center items-center bg-[#f0f2f5];
  .login-form {
    @apply w-500px;
  }
  .admin-logo {
    @apply flex items-center justify-center my-20px;
  }
}
</style>
