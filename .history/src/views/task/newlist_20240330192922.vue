<template>
  <div class="main">
    <div class="left_tree">
       
       <el-tree
         ref="tree"
         :data="treeData"
         :show-checkbox="false"
         node-key="id"
         default-expand-all
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
    <div class="right">
      <!--==========================     头部按钮     ==============================================================-->
      <div id="top_buttons">
        <div id="task_leader">
          <span>任务负责人：</span>
          <el-select v-model="leader" placeholder="请选择">
            <el-option
              v-for="item in taskLeaderList"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </div>
        <el-button @click="clearFilter">清除</el-button>
        <el-button type="success" @click="task">新建任务</el-button>
      </div>

      <!--===============================    卡片组     ==============================================================-->
      <div class="cardGroup">
        <el-row>
      <el-col :span="6" v-for="(item, index) in list"  :key="index" >
        <el-card class="box-card" >
        
          <div>
            <p><strong>任务名称:  </strong>{{ item.name }}</p>
            <p><strong>负责人:  </strong></p>
            <!-- <p>任务描述: {{ item.description }}</p> -->
            <p><strong>疾病名称:  </strong>{{ item.diseaseName }}</p>
            <p><strong>使用数据:  </strong>{{ item.tableName }}</p>
            <p><strong>数据类型:  </strong>{{ item.dataType }}</p>
            <p><strong>使用算法:  </strong>{{ item.algorithmId }}</p>
            <p><strong>创建时间:  </strong>{{ item.time }}</p>
          </div>
          <div class="button-group">
            <el-button size="mini" type="primary" @click="$router.push({ path: '/task/edit', query: { row: item } })">编辑</el-button>
            <el-button size="mini" type="success"  @click="run(item)">运行</el-button>
            <el-button size="mini" type="danger" @click="deleteTable(item)" class="link-left">删除</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
      </div>
      <el-pagination
      :current-page="current"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getList"
    />
      
    </div>
  </div>
</template>

<script>
import { getCategory, addDisease, removeCate } from "@/api/category";
import { getRequest } from "@/utils/api";
import { mapGetters, mapMutations, mapState, mapActions } from "vuex";

