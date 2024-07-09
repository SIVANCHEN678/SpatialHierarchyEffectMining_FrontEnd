<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="输入用户名称" required>
        <el-input v-model="searchObj.name" placeholder=""/>
      </el-form-item>
      <el-form-item label="输入用户" required>
        <el-input v-model="searchObj.username" placeholder=""/>
      </el-form-item>
      <el-form-item label="输入用户" required>
        <el-input v-model="searchObj.username" placeholder=""/>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
    </el-form>
    
    <el-row :gutter="20">
      <el-col :span="8" v-for="(item, index) in tableData" :key="index">
        <el-card class="box-card" @click.native="handleCardClick(item)">
          <div><span>用户名：</span>{{ item.name }}</div>
          <div>{{ item.username }}</div>
          <div><span>创建事件：</span>{{ item.time }}</div>
          <div><span>用户IP：</span>{{ item.ip }}</div>
          <el-button type="danger" size="mini" @click.stop="deleteTable(item)">删除</el-button>
        </el-card>
      </el-col>
    </el-row>
    
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
      current: 1,
      limit: 10,
      searchObj: {},
      list: [],
      total: 0,
      tableData: []
    };
  },
  created() {
    this.getAll();
  },
  methods: {
    getAll() {
      getRequest('admin/user/getAll').then(response => {
        this.tableData = response;
        this.listLoading = true;
      });
    },
    getList(page = 1) {
      this.current = page;
      postRequest(`/admin/user/findUser/${this.current}/${this.limit}`, this.searchObj)
        .then(response => {
          this.list = response.data.records;
          this.tableData = response.data.records;
          this.total = response.data.total;
        })
        .catch(error => {
          console.log(error);
        });
    },
    deleteTable(row) {
      getRequest(`admin/user/delete/${row.id}`).then(response => {
        if (response.code === "200") {
          this.getAll();
          this.$message.success("删除成功");
        } else {
          this.$message.error("删除失败");
        }
      });
    },
    handleCardClick(item) {
      console.log("Clicked on card:", item);
    }
  }
};
</script>

<style scoped>
.box-card {
  margin-bottom: 20px;
}
</style>
