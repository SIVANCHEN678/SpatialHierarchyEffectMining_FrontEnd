<template>
  <div>
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
          <span>
           
           
  
          </span>
        </span>
      </el-tree>
       
      </div>
   
      <!--===============================     导入数据表单   ===================================================================-->
    
    <div class="right_table">
        <el-card class="right_table_topCard">
          <div class="describe_content">
            <h3>数据集名称</h3>
            <p style="margin-top:0.5%">
              <i class="el-icon-user"></i>创建人: <span>{{showDataForm.createUser}}</span>
              <i class="el-icon-time"></i>创建时间: <span>{{showDataForm.createTime}}</span>
              <i class="el-icon-folder-opened"></i>所属类别: <span>{{showDataForm.classPath}}</span>
            </p>
            <el-button type="primary" @click="next()">确 定</el-button>
          </div>

          <!-- 显示表数据 -->
          <el-table :data="tableData" stripe style="width: 100%" class="custom-table">
           <el-table-column v-for="(value, key) in tableData[0]" :key="key" :prop="key" :label="key" width="80">
            <template slot-scope="{ row }">
              <div class="truncate-text">{{ row[key] }}</div>
            </template>
          </el-table-column>
          
          </el-table>

          
        </el-card>
      </div>
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
import { m_changeStep } from  "@/components/mixins/vuex_mixin.js";
let id = 1000;

