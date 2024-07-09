<template>
  <div class="app-container">
    <el-form
      :model="form"
      ref="form"
      label-width="130px"
      v-loading="formLoading"
      :rules="rules"
      :validate-on-rule-change="false"
    >
 
      <el-form-item label="算法名称：" prop="name" >
        <el-input v-model="form.algorithmName"></el-input>
      </el-form-item>
      <el-form-item label="算法类型：" prop="type">
        <el-input v-model="form.algorithmType"></el-input>
      </el-form-item>
      <el-form-item label="算法描述：">
        <el-input v-model="form.algorithmDescription"></el-input>
      </el-form-item>

      <span class="upload">
        <el-upload
          class="upload-demo"
          ref="upload"
          drag

         

          :action="`/api/admin/algorithm/uploadAlgorithm?token=${token}`"
          :with-credentials="true"

          multiple
          :auto-upload="false"
          :limit="5"
          :on-success="handleFilUploadSuccess"
          :on-remove="handleRemove"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">大小不超过500m</div>
        </el-upload>
      </span> 
       <span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="handleUpload">确 定</el-button>
      </span>
      <el-form-item>
        <el-button
          type="primary"
          @click="
            submitForm();
            handleUpload();
          "
          >提交</el-button
        >
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
        deployFilePath: null
      },

      token:'',

      formLoading: false,
      rules: {
        userName: [
          { required: true, message: '请输入数据表名', trigger: 'blur' }
        ],
      },
      success: false,
    }
  },
  //   created () {
  //     console.log(this.$route.query.row)
  //     this.form.id = this.$route.query.row.id
  //     this.form.name = this.$route.query.row.name
  //     this.form.type = this.$route.query.row.type
  //     this.form.description = this.$route.query.row.description
  //     this.form.tableCreateId = this.$route.query.row.tableCreatId
  //     this.form.createTime = this.$route.query.row.createTime
  //   },

  mounted() {
    const user = JSON.parse(localStorage.getItem('user'));
    this.token = user.token;
    console.log( this.token)
  },

  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    // 文件上传成功时的函数
    handleFilUploadSuccess(res, file, fileList) {
      console.log(res, file, fileList)
      this.$message.success("文件上传成功")
    },
    // 处理文件上传的函数
    handleUpload() {
      // console.log(res,file)
      this.submitUpload()
    },
    submitForm() {
      let _this = this
      this.formLoading = true

  

      postRequest('algorithm/insert', this.form).then(

        response => {
          if (response.code == "200") {
            _this.$message.success("算法插入成功")
            this.submitUpload()
            _this.$router.push('/model/list')
          } else {
            _this.$message.error("算法插入失败")
            _this.formLoading = false
          }
        })


    },
    resetForm() {
      //   let lastId = this.form.id
      //   this.$refs['form'].resetFields()
      this.form = {
        id: null,
        name: null,
        type: null,
        description: null,
        tableCreateId: null,
        createTime: null
      }
      //   this.form.id = lastId
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