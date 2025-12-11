import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import Unocss from 'unocss/vite';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import ElementPlus from 'unplugin-element-plus/vite';
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [
      vue(),
      Unocss(),
      ElementPlus({}),
      AutoImport({
        // api 自动导入
        imports: ['vue', 'vue-router', 'pinia'],
        resolvers: [ElementPlusResolver()],
        eslintrc: { enabled: false } // 给eslint生成的配置文件 只需要生成一次 后改为false
      }),
      Components({
        // 组件自动导入
        resolvers: [ElementPlusResolver()],
        dirs: [
          'src/components',
          'src/layout/components',
          'src/views/**/components'
        ]
      })
    ],
    // 配置别名
    resolve: {
      alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }]
    },
    server: {
      proxy: {
        [env.VITE_BASE_API]: {
          target: env.VITE_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/dev-api/, '/api/v1')
        }
      }
    }
  };
});
