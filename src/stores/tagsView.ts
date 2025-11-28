import type {
  RouteLocationNormalizedLoadedGeneric,
  RouteRecordName
} from 'vue-router';

export const useTagsView = defineStore('tagsView', () => {
  const visitedViews = ref<RouteLocationNormalizedLoadedGeneric[]>([]);
  const cacheViews = ref<RouteRecordName[]>([]);
  //   区分哪些需要缓存  []
  const addView = (view: RouteLocationNormalizedLoadedGeneric) => {
    // 当前添加的视图是否已经存储过，存储过则不在添加
    const exits = visitedViews.value.some((v) => v.path === view.path);
    addCacheView(view); // 有可能刚刚清除缓存了，我们在这里重新添加下
    if (exits) return;
    const newView = {
      ...view,
      title: view.meta.title // 每个页卡的名字
    };
    visitedViews.value.push(newView);
  };
  const deleteView = (view: RouteLocationNormalizedLoadedGeneric) => {
    const index = visitedViews.value.findIndex((v) => v.path === view.path);
    if (index > -1) {
      visitedViews.value.splice(index, 1);
    }
    deleteCacheView(view);
  };
  const addCacheView = (view: RouteLocationNormalizedLoadedGeneric) => {
    if (cacheViews.value.includes(view.name)) return;
    if (!view.meta.noCache) {
      // 将当前的name存起来
      cacheViews.value.push(view.name);
    }
  };
  const deleteCacheView = (view: RouteLocationNormalizedLoadedGeneric) => {
    const index = cacheViews.value.indexOf(view.name);
    if (index > -1) {
      cacheViews.value.splice(index, 1);
    }
  };
  const delAllView = () => {
    visitedViews.value = visitedViews.value.filter((view) => view.meta.affix);
    cacheViews.value = [];
  };
  const deleteOtherView = (view: RouteLocationNormalizedLoadedGeneric) => {
    visitedViews.value = visitedViews.value.filter(
      (v) => v.meta.affix || v.path === view.path
    );
    cacheViews.value = cacheViews.value.filter((name) => name === view.name);
  };

  return {
    visitedViews,
    addView,
    deleteView,
    cacheViews,
    delAllView,
    deleteOtherView,
    deleteCacheView
  };
});
