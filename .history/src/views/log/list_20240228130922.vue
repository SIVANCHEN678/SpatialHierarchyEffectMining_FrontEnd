<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="输入操作内容" required>
        <el-input v-model="searchObj.name" placeholder="登录"/>
      </el-form-item>
      <el-form-item label="输入用户名称" required>
        <el-input v-model="searchObj.userName" placeholder=""/>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
    </el-form>
    <div class="card-container">
      <el-card v-for="item in list" :key="item.id" class="card-item">
        <div slot="header" class="clearfix">
          <span>{{ item.name }}</span>
          <el-button size="mini" type="danger" class="link-left"  @click="deleteTable(item)">删除</el-button>
        </div>
        <div>
          <h>用户名称: {{ item.userName }}</h>
          <p>操作时间: {{ item.time }}</p>
          <p>用户IP: {{ item.ip }}</p>
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
import { h } from "vue";
  export default {
    data() {
        return {
            dialogFormVisible: false,
            featuresNum: null,
            selectedDisease: "",
            featureForm: {
                featureName: "",
                diseaseName: "",
                she: null,
                featureNameCn: ""
            },
            current: 1,
            limit: 12,
            searchObj: {},
            list: [],
            total: 0,
            queryParam: {
                diseaseName: null,
                tableType: null,
            },
            subjectFilter: null,
            listLoading: true,
            tableData: [
                {
                    id: null,
                    name: null,
                    username: null,
                    time: null,
                    ip: null,
                }
            ],
            total: 0,
        };
    },
    created() {
        //   this.initSubject()
        this.getList();
    },
    methods: {
        featureSelect(row) {
            this.dialogFormVisible = true;
            this.selectedDisease = row.diseaseName;
            getRequest(`/admin/table/getHeader/${row.tableName}`).then((response) => {
                console.log(response.data);
                const tempData = response.data;
                this.dialogForm.featuresNum = response.data.length;
                this.featuresNum = response.data.length - 1;
                console.log(response.data.length);
                for (let i = 0; i < response.data.length; i++) {
                    const obj = {
                        featureName: tempData[i]
                    };
                    console.log(obj);
                    this.dialogForm.fields.push(obj);
                }
            });
        },
        generateFields() {
            const numFields = parseInt(this.dialogForm.featuresNum);
            if (!isNaN(numFields)) {
                this.dialogForm.fields = Array.from({ length: numFields }, () => ({
                    name: "",
                    type: "",
                }));
            }
        },
        submitTable() {
            const FeaturesLen = this.dialogForm.fields.length;
            console.log(this.dialogForm.fields);
            console.log(FeaturesLen);
            for (let i = 1; i < FeaturesLen; i++) {
                this.featureForm.diseaseName = this.selectedDisease;
                this.featureForm.featureNameCn = this.dialogForm.fields[i].featureNameCn;
                this.featureForm.featureName = this.dialogForm.fields[i].featureName;
                this.featureForm.she = this.dialogForm.fields[i].she;
                postRequest("admin/table/addFeatures", this.featureForm).then((response) => {
                    if (response === true) {
                        // this.$router.push({ path: '@/views/relationships/index'})
                        // this.$router.push({ path: '/relationships' })
                        this.$message.success("保存成功");
                    }
                    else {
                        this.$message.error("保存失败,该字段已存在");
                    }
                });
            }
            this.$router.push('/feature');
        },
        resetForm() {
            this.dialogForm.dataSetName = "";
            this.dialogForm.featuresNum = 1;
            this.dialogForm.fields = [{ featureName: "", she: null, featureNameCn: "" }];
        },
        //医院设置列表
        getList(page = 1) {
            this.current = page;
            console.log(this.searchObj);
            postRequest(`/admin/log/findLog/${this.current}/${this.limit}`, this.searchObj)
                .then(response => {
                //返回集合赋值list
                this.list = response.data.records;
                //总记录数
                this.total = response.data.total;
            })
                .catch(error => {
                console.log(error);
            });
        },
        searchAll() {
            this.listLoading = true;
            getRequest('admin/log/getAll').then((response) => {
                console.log(response.list);
                this.tableData = response;
                this.listLoading = false;
            });
        },
        submitForm() {
            // this.queryParam.pageIndex = 1
            this.search();
        },
        search() {
            this.listLoading = true;
            postRequest('admin/log/search', this.queryParam).then((response) => {
                console.log(response);
                this.tableData = [];
                this.tableData = response;
                this.listLoading = false;
                console.log(this.tableData);
            });
        },
        deleteTable(row) {
            let _this = this;
            getRequest('admin/log/delete/' + row.id).then((response) => {
                console.log(response);
                if (response.code == 200) {
                    _this.searchAll();
                    _this.$message.success("删除成功");
                    _this.getList();
                }
                else {
                    _this.$message.error("删除失败");
                    _this.getList();
                }
            });
        },
    },
    components: { h }
}
    </script>

    <style scoped>
.app-container {
  margin: 20px;
}
.demo-form-inline .el-form-item {
  margin-right: 10px;
}
.card {
  width: 200px; /* 设置方块的宽度 */
  height: 150px; /* 设置方块的高度 */
  background-color: #6dcae9; /* 设置方块的背景颜色 */
  margin: 50px; /* 设置方块之间的间距 */
}
.card-container {
  display: flex;
  flex-wrap: wrap;
}
.link-left{
  margin-left: 20px;
}
.card-item {
  width: calc(17.33% );
  margin: 10px;
  width: 350px; /* 设置方块的宽度 */
  height: 200px; /* 设置方块的高度 */
  margin: 30px; /* 设置方块之间的间距 */
}

</style>
 