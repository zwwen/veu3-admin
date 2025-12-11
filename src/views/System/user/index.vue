<template>
  <div p-15px>
    <el-form :model="searchForm" inline ref="searchFormRef">
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="searchForm.username"
          clearable
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input
          label="手机号"
          v-model="searchForm.mobile"
          clearable
          placeholder="请输入手机号"
        ></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="searchForm.email"
          clearable
          placeholder="请输入邮箱"
        ></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status" w-218px>
        <el-select
          v-model="searchForm.status"
          clearable
          placeholder="请选择状态"
        >
          <el-option label="全部" value="all"></el-option>
          <el-option label="启用" :value="1"></el-option>
          <el-option label="禁用" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button type="default" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
    <h2>用户管理</h2>
    <el-button size="small" type="primary" mb-10px float-end @click="createUser"
      >新增用户</el-button
    >
    <el-table :data="list" stripe :style="{ width: '100%', margin: '20px 0' }">
      <el-table-column prop="id" label="id" />
      <el-table-column prop="username" show-overflow-tooltip label="用户名" />
      <el-table-column prop="mobile" show-overflow-tooltip label="手机号" />
      <el-table-column prop="email" show-overflow-tooltip label="邮箱" />
      <el-table-column prop="status" label="状态" :formatter="formatter" />
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
      :total="total"
      background
      size="small"
      :page-size="pageSize"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <right-panel v-model="visible" :title="panelTitle">
      <edit-user :type="editType" :data="editData" @submit="handleSubmit" />
    </right-panel>
  </div>
</template>

<script setup lang="ts">
import type { IUser, IUserQueryParams, IUserQuery } from '@/api/type';
import { useRoleStore } from '@/stores/role';
import { useUserStore } from '@/stores/user';
import type { FormInstance } from 'element-plus';
const userStore = useUserStore();
const { users, count } = toRefs(userStore.state);
const proxy = getCurrentInstance()!.proxy;
const pageNum = ref(0);
const pageSize = ref(1);
const searchFormRef = useTemplateRef<FormInstance | null>('searchFormRef');
const searchForm = reactive({
  username: '',
  mobile: '',
  email: '',
  status: 'all'
});

// 获取用户列表
const getUserList = async () => {
  try {
    await userStore.getAllUsers({
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      ...searchForm
      // ...可能有搜索条件
    } as unknown as IUserQueryParams);
  } catch (error) {
    proxy?.$message.error('获取用户列表失败:' + error);
  }
};
onMounted(() => {
  getUserList();
});
const tableData = ref([
  {
    id: 1,
    username: '管理员',
    email: '13800138000@xx.com',
    mobile: '13800138000',
    status: false,
    isSuper: true,
    avatar: '',
    roles: [],
    roleIds: [],
    description: '系统管理员，拥有所有权限',
    createdAt: '2023-01-01 12:00:00',
    updatedAt: '2023-01-01 12:00:00'
  },
  {
    id: 2,
    username: '编辑者',
    email: '13800138001@yy.com',
    mobile: '13800138001',
    status: false,
    isSuper: false,
    avatar: '',
    roles: [],
    roleIds: [],
    description: '内容编辑者，拥有编辑权限',
    createdAt: '2023-01-02 12:00:00',
    updatedAt: '2023-01-02 12:00:00'
  },
  {
    id: 3,
    username: '访客',
    email: '13800138002@zz.com',
    mobile: '13800138002',
    status: true,
    isSuper: false,
    avatar: '',
    roles: [],
    roleIds: [],
    description: '普通访客，只有查看权限',
    createdAt: '2023-01-03 12:00:00',
    updatedAt: '2023-01-03 12:00:00'
  }
]);

const list = computed(() => {
  let res: IUser[] = [];
  if (users.value.length > 0) {
    res = users.value.slice(
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
const total = computed(() => {
  return count.value && users.value.length > 0
    ? users.value.length
    : tableData.value.length;
});

// 格式化状态
const formatter = (row: IUser) => {
  return row.status ? '启用' : '禁用';
};

const visible = ref<boolean>(false);
const panelTitle = computed(() =>
  editType.value === 0 ? '新增用户' : '修改用户'
); //新增还是修改
const editType = ref<number>(-1); // 0新增，1编辑
const editData = ref<IUser | undefined>(undefined);
const roleStore = useRoleStore();
roleStore.getRoles({
  pageNum: pageNum.value,
  pageSize: pageSize.value
});
// 编辑页需要选择角色来与用户关联
const defaultRoleList = [
  {
    id: 1,
    name: '超级管理员',
    isDefault: 0,
    description: '',
    createdAt: '',
    updatedAt: ''
  },
  {
    id: 2,
    name: '编辑者',
    isDefault: 0,
    description: '',
    createdAt: '',
    updatedAt: ''
  },
  {
    id: 3,
    name: '查看者',
    isDefault: 0,
    description: '',
    createdAt: '',
    updatedAt: ''
  }
];
const roles = computed(() => roleStore.state.roles || defaultRoleList);
// 提交表单
const postUser = async (data: IUser) => {
  const method =
    editType.value === 0 ? userStore.addUser : userStore.updateUser;
  const tip = editType.value === 0 ? '新增用户' : '编辑用户';
  try {
    await method({
      ...data,
      pageNum: pageNum.value,
      pageSize: pageSize.value
    } as IUserQuery);
    proxy?.$message.success(tip + '成功');
  } catch (error) {
    proxy?.$message.error(tip + '失败');
  }
};
const handleSubmit = async (payload: IUser) => {
  visible.value = false;
  await postUser(payload);
};
// 新增用户
const createUser = async () => {
  editType.value = 0;
  editData.value = {} as IUser;
  editData.value.roles = roles.value; // 所有角色列表
  editData.value.roleIds = []; // 所选择的角色id列表
  visible.value = true;
};

// 编辑用户
const handleEditor = (row: IUser) => {
  editType.value = 1;
  editData.value = { ...row };
  if (!editData.value.roles.length) {
    editData.value.roles = defaultRoleList;
  }
  visible.value = true;
};
// 删除用户
const handleRemove = (row: IUser) => {
  proxy
    ?.$confirm('确定要删除该用户吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    .then(async () => {
      try {
        await userStore.deleteUser({
          ...row,
          pageNum: pageNum.value,
          pageSize: pageSize.value
        } as IUserQuery);
        proxy?.$message.success('删除用户成功');
      } catch (error) {
        proxy?.$message.error('删除用户失败');
      }
    })
    .catch(() => {
      proxy?.$message.info('已取消删除');
    });
};

// 查询
const handleSearch = () => {
  getUserList();
};

// 重置查询表单
const handleReset = () => {
  searchFormRef.value?.resetFields();
  getUserList();
};

// 页码变化
const handleCurrentChange = (page: number) => {
  pageNum.value = page - 1;
  // console.log('当前页码:', pageNum.value);
};
// 每页条数变化
const handleSizeChange = (size: number) => {
  pageSize.value = size;
  // console.log('每页条数:', pageSize.value);
};
</script>

<style scoped></style>
