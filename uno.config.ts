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
  rules: [[/^leading-(\d+)$/, ([, d]) => ({ lineHeight: `${d}px` })]],
  shortcuts: [
    // 自定义快捷类名
    ['icon-aliwangwang', 'text-current inline-block w-2em h-2em align-middle']
  ],
  transformers: [transformerDirective()]
});
