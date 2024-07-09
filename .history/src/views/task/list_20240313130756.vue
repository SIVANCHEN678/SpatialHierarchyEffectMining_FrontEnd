<template>
  <div class="app-container">

    <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="输入疾病名称" required>
                <el-input  v-model="searchObj.diseaseName" placeholder="例如肺癌"/>
            </el-form-item>
            <el-form-item label="输入算法名称" required>
                <el-input v-model="searchObj.algorithmId" placeholder="例如fges"/>
            </el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
        </el-form>
    <el-table
    :data="list"
    stripe
          style="width: 100%">
      <el-table-column prop="id" label="Id" width="50px" />
      <el-table-column prop="name" label="任务名称" width="150px" />
      <el-table-column prop="type" label="任务类型" width="150px" />
      <el-table-column prop="description" label="任务描述" width="150px" />
      <el-table-column prop="diseaseName" label="疾病名称" width="150px" />
      <el-table-column prop="tableName" label="使用数据" width="150px" />
      <el-table-column prop="dataType" label="数据类型" width="150px" />
      <el-table-column prop="algorithmId" label="使用算法" width="100px" />
      <el-table-column prop="time" label="创建时间" width="150px" />
      <el-table-column label="操作" align="center" width="250px">
        <template slot-scope="{ row }">
          <el-button
            size="mini"
            @click="$router.push({ path: '/task/edit', query: { row: row } })"
            >编辑</el-button
          >
          <el-button size="mini" @click="run(row)">运行</el-button>
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
    <!-- 分页 -->
    <el-pagination
      :current-page="current"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getList"
      />
    <div></div>
  </div>
</template>
  
  <script>
import { getRequest, postRequest } from "@/utils/api";
export default {
  data() {
    return {

      
      demoOptions: [],
      physioOptions: [],
      sociolOptions: [],

      current:1, //当前页
            limit:10, //每页显示记录数
            searchObj:{}, //条件封装对象
            list:[], //每页数据集合
            total:0, //总记录数

      queryParam: {
        tableName: null,
        algorithmId: null,
        priorKnowledge: null
      },
      subjectFilter: null,
      listLoading: true,
      tableData: [
        {
          id: null,
          name: null,
          type: null,
          algorithmId: null,
          diseaseName: null,
          tableName: null,
          description: null,
          priorKnowledge: null,
          dataType: null,
          scoreId: null,
          maxDegree: null,
          faithfulnessAssumed: null,
          symmetricFirstStep: null,
          clinicalRepresentation: null,
          livingHabit: null,
          socialConnection: null
        }
      ],
      total: 0,
      options: [{
        value: 'disease_mining',
        label: 'disease_mining'
      }, {
        value: 'factor_mining',
        label: 'factor_mining'
      }, {
        value: 'disease_factor_mining',
        label: 'disease_factor_mining'
      }],
    }
  },

  created() {
   

   // this.init()

  // this.init()    //根据表名返回表头

  //   this.init()

  },
  mounted(){
    this.getList()
  },
  methods: {

    init(){
      getRequest(`admin/mining/getFeatures/${this.tableData.tableName}/${this.tableData.diseaseName}`).then(
                    (response) => {
                    let data = response.data;
                    console.log(data)
                    let columnNametemp = Object.keys(data);
                    this.nodes = columnNametemp
                    console.log(this.nodes)

                    if (Object.keys(data).length ==0){
                      this.demoOptions = []
                      this.physioOptions = []
                      this.sociolOptions = []
                    }else{
                      for (let i = 0; i < columnNametemp.length; i++) {
                        if (data[columnNametemp[i]] != null) {
                        const obj = {
                            columnName: data[columnNametemp[i]].featureName,
                            columnDesc: data[columnNametemp[i]].featureNameCn,
                        };
                        if (data[columnNametemp[i]].she == "0") {
                            obj.columnisR = true;
                            this.demoOptions.push(obj);
                        } 
                        else if(data[columnNametemp[i]].she == "1") {
                            obj.columnisS = true;
                            this.physioOptions.push(obj);
                        } 
                        else if(data[columnNametemp[i]].she == "2") {
                            obj.columnisX = true;
                            this.sociolOptions.push(obj);
                        }

                    }
                    }
                    }
                }
                )
                console.log("特征指标上传完成")
    },

    getList(page =1) { //添加当前页参数
      this.current = page

        postRequest(`admin//mining/findMining/${this.current}/${this.limit}`,this.searchObj)

        postRequest(`admin/mining/findMining/${this.current}/${this.limit}`,this.searchObj)

        postRequest(`admin//mining/findMining/${this.current}/${this.limit}`,this.searchObj)

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
      postRequest('admin/mining/getAll', {}).then(
        (response) => {
          console.log(response.list)
          this.tableData = response
          this.listLoading = false
        }
      );
    },
    submitForm() {
     
      this.search()
    },
    search() {
      this.listLoading = true
      postRequest('admin/mining/search',this.queryParam).then(
        (response) => {
          console.log(response)
          this.tableData = []
          this.tableData = response
          this.listLoading = false

          console(123)

          console.log(this.tableData)
        }
      )
    },
    deleteTable(row) {
      let _this = this
      getRequest('admin/mining/delete/' + row.id).then(
        (response) => {

          console.log("yy",response)
      

          if (response.code == "200") {
          //  _this.searchAll()  不知道何用
            _this.$message.success("删除成功")
            _this.getList()

          } else {
            _this.$message.error("删除失败")
            _this.getList()
          }
        
      }
      )
    },

    run(row) {
      let _this = this
      _this.$router.push({ path: '/she/result' ,query: { form: row}})
   

    }
  }
}
  </script>
  <style scoped="scoped">
</style>