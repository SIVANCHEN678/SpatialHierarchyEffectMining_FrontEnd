<template>
  <div class="app-container">





    <div class="left_tree">
      <span class="lineStyle" style="margin-left: 20%;margin-bottom: 2%;"></span><span><b>选择疾病要查看知识图谱</b></span>
      <hr class="horizontal-line" style="margin-bottom: 5%;">
      <!-- <div v-for="(item,index) in dis" :key="index" style="margin-left: 10px;"><el-button type="success" plain style="width: 150px;">{{item.name}}</el-button></div> -->
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

  <h1 class="ff">知识图谱关系展示</h1>
  <div class="horizontal-line"></div>
    <!-- <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="输入疾病名称" required>
        <el-input v-model="searchObj.diseaseName" placeholder="例如肺癌"/>
      </el-form-item>
      <el-form-item label="输入算法名称" required>
        <el-input v-model="searchObj.algorithmName" placeholder="例如fges"/>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
    </el-form> -->
    <el-row :gutter="20">
      <el-col :span="6" v-for="(item,index) in list1" :key="index" style="margin-bottom: 10px;margin-left: 35px; width: 350px;height: 120px;">
        <el-card body-style="padding: 10px; height: 100px;   ">
          <div  class="clearfix" >
            <!-- <span><strong>任务</strong>{{ item.id }}</span> -->
           
          </div>
          <div><strong>知识图谱关系：</strong>{{ item }}</div>
          <!-- <div><strong>疾病名称：</strong>{{ item.diseaseName }}</div>
          <div><strong>使用数据集：</strong>{{ item.tableName }}</div>
          <div><strong>使用算法：</strong>{{ item.algorithmName }}</div>
          <div><strong>时间：</strong>{{ item.time }}</div> -->
          <el-button type="danger" icon="el-icon-delete" @click="deleteTable(item)" size="small" class="link-left" style="margin-top: 30px;"></el-button>
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
  import { getCategory, addDisease, removeCate } from "@/api/category";
  export default {
    data() {
      return {

        //获取登录用户的id
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},

        current:1, //当前页
        limit:9, //每页显示记录数
        searchObj:{}, //条件封装对象
        list:[], //每页数据集合
        total:0, //总记录数
        diseaseName,
        queryParam: {
          diseaseName: null,
          tableName: null
        },
        list1:null,
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
        dis:null,
        treeData: [],
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
      this.getCatgory();
     // this.getList1()//获取知识图谱
      this.getdis()
    },
    methods: {


        getdis(){
          getRequest(`/admin/relationship/getAllDisease`).then(response => { 

this.dis=response.data


           })
        },

      getCatgory(){
      getCategory("/admin/api/category").then((response)=>{
       this.treeData = response.data;
       console.log(this.treeData)
      })
    },
      getList(page = 1) { //添加当前页参数
            this.current = page
            let id=11
            getRequest(`/admin/relationship/findRelationships/${this.current}/${this.limit}/${id}`,this.diseaseName)
                .then(response => { //请求成功response是接口返回数据
                //返回集合赋值list
                this.list1 = response.data.records

                console.log(123)
                console.log(this.list)

                //总记录数
                this.total = response.data.total
                })
                .catch(error => {//请求失败
                console.log(error)
                })
        },
//         getList1() { //添加当前页参数
            
//             getRequest('/admin/knowledgeGraph/getAllKnowledgeGraph')
//                 .then(response => { //请求成功response是接口返回数据
//                 //返回集合赋值list
//                // this.list1 = response.data

//                 console.log(456)
//                 console.log(this.list)

//                 const resultArray = [];

// // 遍历返回的数据数组，并将 parentName 和 childrenName 的值以 "->" 连接存储到结果数组中
// for (const item of response.data) {
//     resultArray.push(`${item.parentName} -> ${item.childrenName}`);
// }
// this.list1=resultArray
// // 输出结果数组
// console.log(resultArray);
//                 })
//                 .catch(error => {//请求失败
//                 console.log(error)
//                 })
//         },

      // searchAll() {
      //   this.listLoading = true
      //   getRequest('/admin/relationship/getAll', {}).then(
      //     (response) => {
      //       this.tableData = response
      //       this.listLoading = false
      //     }
      //   );
      // },
      submitForm() {
        // this.queryParam.pageIndex = 1
        this.search()
      },
  
    
      changeData(data){
      console.log('dataxinxi',data.label)
      this.current = 1;
      this.diseaseName=data.label
      postRequest(`admin/mining/findMining/${this.current}/${this.limit}`,this.searchObj)
        .then(response => { //请求成功response是接口返回数据
          console.log(response.data)
          this.list = response.data.records; // 返回集合赋值list
          this.total = response.data.total; // 总记录数
        })
        .catch(error => { //请求失败
          console.log(error);
        });
    }, append(isLeaf) {
        // 发送请求新增一个病种信息（目录结构）
        let catagoryNode = {
          label: this.diseaseName,
          catLevel: this.nodeData.catLevel+1,
          parentId: this.nodeData.id,
          isLeafs: isLeaf,
          isCommon: this.nodeData.isCommon,
          path: this.nodeData.path+"/"+this.diseaseName,
          isDelete: 0,
          children: []
        };

        let catagoryNodeJSON = JSON.stringify(catagoryNode);
        addDisease("/admin/api/addDisease",catagoryNodeJSON).then(response=>{
          this.getCatgory(); //刷新目录结构
          console.log(response.data);
        })
        .catch(error=>{
          alert("新增疾病目录错误"+error)
        })
        this.nodeData = {};
        this.cleanInput();
        this.dialogDiseaseVisible = false;
    },
    appendCommon() {
          const newChild = { id: id++, label: this.diseaseName, children: [] , isLeafs: false,isCommon:true};
          if (!this.nodeData.children) {
              this.$set(this.nodeData, 'children', []);
          }
          this.nodeData.children.push(newChild);
          this.nodeData = {};
          this.cleanInput();
      },
      deleteTable(row) {
        let _this = this
        getRequest(`/admin/knowledgeGraph/deleteKnowledgeGraph/${row.id}`).then(
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
    .ff{
      color: #111210;
      font-size: 25px;
      margin-left: 40%;
    }
    .app-container {
      margin: 10px;
    }
    .demo-form-inline .el-form-item {
      margin-right: 10px;
     
      
    }
  
    .link-left {
      margin-left: 120px; /* 设置删除按钮距离方块右边的距离 */
      font-size: 10px;
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
.abc{
  position: relative; /* 设置元素相对定位 */
  margin-left: 20%;
  margin-top: -700px;
}
.horizontal-line {
  height: 1px;
  background-color: #ccc;
  width: 100%;
  margin: 1em 0;
}
    </style>