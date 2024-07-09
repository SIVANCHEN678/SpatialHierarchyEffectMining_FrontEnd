<template>
  <div class="app-container"  >
    
      <el-steps
              :active="active"
              finish-status="success"
              style="margin-top: 35px "
              align-center
      >
          <el-step
                  title="任务信息"
                  icon="el-icon-guide"
          >
        </el-step>
        <el-step
                  title="数据选择"
                  icon="el-icon-edit"
          >
        </el-step>
          <el-step
                  title="特征选择"
                  icon="el-icon-edit"
          >
        </el-step>
        <el-step
                  title="算法选择"
                  icon="el-icon-edit"
          >
        </el-step>
        <el-step
                  title="运算结果"
                  icon="el-icon-view"
          >
        </el-step>
          <!-- <el-step title="数据与算法选择"></el-step> -->
      </el-steps>
      <el-divider></el-divider>

      <!--======================================    o 选择数据表单      ======================================================-->
      <div v-if="active == 0">
          <div id="mainform" style="margin-top: 30px;">
            <div class="center">
              
            </div> 
            <div class="down">
              <el-form
                ref="taskInfoForm"
                :model="taskInfoForm"
                label-width="100px"
                class="form"
                label-position="top"
              >

              <el-form-item prop="taskName" class="inputBox shortItem">
                <template slot="label">
                  <span class="lineStyle">▍</span>
                  <span>任务名称</span>
                </template>
                <el-input v-model="taskInfoForm.taskName"></el-input>
                </el-form-item>   

                <el-form-item prop="principal" class="inputBox shortItem">
                <template slot="label">
                  <span class="lineStyle">▍</span>
                  <span>任务负责人</span>
                </template>
                <el-input v-model="taskInfoForm.principal" :disabled="true"></el-input>
              </el-form-item>

                <el-form-item prop="participants" class="inputBox shortItem">
                <template slot="label">
                  <span class="lineStyle">▍</span>
                  <span>参与人员</span>
                </template>
                <el-input v-model="taskInfoForm.participants"></el-input>
              </el-form-item>

              <el-form-item prop="tips">
                  <template slot="label">
                    <span class="lineStyle">▍</span>
                    <span>备注</span>
                  </template>
                  <el-input type="textarea" :autosize="{ minRows: 10, maxRows: 20 }" placeholder="请输入内容"
                    v-model="taskInfoForm.label"></el-input>
                </el-form-item>

                           

              </el-form>
            </div>
          </div>
   
          <div id="center">
            <el-button @click="resetForm('taskInfoForm')" round>重置</el-button>

              <el-button type="primary" @click="next() ">下一步</el-button>
           
        </div>
      </div>
    <!--======================================     1选择数据      ======================================================-->
    
    <div v-if="active==1">
          <div class="left_tree" v-if="active == 1">
            
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
              <span class="custom-tree-node" slot-scope="{ node, }">
                <span>{{ node.label }}</span>
                <span>
                  
                  
        
                </span>
              </span>
            </el-tree>
          </div>
         

        <div class="right_table">
        <el-card class="right_table_topCard">
          <div class="describe_content">
            <h3>数据集名称</h3>
            <p style="margin-top:0.5%">
              <i class="el-icon-user"></i>创建人: <span>{{showDataForm.createUser}}</span>
              <i class="el-icon-time"></i>创建时间: <span>{{showDataForm.createTime}}</span>
              <i class="el-icon-folder-opened"></i>所属类别: <span>{{showDataForm.classPath}}</span>
            </p>
            
          </div>
          <div class="buttom" >
            <el-button type=success>确认</el-button>
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
      <div id="center">
            <!-- <el-button @click="resetForm('taskInfoForm')" round>重置</el-button> -->
              <el-button type="primary" @click="next() ">下一步</el-button>
           
        </div>


      </div>


      <!--======================================     2选择特征     ======================================================-->
      <div v-if="active == 2">
    <div class="mainform">
      <el-form
        class="form"
        :model="columnSelectForm.formData"
        :rules="columnSelectForm.rules"
        v-show="columnSelectForm.isShow"
        ref="columnSelectForm"
        label-position="top"
      >
        <el-form-item
          label="选择属性列："
          prop="selectedData"
          font-weight: bold
          style="margin-bottom: 1px;font-size: 5px; "
        >
       <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            class="custom-checkbox"
            size="medium" 
            font-weight: bold
            @change="handleCheckAllChange"
          >
           <h4> 全选</h4>
          </el-checkbox>
        </el-form-item>

        <el-checkbox-group
          style="margin-left: 20px;"
          v-model="columnSelectForm.formData.selectedData"
          @change="handleCheckedCitiesChange"
          :indeterminate="isIndeterminate"
          size="medium"
          prop="selectedData"
        >
          <!-- 临床表征指标 -->
          <el-row :gutter="20">
    <h5 class="text" style="font-size: 20px; font-weight: bold;">
      <span class="lineStyle">▍</span>临床表征指标
    </h5>
    <el-col v-for="item in demoOptions" :key="item.columnName" :span="8">
      <div v-if="item.columnisR" class="checkbox-container">
        <el-tooltip effect="light" :content="item.columnDesc" placement="top">
          <el-checkbox class="radio" v-model="checkedDemoOptions" :label="item.columnName" border>
            {{ item.columnName }}
          </el-checkbox>
        </el-tooltip>
      </div>
    </el-col>
   
  </el-row>

          <el-divider></el-divider>
          <!-- 社会环境指标 -->
          <el-row :gutter="20">
            <h5 class="text" style="font-size: 20px; font-weight: bold;"> <span class="lineStyle">▍</span>社会环境指标</h5>
            <el-col v-for="item in sociolOptions" :key="item.columnName" :span="8">
              <div v-if="item.columnisX" class="checkbox-container">
                <el-tooltip effect="light" :content="item.columnDesc" placement="top">
                  <el-checkbox class="radio" :label="item.columnName" border>
                    {{ item.columnName }}
                  </el-checkbox>
                </el-tooltip>
              </div>
            </el-col>
          </el-row>
          <el-divider></el-divider>
          <!-- 生活行为习惯指标 -->
          <el-row :gutter="20">
            <h5 class="text" style="font-size: 20px; font-weight: bold;"> <span class="lineStyle">▍</span>生活行为习惯指标</h5>
            <el-col v-for="item in physioOptions" :key="item.columnName" :span="8">
              <div v-if="item.columnisS" class="checkbox-container">
                <el-tooltip effect="light" :content="item.columnDesc" placement="top">
                  <el-checkbox class="radio" :label="item.columnName" border>
                    {{ item.columnName }}
                  </el-checkbox>
                </el-tooltip>
              </div>
            </el-col>
          </el-row>
        </el-checkbox-group>
        <div v-if="!isCheckboxSelected" style="color: red;"></div>
        <br />
      </el-form>
    </div>
    <div class="center" style="font-size: 16px;">
      <el-button @click="prev">上一步</el-button>
      <el-button @click="next">下一步</el-button>
    </div>
  </div>








  

  
      <!--======================================     选择算法      ======================================================-->
      <div v-if="active == 3">
       
          <!-- <el-container id="maintest"> -->

            <div id="main">
              <el-tabs  style="height: 100% ;width: 50%;margin-left: 50px;"  class="demo-tabs" tab-position="left" >
                <el-tab-pane label="User" style="background-color: aquamarine;">User</el-tab-pane>
                <el-tab-pane label="Config">Config</el-tab-pane>
                <el-tab-pane label="Role">Role</el-tab-pane>
                <el-tab-pane label="Task">Task</el-tab-pane>
              </el-tabs>
          <div id="mainform">
            

              <el-form
                      ref="form"
                      :model="form"
                      :validate-on-rule-change="false"
                      label-width="120px"
                      style="margin-top: -100px"
              >   
                  <!-- <el-form-item label="任务名称" >
                    <span class="lineStyle">▍</span>
                      <el-input v-model="form.name"></el-input>
                  </el-form-item> -->
                  <!-- <el-form-item label="疾病名称" required>
                      <el-input v-model="form.diseaseName"></el-input>
                  </el-form-item> -->   
                  <el-form-item label="任务类型" >
                    <span class="lineStyle">▍</span>
                      <el-select v-model="form.type" placeholder="请选择任务类型">
                          <el-option
                                  label="空间层次效应挖掘"
                                  value="she_mining"
                          ></el-option>
                    
                          <el-option
                                  label="临床表征-疾病危险因素因果关系挖掘"
                                  value="clinical_features_mining"
                          ></el-option>
                      </el-select>
                  </el-form-item>
                 
                  <el-form-item label="任务描述">
                    <span class="lineStyle">▍</span>
                      <el-input v-model="form.description"></el-input>
                  </el-form-item>
                  
                  <el-form-item label="算法选择" >
                    <span class="lineStyle">▍</span>
                      <el-select v-model="form.algorithmId" placeholder="请选择算法">
                          <el-option label="fges" value="fges"></el-option>
                          <el-option label="fci" value="fci"></el-option>
                          <el-option label="gfci" value="gfci"></el-option>
                          <el-option label="rfci" value="rfci"></el-option>
                      </el-select>
                  </el-form-item>

              </el-form>
          </div>
          
          <div id="center">
                <el-button type="primary" @click="prev">上一步</el-button>
                <el-button type="primary" @click="submitForm">提交</el-button>
          </div>
      </div></div>
  </div>
