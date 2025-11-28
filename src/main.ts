import { createApp } from 'vue';

// import ElementPlus from 'element-plus';
// import 'element-plus/dist/index.css';
import router from './router';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import 'uno.css';
import '/public/base.css';
import '@/style/index.scss';
import App from './App.vue';
// 引入自定义插件
import elementPlugin from '@/plugins/element';
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
const app = createApp(App);
app
  .use(router)
  .use(pinia)
  .use(elementPlugin)
  // .use(ElementPlus)
  .mount('#app');
