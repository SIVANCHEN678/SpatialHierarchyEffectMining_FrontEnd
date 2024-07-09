<template>
    <div class="app-container">
      <el-form :inline="true" class="demo-form-inline">
              <el-form-item label="输入用户名称" required>
                  <el-input  v-model="searchObj.name" placeholder=""/>
              </el-form-item>

              <el-form-item label="输入用户" required>
                  <el-input v-model="searchObj.username" placeholder=""/>
              </el-form-item>

              <!-- <el-form-item label="输入用户" required>
                  <el-input v-model="searchObj.username" placeholder=""/>
              </el-form-item> -->

              <el-form-item label="输入用户" required>
                  <el-input v-model="searchObj.username" placeholder=""/>
              </el-form-item>

              <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
          </el-form>
      <el-table
        :data="tableData"
        stripe
            style="width: 100%"
      >
        <el-table-column prop="id" label="Id" width="100px" />
        <el-table-column prop="name" label="用户名称" width="200px" />
        <el-table-column prop="role" label="用户角色" width="200px" />
        <el-table-column prop="gender" label="用户性别" width="200px" />
        <el-table-column prop="age" label="用户年龄" width="200px" />
        <el-table-column prop="registerTime" label="注册时间" width="200px" />
        <el-table-column label="操作" align="center" width="300px">
          <template slot-scope="{ row }">
            <el-button
              size="mini"
              type="danger"
              @click="deleteTable(row)"
              class="link-left"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
      :current-page="current"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getList"
      />
    </div>
  </template>
    
    <script>
  import { postRequest, getRequest } from "@/utils/api";
  export default {
    data() {
      return {
        dialogFormVisible: false,
        featuresNum: null,
        selectedDisease: "",
        featureForm: {
          featureName: "",
          diseaseName: "",
          she: null,
          featureNameCn: ""
        },
  
        current:1, //当前页
        limit:10, //每页显示记录数
        searchObj:{}, //条件封装对象
        list:[], //每页数据集合
        total:0, //总记录数
        
        queryParam: {
  
          diseaseName: null,
          tableType: null,
        },
        subjectFilter: null,
        listLoading: true,
        tableData: [
          {
            id: null,
            name: null,
            username: null,
            time: null,
            ip: null,
          }
        ],
        total: 0,
      }
    },
    created() {
      //   this.initSubject()
      this.getAll();
    },
    methods: {

      getAll(){
        getRequest('admin/user/getAll').then(
          (response) => {
            this.tableData = response
            this.listLoading = true
          }
        );},
  
      featureSelect(row){
        this.dialogFormVisible = true;
        this.selectedDisease = row.diseaseName
        getRequest(`/admin/table/getHeader/${row.tableName}`).then(
          (response) => {
            console.log(response.data)
            const tempData = response.data
            this.dialogForm.featuresNum = response.data.length
            this.featuresNum = response.data.length - 1
            console.log(response.data.length)
            for(let i = 0; i < response.data.length; i++){
              const obj = {
                featureName: tempData[i]
              }
              console.log(obj)
              this.dialogForm.fields.push(obj)
            }
          }
        )
  
      },
  
      generateFields() {
        const numFields = parseInt(this.dialogForm.featuresNum);
        if (!isNaN(numFields)) {
          this.dialogForm.fields = Array.from({ length: numFields }, () => ({
            name: "",
            type: "",
          }));
        }
      },
  
      submitTable() {
        const FeaturesLen = this.dialogForm.fields.length
        console.log(this.dialogForm.fields)
        console.log(FeaturesLen)
        for(let i=1; i < FeaturesLen; i++){
          this.featureForm.diseaseName = this.selectedDisease
          this.featureForm.featureNameCn = this.dialogForm.fields[i].featureNameCn
          this.featureForm.featureName = this.dialogForm.fields[i].featureName
          this.featureForm.she = this.dialogForm.fields[i].she
          postRequest("admin/table/addFeatures", this.featureForm).then(
            (response) => {
              if (response === true) {
                  // this.$router.push({ path: '@/views/relationships/index'})
                  // this.$router.push({ path: '/relationships' })
                  this.$message.success("保存成功")
                }
                else{
                  this.$message.error("保存失败,该字段已存在")
                }
            }
          )
        }
        this.$router.push('/feature')
      },
  
      resetForm() {
        this.dialogForm.dataSetName = "";
        this.dialogForm.featuresNum = 1;
        this.dialogForm.fields = [{ featureName: "", she: null, featureNameCn: "" }];
      },
  
      //医院设置列表
      getList(page=1) { //添加当前页参数
              this.current = page
              postRequest(`/admin/user/findUser/${this.current}/${this.limit}`,this.searchObj)
                  .then(response => { //请求成功response是接口返回数据

                  //返回集合赋值list
                  this.list = response.data.records

                    console.log(2222)
                    console.log(response)
                  //返回集合赋值list
                  this.tableData = response.data.records

                  //返回集合赋值list
                  this.list = response.data.records

                  //总记录数
                  this.total = response.data.total
                  })
                  .catch(error => {//请求失败
                  console.log(error)
                  })
          },
      searchAll() {
        this.listLoading = true
        getRequest('admin/user/getAll').then(
          (response) => {
            this.tableData = response
            this.listLoading = false
          }
        );
      },
      submitForm() {
        // this.queryParam.pageIndex = 1
        this.search()
      },
      search() {
        this.listLoading = true
        postRequest('admin/user/search',this.queryParam).then(
          (response) => {
            console.log(response)
            this.tableData = []
            this.tableData = response
            this.listLoading = false
            console.log(this.tableData)
          }
        )
            },
      deleteTable(row) {
        let _this = this
        getRequest('admin/user/delete/' + row.id).then(
          (response) => {


            if (response.code == "200") {
              _this.searchAll()
              _this.$message.success("删除成功")
            } else {
              _this.$message.error("删除失败")
            console.log(200)
            console.log(response)
            if (response.code == "200") {
              _this.searchAll()
              _this.$message.success("删除成功")
              _this.getList();
            } else {
              _this.$message.error("删除失败")
              _this.getList();

            }
          }
        }
        )
      },
    }
  }
    </script>
    <style scoped="scoped">
  </style>