import type { App } from 'vue';
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus';
export default (app: App): void => {
  // 这些都放在组件实例的全局属性上
  app.config.globalProperties.$message = ElMessage;
  app.config.globalProperties.$notify = ElNotification;
  app.config.globalProperties.$confirm = ElMessageBox.confirm;
  app.config.globalProperties.$alert = ElMessageBox.alert;
  app.config.globalProperties.$prompt = ElMessageBox.prompt;
};
export type Size = 'default' | 'small' | 'large';
