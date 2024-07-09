<template>
  <div class="app-container">
    <el-form
      :model="form"
      ref="form"
      label-width="130px"
      v-loading="formLoading"
      :rules="rules"
    >
      <el-form-item label="数据表id：" prop="id" required>
        <el-input v-model="form.id"></el-input>
      </el-form-item>
      <el-form-item label="数据表名：" prop="name">
        <el-input v-model="form.tableName"></el-input>
      </el-form-item>
      <el-form-item label="疾病名称：">
        <el-input v-model="form.diseaseName"></el-input>
      </el-form-item>
      <el-form-item label="数据描述：">
        <el-input v-model="form.description"></el-input>
      </el-form-item>
      <el-form-item label="数据类型：" prop="type">
        <el-input v-model="form.tableType"></el-input>
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
        tableName: null,
        diseaseName: null,
        description: null,
        tableType: null
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
    this.form.tableName = this.$route.query.row.tableName
    this.form.tableType = this.$route.query.row.tableType
    this.form.description = this.$route.query.row.description
    this.form.diseaseName = this.$route.query.row.diseaseName
  },
  methods: {
    submitForm() {
      let _this = this
      this.formLoading = true
      postRequest('admin/table/updateTable', this.form).then(
        response => {
          console.log(response)
          if (response.code == "200") {
            _this.$message.success("修改成功")
            _this.$router.push('/data/list')
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