</template>


<script>
import { ref } from 'vue'
const tabPosition = ref('left')

  import { getRequest, postRequest } from "@/utils/api";
import { validAlphabets } from '@/utils/validate';
  export default {

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
            selectedPosition: '', // 初始化选中的位置为空
            positions: [], // 存储从数据库获取的选项数据
            tabs: [], // 存储从数据库获取的选项卡数据
            demoOptions: [],
 
            demoOptions: [],
      
      checkedDemoOptions: [],
            

            patientTable: [],
            cityslens:0,
            dataTableVision: false,
            chooseDisease:'',
            chosenData: "",
            checkAll: false,
            isIndeterminate: false,
            isCheckboxSelected: false,
            selectedcitys:[],//保存所选的城市
            taskInfoForm: {//存取表单
              taskName: "",
              principal: "",
              participants: "",
              disease: "",
              label:""

            },
            checkAllDemoOptions: false, // 全选状态临床
            citys: ['重庆', '四川', '贵州'], // 假设这是你的病城市列表
            selectedDiseases: [] ,// 用于存储用户选择的病种

            dialogDiseaseVisible2: false,
            options: [{
                value: '肺癌',
                label: '肺癌'
                }, {
                value: '糖尿病',
                label: '糖尿病'
                }, {
                value: '高血压',
                label: '高血压'
                }, {
                value: '前列腺癌',
                label: '前列腺癌'
                }, {
                value: '结直肠癌',
                label: '结直肠癌'
                }, {
                value: '脑卒中',
                label: '脑卒中'
                }, {
                value: '心脏病',
                label: '心脏病'
                }, {
                value: '胃癌',
                label: '胃癌'
                }, {
                value: '乳腺癌',
                label: '乳腺癌'
                }], 


               // demoOptions: [],
                physioOptions: [],
                sociolOptions: [],


                table1:'',
             //   demoOptions: [],
                physioOptions: [],
                sociolOptions: [],
                tableData:[],
              active: 0,//步骤条初始化
              showStep: true,
              formArray: ["dataSelectForm", "priorSelectForm", "algoForm"],
              form: {
                  id: null,
                  name: null,
                  type: null,
                  algorithmId: null,
                  diseaseName: null,
                  tableName: null,
                  description: null,
                  dataType: null,
                  scoreId: null,
                  maxDegree: null,
                  faithfulnessAssumed: null,
                  symmetricFirstStep: null,
                  clinicalRepresentation: null,
                  livingHabit: null,
                  socialConnection: null
              },
                //数据选择-----------------------------------------------------------------------------------------------
                dataSelectForm: {
                    isShow: true,
                    formData: {
                        selectedData: "",
                    },
                    rules: {
                        selectedData: [
                        { required: true, message: "请选择数据表", trigger: "blur" },
                        ],
                    },
                },
                //选择循证医学知识-----------------------------------------------------------------------------------------------
                priorSelectForm: {
                    isShow: false,
                    formData: {
                        selectedData: "",
                    },
                    rules: {
                        selectedData: [
                        { required: true, message: "", trigger: "blur" },
                        ],
                    },
                },

                columnSelectForm: {
                    isShow: false,
                    formData: {
                    selectedData: [],
                    },
                    rules: {
                    selectedData: [
                        { required: true, message: "请选择属性列", trigger: "blur" },
                    ],
                    },
                },

              dataOptions: [],
              tableTypes: []

          }
      },
        created(){
          this.inim();
        },

      computed: {
     
      isAtLeastOneCheckboxSelected() {
        const selectedData = this.columnSelectForm.formData.selectedData;
        return selectedData && selectedData.length > 0;
      }
    },
      methods: {

        //查询是否有城市则做出判断
         handleNext() {
    // 从服务器获取返回的值  
   // const response = await this.getDataFromServer();//设置后端请求
    const valueFromServer = 1; // 假设返回的值是一个对象，其中包含名为 value 的属性

    // 根据返回的值决定是否弹出对话框
    if (valueFromServer === 1) {//先设置有城市
      this.dialogDiseaseVisible2 = true; // 弹出对话框
    } else {
      this.next(); // 执行下一步操作
    }
  },



          //重置
          resetForm(formName) {
      // 不加if判断会报错找不到resetFields，因为form用的v-if，不显示时找不到DOM结构
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
      }
    },
    inim(){
  
      this.taskInfoForm.principal = (JSON.parse(localStorage.getItem("user"))).name;

      
    },

        checkSelection() {
    const selectedData = this.columnSelectForm.formData.selectedData;
    if (selectedData && selectedData.length > 0) {
      this.isCheckboxSelected = true;
    } else {
      this.isCheckboxSelected = false;
    }
  },
    handleCheckAllChange(val) {
      if (val) {
        this.columnSelectForm.formData.selectedData = [
          ...this.demoOptions.map(item => item.columnName),
          ...this.sociolOptions.map(item => item.columnName),
          ...this.physioOptions.map(item => item.columnName)
        ];
      } else {
        this.columnSelectForm.formData.selectedData = [];
      }
      this.checkAll = checked;
      this.checkedRelationships = val ? this.causalOptions : [];
      this.isIndeterminate = true;

      console.log('选择的',this.columnSelectForm.formData.selectedData)
    },

      handleCheckedCitiesChange(value) {
        const minSelection = 5; // 设置最小选项数为五个
        let checkedCount = value.length;
 
        
        this.checkAll = checkedCount === this.causalOptions.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount <= this.causalOptions.length;
      },
    //确认表单第一环节
        sure(name){
          this.dataSelectForm.formData.selectedData = name
          this.table1=name
          
        },
        getData(tablename) {
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

        getDataset(){//从病种获取数据集 第一环节
            getRequest('admin/mining/getDataByDisease/'+this.taskInfoForm.disease).then(
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
        getCatgory(){ //获取树
      getCategory("/api/category").then((response)=>{
       this.treeData = response.data;
      })
    },
    addDisease() {
      const newNode = { id: id++, label: this.diseaseName, children: [] , isLeafs: false};
      this.treeData.push(newNode);
      this.cleanInput()
    },
        next(){
         
      //    this.active++;
      console.log(this.demoOptions)
   
          console.log(this.active)
          if(this.active === 0){
           this. dialogDiseaseVisible2=false;
            if (!this.taskInfoForm.taskName) {
            this.$message('请填写任务名称');
                  return;
            }
         
            if (!this.taskInfoForm.participants) {
            this.$message('请填写参与人');
                  return;
            }
           
         
              
          }
       
                  
            this.active++;
            if (this.active == 2) {
            //第二环节展示各特征  第一个是病种  第二个是哪个数据集
                this.columnSelectForm.isShow = true;
                getRequest(`admin/mining/getFeatures/${this.table1}/${this.taskInfoForm.disease}/`).then(
                    (response) => {
                    console.log("特征返回",response)
                    let data = response.data;
                    console.log(data)
                    let columnNametemp = Object.keys(data);
                    this.nodes = columnNametemp

                    console.log(this.nodes)

                    if (Object.keys(data).length ==0){
                      this.demoOptions = []
                      this.physioOptions = []
                      this.sociolOptions = []

                    }else{
                      for (let i = 0; i < columnNametemp.length; i++) {
                        if (data[columnNametemp[i]] != null) {
                        const obj = {
                            columnName: data[columnNametemp[i]].featureName,
                            columnDesc: data[columnNametemp[i]].featureNameCn,
                        };
                        if (data[columnNametemp[i]].she == "0") {
                            obj.columnisR = true;
                            this.demoOptions.push(obj);
                        } 
                        else if(data[columnNametemp[i]].she == "1") {
                            obj.columnisS = true;
                            this.physioOptions.push(obj);
                        } 
                        else if(data[columnNametemp[i]].she == "2") {
                            obj.columnisX = true;
                            this.sociolOptions.push(obj);
                        }

                    }
                    }
                    }
                }
                )

            }
            if(this.active == 2){
              // 发送异步请求获取选项数据和选项卡数据
              this.fetchPositions();
               
            }
            else{
              if(!this.demoOptions&&! this.physioOptions&&!this.sociolOptions){
                    this.$message('请选择特征');
                            return;
                  }
            }

            


        },
        async fetchPositions() {
      


          try {
    const response = await getRequest('admin/algorithm/getAll', {})
    console.log('算法', response)
    // 假设后端返回的数据结构为 { tabPositions: [], tabs: [] }
    if (response && response.algorithmDescription && response.algorithmName) {
      tabPositions.value = response.algorithmDescription
      tabs.value = response.algorithmName
      tabPosition.value = tabPositions.value[0].value // 默认选中第一个位置
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
},
   
   


          prev() {
            if(this.active == 1){
              this.demoOptions = [],
              this.physioOptions = [],
              this.sociolOptions = []
            }
            if (this.active > 0) this.active--;
          },

          stepBack(stepIndex) {
              if (this.active - 1 >= 0) {
                  if (this.active == 1) {
                      this.dataInOptions = [];
                  }
                  let formName = this.formArray[stepIndex];
                  this[formName].isShow = false;
                  this.active--;
                  let preFormName = this.formArray[--stepIndex];
                  this[preFormName].isShow = true;
              }
          },

          getAllData() {
            postRequest('admin/index/getData', {}).then(
              (response) => {
                const tempList = response;
                for (let i = 0; i < tempList.length; i++) {
                  const obj = {
                      tableName: tempList[i].tableName,
                  };
                  this.dataOptions.push(obj);
              }
              })
          },

          getAllPriorData() {
            postRequest('admin/index/getPriorData', {}).then(
              (response) => {
                const tempList = response;
                for (let i = 0; i < tempList.length; i++) {
                  const obj = {
                      tableName: tempList[i].tableName,
                  };
                  this.priorOptions.push(obj);
              }
            })
          },

          //提交整个任务
          submitForm() {

           // 获取所有表单项的值
    const { name,type, description, algorithmId } = this.form;
    // 检查是否所有的表单项都有值
    if (name  && description && algorithmId) {
      // 执行提交表单的操作
      console.log("提交表单");
    } else {
      // 显示错误提示
      this.$message.error("请填写所有必填项");
    // return;
    }

            this.form.diseaseName = this.chooseDisease
            this.form.tableName = this.dataSelectForm.formData.selectedData;

            var clinical = ""
            var living = ""
            var social = ""

            const column = this.columnSelectForm.formData.selectedData
            console.log(this.demoOptions)
            for(var i in column){
              for(var j in this.demoOptions){
                if(column[i] == this.demoOptions[j].columnName){
                  clinical = clinical + column[i] + ","
                }
              }
            }

            for(var i in column){
              for(var j in this.physioOptions){
                if(column[i] == this.physioOptions[j].columnName){
                  living = living + column[i] + ","
                }
              }
            }

            for(var i in column){
              for(var j in this.sociolOptions){
                if(column[i] == this.sociolOptions[j].columnName){
                  social = social + column[i] + ","
                }
              }
            }

            this.form.clinicalRepresentation = clinical
            this.form.livingHabit = living
            this.form.socialConnection = social

            console.log("数据类型",this.tableTypes)
            for(var i in this.dataOptions){
              if(this.dataOptions[i].tableName == this.form.tableName){
                console.log("6666666")
                console.log("数据类型",this.tableTypes[i].tableType)
                if(this.tableTypes[i].tableType == "离散数据"){
                  this.form.dataType = "discrete"
                }else{
                  this.form.dataType = "continuous"
                }
              }
            }

            console.log("数据类型",this.form.dataType)


              //把任务存进数据库，跳转到任务管理页面  结果显示
            postRequest("admin/mining/insert", this.form).then(
                response =>{
                    console.log(response)
                    if (response.code == "200") {
                        this.$message.success("任务创建成功")
                        // if (_this.form.type == "she_mining") {
                        this.$router.push({ path: '/she/result' ,query: { form: this.form} })
                        // ,demoOptions: this.demoOptions, physioOptions: this.physioOptions, sociolOptions: this.sociolOptions
                        console.log(this.form)
                        // }
                        // else if (_this.form.type == "factor_mining") {
                        // _this.$router.push({ path: '/factor/result', query: { form: _this.form } })
                        // }
                        // else if (_this.form.type == "disease_factor_mining") {
                        // _this.$router.push({ path: '/diseaseFactor/result', query: { form: _this.form } })
                        // }
                    } else {
                        this.$message.error("任务创建失败,请重新填写任务设置信息")
                        // this.formLoading = false
                    }
                }
            )

          
              }}

    //   mounted() {
    //       this.getAllData();
    //   },

  }
</script>

<style scoped>
#mian{
  width: 100%;
}
#mainform {

    display: flex;
    justify-content: center;
    align-items: center;
}
#center {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 50px;
}
#top_buttons > * {
display: inline-block;
}
#load_state {
  margin-right: 40px;
}
#data_source {
  margin-right: 20px;
}
#top_right_buttons {
  float: right;
  margin-right: 100px;
  color: rgb(114, 175, 245);
}
#table {
  margin-top: 10px;
}
::v-deep .el-dialog__header {
  background-color: rgb(114, 175, 245);

}
::v-deep .el-dialog__title{
  font-size: 17px;
  color: white;
  font-weight: 400;
}
.feature{
  display: inline-block; 
    width: 200px;
}
.el-button{
  size:small;
}

