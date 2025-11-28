import { useSettingStore } from "@/stores/settings"
import { generateColors, setColors } from "@/utils/color"

export const useGenerateTheme = () => {
  //  监控主题的变化，跟新到store中
  // 生成主题更新
  const store = useSettingStore()
  const theme = computed(() => store.settings.theme)
  const originalTheme = computed(() => store.settings.originalTheme)
  watchEffect(() => {
    if (theme.value !== originalTheme.value) {
      const colors = {
        primary: theme.value, // priamry
        ...generateColors(theme.value) // primary-light-1/9
      }
      setColors(colors)
      store.changeSetting({ key: "originalTheme", value: theme.value })
    }
  })
  // 目的就是生成主体应用在根元素上
}
