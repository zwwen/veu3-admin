# 技术栈：Vue3 + Vue-Router + Pinia + Element-Plus + TypeScript + Vite

    - 创建项目：pnpm create vite --template vue-ts
    - 安装代码校验插件：npx eslint --init
    - 安装代码格式化插件：pnpm install prettier eslint-plugin-prettier eslint-config-prettier -D 并在根目录下创建prettier.config.ts文件
    - 安装vscode编辑器插件并添加到工作区中方便其他人使用：eslint、prettier、EditorConfig for Visual Studio Code、any-rule
    - 安装代码提交规范插件并进行初始化配置：pnpm i husky lint-staged -D / npx husky init
    - 安装代码提交时commit规范：pnpm install @commitlint/cli @commitlint/config-conventional -D，再根目录下创建：commitlint.config.cjs
    - 安装插件 normalize.css 清除默认样式：pnpm i normalize.css
    - 安装样式：pnpm i sass unocss @unocss/preset-uno @unocss/preset-attributify -D
    - 安装插件使unocss可以在样式文件中使用：pnpm i @unocss/transformer-directives, 在 style 标签样式中使用 @apply unocss的样式名
    - 按需自动导入插件安装及配置：pnpm install -D unplugin-vue-components unplugin-auto-import
    - 按需导入样式插件： pnpm i unplugin-element-plus -D
    - 安装unocss图标组件：pnpm i @unocss/preset-icons @iconify-json/ant-design -D
    - 安装自动加载图标组件：pnpm i @iconify/vue 它会自动去加载用到的图标，其本身是没有任何图标的，而是去动态加载图标，且有缓存功能和渲染的是svg格式。 而不需要单独去安装图标组件，比如上面的：pnpm i @iconify-json/ant-design -D
    - 安装持久化存储插件：pnpm i pinia-plugin-persistedstate
    - 安装路径拼接插件：pnpm i path-browserify @types/path-browserify
    - 安装路径参数解析插件：pnpm i path-to-regexp
    - 安装全屏功能插件：pnpm i screenfull
    - 安装换肤插件：pnpm i css-color-function

```ts
// 在根目录下新建 uno.config.ts
import { defineConfig } from 'unocss';
import presetAttributify from '@unocss/preset-attributify';
import presetUno from '@unocss/preset-uno';
import transformerDirective from '@unocss/transformer-directives';
// unocss 图标预设 会自动从图标库中加载图标
import presetIcons from '@unocss/preset-icons';

export default defineConfig({
  presets: [
    presetAttributify(),
    presetUno(),
    presetIcons({
      extraProperties: {
        // 设置图标的额外样式
      }
    })
  ],
  transformers: [transformerDirective()],
  shortcuts: [
    // 自定义快捷类名
    ['icon-aliwangwang', 'text-current inline-block w-2em h-2em align-middle']
  ]
});
// 在main.ts中引入使用
import 'uno.css';
// 在vite.config.ts中引入使用
import Unocss from 'unocss/vite';
export default defineConfig({
  plugins: [Unocss()]
});

// 在组件中使用配置好的unocss图标
<div
    i-ant-design:aliwangwang-outlined
    text-current
    inline-block
    w-2em
    h-2em
    align-middle
  ></div>
  <div i-ant-design:aliwangwang-outlined icon-aliwangwang></div>
```

```ts
// vite.config.ts
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import ElementPlus from 'unplugin-element-plus/vite';
export default defineConfig({
  plugins: [
    ElementPlus({}),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ]
});
```