#maintest {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#step {
  width: 80%;
  position: absolute;
  top: 250px;
}
#stepcontain {
  position: absolute;

  top: 340px;
  left: 37%;
}

.button1 {
  position: absolute;
  margin-top: 20px;
  left: 10%;
}
.text {
  font-size: 14px;
}

/* #mainBox{
  overflow: auto;
} */
.form {
  width: 80vh;
  margin: auto;
}
.form .inputBox {
  width: 25%;
}
.form .shortItem {
  display: inline-block;
  margin-right: 12vh;
}
.form .inputBox:last-child {
  width: 50%;
}

.lineStyle {
  color: rgb(100, 172, 231);
}

#disGroup {
  width: 90%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}
.disGroup-item {
  width: 180px;
  margin-bottom: 10px;
}

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

.checkbox-container {
  margin-right: 10px; /* 设置右侧间距 */
  margin-bottom: 10px; /* 设置下方间距 */
}


/* .lineStyle {
  color: rgb(100, 172, 231);
  font-weight: 100;
  font-size: 25px;
} */
.checkbox-wrapper {
  margin-top: 30px;
  padding-top: 2%;
  display: flex;
  align-items: center;
  margin-left: 100px;
}
/* .checkbox-wrapper {
  margin-bottom: 50px; /* 设置复选框全选的底部间距 */
