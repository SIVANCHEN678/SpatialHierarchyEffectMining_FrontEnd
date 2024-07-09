<template>
  <div class="app-container">

    <div class="left_tree">

      <div class="tipInfo">
    
      
      <h3 >选择疾病查看知识图谱</h3></div>
      <el-button size="mini" type="primary" @click="all" style="margin-left: 20%;">全部关系</el-button>
    
      <hr class="horizontal-line" style="margin-bottom: 5%;">
      <!-- <div v-for="(item,index) in dis" :key="index" style="margin-left: 10px;"><el-button type="success" plain style="width: 150px;">{{item.name}}</el-button></div> -->
      <el-tree ref="tree" :data="treeData1" :show-checkbox="false" node-key="id" default-expand-all
        :expand-on-click-node="false" :check-on-click-node="true" :highlight-current="true" @node-click="changeData"
        @check-change="handleCheckChange">
          <span class="custom-tree-node" slot-scope="{ node, data }">
          <span v-if="data.catLevel == 1" style="font-weight: bold; font-size: 15px; color: #252525">{{ node.label
            }}</span>
          <span v-else>{{ node.label }}</span>
          <span></span></span>
          </el-tree>

      <el-tree ref="tree" :data="treeData2" :show-checkbox="false" node-key="id" default-expand-all
        :expand-on-click-node="false" :check-on-click-node="true" :highlight-current="true" @node-click="changeData"
        @check-change="handleCheckChange">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span v-if="data.catLevel == 1" style="font-weight: bold; font-size: 15px; color: #252525">{{ node.label
            }}</span>
          <span v-else>{{ node.label }}</span>
          <span>
      
          </span>
        </span>
      </el-tree>
      <el-tree ref="tree" :data="treeData3" :show-checkbox="false" node-key="id" default-expand-all
        :expand-on-click-node="false" :check-on-click-node="true" :highlight-current="true" @node-click="changeData"
        @check-change="handleCheckChange">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span v-if="data.catLevel == 1" style="font-weight: bold; font-size: 15px; color: #252525">{{ node.label
            }}</span>
                 <span v-else>{{ node.label }}</span>
          <span>
           
          </span>
        </span>
      </el-tree>
       
      </div>


<div class="right_table">

  <h1 class="ff" style="margin-bottom: 3%;">疾病知识图谱关系</h1>
  
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
      <el-col :span="24" v-for="(item,index) in list1" :key="index" style="margin-bottom: 30px;margin-left: 50px; width: 350px;height: 150px;">
        <el-card body-style="padding: 30px; height: 200px;   ">
          <div  class="clearfix" >
            <!-- <span><strong>任务</strong>{{ item.id }}</span> -->
           
          </div>
          <!-- <div><strong>知识图谱关系：</strong>{{ item }}</div> -->
          <div><strong>疾病名称：</strong>{{ item.diseaseName }}</div>
          <div><strong>关系：</strong>{{ item.parentName }}->{{item.childrenName}}</div>
          
         
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
    <div>




    </div>
  
  </div>


  </div>
</template>

    
    <script>
  import { getRequest, postRequest } from "@/utils/api";
  import { getCategory} from "@/api/category";
  export default {
    data() {
      return {

        //获取登录用户的id
        userId: sessionStorage.getItem("userid"),
      treeData1: [],
      treeData2:[],
      treeData3:[],
        current:1, //当前页
        limit:9, //每页显示记录数
        searchObj:{}, //条件封装对象
        list:[], //每页数据集合
        total:0, //总记录数
        diseaseName:'',
        queryParam: {
          diseaseName: null,
        //  tableName: null
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
     
   
      this.getCatgory1();
     // this.getList1()//获取知识图谱
    //  this.getdis()
    this.getList()
    },
    methods: {

      getCatgory1() {
     

getCategory(`/api/category?uid=${this.userId}`).then((response) => {
console.log('获取的树',response)
this.treeData1 = response.data.slice(0,1);
this.treeData2 = response.data.slice(1,2);
this.treeData3 = response.data.slice(2,3);
// 获取病种和数据集总数

});

},
filterNonLeafNodes(treeNode) {
  // If the node is a leaf node (no children or empty children array), return empty array
  if (!treeNode.children || treeNode.children.length === 0) {
    return [];
  } else {
    // Recursively filter non-leaf nodes
    treeNode.children = treeNode.children
      .map(child => this.filterNonLeafNodes(child))
      .flat(); // Flatten the array after filtering
    return treeNode;
  }
}
,

      getList(page = 1) { //添加当前页参数
            this.current = page
          
            postRequest(`/api/knowledgeGraph/findKnowledgeGraph/${this.current}/${this.limit}/${this.userId}`,this.queryParam)
                .then(response => { //请求成功response是接口返回数据
                //返回集合赋值list
                this.list1 = response.data.records

                console.log(123)
                console.log(this.list1)

                //总记录数
                this.total = response.data.total
                })
                .catch(error => {//请求失败
                console.log(error)
                })
        },


        all(){
          this.queryParam={}
          this.getList()
        },
      submitForm() {
        // this.queryParam.pageIndex = 1
        this.search()
      },
  
    
      changeData(data){
      console.log('dataxinxi',data.label)
      this.current = 1;
      this.queryParam.diseaseName=data.label

      this.getList()
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
  
.right_table {
  display: inline-block;
  height: 820px;
  width: 82%;
  position: absolute;
  /* border: none; */
  /* overflow-y: auto; */
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
  position: absolute;
  margin-left: 20%;
  margin-top: -45%;
  
}
.horizontal-line {
  height: 1px;
  background-color: #ccc;
  width: 100%;
 
}
.tipInfo {
  background-color: rgba(124, 124, 124, 0.1);
  height: 50px;
  text-align: center;
}

    </style>