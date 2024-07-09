<template>
  <div class="app-container">
    <el-form
      :model="form"
      ref="form"
      label-width="130px"
      v-loading="formLoading"
      :rules="rules"
    >
      <el-form-item label="算法id：" prop="id" required>
        <el-input v-model="form.id"></el-input>
      </el-form-item>
      <el-form-item label="算法名称：" prop="name" required>
        <el-input v-model="form.algorithmName"></el-input>
      </el-form-item>
      <el-form-item label="算法类型：">
        <el-input v-model="form.algorithmType"></el-input>
      </el-form-item>
      <el-form-item label="算法描述：">
        <el-input v-model="form.algorithmDescription"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import { postRequest } from "@/utils/api";
export default {
  data() {
    return {
      form: {
        id: null,
        algorithmName: null,
        algorithmType: null,
        algorithmDescription: null,
        createTime: null,
      },
      formLoading: false,
      rules: {
        userName: [
          { required: true, message: '请输入数据表名', trigger: 'blur' }
        ],
      }
    }
  },
  created() {
    console.log(this.$route.query.row)
    this.form.id = this.$route.query.row.id
    this.form.algorithmName = this.$route.query.row.algorithmName
    this.form.algorithmType = this.$route.query.row.algorithmType
    this.form.algorithmDescription = this.$route.query.row.algorithmDescription
  },
  methods: {
    submitForm() {
      let _this = this
      this.formLoading = true
      postRequest('admin/algorithm/update', this.form).then(
        response => {
          if (response.code == "200") {
            _this.$message.success("修改成功")
            _this.$router.push('/model/list')
          } else {
            _this.$message.error("修改失败")
            _this.formLoading = false
          }
        })
    },
    resetForm() {
      let lastId = this.form.id
      this.$refs['form'].resetFields()
      this.form = {
        id: null,
        name: null,
        type: null,
        description: null,
        tableCreateId: null,
        createTime: null
      }
      this.form.id = lastId
    },
  }
}

</script>

<style scoped>
.upload {
  height: 10.666667rem;
  width: 100%;
  display: table;
  text-align: center;
}
</style>