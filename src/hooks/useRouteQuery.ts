import type { LocationQuery } from 'vue-router';

// 解析路由及参数的自定义 Hook
export const useRouteQuery = () => {
  const redirect = ref<string | null>(null);
  const otherQuery = ref<LocationQuery>({});
  const route = useRoute();
  watchEffect(() => {
    const { redirect: redirectParam, ...restQuery } = route.query;
    console.log('route.query:', route.query);
    console.log('redirect:', redirect);
    console.log('restQuery:', restQuery);
    redirect.value = (redirectParam as string) || null;
    otherQuery.value = restQuery;
  });
  return { redirect, otherQuery };
};
