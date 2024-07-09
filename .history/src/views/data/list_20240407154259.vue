<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="输入疾病名称" required>
                <el-input  v-model="searchObj.diseaseName" placeholder="例如肺癌"/>
            </el-form-item>
            <el-form-item label="输入数据类型" required>
                <el-input v-model="searchObj.tableType" placeholder="例如多空间层次"/>
            </el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
            <router-link :to="{ path: '/data/upload' }" class="link-left">
                <el-button class="btn-upload" type="primary">上传</el-button>
            </router-link>
        </el-form>
    <el-table
      :data="list"
      stripe
          style="width: 100%"
    >
      <el-table-column prop="id" label="Id" width="100px" />
      <el-table-column prop="tableName" label="表名" width="200px" />
      <el-table-column prop="diseaseName" label="疾病名称" width="200px" />
      <el-table-column prop="description" label="数据描述描述" width="200px" />
      <el-table-column prop="tableType" label="数据类型" width="200px" />
      <el-table-column prop="time" label="上传时间" width="300px" />
      <el-table-column label="操作" align="center" width="300px">

        <template slot-scope="{ row }"><!-- row 是可以把哪一行的元素给出-->
          <el-button
            size="mini"
            type="danger"
            @click="featureSelect(row)"
            class="link-left"
            >字段管理</el-button
          >
          <el-button
            size="mini"
            @click="$router.push({ path: '/data/edit', query: { row: row } })"
            >编辑</el-button
          >
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


    <!--===============================     导入数据表单   ===================================================================-->
    <el-dialog
      id="importDataTable"
      title="特征注释"
      :visible.sync="dialogFormVisible"
      width="40%"
      class="dialog"
    >
      <el-form
        :model="dialogForm"
        ref="dialogFormRef"
        :rules="dialogForm.rules"
        label-width="110px"
      >
        <el-form-item label="特征个数" prop="featuresNum">
          <el-input-number
            v-model="dialogForm.featuresNum"
            :min="this.featuresNum"
            :step="1"
            @change="generateFields"
          ></el-input-number>
        </el-form-item>
        <el-form-item
       
          v-for="(field, index) in dialogForm.fields"
          :key="(index +1)"
          :label="'特征' + (index +1)"
          :prop="'field'"
        
        >
          <el-input
            v-model="field.featureName"
            class="feature"
            :placeholder="'请输入特证' + (index + 1) + '名称'"
          ></el-input>

          <el-input
            v-model="field.featureNameCn"
            class="feature"
            :placeholder="'请输入特证' + (index + 1) + '中文名称'"
          ></el-input>
      
          <el-select v-model="field.she" style="  margin-left:20px;" placeholder="请选择特征类型" class="feature">
            <el-option label="临床表征" value="0"></el-option>
            <el-option label="生活行为习惯" value="1"></el-option>
            <el-option label="社会环境" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button @click="resetForm()">重置</el-button>
        <el-button type="primary" @click="submitTable">提交</el-button>
      </div>
    </el-dialog>
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

      dialogForm: {
        tableName: "",
        featuresNum: 1,
        fields: [{featureName: "", she: null, featureNameCn: ""}],
        file: {},
        fileList: [],
        rules: {
          tableName: [
            { required: true, message: "数据表名称不能为空", trigger: "blur" },
          ],
          numFeatures: [
            { required: true, message: "特征个数不能为空", trigger: "blur" },
            { type: "integer", message: "特征个数需为整数", trigger: "blur" },
            { min: 1, message: "特征个数需>1", trigger: "blur" },
          ],
        },
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
          tableName: null,
          diseaseName: null,
          description: null,
          tableType: null,
          createTime: null
        }
      ],
      total: 0,
    }
  },
  created() {
    //   this.initSubject()
    this.getList();
  },
  methods: {

    featureSelect(row){
      this.dialogFormVisible = true;
      this.selectedDisease = row.diseaseName
      getRequest(`/admin/table/getHeader/${row.tableName}`).then(
        (response) => {

          console.log(111)

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
      console.log(123)
      console.log(this.dialogForm.fields)

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
            if (response.code == "200") {
           
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
            postRequest(`/admin/table/findTables/${this.current}/${this.limit}`,this.searchObj)
                .then(response => { //请求成功response是接口返回数据
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
      getRequest('admin/table/getAll').then(
        (response) => {
          console.log(response.list)
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
      postRequest('admin/table/search',this.queryParam).then(
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
      getRequest('admin/table/delete/' + row.id).then(
        (response) => {
          if (response.code == "200") {
            _this.searchAll()
            _this.$message.success("删除成功")

            this.getList();

          } else {
            _this.$message.error("删除失败")
          }
        }
      )
    },
  }
}
  </script>
  <style scoped="scoped">
</style>