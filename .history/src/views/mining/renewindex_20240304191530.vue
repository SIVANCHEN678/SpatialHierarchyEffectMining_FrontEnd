<template>
  <div class="app-container">
      <el-header>
          <h3>空间层次效应挖掘任务设置</h3>
          <el-divider></el-divider>
      </el-header>
      <el-steps
              :active="active"
              finish-status="success"
              style="margin-top: 50px"
              align-center
      >
          <el-step
                  title="病种及数据选择"
                  description="选择病种及所需的数据表"
          ></el-step>
          <el-step
                  title="空间层次特征选择"
                  description="选择临床表征、社会环境、生活行为习惯三个空间层次的指标"
          ></el-step>
          <el-step
                  title="基本信息"
                  description="填写任务的名称、任务类型、任务描述并选择要执行的算法"
          ></el-step>
          <!-- <el-step title="数据与算法选择"></el-step> -->
      </el-steps>

      <!--======================================     选择数据表单      ======================================================-->
      <div v-if="active == 0">
          <div id="mainform">
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



              <el-form-item prop="disease">
                 <template slot="label">
                  <span class="lineStyle">▍</span>
                  <span>研究病种</span>
                </template>
                <el-radio-group
                  id="disGroup"
                  v-model="taskInfoForm.disease"
                  ref="disGroup"
                  @change="getDataset"
                >
                  <el-radio
                    v-for="item in options"
                    class="disGroup-item"
                    :key="item.value"
                    :label="item.label"
                    border
                    >{{ item.value }}</el-radio
                  >
                  
              </el-radio-group>
            </el-form-item>

                  

              </el-form>
            </div>
          </div>
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
          <div id="center">
            <el-button @click="resetForm('taskInfoForm')" round>重置</el-button>
              <el-button type="primary" @click="next">下一步</el-button>
          </div>
     
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
        </div>

      <!--======================================     选择空间层次      ======================================================-->
      <div v-if="active == 1">

        <div id="mainform">
            <el-form
          class="form"
          :model="columnSelectForm.formData"
          :rules="columnSelectForm.rules"
          v-show="columnSelectForm.isShow"
          ref="columnSelectForm"
          label-position="top"
        >

    
          <el-form-item label="选择属性列：" prop="selectedData">
          
            <div style="margin: 15px 0;"></div>
            <div class="checkbox-wrapper" style="margin-top: -560px ">
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            </div>
            <el-checkbox-group
            style="margin-left: -50px;"
              v-model="columnSelectForm.formData.selectedData"
              @change="handleCheckedCitiesChange"
              :indeterminate="isIndeterminate"
              size="medium"
              prop="selectedData"
            >
            
              <el-row :gutter="10">
                <h5 class="text">临床表征指标</h5>

                <el-col
                  v-for="item in demoOptions"
                  :key="item.columnName"
                  :span="6"
                >
                  <div v-if="item.columnisR">
                    <el-tooltip
                      effect="light"
                      :content="item.columnDesc"
                      placement="top"
                      style="margin-top: 20px"
                    >
                      <el-checkbox
                        class="radio"
                        :label="item.columnName"
                        border
                        style="margin-top: 20px"
                        >{{ item.columnName }}
                      </el-checkbox
                      >
                    </el-tooltip>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <h5 class="text">社会环境指标</h5>

                <el-col
                  v-for="item in sociolOptions"
                  :key="item.columnName"
                  :span="6"
                >
                  <div v-if="item.columnisX">
                    <el-tooltip
                      effect="light"
                      :content="item.columnDesc"
                      placement="top"
                      style="margin-top: 20px"
                    >
                      <el-checkbox
                        class="radio"
                        :label="item.columnName"
                        border
                        style="margin-top: 20px"
                        >{{ item.columnName }}</el-checkbox
                      >
                    </el-tooltip>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <h5 class="text">生活行为习惯指标</h5>

                <el-col
                  v-for="item in physioOptions"
                  :key="item.columnName"
                  :span="6"
                >
                  <div v-if="item.columnisS">
                    <el-tooltip
                      effect="light"
                      :content="item.columnDesc"
                      placement="top"
                      style="margin-top: 20px"
                    >
                      <el-checkbox
                        class="radio"
                        :label="item.columnName"
                        border
                        style="margin-top: 20px"
                        >{{ item.columnName }}</el-checkbox
                      >
                    </el-tooltip>
                  </div>
                </el-col>
              </el-row>
            </el-checkbox-group>
          </el-form-item>



          <div v-if="!isCheckboxSelected" style="color: red;">请至少选择5个特征</div>

          <br />    
        </el-form>
        </div>
        <div id="center">
              <el-button type="primary" @click="prev">上一步</el-button>
              <el-button type="primary" @click="next">下一步</el-button>
          </div>
      </div>

      <!--======================================     选择算法      ======================================================-->
      <div v-if="active == 2">
          <!-- <el-container id="maintest"> -->
          <div id="mainform">
              <el-form
                      ref="form"
                      :model="form"
                      :validate-on-rule-change="false"
                      label-width="120px"
                      style="margin-top: 100px"
              >
                  <el-form-item label="任务名称" >
                      <el-input v-model="form.name"></el-input>
                  </el-form-item>
                  <!-- <el-form-item label="疾病名称" required>
                      <el-input v-model="form.diseaseName"></el-input>
                  </el-form-item> -->
                  <el-form-item label="任务类型" >
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
                      <el-input v-model="form.description"></el-input>
                  </el-form-item>
                  <el-form-item label="算法选择" >
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
      </div>
  </div>
