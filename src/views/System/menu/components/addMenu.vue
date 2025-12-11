<template>
  <el-form
    ref="ruleFormRef"
    :model="editData"
    :rules="rules"
    label-width="80px"
  >
    <el-form-item label="菜单标题" prop="title">
      <el-input v-model="editData.title" placeholder="请输入菜单标题" />
    </el-form-item>
    <el-form-item label="菜单路径" prop="path">
      <el-input v-model="editData.path" placeholder="请输入菜单路径" />
    </el-form-item>
    <el-form-item label="路由名称" prop="name">
      <el-input v-model="editData.name" placeholder="请输入路由名称" />
    </el-form-item>
    <el-form-item label="菜单图标" prop="icon">
      <el-input v-model="editData.icon" placeholder="请输入菜单图标" />
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
import type { MenuData } from '@/api/type';
import type { FormInstance, FormItemRule, FormRules } from 'element-plus';
import type { PropType } from 'vue';
const props = defineProps({
  type: {
    // 操作类型：0编辑 1新增
    type: Number,
    required: true
  },
  data: {
    type: Object as PropType<MenuData>,
    default: () => ({})
  }
});
const ruleFormRef = ref<FormInstance>();
const editData = ref<Partial<MenuData>>({
  title: '',
  icon: '',
  path: '',
  name: ''
});
const rules = reactive<FormRules>({
  path: [{ required: true, message: '请输入菜单路径', trigger: 'blur' }],
  name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }]
});
const defaultProp = {
  title: '',
  icon: '',
  path: '',
  name: ''
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
      ruleFormRef.value?.clearValidate();
      resetForm();
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
