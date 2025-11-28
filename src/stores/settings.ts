import varaibles from '@/style/variables.module.scss';
export const useSettingStore = defineStore(
  'setting',
  () => {
    // varaibles

    // 选择一个颜色，现在正在应用的颜色
    const settings = reactive({
      theme: varaibles.theme,
      originalTheme: '',
      tagsView: true,
      sidebarLogo: false
    });
    type ISetting = typeof settings;

    const changeSetting = <T extends keyof ISetting>({
      key,
      value
    }: {
      key: T;
      value: ISetting[T];
    }) => {
      settings[key] = value;
    };
    return { changeSetting, settings };
  },
  {
    persist: {
      storage: sessionStorage,
      pick: ['settings.theme', 'settings.tagsView', 'settings.sidebarLogo']
    }
  }
);
