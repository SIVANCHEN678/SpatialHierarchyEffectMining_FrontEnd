<template>
  <div class="app-container">
    <el-form :model="queryParam" ref="queryForm" :inline="true">
      
      <el-form-item label="输入疾病名称" required>
        <el-input v-model="queryParam.diseaseName" placeholder="例如糖尿病"></el-input>
        </el-form-item>

        <el-form-item label="选择数据类型" required>
            <el-select v-model="queryParam.tableType" placeholder="例如临床表征">
                <el-option label="临床表征" value="临床表征"></el-option>
                <el-option label="生活行为习惯" value="生活行为习惯"></el-option>

                <el-option label="社会环境" value="社会环境"></el-option>
                <el-option label="多空间层次" value="多空间层次"></el-option>
            </el-select>
        </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm">查询</el-button>
        <router-link :to="{ path: '/data/upload' }" class="link-left">
          <el-button class="btn-upload" type="primary">上传</el-button>
        </router-link>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="tableData"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column prop="id" label="Id" width="90px" />
      <el-table-column prop="tableName" label="表名" width="120px" />
      <el-table-column prop="diseaseName" label="疾病名称" width="140px" />
      <el-table-column prop="description" label="数据描述描述" width="160px" />
      <el-table-column prop="tableType" label="数据类型" width="160px" />
      <el-table-column prop="createTime" label="创建时间" width="160px" />
      <el-table-column label="操作" align="center" width="160px">
        <template slot-scope="{ row }">
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
    <div></div>
  </div>
</template>
  
  <script>
import { postRequest, getRequest } from "@/utils/api";
export default {
  data() {
    return {
      
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
    this.searchAll()
  },
  methods: {
    searchAll() {
      this.listLoading = true
      getRequest('table/getAll').then(
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
      postRequest('table/search',this.queryParam).then(
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
      getRequest('table/delete/' + row.id).then(
        (response) => {
          console.log(response)
          if (response === true) {
            _this.searchAll()
            _this.$message.success("删除成功")
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