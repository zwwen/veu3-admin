<template>
  <div class="tags-view-container">
    <el-scrollbar w-full whitespace-nowrap>
      <router-link
        class="tags-view-item"
        v-for="(tag, index) in visitedViews"
        :class="{
          active: isActive(tag)
        }"
        :style="{
          backgroundColor: isActive(tag) ? theme : '',
          borderColor: isActive(tag) ? theme : ''
        }"
        :key="index"
        :to="{ path: tag.path, query: tag.query }"
      >
        <el-dropdown
          placement="top-start"
          trigger="contextmenu"
          @command="(command) => handleCommand(command, tag)"
        >
          <span leading-28px>{{ (tag as any).title }}</span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="all">关闭所有</el-dropdown-item>
              <el-dropdown-item command="other">关闭其他</el-dropdown-item>
              <el-dropdown-item command="self" v-if="!tag.meta.affix"
                >关闭</el-dropdown-item
              >
              <el-dropdown-item command="refresh">刷新</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <svg-icon
          v-if="isAffix(tag)"
          icon-name="ant-design:close-circle-outlined"
          mx-2px
          leading-28px
          @click.prevent="closeSelectedTag(tag)"
        ></svg-icon>
      </router-link>
    </el-scrollbar>
  </div>
</template>
<script lang="ts" setup>
import { useTagsView } from '@/stores/tagsView';
import { useSettingStore } from '@/stores/settings';
import type {
  RouteLocationNormalizedGeneric,
  RouteRecordRaw
} from 'vue-router';
import { join } from 'path-browserify';
const store = useTagsView();

const { deleteView, addView, delAllView, deleteOtherView, deleteCacheView } =
  store;

//  必须采用storeToRefs 进行解构出来
const { visitedViews } = storeToRefs(store);

import { routes } from '@/router/index';
const router = useRouter();
const route = useRoute();
const isActive = (tag: RouteLocationNormalizedGeneric) => {
  return tag.path === route.path;
};
function isAffix(tag: RouteLocationNormalizedGeneric) {
  return !tag.meta.affix;
}
const addTags = () => {
  if (route.name) {
    // 需要添加到tags中
    addView(route);
  }
};
const toLastView = () => {
  const lastView = visitedViews.value[visitedViews.value.length - 1];
  if (lastView) {
    router.push(lastView.path);
  } else {
    router.push('/');
  }
};
const closeSelectedTag = (tag: RouteLocationNormalizedGeneric) => {
  // ...
  deleteView(tag);

  if (isActive(tag)) {
    // 如果删掉了自己，需要导航到当前list中的最后一个
    toLastView();
  }
};

//  此方法用于计算 哪些tag应该默认展示在列表中
function filterAffix(routes: RouteRecordRaw[], basePath = '/') {
  const tags: RouteLocationNormalizedGeneric[] = [];
  for (let route of routes) {
    if (route.meta?.affix) {
      tags.push({
        name: route.name,
        path: join(basePath, route.path),
        meta: route.meta
      } as RouteLocationNormalizedGeneric);
    }
    if (route.children) {
      tags.push(...filterAffix(route.children, route.path));
    }
  }

  return tags;
}

const initTags = () => {
  const filterAffixTags = filterAffix(routes);
  filterAffixTags.forEach((tag) => {
    addView(tag);
  });
  addTags();
};
// 页面加载后 需要初始化固定 + 默认当前路径的
onMounted(() => {
  initTags();
});
//  路径变化时重新添加
watch(() => route.path, addTags);

// 点击菜单

const CommandType = {
  All: 'all',
  Other: 'other',
  Self: 'self',
  Refresh: 'refresh'
} as const;

type CommandType = (typeof CommandType)[keyof typeof CommandType];

const handleCommand = (
  command: CommandType,
  view: RouteLocationNormalizedGeneric
) => {
  switch (command) {
    case CommandType.All:
      delAllView();
      router.push('/');
      break;
    case CommandType.Other:
      deleteOtherView(view);
      if (!isActive(view)) {
        router.push(view.path);
      }
      break;
    case CommandType.Self:
      closeSelectedTag(view);
      break;
    case CommandType.Refresh:
      // 跳转到专门做刷新的一个路由，在通过这个路由回来即可
      deleteCacheView(view);

      router.push('/redirect' + view.path);
      break;
  }
};

const settingsStore = useSettingStore();
const theme = computed(() => settingsStore.settings.theme);
</script>

<style scoped lang="scss">
.tags-view-container {
  @apply w-full overflow-hidden  @apply h-[var(--tagsview-height)] leading-[var(--tagsview-height)] shadow-sm shadow-gray-10 bg-gray-1;
}
.tags-view-item {
  border: 1px solid #ccc;
  @apply inline-block h-28px leading-28px px-3px mx-3px box-border text-black;
  &.active {
    @apply text-white;
    .el-dropdown {
      color: #fff;
    }
    &::before {
      content: '';
      @apply inline-block w-8px h-8px rounded-full  bg-white mr-3px;
    }
  }
}
</style>
