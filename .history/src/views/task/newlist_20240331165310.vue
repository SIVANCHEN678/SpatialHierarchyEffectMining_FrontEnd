<template>
  <div class="main"> 
    <div class="left_tree">
       
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
   
      <!--===============================     导入数据表单   ===================================================================-->
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

 <!--===============================     导入卡片组   ===================================================================-->
      <div class="cardGroup">
        <el-row>
      <el-col :span="6" v-for="(item, index) in list"  :key="index" >
        <el-card class="box-card" >
        
          <div>
            <p><strong>任务名称:  </strong>{{ item.name }}</p>
            <p><strong>负责人:  </strong>{{item.leader}}</p>
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
  
</template>

<script>
import { getRequest, postRequest } from "@/api/user";
import { getFetures } from "@/api/feature.js";
import { getCategory, addDisease, removeCate } from "@/api/category";
import { getTableDes, getTableData, getFielterData} from "@/api/tableDescribe.js";
import { mapGetters, mapMutations, mapState, mapActions } from "vuex";
import { disOptions } from "@/components/tab/constData.js";
import { resetForm, debounce, tabSwitch } from "@/components/mixins/mixin";
// import { treeData } from "@/components/tab/treeData.js";
import { tableData, tableData2 } from "@/components/tab/TableData.js";
import { addTableData } from "@/components/tab/addTableData.js";
import axios from 'axios';
import vuex_mixin from "@/components/mixins/vuex_mixin";
let id = 1000;

export default {
  mixins: [resetForm, debounce,vuex_mixin],
  computed: {
    ...mapGetters(["dataDisList", "dataCreatorList","taskLeaderList"]),
    ...mapState(["dataList"]),
    loginUserID(){
      return sessionStorage.getItem("userid")
    }
  },
  props: {//添加调
    moduleName: {
      type: String,
      default: "disFactor",
    },
  },
  
  watch: {
    "dialogForm.tableName"() {
      this.checkTableName();
    },
  },

  data() {
    return {
      list: [], //每页数据集合
       total: 0, //总记录数
       current: 1, //当前页
      limit: 12, //每页显示记录数
      searchObj: {}, //条件封装对象
      // 获取虚拟树形结构数据
      // treeData: JSON.parse(JSON.stringify(treeData)),
      treeData: [],
      // 获取虚拟表格数据
      // tableData: JSON.parse(JSON.stringify(tableData)),
      tableData: [],
      fullData: '',
      showTooltip: false,
      hoverTimer: null,
      dialogDiseaseVisible: false,
      dialogDataVisible: false,
      characterVisible: false,
      showAddTableData: false,
      characterId:1,
      showDataForm: {
          createUser:'',
          createTime:'',
          classPath:''
      },
      addDataForm:{
          dataName:"",
          createUser: "",
          createTime: "",
          path: "",
          characterList:[
              {
                  opt:'',
                  characterId:-1,
                  featureName: '',
                  chName: '',
                  type: '',
                  unit:'',
                  range:'',
                  button:'点击选择特征',
                  value:'',
                  computeOpt:''
              }
          ]
      },
      characterOptList:[
      ],
      addTableData: addTableData,
      input3: '',
      select: '',

      dialogDiseaseVisible2: false,

      nodeData: {},

      diseaseName:'',

      loading: false,
      loading2: false,
      getData_loading: false,
      loadText: "拼命加载中",
      loadText2: "拼命加载中",
      disease: "",
      creator: "",
      disOptions,
      
      featuresVision: false,
      DatadialogVisible:false,
      featuresMap: {},
      patientTable:[],
      dialogForm: {
        filesInfo: [],
        tableName: "",
        tablename:'',

        isOnly: true,
        dataDisease: "",
        featuresNum: 1,
        fields: [{ name: "", type: "" }],
        rules: {
          tableName: [
            {
              required: true,
              message: "数据表名称不能为空",
              trigger: "change",
            },
          ],
          dataDisease: [
            {
              required: true,
              message: "涉及疾病不能为空",
              trigger: "blur",
            },
          ],
          numFeatures: [
            { required: true, message: "特征个数不能为空", trigger: "blur" },
            { type: "integer", message: "特征个数需为整数", trigger: "blur" },
            { min: 1, message: "特征个数需>1", trigger: "blur" },
          ],
        },
      },
      dialogFormVisible: false,
      options: {
        method: "post",
        data: {},
        url: "/DataTable/upload",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    };
  },

  created() {
    this.getList(); // 获取数据
    console.log
    // 检查重名的防抖函数
    this.checkTableName = this.debounce(() => {
      getRequest("/admin/api/DataTable/inspection", {
        newname: this.dialogForm.tableName,
      }).then((res) => {
        console.log(res);
        // 上一次重复了这一次不重复就要提醒一下
        if (!this.dialogForm.isOnly && res.data) {
          this.$message({
            showClose: true,
            message: "表名可用",
            type: "success",
          });
        }
        if (typeof res.data === "boolean") {
          this.dialogForm.isOnly = res;
        }
        if (!res.data) {
          this.$message({
            showClose: true,
            message: "数据表重名，请重新填写",
            type: "warning",
          });
          return false;
        }
        return true;
      });
    }, 200);
    this.getCatgory();
  
    
  },

  methods: {
    clearFilter() {
      this.disease = "";
      this.leader = "";
    },
    run(row) {

let _this = this
_this.$router.push({ path: '/she/result' ,query: { form: row}})


},    // 删除数据
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

    
    
  
    getCatgory(){
      getCategory("/admin/api/category").then((response)=>{
       this.treeData = response.data;
      })
    },

    getTableDescribe(id){
      getTableDes("/admin/api/tableDescribe",id).then(response=>{
        console.log('获取数据',response)
        this.showDataForm.createUser = response.data.createUser;
        this.showDataForm.createTime = response.data.createTime;
        this.showDataForm.classPath = response.data.classPath;
        this.tableData = [];
      })
      .catch(error=>{
        console.log("错误",error)
      });
    },
    getTableData(tableId,tableName){//后端tabaledata
      getTableData("/admin/api/getTableData",tableId,tableName).then(response=>{   // 获取表数据
      this.tableData = response.data;
        console.log("数据长度"+response.data.length)
      })
      .catch(error=>{
        console.log(error);
      })
    },
    changeData(data){
      console.log('dataxinxi',data.label)
      this.current = 1;
      this.searchObj.diseaseName=data.label
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
 




  



    ...mapMutations(["SetDataList"]),
    ...mapActions(["getDataList"]),
    getData(tablename) {
      this.DatadialogVisible = true;
      this.getData_loading = true;
      getRequest("/admin/DataTable/getInfoByTableName", {
        tableName: tablename,
      }).then((res) => {
        this.patientTable = res.data;
        console.log("patientTable:"+res.data);
        this.getData_loading = false;
      });
    },
    changeLabel(name, label) {
      console.log("name: ")
      console.log(name)

      console.log("label:")
      console.log(label)

      this.featuresMap[name] = label;
    },

  },
   
}
</script>

<style scoped>
#top_buttons > * {
  display: inline-block;
}
.truncate-text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

#DiseaseFilter {
  margin-right: 40px;
}
#creatorFilter {
  margin-right: 20px;
}
#top_right_buttons {
  float: right;
  margin-right: 100px;
}
#table {
  margin-top: 10px;
}

