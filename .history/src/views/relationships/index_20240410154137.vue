<template>
  <div class="app-container">





    <div class="left_tree">
      <el-button type="success" style="margin-left: 5%; margin-bottom: 5%;" >      点击疾病名称查询历史任务      </el-button>
      <el-tree
        ref="tree"
        :data="treeData"
        :show-checkbox="false"
        node-key="id"
        
        :expand-on-click-node="false"
        :check-on-click-node="true"
        :highlight-current="true"
        @node-click="changeData"
        @check="changeData"
        @check-change="handleCheckChange">
        <span class="custom-tree-node" slot-scope="{ node,  }">
          <span>{{ node.label }}</span>
        </span>
      </el-tree>
       
      </div>


<div class="abc">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="输入疾病名称" required>
        <el-input v-model="searchObj.diseaseName" placeholder="例如肺癌"/>
      </el-form-item>
      <el-form-item label="输入算法名称" required>
        <el-input v-model="searchObj.algorithmName" placeholder="例如fges"/>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
    </el-form>
    <el-row :gutter="20">
      <el-col :span="6" v-for="item in list" :key="item.id" style="margin-bottom: 10px;margin-left: 35px; width: 350px;height: 300px;">
        <el-card body-style="padding: 20px; height: 180px;   ">
          <div  class="clearfix" >
            <!-- <span><strong>任务</strong>{{ item.id }}</span> -->
           
          </div>
          <div><strong>因果关系：</strong>{{ item.relationship }}</div>
          <div><strong>疾病名称：</strong>{{ item.diseaseName }}</div>
          <div><strong>使用数据集：</strong>{{ item.tableName }}</div>
          <div><strong>使用算法：</strong>{{ item.algorithmName }}</div>
          <div><strong>时间：</strong>{{ item.time }}</div>
          <el-button type="danger" icon="el-icon-delete" @click="deleteTable(item)" class="link-left" style="margin-top: 20px;"></el-button>
        </el-card>
      </el-col>
    </el-row>
    <!-- 分页 -->
    <el-pagination
      :current-page="current"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getList"
    />
    <div></div></div>
  </div>
</template>

    
    <script>
  import { getRequest, postRequest } from "@/utils/api";
  export default {
    data() {
      return {
        current:1, //当前页
        limit:12, //每页显示记录数
        searchObj:{}, //条件封装对象
        list:[], //每页数据集合
        total:0, //总记录数
        queryParam: {
          diseaseName: null,
          tableName: null
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
            postRequest(`/admin/relationship/findRelationships/${this.current}/${this.limit}`,this.searchObj)
                .then(response => { //请求成功response是接口返回数据
                //返回集合赋值list
                this.list = response.data.records

                console.log(123)
                console.log(this.list)

                //总记录数
                this.total = response.data.total
                })
                .catch(error => {//请求失败
                console.log(error)
                })
        },


      searchAll() {
        this.listLoading = true
        getRequest('/admin/relationship/getAll', {}).then(
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
      // search() {
      //   this.listLoading = true
      //   postRequest('/admin/relationship/getByVo',this.queryParam).then(

      // searchAll() {
      //   this.listLoading = true
      ///   postRequest('/admin/relationship/getByVo',this.queryParam).then(

      //     (response) => {
      //       console.log(response)
      //       this.tableData = []
      //       this.tableData = response
      //       this.listLoading = false
      //       console.log(this.tableData)
      //     }
      //   )

      // },

      // },   getRequest('/admin/relationship/getAll', {}).then(
      //     (response) => {
      //       this.tableData = response
      //       this.listLoading = false
      //     }
      //   );
      // },

      //没有用
      // submitForm() {
      //   // this.queryParam.pageIndex = 1
      //   this.search()
      // },
      
      // search() {
      //   this.listLoading = true
    

      deleteTable(row) {
        let _this = this
        getRequest(`/admin/relationship/delete/${row.id}`).then(
          (response) => {
            console.log(response)
            if (response.code == "200") {
              _this.searchAll()
              _this.$message.success("删除成功")

              _this.getList()

            } else {
              _this.$message.error("删除失败")
            }
          }
        )
      },
    }
  }
    </script>
    <style scoped>
    .app-container {
      margin: 20px;
    }
    .demo-form-inline .el-form-item {
      margin-right: 10px;
      margin-left: 20%;
      
    }
    .card-item {
      width: 300px; /* 设置方块的宽度 */
      height: 200px; /* 设置方块的高度 */
      margin-bottom: 20px; /* 设置方块之间的底部外边距 */
    }
    .link-left {
      margin-left: 120px; /* 设置删除按钮距离方块右边的距离 */
    }
    .left_tree{
  display: inline-block;
  height: 700px;
  width: 15%;
  border-radius: 3px;
  border-left: 1px solid #e6e6e6;
  border-right: 1px solid #e6e6e6;
  border-top: 1px solid #e6e6e6;
}
    </style>