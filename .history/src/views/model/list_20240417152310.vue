<template>
  <div class="app-container">
    <div style="margin-left: 20%;">
    <el-form :model="queryParam" ref="queryForm" :inline="true">
      <el-form-item label="选择算法类型" required>
        <el-select v-model="queryParam.algorithmType" placeholder="例如基于约束">
          <el-option label="基于约束" value="基于约束"></el-option>
          <el-option label="基于分数" value="基于分数"></el-option>
          <el-option label="函数因果" value="函数因果"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="输入算法名称" required>
        <el-input v-model="queryParam.algorithmName" placeholder="例如fges"></el-input>
      </el-form-item>

     

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="submitForm">查询</el-button>
        <el-button type="primary" icon="el-icon-search" @click="clearn">清除</el-button>
        <span>  </span>
        <router-link :to="{path:'/model/upload'}" class="link-left">
          <!-- <el-button class="btn-upload" icon="el-icon-search" style="margin-left: 10px;"  type="success">算法导入</el-button> -->
        </router-link>
      </el-form-item>
    </el-form></div>
    <div class="card-container">
      <el-card  v-loading="listLoading" v-for="(item, index) in tableData" :key="index" class="card-item">
      <div >
        
        <p><strong>算法名称: </strong>{{ item.algorithmName }}</p>
        <p><strong>算法类型: </strong>{{ item.algorithmType }}</p>
        <p><strong>算法描述: </strong>{{ item.algorithmDescription }}</p>
        <p><strong>上传时间:</strong> {{ item.time }}</p>
        <p><strong>最大度: </strong>{{ item.maxDegree }}</p>
        <p><strong>评分函数: </strong>{{ item.scoreId }}</p>
        
        </div>
        <div class="button-group">
          <el-button size="mini" type="success" @click="$router.push({path:'/model/edit',query:{row:item}})">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteTable(item)" class="link-left">删除</el-button>
        </div>
     
    </el-card>
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
</template>
  
  <script>
  import { postRequest, getRequest } from "@/utils/api";
  export default {
    data () {
      return {
        queryParam: {
          algorithmName: null,
          algorithmType: null
        },
        searchObj: {}, //条件封装对象
        subjectFilter: null,
        listLoading: true,
        limit:10,
        tableData: [
            {
                id: null,
                algorithmName: null,
                algorithmType: null,
                algorithmDescription: null,
                createTime: null,
            }
        ],
        total: 0,
      }
    },
    mounted(){
      this.getList(); // 获取数据
    },
    created () {
    //   this.initSubject()
      this.searchAll()
    },
    methods: {
      clearn(){
        this.queryParam={}
        this.getList();
      },
      //未写
      getList(page = 1) { //添加当前页参数
      this.current = page;
      postRequest(`/admin/algorithm/findTables/${this.current}/${this.limit}`, this.searchObj)
        .then(response => { //请求成功response是接口返回数据
          console.log(response.data)
          this.list = response.data.records; // 返回集合赋值list
          this.total = response.data.total; // 总记录数
        })
        .catch(error => { //请求失败
          console.log(error);
        });
    },
        searchAll () {
          this.listLoading = true
          getRequest('admin/algorithm/getAll',{}).then(
                  (response)=>{
                    console.log('1',response)
                    this.tableData=response
                    this.listLoading=false
                  }
                );
      },
      submitForm () {
        // this.queryParam.pageIndex = 1
        this.search()
      },
      search(){
        this.listLoading=true
        postRequest('admin/algorithm/search',this.queryParam).then(
        (response) => {
          this.tableData = []
          this.tableData = response.data
          this.listLoading = false
          console.log(this.tableData)
        })
      },
      deleteTable (row) {
        let _this = this
        getRequest('admin/algorithm/delete/'+row.id).then(
            (response)=>{
                if(response.code == "200"){
                    _this.searchAll()
                //  _this.$message.success("删除成功")
                  this.getList(); // 获取数据
                  

                }else{
                  //  _this.$message.error("删除失败")
                }
            }
        )
      },
    }
  }
  </script>
  <style scoped="scoped">
.box-card {
  width: 300px;
  margin: 20px;
}

.text {
  font-size: 22px;

}
.text item{
  margin-top: 10px;
}
.item {
  padding: 20px 0;
  margin-bottom: 20px; /* 添加间隔 */
}
.card-item {
  width: 400px; /* 设置方块的宽度 */
  height: 300px; /* 设置方块的高度 */
  margin: 30px; /* 设置方块之间的间距 */
  padding-left: 20px;
}
.card-container {
  display: flex;
  flex-wrap: wrap;
  padding-left: 20px;
}
.button-group{
  display: center;
  margin-left: 60px;
  margin-top: 20px;
}
</style>