.text {
  margin-top: 20px;
  margin-bottom:20px; /* 设置每个指标标题的底部间距 */
}
.center {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.col-container {
padding-top: 20px;
}
.custom-checkbox .el-checkbox__label {
  font-size: 50px;
  font-weight: bold;
  
}
#modelList {
  height: 60vh;
  width: 100%;
  margin-bottom: 5vh;
}

.titleBox {
  margin: 10px auto 10px auto;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
}

.introBox {
  background-color: #e8f3ff;
  height: 5vh;
  width: 100%;
  overflow: auto;
}

.introBox p {
  margin-left: 15px;
}
.introBox p:first-child {
  font-size: 18px;
  font-weight: 600;
}
.introBox p:nth-child(2) {
  margin-left: 2em;
}

.paramBox .el-form {
  margin-top: 2vh;
  margin-left: 60vh;
}
.paramBox .el-form .el-input {
  width: 25vh;
  margin-top: -50px;
}

.paramTitle {
  font-size: 20px;
  font-weight: 600;
}

.valueRange {
  color: gray;
  margin-left: 10px;
}

.el-icon-warning-outline {
  margin-left: 10px;
  font-size: 20px;
}
.el-icon-warning-outline:hover {
  color: #368ce7;
}

.buttonBox {
  width: 35vh;
  margin-top: 70px;
  margin-right: auto;
  margin-left: auto;
}
.demo-tabs .el-tabs__nav {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 控制标签在竖向排列时的对齐方式，可以根据需要调整 */
}

.demo-tabs .el-tabs__item {
  width: 100%; /* 控制标签的宽度，这里设置为充满父容器 */
  margin-bottom: 8px; /* 控制标签之间的间距，可以根据需要调整 */
}

</style>