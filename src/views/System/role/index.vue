<template>
  <div p-15px>
    <h2>角色管理</h2>
    <el-button size="small" type="primary" mb-10px float-end @click="createRole"
      >新增角色</el-button
    >
    <el-table :data="list" stripe :style="{ width: '100%', margin: '20px 0' }">
      <el-table-column prop="id" label="id" />
      <el-table-column prop="name" label="角色名称" />
      <el-table-column
        prop="description"
        show-overflow-tooltip
        label="角色描述"
      />
      <el-table-column
        prop="isDefault"
        show-overflow-tooltip
        label="是否默认"
        :formatter="formatter"
      />
      <el-table-column
        prop="createdAt"
        show-overflow-tooltip
        label="创建时间"
      />
      <el-table-column
        prop="updatedAt"
        show-overflow-tooltip
        label="更新时间"
      />
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="scope">
          <el-button
            text
            type="primary"
            size="small"
            @click="handleEditor(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            text
            size="small"
            @click="handleRemove(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-sizes="[1, 5, 10, 20, 30, 50, 100]"
      layout="prev, pager, next, sizes, jumper, total"
      :total="countValue"
      background
      size="small"
      :page-size="pageSize"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <right-panel v-model="visible" :title="panelTitle">
      <edit-role :type="editType" :data="editData" @submit="handleSubmit" />
    </right-panel>
  </div>
</template>

<script setup lang="ts">
import type { IRole } from '@/api/type';
import { useRoleStore } from '@/stores/role';
const roleStore = useRoleStore();
const { roles, count } = toRefs(roleStore.state);
const proxy = getCurrentInstance()!.proxy;
const pageNum = ref(0);
const pageSize = ref(1);
watchEffect(() => {
  try {
    roleStore.getRoles({ pageNum: pageNum.value, pageSize: pageSize.value });
  } catch (error) {
    console.error('获取角色列表失败:', error);
  }
});
const tableData = ref([
  {
    id: 1,
    name: '管理员',
    description: '拥有所有权限',
    isDefault: 0,
    createdAt: '2023-01-01 12:00:00',
    updatedAt: '2023-01-01 12:00:00'
  },
  {
    id: 2,
    name: '编辑者',
    description: '可以编辑内容',
    isDefault: 0,
    createdAt: '2023-01-02 12:00:00',
    updatedAt: '2023-01-02 12:00:00'
  },
  {
    id: 3,
    name: '访客',
    description: '只能查看内容',
    isDefault: 1,
    createdAt: '2023-01-03 12:00:00',
    updatedAt: '2023-01-03 12:00:00'
  }
]);

const list = computed(() => {
  let res: IRole[] = [];
  if (roles.value.length > 0) {
    res = roles.value.slice(
      pageNum.value * pageSize.value,
      (pageNum.value + 1) * pageSize.value
    );
  } else {
    res = tableData.value.slice(
      pageNum.value * pageSize.value,
      (pageNum.value + 1) * pageSize.value
    );
  }
  return res;
});
const countValue = computed(() => {
  return count.value && roles.value.length > 0
    ? roles.value.length
    : tableData.value.length;
});

// 格式化是否默认列
const formatter = (row: IRole) => {
  return row.isDefault === 1 ? '是' : '否';
};

const visible = ref<boolean>(false);
const panelTitle = computed(() =>
  editType.value === 0 ? '新增角色' : '修改角色'
); //新增还是修改
const editType = ref<number>(-1); // 0新增，1编辑
const editData = ref<IRole | undefined>(undefined);
// 提交表单
const postRole = async (data: IRole) => {
  console.log('提交数据:', data);
  const method =
    editType.value === 0 ? roleStore.addRole : roleStore.updateRole;
  const tip = editType.value === 0 ? '新增角色' : '编辑角色';
  try {
    await method({
      ...data,
      pageNum: pageNum.value,
      pageSize: pageSize.value
    });
    proxy?.$message.success(tip + '成功');
  } catch (error) {
    proxy?.$message.error(tip + '失败');
  }
};
const handleSubmit = async (payload: IRole) => {
  visible.value = false;
  await postRole(payload);
  console.log('提交数据:', payload);
};
// 新增角色
const createRole = async () => {
  editType.value = 0;
  editData.value = {} as IRole;
  visible.value = true;
};

// 编辑角色
const handleEditor = (row: IRole) => {
  editType.value = 1;
  editData.value = { ...row };
  visible.value = true;
};
// 删除角色
const handleRemove = (row: IRole) => {
  proxy
    ?.$confirm('确定要删除该角色吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    .then(async () => {
      try {
        await roleStore.deleteRole({
          ...row,
          pageNum: pageNum.value,
          pageSize: pageSize.value
        });
        proxy?.$message.success('删除角色成功');
      } catch (error) {
        proxy?.$message.error('删除角色失败');
      }
    })
    .catch(() => {
      proxy?.$message.info('已取消删除');
    });
};

// 页码变化
const handleCurrentChange = (page: number) => {
  pageNum.value = page - 1;
  console.log('当前页码:', pageNum.value);
};
// 每页条数变化
const handleSizeChange = (size: number) => {
  pageSize.value = size;
  console.log('每页条数:', pageSize.value);
};
</script>

<style scoped></style>
