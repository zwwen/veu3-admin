// 对color做生产的，设置的
import cssFunc from "css-color-function"
const formula: { [prop: string]: string } = {
  "primary-light-1": "color(xxx tint(10%))",
  "primary-light-2": "color(xxx tint(20%))",
  "primary-light-3": "color(xxx tint(30%))",
  "primary-light-4": "color(xxx tint(40%))",
  "primary-light-5": "color(xxx tint(50%))",
  "primary-light-6": "color(xxx tint(60%))",
  "primary-light-7": "color(xxx tint(70%))",
  "primary-light-8": "color(xxx tint(80%))",
  "primary-light-9": "color(xxx tint(90%))"
}

const generateColors = (primary: string) => {
  const colors: Record<string, string> = {}
  Object.entries(formula).forEach(([key, v]) => {
    const value = v.replace(/xxx/g, primary)
    colors[key] = cssFunc.convert(value)
  })
  return colors
}

const setColors = (colors: Record<string, string>) => {
  const el = document.documentElement
  Object.entries(colors).forEach(([key, value]) => {
    el.style.setProperty(`--el-color-${key}`, value)
  })
}

export { generateColors, setColors }