</template>


<script>
  import { getRequest, postRequest } from "@/utils/api";
import { validAlphabets } from '@/utils/validate';
  export default {

      data() {
          return { patientTable: [],
            dataTableVision: false,
            chooseDisease:'',
            chosenData: "",
            checkAll: false,
            isIndeterminate: false,
            isCheckboxSelected: false,
            taskInfoForm: {
              taskName: "",
              principal: "",
              participants: "",
              disease: "",
            },
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


                demoOptions: [],
                physioOptions: [],
                sociolOptions: [],


                table1:'',
                demoOptions: [],
                physioOptions: [],
                sociolOptions: [],
              




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
    },

      handleCheckedCitiesChange(value) {
        const minSelection = 5; // 设置最小选项数为五个
        let checkedCount = value.length;
 
        
        this.checkAll = checkedCount === this.causalOptions.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount <= this.causalOptions.length;
      },
    
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

        getDataset(){
            getRequest('admin/mining/getDataByDisease/'+this.chooseDisease).then(
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

        next(){
      //    this.active++;
      console.log(this.demoOptions)
   
          console.log(this.active)
          if(this.active === 0){
            if (!this.taskInfoForm.disease||!this.taskInfoForm.participants||!this.taskInfoForm.principal) {
            this.$message('请选择病种');
                  return;
            }
     
           if (! this.table1) {
            this.$message('请选择确认数据表单');
                return;
               }
              
          }
          if (this.active === 1) {
          if (this.columnSelectForm.formData.selectedData.length < 5) {
            this.$message.warning('请至少选择五个特征');
      return; // 防止继续进行下一步操作
          }
        }
            
            this.active++;
            if (this.active == 1) {

                this.columnSelectForm.isShow = true;
                getRequest(`admin/mining/getFeatures/${this.dataSelectForm.formData.selectedData}/${this.taskInfoForm.disease}/`).then(
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

            else{
              if(!this.demoOptions&&! this.physioOptions&&!this.sociolOptions){
                    this.$message('请选择特征');
                            return;
                  }
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
          submitForm() {

           // 获取所有表单项的值
    const { name, type, description, algorithmId } = this.form;
    // 检查是否所有的表单项都有值
    if (name && type && description && algorithmId) {
      // 执行提交表单的操作
      console.log("提交表单");
    } else {
      // 显示错误提示
      this.$message.error("请填写所有必填项");
      return;
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

#mainform {
    display: flex;
    justify-content: center;
    align-items: center;
}
#center {
    display: flex;
    justify-content: center;
    align-items: center;
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
  width: 70%;
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


.checkbox-wrapper {
  margin-top: -30px;
  padding-top: 2%;
  display: flex;
  align-items: center;
}

</style>