<template>
  <div>
    <div id="dataList">
              <el-card
                :body-style="{ padding: '0px' }"
                v-for="item in dataOptions"
                :key="item.id"
                :shadow="chosenData === item ? 'always' : 'hover'"
                style="width: 210px"
                @click.native="chosenData = item"
              >
                <img src="@/assets/dataset.png" class="image" object-fit="contain" />
                <div style="padding: 14px">
                  <span>{{ item.tableName }}</span>
                  <div class="bottom clearfix">
                    <el-button
              type="text"
              class="button"
              @click="getData(item.tableName)"
              style="float: left; margin-left: -5px"
              >数据预览</el-button
            >
                    <el-button type="text" class="button" @click="sure(item.tableName)"
                      >确认</el-button
                    >
                  
                  </div>
                </div>
              </el-card>
    </div>
    <el-pagination
      @current-change="currentPageChange()"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      layout="total, prev, pager, next"
      :total="dataTotal"
      :hide-on-single-page="true"
      style="margin-left: 40%; margin-top: 20px"
    >
    </el-pagination>
    <el-table
      :data="patientTable"
      v-if="dataTableVision"
      style="width: 100%; margin-top: 20px"
      max-height="450px"
      border
      stripe
      v-loading="getData_loading"
      element-loading-text="正在获取数据"
      element-loading-spinner="el-icon-loading"
    >
      <el-table-column type="index"> </el-table-column>
      <el-table-column
        v-for="(key, index) in Object.keys(patientTable[0])"
        :key="index"
        :label="key"
        :prop="key"
      >
      </el-table-column>
    </el-table>
    <div class="buttonGroup">
      <el-button @click="backStep()" round>上一步</el-button>
    </div>
  </div>
</template>

<script>
// TODO:大数据预览卡顿， 需要做虚拟列表，动态渲染
import { getRequest } from "@/api/user.js";
import vuex_mixin from "@/components/mixins/vuex_mixin";

export default {
  name: "DataSelect",
  mixins: [vuex_mixin],
  props: {
    moduleName: {
      type: String,
      default: "disFactor",
    
    },
  },
  computed: {},

  data() {
    return {
      // 
      chosenData: "",
      pageSize: 4,
      currentPage: 1,
      dataTotal: 0,
      getData_loading: false,
      dataTableVision: false,
      patientTable: [],
      list: [],
      showList: [],
    };
  },
mounted(){
  //console.log("12",this.m_disease)
  // const selectedValue = this.$route.query.selectedValue;
  // this.tablen=selectedValue
  // console.log("111",selectedValue)
},
  created() {
  //   const selectedValue = this.$route.query.selectedValue;
  // this.tablen=selectedValue
  // console.log("111",this.tablen)
    this.init();
    console.log(this.list);
    console.log(this.showList);
  },

  methods: {
    getData(tablename) {//数据预览
          console.log(tablename)
      this.getData_loading = true;
      getRequest('admin/mining/DataTable/getInfoByTableName/'+tablename
       // tableName: tablename,
    ).then((res) => {
      console.log(res);
        this.patientTable = res.data;
        this.getData_loading = false;
        this.dataTableVision = true;
      })},

    init() {

      
      for (const item of this.m_dataList) {
        if (item.disease === this.m_disease) {
          this.list.push(item);
        }
      }
      if(this.list.length<1){
        this.$message({
          message:'该病种没有数据，请上传',
          type:'warning'
        })
        return false;
      }
      this.dataTotal = this.list.length;
      //设置要显示的数据列表
      if (this.dataTotal > 4) {
        for (let i = 0; i < 4; i++) {
          this.showList.push(this.list[i]);
        }
      } else {
        for (let i = 0; i < this.list.length; i++) {
          this.showList.push(this.list[i]);
        }
      }
      
    },
    getDataset(){//得到数据表
            getRequest('admin/mining/getDataByDisease/'+this.tablen).then(
                (response) => {
                    console.log(response)
                    const tempList = response.data;
                  if (tempList.length == 0){
                    this.dataOptions = []
                  }else {
                    this.dataOptions = []
                    for (let i = 0; i < tempList.length; i++) {
                    const obj = {
                        tableName: tempList[i].tableName,
                    };
                    const obi = {
                        tableType: tempList[i].tableType
                    }
                    this.dataOptions.push(obj);
                    this.tableTypes.push(obi)
                }
                  }
              })
        },
    getData(tablename) {
      this.getData_loading = true;
      getRequest("/DataTable/getInfoByTableName", {
        tableName: tablename,
      }).then((res) => {
        this.patientTable = res.data;
        this.getData_loading = false;
        this.dataTableVision = true;
      });
    },

 

    currentPageChange() {
      let start = (this.currentPage - 1) * this.pageSize;
      let end = start + this.pageSize - 1;
      this.showList.length = 0;
      if (this.list.length >= end + 1) {
        for (let i = start; i <= end; i++) {
          this.showList.push(this.list[i]);
        }
      } else {
        for (let j = start; j < this.list.length; j++) {
          this.showList.push(this.list[j]);
        }
      }
    },

    next(name) {
      this.chosenData = name;
      this.m_changeStep(3);
      this.m_changeTaskInfo({ dataset: this.chosenData });
    },

    backStep() {
      this.m_changeStep(this.m_step - 1);
    },
  },
};
</script>

<style scoped>
#dataList {
  width: 80%;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-evenly;
  margin-left: 100px;
}

.bottom {
  margin-top: 13px;
  padding-bottom: 10px;
  line-height: 15px;
}
#dataList .button {
  padding: 0;
  float: right;
}

.buttonGroup {
  width: 200px;
  margin-top: 5vh;
  margin-left: auto;
  margin-right: auto;
}
</style>
