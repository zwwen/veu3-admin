<template>
  <div class="menu-container" p-15px>
    <el-card>
      <template #header>
        <el-button type="primary" @click="handleCreateRootMenu"
          >新增根菜单</el-button
        >
      </template>
      <div class="menu-tree">
        <el-tree
          :data="menus"
          :props="defaultProps"
          :expand-on-click-node="false"
          highlight-current
          :allow-drop="allowDrop"
          :allow-drag="allowDrag"
          draggable
          @node-drop="handleNodeDrop"
        >
          <template #default="{ data }">
            <div class="custom-tree-node">
              <span>{{ data.title }}</span>
              <div>
                <el-button
                  type="primary"
                  link
                  @click="handleCreateChildMenu(data)"
                >
                  添加
                </el-button>
                <el-button type="primary" link @click="handleEdit(data)">
                  编辑
                </el-button>
                <el-button
                  style="margin-left: 4px"
                  type="danger"
                  link
                  @click="handleRemove(data)"
                >
                  删除
                </el-button>
              </div>
            </div>
          </template>
        </el-tree>
      </div>
    </el-card>
    <right-panel v-model="panelVisible" :title="panelTitle">
      <add-menu
        :type="menuType"
        :data="editData"
        @submit="submitMenuForm"
      ></add-menu>
    </right-panel>
  </div>
</template>

<script setup lang="ts">
import type { AllowDropType, RenderContentContext } from 'element-plus';
import type { ITreeItemData, MenuData } from '@/api/type';
import { useReloadPage } from '@/hooks/useReloadPage';
import { useMenuStore } from '@/stores/menu';
const proxy = getCurrentInstance()?.proxy;
const menuStore = useMenuStore();
const { reloadPage } = useReloadPage();
const menus = computed(() => menuStore.state.menuTreeData);
menuStore.getAllMenus();
const defaultProps = {
  children: 'children',
  label: 'title'
};
const panelVisible = ref(false);
const menuType = ref(0); // 0根 1子
const editData = ref<MenuData | undefined>(undefined);
const panelTitle = computed(() =>
  menuType.value === 0 ? '添加根节点菜单' : '添加子节点菜单'
);
// 新增根节点菜单
const handleCreateRootMenu = () => {
  menuType.value = 0;
  editData.value = {} as MenuData;
  panelVisible.value = true;
};
const parentData = ref<ITreeItemData | null>();
// 新增子节点菜单
const handleCreateChildMenu = (data: ITreeItemData) => {
  menuType.value = 1;
  panelVisible.value = true;
  parentData.value = data;
};
// 编辑节点
const handleEdit = (data: ITreeItemData) => {
  menuType.value = 1;
  panelVisible.value = true;
  editData.value = { ...data };
};
// 删除节点
const handleRemove = (data: ITreeItemData) => {
  proxy
    ?.$confirm('确定要删除该菜单吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    .then(async () => {
      try {
        await menuStore.removeMenu(data);
        proxy?.$message.success('删除菜单成功');
        resetStatus();
      } catch (error) {
        proxy?.$message.error('删除菜单失败');
      }
    })
    .catch(() => {
      proxy?.$message.info('已取消删除');
    });
};

const resetStatus = () => {
  panelVisible.value = false;
  parentData.value = null;
  reloadPage();
};
const generateMenuSortId = (list: ITreeItemData[]) => {
  if (list && list.length) {
    const last = list[list.length - 1];
    return (last?.sort_id ?? 0) + 1;
  }
  return 0;
};
const addRootMenu = async (data: MenuData) => {
  data.parent_id = 0;
  data.sort_id = generateMenuSortId(menus.value);
  try {
    await menuStore.appendMenu(data);
    proxy?.$message.success('添加根菜单成功');
  } catch (error) {
    proxy?.$message.error('添加根菜单失败' + error);
  }
};
const generateChild = (data: MenuData) => {
  const parent = parentData.value!;
  if (!parent.children) {
    parent.children = [];
  }
  data.parent_id = parent.id;
  data.sort_id = generateMenuSortId(parent.children);
  return data;
};
const addChildMenu = async (data: MenuData) => {
  const child = generateChild(data);
  try {
    await menuStore.appendMenu(child);
    proxy?.$message.success('添加子菜单成功');
  } catch (error) {
    proxy?.$message.error('添加子菜单失败' + error);
  }
};
const submitMenuForm = (payload: MenuData) => {
  console.log('提交数据:', payload);
  if (menuType.value === 0) {
    console.log('根节点');
    addRootMenu({ ...payload });
  } else {
    console.log('子节点');
    addChildMenu({ ...payload });
  }
  resetStatus();
};

// 拖拽节点
type Node = RenderContentContext['node'];
const allowDrop = (draggingNode: Node, dropNode: Node, type: AllowDropType) => {
  if (
    draggingNode.data.parent_id === 0 ||
    draggingNode.data.parent_id == null
  ) {
    return type !== 'inner';
  } else {
    return true;
  }
};
const allowDrag = (draggingNode: Node) => {
  return (
    draggingNode.data.parent_id !== 0 || draggingNode.data.parent_id !== null
  );
};
const handleNodeDrop = async () => {
  try {
    await menuStore.updateBulkMenu();
    proxy?.$message.success('拖拽成功');
  } catch (error) {
    proxy?.$message.error('拖拽失败' + error);
  }
};
</script>

<style scoped lang="scss"></style>
