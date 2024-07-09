<template>
  <div> 
    <div>
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
    
      <div class="right_table">
     
          <div class="describe_content">
            <h3>数据集信息</h3>
            <p style="margin-top:0.5%">
              <i class="el-icon-user"></i>创建人: <span>{{ showDataForm.createUser }}</span>
              <i class="el-icon-time"></i>创建时间: <span>{{ showDataForm.createTime }}</span>
              <i class="el-icon-folder-opened"></i>所属类别: <span>{{ showDataForm.classPath }}</span>
              <i class="el-icon-folder-opened"></i>数据集名称: <span>{{ showDataForm.tablename }}</span>
            </p>
          </div>
     
          <!-- 显示表数据 -->
          <div style="width: 100%;height: 500px;overflow-y: scroll;">
            <el-table :data="tableData" stripe style=""  class="no-vertical-scrollbar"  :fit="false">
            <el-table-column v-for="(value, key) in tableData[0]" :key="key" :prop="key" :label="key" width="80">
              <template slot-scope="{ row }">
                <div class="truncate-text">{{ row[key] }}</div>
              </template>
            </el-table-column>
          </el-table>
          </div>
       

       
      </div>
      <div class="center" style="font-size: 16px;">
              <el-button @click="backStep()">上一步</el-button>
              <el-button @click="city()">下一步</el-button>
    </div>
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
import vuex_mixin from "@/components/mixins/vuex_mixin";
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
      dise:null,

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
          classPath:'',
          tablename:''
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
    this.getTableDescribe("1005")
    this.getTableData("1005","copd");
    
  },

  methods: {
    // changeData(node){
    //   console.log('node',node)
    //   if(data.isLeafs==1) {
    //     //获取描述信息
    //     this.getTableDescribe(data.id, data.label);
        
    //     //获取数据信息
    //     this.getTableData(data.id, data.label);
    //     console.log('数据标签', data.label)

    //   }
    // },
    city(){

      //存储数据类型
      getRequest("/admin/api/getDataType", {
        tableName: this.showDataForm.tablename,
        
        // userId
      }).then((res) => {
        console.log('res',res,data);
        this.m_changeTaskInfo({ m_dataType: res.data });//直接设置
      });

      const containsDataset = this.showDataForm.classPath.includes("公共数据集");
      console.log(containsDataset); // 如果包含则返回true，否则返回falses
if(containsDataset===true){
  this.chosenData =  this.tablename;
  this.m_changeTaskInfo({ m_dataset: this.chosenData });//直接设置

    this.m_changeTaskInfo({ m_disease: this.dise});//设置病种  获取的
  this.m_changeStep(3);
}else{
  this.chosenData =  this.tablename;
      console.log('chosenData',this.chosenData)//这里是点击而获取到的数据表明
     
      this.m_changeTaskInfo({ m_dataset: this.chosenData });//直接设置

      this.m_changeTaskInfo({ m_disease: this.dise});//设置病种  获取的
     // this.m_changeTaskInfo({ m_dataset: this.chosenData });//直接设置
      // this.m_changeTaskInfo({ m_disease: '高血压'});
      this.$router.push('/test');
}
     
    },
  

    backStep() {
      this.m_changeStep(this.m_step - 1);
    },
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
      postRequest("/admin/api/feature/insertFeature", {
        tableName: this.dialogForm.tableName,
        tableHeaders
        // userId
      }).then((res) => {
        console.log(res);
        this.dialogFormVisible = false;
      });

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
        this.showDataForm.tablename = response.data.tableName;
        this.tableData = [];
        this.dise = response.data.diseaseName;

        console.log("********疾病名称", this.dise)
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
      this.tablename=data.label
      if(data.isLeafs==1) {
        //获取描述信息
         this.getTableDescribe(data.id);
        //获取数据信息
        this.getTableData(data.id, data.label);

      }
      // getRequest('admin/api/getDiseaseName/',data.label).then(
      //               (response) => {
      //                 console.log("疾病返回",response.data)
      //                 this.dise=response.data


      //               }
                                  
      //           )
       
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
        addDisease("/admin/api/addDisease",catagoryNodeJSON).then(response=>{
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
      removeCate("/admin/api/category/remove",data).then(response=>{ // data就是要删除的目录信息
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
        url: "/adminapi/createTable",
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
        url: "/admin/api/filterTableData",
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
      getFetures("/admin/api/feature/getFeatures",index).then(response=>{
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
  margin-top: 18px;
  margin-left: auto;
  margin-right: auto;
}

.content {
  width: 100%;
  height: auto;
}

.left_tree{
  display: inline-block;
  height: 500px;
  width: 18%;
  border-radius: 3px;
  border-left: 1px solid #e6e6e6;
  border-right: 1px solid #e6e6e6;
  border-top: 1px solid #e6e6e6;
}

.right_table {
  display: inline-block;
  width: 70%;
  height: 65%;
  position: absolute;
  overflow: auto;
  margin-top: -2%;
  margin-left: 20px;
  overflow-x: auto;
}

.truncate-text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.right_table_topCard {
  padding: 0;
  height: auto;
  width: 90%;
  border-radius: 3px;
  border-bottom: 1px solid #e6e6e6;
  position: relative;
  top: 2%;
  left: 1%;
}

.describe_content {
  display: inline-block;
  width: 100%;
}

.buttom {
  display: inline-block;
  width: 20%;
  position: relative;
  right: -20%;
  bottom: 10px;
}

.describe_content span {
  margin: 10px;
}
.center{
  margin-top: 30px;
}

</style>