export default {
  mixins: [resetForm, debounce,vuex_mixin],
  computed: {
    ...mapGetters(["dataDisList", "dataCreatorList"]),
    ...mapState(["dataList"]),
    loginUserID(){
      return sessionStorage.getItem("userid")
    }
  },
  
  watch: {
    "dialogForm.tableName"() {
      this.checkTableName();
    },
  },

  data() {
    return {

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
    // 检查重名的防抖函数
    this.checkTableName = this.debounce(() => {
      getRequest("/api/DataTable/inspection", {
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
    this.getTableDescribe("1005")
    this.getTableData("1005","copd");
    
  },

  methods: {
    compelete() {
      // 判断多标签合理性
      let labelCount = 0;
      for (const key in this.featuresMap) {
        if (Object.hasOwnProperty.call(this.featuresMap, key)) {
          if (this.featuresMap[key] == "label") {
            labelCount++;
          }
        }
      }
      if (labelCount < 1) {
        this.$message({
          showClose: true,
          type: "warning",
          message: "请至少设置一个标签特征",
        });
        return false;
      }
      if (this.dialogForm.dataDisease != "多疾病" && labelCount > 1) {
        this.$message({
          showClose: true,
          type: "warning",
          message: "只有多病种数据集能设置多个标签特征",
        });
        return false;
      }

      this.loadText2 = "正在添加字段类型";
      this.loading2 = true;
      let tableHeaders = [];
      for (const key in this.featuresMap) {
        if (Object.hasOwnProperty.call(this.featuresMap, key)) {
          switch (this.featuresMap[key]) {
            case "diagnosis":
              tableHeaders.push({
                fieldName: key,
                isDiagnosis: "1",
              });
              break;
            case "examine":
              tableHeaders.push({
                fieldName: key,
                isExamine: "1",
              });
              break;
            case "pathology":
              tableHeaders.push({
                fieldName: key,
                isPathology: "1",
              });
              break;
            case "vital_signs":
              tableHeaders.push({
                fieldName: key,
                isVitalSigns: "1",
              });
              break;
            case "label":
              tableHeaders.push({
                fieldName: key,
                isLabel: "1",
              });
              break;
            default:
              break;
          }
        }
      }
      // let userId = sessionStorage.getItem("userid")-0;
      // 上传特征分类结果
      postRequest("/api/feature/insertFeature", {
        tableName: this.dialogForm.tableName,
        tableHeaders
        // userId
      }).then((res) => {
        console.log(res);
        this.dialogFormVisible = false;
      });

      // 重新上传数据表，使其保存到数据列表中
      // 此处上传时后台已有数据表，可和后台配合只发送保存通知已提高效率
      // this.options.url = "/DataTable/uploadTable";
      // this.$axios(this.options).then((res) => {

      //   this.loading2 = false;
      //   this.resetForm('dialogFormRef');
      //   if (res?.code == "200") {
      //     this.$message({
      //       showClose: true,
      //       type: "success",
      //       message: "上传成功",
      //     });
      //     this.featuresVision = false;
      //     this.dialogFormVisible = false;
      //     this.getDataList();
      //   } else {
      //     this.$message({
      //       showClose: true,
      //       type: "error",
      //       message: "上传失败",
      //     });
      //   }
      // });
      this.getCategory(); // 更新目录结构
    },
    changeLabel(name, label) {
      console.log("name: ")
      console.log(name)

      console.log("label:")
      console.log(label)

      this.featuresMap[name] = label;
    },
  
    
  
    getCatgory(){
      getCategory("/api/category").then((response)=>{
       this.treeData = response.data;
      })
    },

    getTableDescribe(id){
      getTableDes("/api/tableDescribe",id).then(response=>{
        this.showDataForm.createUser = response.data.createUser;
        this.showDataForm.createTime = response.data.createTime;
        this.showDataForm.classPath = response.data.classPath;
        this.tableData = [];
      })
      .catch(error=>{
        console.log("错误",error)
      });
    },
    getTableData(tableId,tableName){
      getTableData("/api/getTableData",tableId,tableName).then(response=>{   // 获取表数据
      this.tableData = response.data;
        console.log("数据长度"+response.data.length)
      })
      .catch(error=>{
        console.log(error);
      })
    },
    changeData(data){
      if(data.isLeafs==1) {
        //获取描述信息
         this.getTableDescribe(data.id);
        //获取数据信息
        this.getTableData(data.id, data.label);

      }
    },
    append(isLeaf) {
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
        addDisease("/api/addDisease",catagoryNodeJSON).then(response=>{
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
    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
      removeCate("/api/category/remove",data).then(response=>{ // data就是要删除的目录信息
        console.log(response.data);
      }).catch(error=>{
        console.log(error);
      })
    },

    addDisease() {
      const newNode = { id: id++, label: this.diseaseName, children: [] , isLeafs: false};
      this.treeData.push(newNode);
      this.cleanInput()
    },

    handleCheckChange(data, checked) {
      if (checked) {
        this.$refs.tree.setCheckedKeys([data.id])
      }
    },

    markNode(data){
      console.log(data);
      this.nodeData = data;
    },

    cleanInput(){
      this.dialogDiseaseVisible = false;
      this.dialogDiseaseVisible2 = false;
      this.diseaseName = ""
    },
    cleanDataInput(){
      this.dialogDataVisible = false
    },
    addTable(){ // 创建表
      this.diseaseName = this.addDataForm.dataName
      this.dialogDataVisible = false
       let filterConditions = {};
      filterConditions.addDataForm = this.addDataForm;
      filterConditions.nodeData = this.nodeData;
      this.options = {
        method: "post",
        data: filterConditions,
        url: "api/createTable",
        headers: {
          "Content-Type": "application/json",
        },
      };
      this.$axios(this.options).then(res=>{
        console.log("数据:")
        console.log(res.data);
      });
      this.append(1)
    },
    putToAddDataForm(){
        let number = -Math.floor(Math.random() * 100);
        let item = {
            opt:'',
            characterId:-1,
            featureName: '',
            chName: '',
            type: '',
            unit:'',
            range:'',
            removeIndex:number,
            button:'点击选择特征',
            value:'',
            computeOpt:''
        }
        this.addDataForm.characterList.push(item);
    },
    deleteToAddDataForm(item){
        let index = this.addDataForm.characterList.indexOf(item)
        if (index !== -1) {
            this.addDataForm.characterList.splice(index, 1)
        }
    },
    chooseCharacter(item){
        this.exchangeCharacterList(0);
        this.characterVisible = true
        this.characterOptItem = item
    },
    submitCharacterCondition() {
      console.log("this.addDataForm.characterList");
      console.log(this.addDataForm.characterList)
      let filterConditions = {};
      filterConditions.addDataForm = this.addDataForm;
      filterConditions.nodeData = this.nodeData;
      this.options = {
        method: "post",
        data: filterConditions,
        url: "api/filterTableData",
        headers: {
          "Content-Type": "application/json",
        },
      };

      this.$axios(this.options).then(res=>{
        this.addTableData = res.data;
        console.log("数据:")
        console.log(this.addTableData)
      });
        //展示表格
        this.showAddTableData = true
        //发送axios请求
        // getFielterData("/api/filterTableData",this.addDataForm, this.nodeData).then(response=>{
        //   console.log(response.data);
        // }).catch(error=>{
        //   console.log("数据筛选失败！！！！！！！！！！");
        // })
        let s = JSON.stringify(this.addDataForm.characterList, null, 2);
        console.log("this.addDataForm:")
        console.log(this.addDataForm)
        console.log(s)
    },
    getNowDateFormat() {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },
    openAddDataForm(type) {
        this.addDataForm = {
            dataName:"",
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
        }
        this.dialogDataVisible=true
        this.showAddTableData=false
        this.showDataForm.createUse = sessionStorage.getItem('username')
        this.showDataForm.createTime = this.getNowDateFormat()
        this.showDataForm.classPath = type
    },
    exchangeCharacterList(index){
      getFetures("/api/feature/getFeatures",index).then(response=>{
        console.log("特征为：");
        console.log(response.data);
        this.characterOptList = response.data;
        console.log(this.characterList)
      }).catch(error=>{
        console.log(error);
      })
    }
  },
    ...mapMutations(["SetDataList"]),
    ...mapActions(["getDataList"]),
    getData(tablename) {
      this.DatadialogVisible = true;
      this.getData_loading = true;
      getRequest("/DataTable/getInfoByTableName", {
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

    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(row) {
      postRequest(`DataTable/delete/${row.id}`).then((res) => {
        this.SetDataList(res.reverse());
      });
    },
    clearFilter() {
      this.disease = "";
      this.creator = "";
    },
    importData() {
      this.dialogFormVisible = true;
    },

    handleSubmit() {
      console.log("文件上传中...");
    },

    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    beforeUpload(file) {
      //上传前的验证
      const isCSV =
        file.type === "text/csv" || file.type === "application/vnd.ms-excel";
      // const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isCSV) {
        this.$message.error("上传文件仅支持 CSV 格式");
      }
      // if (!isLt2M) {
      //     this.$message.error('上传文件大小不能超过 2MB!');
      // }
      // return isJPG && isLt2M;
      return isCSV;
    },

    removeFileExtension(fileName) {
      // 寻找最后一个点号的位置
      const lastDotIndex = fileName.lastIndexOf(".");

      // 如果找到了点号并且不在文件名的开头或结尾
      if (
        lastDotIndex !== -1 &&
        lastDotIndex < fileName.length - 1 &&
        lastDotIndex > 0
      ) {
        // 返回删除了后缀的文件名部分
        return fileName.substring(0, lastDotIndex);
      } else {
        // 如果没有找到点号或者点号在文件名的开头或结尾，直接返回原文件名
        return fileName;
      }
    },

    changeFile() {
      console.log(this.$refs["uploadRef"].uploadFiles);
      if (this.dialogForm.tableName.length < 1) {
        this.dialogForm.tableName = this.removeFileExtension(
          this.$refs["uploadRef"].uploadFiles[0].name
        );
      }
},
    next() {
    //  this.chosenData = name;
      this.m_changeStep(3);
     // this.m_changeTaskInfo({ dataset: this.chosenData });
    },

    backStep() {
      this.m_changeStep(this.m_step - 1);
    },

   
};
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
  height: 800px;
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
  height: auto;
  width: 75%;
  position: absolute;
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
}
</style>