import {  postRequest } from "@/utils/api";
export default {
  computed: {
    ...mapState(["taskList"]), //获取的任务列表和树
    ...mapGetters(["taskLeaderList", "taskDiseaseList"]),
  },
    // 组件创建时自动执行的钩子函数
    mounted() {
    this.getList(); // 获取数据
   this.getCatgory()
  },

  created() {
   this.getList(); // 获取数据
   this.getCatgory()
    //this.getTaskList(sessionStorage.getItem("userid") - 0);
   // this.getTaskList();
   // this.getTreeData();
   // this.getCatgory();
  },
  data() {
    return {
      treeData: [],
      diseaseName: null,
      list: [], //每页数据集合
      disease: "",
      leader: "",
      resultDialogShow: false,
      result: {},
      treeData: JSON.parse(JSON.stringify(treeData)),
      current: 1, //当前页
      limit: 12, //每页显示记录数
      searchObj: {}, //条件封装对象
      list: [], //每页数据集合
      total: 0, //总记录数
    };
  },

  methods: {
    getCatgory(){
      getCategory("/admin/api/category").then((response)=>{
    if(response.data.code === 200){
      this.treeData = response.data;
      console.log(response.data);
    } else {
      console.error('获取分类数据出错:', response.statusText);
    }
  }).catch(error => {
    console.error('请求分类数据时发生错误:', error);
  });
},
    run(row) {

      let _this = this
      _this.$router.push({ path: '/she/result' ,query: { form: row}})
   

    },

    getList(page = 1) { //添加当前页参数
    
      this.current = page;
      postRequest(`admin/mining/findMining/${this.current}/${this.limit}`, this.searchObj)
        .then(response => { //请求成功response是接口返回数据
          console.log(response.data)
          this.list = response.data.records; // 返回集合赋值list
          this.total = response.data.total; // 总记录数
        })
        .catch(error => { //请求失败
          console.log(error);
        });
    },
     // 删除数据
     deleteTable(row) {
      getRequest('admin/mining/delete/' + row.id)
        .then(response => {
          if (response.code === "200") {
            this.$message.success("删除成功");
            this.getList(); // 删除成功后重新获取数据列表
          } else {
            this.$message.error("删除失败");
            this.getList(); // 删除失败后重新获取数据列表
          }
        });
    },

    // 运行任务
    run(row) {
      console.log(row)
      this.$router.push({ path: '/she/result' ,query: { form: row }});
    },
    //新建任务
    task(){
      this.$router.replace("/mining/renewindex")
    },
    ...mapActions(["getTaskList"]),//得到任务列表
    ...mapMutations(["SetTaskList"]),
    handleCheck(row) {
      getRequest(`Task/result/${row.id}`).then((res) => {
        this.result = res;
        this.resultDialogShow = true;
      });
    },
    handleDelete(row) {
      getRequest(`Task/delete/${row.id}`).then((res) => {
        console.log(res);
        this.SetTaskList(res.reverse());
      });
    },
    clearFilter() {
      this.disease = "";
      this.leader = "";
    },
    changeData(node) {
      console.log(node.label)
      this.getList(); // 获取数据
      //this.disease = node.label;
      this.current = 1;
      this.searchObj.diseaseName=node.label
      postRequest(`admin/mining/findMining/${this.current}/${this.limit}`,this.searchObj)
        .then(response => { //请求成功response是接口返回数据
          console.log(response.data)
          this.list = response.data.records; // 返回集合赋值list
          this.total = response.data.total; // 总记录数
        })
        .catch(error => { //请求失败
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
.main {
  display: grid;
  grid-template-columns: 12% 100%;
}

.left_tree {
  display: inline-block;
  border-radius: 3px;
  border-left: 1px solid #e6e6e6;
  border-right: 1px solid #e6e6e6;
  border-top: 1px solid #e6e6e6;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

#top_buttons {
  margin-left: 3%;
  margin-bottom: 20px;
}

#top_buttons > * {
  display: inline-block;
}
#task_disease {
  margin-right: 40px;
}
#task_leader {
  margin-right: 20px;
}
#table {
  margin-top: 10px;
}
.lineStyle {
  color: rgb(100, 172, 231);
}
.featureTitle {
  font-weight: 800;
}
.cardGroup {
  width: 100%;
  margin-left: 3%;
  display: grid;
  grid-template-columns: repeat(auto-fill, 400px);
  grid-row-gap: 40px;
  grid-column-gap: 60px;
}

.cardInfo {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 定义两列，每列占用相等的空间 */
  grid-template-rows: auto auto auto auto; /* 定义四行，高度根据内容自适应 */
  gap: 10px; /* 定义网格行和列之间的间隙 */
}

.cardInfo > div:nth-child(5), /* 第五个子元素（数据表） */
.cardInfo > div:nth-child(6) /* 第六个子元素（创建时间） */ {
  grid-column: 1 / span 2; /* 这两个元素跨越两列 */
}

.ttl{
  font-weight: 600;
  color: #071135;
}

.editButton {
  margin-left: 30%;
  margin-top: 5%;
}

.icon {
  justify-self: end;
}
.box-card {
  width: 300px; /* 设置卡片的宽度 */
  height: 250px; /* 设置卡片的高度 */
  margin-bottom: 30px; /* 设置卡片之间的间距 */
 
}
.cardGroup {
  width: 85%;
  margin-left: 3%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* 自适应宽度，最小宽度300px */
  grid-row-gap: 40px;
  grid-column-gap: 60px;
}

.button-group {
  text-align: center; /* 按钮右对齐 */
  margin-top: 10px; /* 设置按钮与内容的间距 */
}
</style>
