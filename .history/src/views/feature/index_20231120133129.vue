<template>
    <div class="app-container">
      <el-form :model="queryParam" ref="queryForm" :inline="true">
        <el-form-item label="选择算法类型" required>
            <el-select v-model="searchObj.diseaseName" placeholder="例如基于约束">
                <el-option label="肺癌" value="肺癌"></el-option>
                <el-option label="糖尿病" value="糖尿病"></el-option>
                <el-option label="高血压" value="高血压"></el-option>
                <el-option label="前列腺癌" value="前列腺癌"></el-option>
                <el-option label="结直肠癌" value="结直肠癌"></el-option>
            </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="list"
        stripe
            style="width: 100%"
      >
        <el-table-column prop="id" label="Id" width="150px" />
        <el-table-column prop="diseaseName" label="疾病名称" width="300px" />
        <el-table-column prop="featureName" label="字段名称" width="150px" />
        <el-table-column prop="featureNameCn" label="字段中文名称" width="150px" />
        <el-table-column prop="she" label="空间层次" width="150px" />

        <el-table-column label="操作" align="center" width="250px">
          <template slot-scope="{ row }">
            <el-button
            size="mini"
            @click="$router.push({ path: '/feature/edit', query: { row: row } })"
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
      <!-- 分页 -->
    <el-pagination
    :current-page="current"
    :page-size="limit"
    :total="total"
    style="padding: 30px 0; text-align: center;"
    layout="total, prev, pager, next, jumper"
    @current-change="getList"
    />
      <div>
	</div>
    </div>
    
  </template>
  
  <script>
  import { getRequest, postRequest } from "@/utils/api";
  export default {
    data() {
      return {
        current:1, //当前页
        limit:10, //每页显示记录数
        searchObj:{}, //条件封装对象
        list:[], //每页数据集合
        total:0, //总记录数
        queryParam: {
          diseaseName: null,
        },
        subjectFilter: null,
        listLoading: true,
        tableData: [
          {
            id: null,
            relationships: null,
            diseaseName: null,
            algorithmName: null,
            tableName: null,
            priorKnowledgeName: null,
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
      this.getList()
    },
    methods: {

      getList(page = 1) { //添加当前页参数
            this.current = page
            postRequest(`/admin/feature/findFeatures/${this.current}/${this.limit}`,this.searchObj)
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
        getRequest('admin/feature/getAllFeatures', {}).then(
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
        postRequest('admin/feature/getByVo',this.queryParam).then(
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
        getRequest('admin/feature/deleteFeature/' + row.id).then(
          (response) => {
            if (response.code == "200") {
              _this.searchAll()
              _this.$message.success("删除成功")
<<<<<<< HEAD
<<<<<<< HEAD
=======
              _this.getList()
>>>>>>> 968a5ae (yy第一次提交)
=======
>>>>>>> e73a6b49db1d1575e7062fc8d56f22f1bd4829c2
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