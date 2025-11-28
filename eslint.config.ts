import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import { defineConfig } from 'eslint/config';
// 加载json文件模块的方法
// 1、使用fs模块读取后JSON.parse()
// 2、使用import导入 import autoImport from './.eslintrc-auto-import.json' with { type: 'json' };

// 3、使用createRequire方法

import { createRequire } from ' module';
const require = createRequire(import.meta.url);
const autoImport = require('./.eslintrc-auto-import.json');

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node, ...autoImport.globals }
    }
  },
  tseslint.configs.recommended,
  pluginVue.configs['flat/essential'],
  {
    files: ['**/*.vue'],
    languageOptions: { parserOptions: { parser: tseslint.parser } }
  },
  {
    // 忽略哪些文件不通过 eslint 检查
    ignores: [
      'dist/**',
      'node_modules/**',
      'public/**',
      'src/assets/**',
      '.css',
      '*.d.ts'
    ]
  },
  {
    rules: {
      // 关闭禁止使用 console 的规则
      'no-console': 'off',
      // 关闭禁止使用 debugger 的规则
      'no-debugger': 'off',
      // 允许在 Vue 文件中使用未定义的变量（如组件名）
      'vue/no-unused-components': 'off',
      // 关闭组件命名必须为多字母的规则
      'vue/multi-word-component-names': 'off',
      // 使用分号
      semi: ['error', 'always'],
      // 使用单引号
      quotes: ['error', 'single'],
      // 缩进为 2 个空格
      indent: ['error', 2],
      // 强制在对象字面量的属性中使用一致的逗号风格
      'comma-dangle': ['error', 'always-multiline']
    }
  },
  prettierRecommended // 添加 Prettier 推荐配置 会覆盖上面的格式化规则
]);
