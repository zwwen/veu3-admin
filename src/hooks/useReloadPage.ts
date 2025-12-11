export const useReloadPage = () => {
  const proxy = getCurrentInstance()?.proxy;
  const reloadPage = async ({
    title = '刷新页面',
    message = '确定要刷新页面吗?'
  } = {}) => {
    try {
      await proxy?.$confirm(title, message);
      window.location.reload();
    } catch (error) {
      proxy?.$message.warning('取消刷新页面');
    }
  };
  return { reloadPage };
};