.featureLabel {
  height: 55vh;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  overflow: auto;
}

.featureLabel .el-form-item__label {
  color: #252525;
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

.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

.right_table {
  display: inline-block;
  height: 300px;
  width: 75%;
  position: absolute;
  margin-left: 100px;
}
#top_buttons > * {
  display: inline-block;
}
#top_buttons {
  margin-left: 20%;
  margin-top:-700px;
  margin-bottom: 20px;
}
#task_leader {
  margin-right: 20px;
}
.right_table_topCard {
  padding: 0;
  height: 700px;
  width: 95%;
  border-radius: 3px;
  border-bottom: 1px solid #e6e6e6;
  position: relative;
  top: 2%;
  left: 1%;
}
.cardGroup {
  width: 100%;
  margin-left: 23%;
  display: grid;
  grid-template-columns: repeat(auto-fill, 400px);
  grid-row-gap: 60px;
  grid-column-gap: 160px;
}
.box-card {
  width: 300px; /* 替换为您希望的宽度 */
  max-width: 100%; /* 可选，确保卡片在较小屏幕上不会超出父容器 */
  margin: 20px;
}
.cardGroup {
  width: 85%;
  margin-left: 16%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* 自适应宽度，最小宽度300px */
  grid-row-gap: 160px;
  grid-column-gap: 200px;
}
.describe_content {
  display: inline-block;
  width: 70%;
  
}

.describe_content span {
  margin: 10px;
}

.add_button {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
}

.nameInput {
  width: 70%;
}

.addDataClass {
  border-radius: 10px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  padding: 10px;
  font-size: 16px;
}
.addDataClass .el-input {
  width: 160px;
}
.addDataClass .addDataBaseInfo {
  margin-left: 50px;
}
.addDataClass .addDataTitle{
  margin-top: 10px;
  margin-right: 15px;
  padding-bottom: 10px;
  font-size: 18px;
  border-bottom: 1px solid #ebeef5;
}
.el-select .el-input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.cool-button {
    display: inline-block;
    padding: 12px 24px;
    font-size: 15px;
    font-weight: bold;
    color: #fff;
    background: linear-gradient(to right, #26acdf, #3ee09a);
    border: none;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    width: 200px;
    letter-spacing: 1px;
    cursor: pointer
}
.center{
  margin-top: 80px;
}

.cool-button::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.1);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
    z-index: -1;
}

.cool-button:hover {
    background: linear-gradient(to right, #51bae2, #80e7bb);
}

.cool-button:hover::before {
    transform: scaleX(1);
}
.custom-table tr {
    background-color: #dcf3fc !important;
    height: 300px;
}
.right_table .el-table {
  height: 600px; /* 或者您想要的高度值 */
  overflow-y: auto; /* 如果内容超出高度，启用滚动条 */
}
.buttom {
  display: inline-block;
  width: 20%;
  position: relative;
  right: -20%;
  bottom: 10px;
}
</style>


