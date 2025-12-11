<template>
  <el-form
    ref="ruleFormRef"
    :model="editData"
    :rules="rules"
    label-width="80px"
  >
    <el-form-item label="用户名" prop="username">
      <el-input v-model="editData.username" placeholder="请输入用户名" />
    </el-form-item>
    <el-form-item label="手机号" prop="mobile">
      <el-input v-model="editData.mobile" placeholder="请输入手机号" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="editData.email" placeholder="请输入邮箱" />
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-switch
        v-model="editData.status"
        :active-value="1"
        :inactive-value="0"
      />
    </el-form-item>
    <el-form-item label="角色分配" prop="roleIds">
      <el-select multiple v-model="editData.roleIds" placeholder="请选择角色">
        <el-option
          v-for="role in editData.roles"
          :key="role.id"
          :label="role.name"
          :value="role.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-input
        type="textarea"
        v-model="editData.description"
        :rows="3"
        placeholder="请输入描述"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button @click="handleResetForm(ruleFormRef)">重置</el-button>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        提交
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import type { IUser } from '@/api/type';
import type { FormInstance, FormItemRule, FormRules } from 'element-plus';
import type { PropType } from 'vue';
const props = defineProps({
  type: {
    // 操作类型：0编辑 1新增
    type: Number,
    required: true
  },
  data: {
    type: Object as PropType<IUser>,
    default: () => ({})
  }
});
const ruleFormRef = ref<FormInstance>();
const editData = ref<Partial<IUser>>({
  username: '',
  mobile: '',
  email: '',
  status: true,
  roleIds: [],
  description: ''
});
// 验证手机号
const validateMobile = (
  rule: unknown,
  value: string,
  callback: (args?: Error) => void
) => {
  const reg =
    /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/;
  if (!isNaN(Number(value)) && value.length === 11 && reg.test(value)) {
    callback();
  } else {
    callback(new Error('请输入正确格式的手机号!'));
  }
};
const rules = reactive<FormRules>({
  username: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    {
      type: 'email',
      message: '请输入正确的邮箱地址',
      trigger: ['blur', 'change']
    }
  ] as FormItemRule,
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      validator: validateMobile,
      message: '请输入正确的手机号',
      trigger: 'blur'
    }
  ]
});
const defaultProp = {
  username: '',
  email: '',
  mobile: '',
  description: '',
  status: true
};
const resetForm = () => {
  editData.value = { ...defaultProp, ...props.data };
};
watchEffect(() => {
  if (props.data) {
    // 移除之前表单校验结果
    ruleFormRef.value?.clearValidate();
    resetForm();
  }
});
const emit = defineEmits(['submit']);
// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      emit('submit', editData.value);
    } else {
      console.log('error submit!', fields);
    }
  });
};
// 重置表单
const handleResetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  editData.value = { ...defaultProp };
};
</script>
