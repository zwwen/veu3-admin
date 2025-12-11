<template>
  <el-form
    ref="ruleFormRef"
    style="max-width: 600px"
    :model="editData"
    :rules="rules"
    label-width="auto"
  >
    <el-form-item label="角色名称" prop="name">
      <el-input v-model="editData.name" />
    </el-form-item>
    <el-form-item label="角色描述">
      <el-input v-model="editData.description" />
    </el-form-item>
    <el-form-item label="是否默认角色" prop="isDefault">
      <el-switch
        v-model="editData.isDefault"
        :active-value="1"
        :inactive-value="0"
      />
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
import type { IRole } from '@/api/type';
import type { FormInstance, FormRules } from 'element-plus';
import type { PropType } from 'vue';
const props = defineProps({
  type: {
    type: Number,
    required: true
  },
  data: {
    type: Object as PropType<IRole>,
    default: () => ({})
  }
});
const ruleFormRef = ref<FormInstance>();
const editData = ref({
  name: '',
  description: '',
  isDefault: 0
});
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
});
const defaultProp = {
  name: '',
  description: '',
  isDefault: 0
};
const resetForm = () => {
  editData.value = { ...defaultProp, ...props.data };
};
watchEffect(() => {
  if (props.data) {
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
