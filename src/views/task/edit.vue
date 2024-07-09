<template>
  <div class="app-container">
    <el-form
      :model="form"
      ref="form"
      label-width="130px"
      v-loading="formLoading"
      :rules="rules"
    >
      <el-form-item label="任务id：" prop="id" required>
        <el-input v-model="form.id"></el-input>
      </el-form-item>
      <el-form-item label="任务名称：" prop="name" required>
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="任务类型：">
        <el-select v-model="form.type" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="任务描述：">
        <el-input v-model="form.description"></el-input>
      </el-form-item>
      <el-form-item label="所选数据：">
        <el-input v-model="form.tableName"></el-input>
      </el-form-item>
      <el-form-item label="数据类型：">
        <el-input v-model="form.dataType"></el-input>
      </el-form-item>
      <el-form-item label="循证医学知识：">
        <el-input v-model="form.priorKnowledge"></el-input>
      </el-form-item>
      <el-form-item label="使用算法：">
        <el-input v-model="form.algorithmName"></el-input>
      </el-form-item>
      <el-form-item label="分数函数：">
        <el-input v-model="form.scoreId"></el-input>
      </el-form-item>
      <el-form-item label="最大度：">
        <el-input v-model="form.maxDegree"></el-input>
      </el-form-item>
      <el-form-item label="忠实性检验：">
        <el-input v-model="form.faithfulnessAssumed"></el-input>
      </el-form-item>
      <el-form-item label="参与人">
        <el-input v-model="form.symmetricFirstStep"></el-input>
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
        name: null,
        type: null,
        algorithmId: null,
        tableName: null,
        description: null,
        testId: null,
        priorKnowledge: null,
        dataType: null,
        scoreId: null,
        numCategoriesToDiscretize: null,
        maxDegree: null,
        faithfulnessAssumed: null,
        symmetricFirstStep: null,
      },
      formLoading: false,
      options: [{
        value: '空间层次效应挖掘',
        label: '空间层次效应挖掘'
      }, {
        value: '疾病危险因素因果关系挖掘',
        label: '疾病危险因素因果关系挖掘'
      }],
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
    this.form.name = this.$route.query.row.name
    this.form.description = this.$route.query.row.description
    this.form.type = this.$route.query.row.type
    this.form.disease = this.$route.query.row.disease
    this.form.factor = this.$route.query.row.factor
    this.form.tableName = this.$route.query.row.tableName
    this.form.algorithmName = this.$route.query.row.algorithmName
    this.form.time = this.$route.query.row.time
  },
  methods: {
    submitForm() {
      let _this = this
      this.formLoading = true

    


      postRequest('mining/update', this.form).then(

        response => {
          console.log(response)
          if (response.code == "200") {
            _this.$message.success("修改成功")
            _this.$router.push('/task/list')
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
        disease: null,
        factor: null,
        tableName: null,
        algorithmName: null,
        time: null
      }
      this.form.id = lastId
    },
  }
}

</script>

<style scoped>
.upload {
  height: 10.666667 rem;
  width: 100%;
  display: table;
  text-align: center;
}
</style>