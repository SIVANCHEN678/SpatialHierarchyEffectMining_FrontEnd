<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="输入疾病名称" required>
        <el-input v-model="searchObj.diseaseName" placeholder="例如肺癌"/>
      </el-form-item>
      <el-form-item label="输入算法名称" required>
        <el-input v-model="searchObj.algorithmId" placeholder="例如fges"/>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
    </el-form>

    <!-- 使用卡片组展示数据 -->
    <el-row>
      <el-col :span="8" v-for="(item, index) in list" :key="index">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ item.name }}</span>
          </div>
          <div>
            <p>任务类型: {{ item.type }}</p>
            <p>任务描述: {{ item.description }}</p>
            <p>疾病名称: {{ item.diseaseName }}</p>
            <p>使用数据: {{ item.tableName }}</p>
            <p>数据类型: {{ item.dataType }}</p>
            <p>使用算法: {{ item.algorithmId }}</p>
            <p>创建时间: {{ item.time }}</p>
          </div>
          <div class="button-group">
            <el-button size="mini" @click="$router.push({ path: '/task/edit', query: { row: item } })">编辑</el-button>
            <el-button size="mini" @click="run(item)">运行</el-button>
            <el-button size="mini" type="danger" @click="deleteTable(item)" class="link-left">删除</el-button>
          </div>
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
  </div>
</template>

<script>
import { getRequest, postRequest } from "@/utils/api";

export default {
  data() {
    return {
      current: 1, //当前页
      limit: 10, //每页显示记录数
      searchObj: {}, //条件封装对象
      list: [], //每页数据集合
      total: 0, //总记录数
      // 其他数据属性...
    }
  },

  // 组件创建时自动执行的钩子函数
  mounted() {
    this.getList(); // 获取数据
  },

  methods: {
    // 获取数据列表
    getList(page = 1) { //添加当前页参数
      this.current = page;
      postRequest(`admin/mining/findMining/${this.current}/${this.limit}`, this.searchObj)
        .then(response => { //请求成功response是接口返回数据
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
      this.$router.push({ path: '/she/result' ,query: { form: row }});
    }
  }
}
</script>

<style scoped>
.box-card {
  width: 3500px; /* 设置卡片的宽度 */
  height: 300px; /* 设置卡片的高度 */
  margin-bottom: 20px; /* 设置卡片之间的间距 */
}

.button-group {
  text-align: center; /* 按钮右对齐 */
  margin-top: 10px; /* 设置按钮与内容的间距 */
}
</style>
