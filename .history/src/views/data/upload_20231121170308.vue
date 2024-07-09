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
      <!-- <el-form-item label="数据表id："  prop="id" required>
          <el-input v-model="form.id"></el-input>
        </el-form-item>    action="http://10.16.34.89:8080/api/admin/table/upload"-->
      <el-form-item label="数据表名：" prop="name">
        <el-input v-model="form.tableName"></el-input>
      </el-form-item>
      <el-form-item label="疾病名称：" prop="type">
        <el-input v-model="form.diseaseName"></el-input>
      </el-form-item>
      <el-form-item label="数据描述：">
        <el-input v-model="form.description"></el-input>
      </el-form-item>
      <el-form-item label="数据类型：" >
        <el-input v-model="form.tableType"></el-input>
      </el-form-item>
      <span class="upload">
        <el-upload
          class="upload-demo"
          ref="upload"
          drag
       
          :action="`http://localhost:8088/api/admin/table/upload?token=${token}`"
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
      <!-- <span slot="footer" class="dialog-footer"   http://10.16.68.119:8088>
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="handleUpload">确 定</el-button>
      </span> -->
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

import { postRequest, } from "@/utils/api";
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

        tableType: null,
        token:'',
        
        tableType: null,
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


  // const user = JSON.parse(localStorage.getItem('user'));
    //  const token = user.token;
    //  console.log(token)
    

    submitForm() {

      let _this = this
      this.formLoading = true
      postRequest('admin/table/insert', this.form).then(
        response => {
          console.log(response)
          if (response.code == "200") {
            _this.$message.success("数据插入成功")
            this.submitUpload()
            _this.$router.push('/data/list')
          } else {
            _this.$message.error("数据插入失败")
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
    }

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