<template>
  <div class="Box">
    <div v-if="shouldDisplay">
    <div style="text-align: center;background: #ffd9e6;border-radius: 50px">
          <span style="font-weight: bold">选择要展示因果关系的地区</span>
        </div>
<ares @provinceSelected="onProvinceSelected" 
  @citySelected="onCitySelected" 
  @districtSelected="onDistrictSelected" /></div>

    <div style="text-align: center;margin-top: 10px;background: #ffd9e6;border-radius: 50px">
          <span style="font-weight: bold">特征下的进度条为该特征的完备率</span>
        </div>
        <el-dialog
      id="importDataTable"
      title="对所有特征进行分层次  请完整填写"
      :visible.sync="dialogFormVisible2"
      :close-on-click-modal="false" 
      append-to-body="true"
     
      :close-on-press-escape="false"
      width="40%"
      class="dialog"
    >
      <el-form
        :model="dialogForm"
        ref="dialogFormRef"
        :rules="dialogForm.rules"
        label-width="110px"
      >
        <el-form-item label="特征个数" prop="featuresNum">
          <el-input-number
            v-model="dialogForm.featuresNum"
            :min="this.featuresNum"
            :step="1"
          ></el-input-number>
        </el-form-item>
        <el-form-item
       
          v-for="(field, index) in dialogForm.fields"
          :key="index"
          :label="'特征' + (index + 1)"
          :prop="'field'"
        
        >
          <el-input
            v-model="field.featureName"
            class="feature"
            :placeholder="'请输入特证' + (index + 1) + '名称'"
          ></el-input>

          <el-input
            v-model="field.featureNameCn"
            class="feature"
            :placeholder="'请输入特证' + (index + 1) + '中文名称'"
          ></el-input>
      
          <el-select v-model="field.she" style="  margin-left:20px;" placeholder="请选择特征类型" class="feature">
            <el-option label="临床表征" value="0"></el-option>
            <el-option label="生活行为习惯" value="1"></el-option>
            <el-option label="社会环境" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogFormVisible = false">取消</el-button> -->
        <el-button @click="resetForm1()">重置</el-button>
        <el-button type="primary" @click="submitTable2">提交</el-button>
      </div>
    </el-dialog>
    <!-- ------------------------------------选择目标特征 ------------------------------->
    <h3><strong>选择下列指标参与运算</strong></h3>
    <el-button  style="margin-left: -10%;" type="primary" @click="handleClickdd()"   size="mini">  特征管理</el-button>
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
         
          prop="selectedData"
          font-weight: bold
          style="margin-bottom: 1px;font-size: 15px; "
        >
       <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            class="custom-checkbox"
            size="medium" 
            font-weight: bold
            @change="handleCheckAllChange"
          >
           <h4> <strong>全选</strong></h4>
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
          <el-row :gutter="4">
    <h5 class="text" style="font-size: 20px;margin-bottom: 10px; font-weight: bold; ">
      <span class="lineStyle">▍</span>临床表征指标
    </h5>
    <el-col v-for="item in demoOptions" :key="item.columnName" :span="4">
      <div v-if="item.columnisR" class="checkbox-container">
        <el-tooltip effect="light" :content="item.columnDesc" placement="top">
          <el-checkbox class="radio"  :label="item.columnName"  border>
            {{ item.columnName }}
            <el-progress :percentage="featuresMissingRate[item.columnName]"
                            :format="format"
                            :color="getProgressStatus(featuresMissingRate[item.columnName])"
                            style="width: 100px;"
                            >
          </el-progress>
          </el-checkbox>
          
        </el-tooltip>
      </div>
    </el-col>
   
  </el-row>

          <el-divider></el-divider>
          <!-- 社会环境指标 -->
          <el-row :gutter="4">
          <h5 class="text" style="font-size: 20px; font-weight: bold;"> <span class="lineStyle">▍</span>社会环境指标</h5>

         

          <el-col v-for="item in sociolOptions" :key="item.columnName" :span="4">
            <div v-if="item.columnisX" class="checkbox-container">
              <el-tooltip effect="light" :content="item.columnDesc" placement="top">
                <el-checkbox class="radio" :label="item.columnName" border>
                  {{ item.columnName }}
                  <el-progress :percentage="featuresMissingRate[item.columnName]"
                            :format="format"
                            :color="getProgressStatus(featuresMissingRate[item.columnName])"
                            style="width: 100px;">
          </el-progress>
                </el-checkbox>
              
              </el-tooltip>
            </div>
          </el-col>
        </el-row>
          <el-divider></el-divider>
          <!-- 生活行为习惯指标 -->
          <el-row :gutter="4">
            <h5 class="text" style="font-size: 20px; font-weight: bold;"> <span class="lineStyle">▍</span>生活行为习惯指标</h5>
            <el-col v-for="item in physioOptions" :key="item.columnName" :span="4">
              <div v-if="item.columnisS" class="checkbox-container">
                <el-tooltip effect="light" :content="item.columnDesc" placement="top">
                  <el-checkbox class="radio" :label="item.columnName" border>
                    {{ item.columnName }}
                    <el-progress :percentage="featuresMissingRate[item.columnName]"
                            :format="format"
                            :color="getProgressStatus(featuresMissingRate[item.columnName])"
                            style="width: 100px;">
                          </el-progress>   </el-checkbox>
          
                </el-tooltip>
              </div>
            </el-col>
          </el-row>
        </el-checkbox-group>
        <div v-if="!isCheckboxSelected" style="color: red;"></div>
        <br />
      </el-form>

    </div>
    <el-divider></el-divider>
         
          <el-row :gutter="20">
          <h5 class="text" style="font-size: 20px;margin-left: 20px; font-weight: bold;"> <span class="lineStyle">▍</span>已选特征</h5></el-row>

          <div class="select_feature_check_boxs">
  <el-checkbox-group v-model="selectedFeatures">
    <div v-for="item in selectedFeatures" :key="item" style="display: inline-block;">
  
        <el-checkbox :label="item">
          {{ findItemLabel(item) }}
          <!-- <el-progress
            :percentage="featuresMissingRate[item]"
            :color="getProgressStatus(featuresMissingRate[item])"
          
          ></el-progress> -->
        </el-checkbox>
      
    </div>
  </el-checkbox-group>
</div>
<div class="center" style="font-size: 10px;">
       <el-button   type="primary"   @click="next()">下一步</el-button>
      <el-button  type="success" @click="backStep()">上一步</el-button>
     
    </div>
  </div>
</template>

<script>
import ares from '@/views/test1.vue'
import { getRequest } from "@/api/user.js";
import vuex_mixin from "@/components/mixins/vuex_mixin";
import {  postRequest } from "@/api/user";
export default {
  name: "FeatureSelect",
  props: {
    moduleName: {
      type: String,
      default: "disFactor",
    },
  },
  mixins: [vuex_mixin],
  computed: {},
  components: {  ares},
  data() {
    return {
      featuresNum: null,
      dialogForm: {
        dataType: "",
        region: "",
        filesInfo: [],
        tableName: "",
        isOnly: true,
        dataDisease: "",
        fields: [],
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
      shouldDisplay: false, // 或者false，根据初始是否需要显示来设定
      selectedFeatures: [], // 新增：存储已选特征
      selectdata:[],
      featuresMissingRate: {},
        target: "",
        trainFea: [],
        province:'',
        city:'',
        district:'',
      fea:[],
      checkAll:'',
      allFeatures: [],
      isCheckboxSelected: false,
      demoOptions: [],//临床
      physioOptions: [],
      disease:'',
      featureForm:{},
      dialogFormVisible2: false,
      sociolOptions: [],
      featuresMissingRate: {},//缺失率
      peopleFeatures: [],
      physiologicalFeatures: [],
      socialFeatures: [],
      checkAll_1: false,
      checkAll_2: false,
      table1:'',
      isIndeterminate: false,
      checkAll_target: false,
      computeFeatures: [],
      knownFeatures: [],
      targetFeature: [],
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
    };
  },

  created() {
    this.all=this.$store.state.disFactor;
    console.log(this.all,'vux')
    this.columnSelectForm.isShow = true;
    if(this.all.m_have==200){
      this.shouldDisplay=true
    }


  },
  mounted(){
    this.init();
    this.getMissingRates()
  },
  computed: {
    availableFeatures() {
        return this.fea.filter((feature) => feature !== this.target);
      },
     isAtLeastOneCheckboxSelected() {
       const selectedData = this.columnSelectForm.formData.selectedData;
       return selectedData && selectedData.length > 0;
     }
   },

  methods: {
    onProvinceSelected(province) {
    // 处理省的选择
    console.log('Selected Province:', province);
    this.province=province
  },
  onCitySelected(city) {
    // 处理市的选择
    console.log('Selected City:', city);
    this.city=city
  },
  onDistrictSelected(district) {
    // 处理区的选择
    console.log('Selected District:', district);
    this.district=district
  },
    findItemLabel(columnName) {//用来挑选保存已选特征的
    let foundItem = this.demoOptions.find(option => option.columnName === columnName) ||
                   this.sociolOptions.find(option => option.columnName === columnName) ||
                   this.physioOptions.find(option => option.columnName === columnName);
    return foundItem ? foundItem.columnName : '';
  },
    getProgressStatus(missingRate) {
      
        if (missingRate < 30) {
          return '#ccff00';
        } else if (missingRate < 70) {
          return '#d3d1ff';
        } else {
          return '#ff7f50';
        }
  
      },
  
      format(percentage) {
        percentage=percentage
        return  `${percentage}%`;
      },
      getMissingRates(){//得到缺失率       这个现在都是这个
       let tableName = this.$store.state.disFactor.m_dataset
      
        getRequest(`/feature/getMissingRates/${tableName}`).then(res =>{
          this.featuresMissingRate = res
          console.log(res)
        })
      },
    handleCheckedCitiesChange(value) {//复选框的改变事件
        const minSelection = 5; // 设置最小选项数为五个
        let checkedCount = value.length;
        this.selectedFeatures = value.slice(); // 将选中的值同步到selectedFeatures
        
        this.checkAll = checkedCount === this.causalOptions.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount <= this.causalOptions.length;
      },

    // isAtLeastOneCheckboxSelected() {
    //     const selectedData = this.columnSelectForm.formData.selectedData;
    //     return selectedData && selectedData.length > 0;
    //   },
      checkSelection() {
    const selectedData = this.columnSelectForm.formData.selectedData;
    console.log('selectedData',selectedData)
    if (selectedData && selectedData.length > 0) {
      this.isCheckboxSelected = true;
    } else {
      this.isCheckboxSelected = false;
    }
  },
  submitTable2() {

console.log("疾病名称",this.all.m_disease)

for(let i=0; i < this.dialogForm.fields.length; i++){
const field = this.dialogForm.fields[i];
if (!field.featureNameCn || !field.featureName || !field.she) {
this.$message.error("请填写完整的字段信息");
return; // 中断循环
}}
const FeaturesLen = this.dialogForm.fields.length
console.log(this.dialogForm.fields)
console.log(FeaturesLen)
for(let i=0; i < FeaturesLen; i++){
  this.featureForm.diseaseName = this.all.m_disease
  this.featureForm.featureNameCn = this.dialogForm.fields[i].featureNameCn
  this.featureForm.featureName = this.dialogForm.fields[i].featureName
  this.featureForm.she = this.dialogForm.fields[i].she
  postRequest("/api/table/addFeatures", this.featureForm).then(
    (response) => {
      if (response.code == 200) {
    
          //this.$message.success("保存成功")
          this.dialogFormVisible2 = false;
          this.init();
        }
        else{
         // this.$message.error("保存失败,该字段已存在")
          this.dialogFormVisible2 = false;
          this.init();
        }
        
    }
  )
}
},
  handleCheckAllChange(val) {//这是全选的
      if (val) {
        this.columnSelectForm.formData.selectedData = [
          ...this.demoOptions.map(item => item.columnName),
          ...this.sociolOptions.map(item => item.columnName),
          ...this.physioOptions.map(item => item.columnName)
        ];
        
      } else {
        this.columnSelectForm.formData.selectedData = [];
      }
      this.selectedFeatures = this.columnSelectForm.formData.selectedData.slice(); // 将选中的值同步到selectedFeatures
      this.checkAll = checked;
      this.checkedRelationships = val ? this.causalOptions : [];
      this.isIndeterminate = true;

      console.log('选择的',this.columnSelectForm.formData.selectedData)
    },

    init() {
    
      this.table1=this.$store.state.disFactor.m_dataset
     this.disease=this.$store.state.disFactor.m_disease//根据表名找到所有的变量名，然后在疾病里面找是否有这个特征

      if((!this.table1 || Object.keys(this.table1).length === 0) ){
        window.alert('请返回上一步选择数据集')
      }
     
      console.log( this.table1)

      console.log( this.disease)
     
      getRequest(`api/mining/getFeatures/${this.table1}/${this.disease}`).then(
                    (response) => {
                    console.log("所有的特征返回",response)
                    let data = response.data;
                    console.log(data)
                    if(Object.keys(data).length === 0){
                      this.handleClickdd();
                    }else{
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
               
              console.log('社会',this.sociolOptions)
                    }
                    )
                            },
              handleClickdd() {
                if(this.shouldDisplay===true){
                    alert('该数据的分层等待管理员处理，请先选择其他的数据挖掘')
                    return;
                }else{
                  this.dialogFormVisible2=true;
      getRequest(`/api/table/getHeader/${this.all.m_dataset}`).then((res) => {
        console.log("返回数据为：");
            console.log(res);
            let featureList = res.data;
            const tempData = res.data
            console.log(featureList)
            this.dialogForm.featuresNum=res.data.length;
            this.featuresNum = res.data.length;
            this.dialogForm.fields = [];
                for(let i = 0; i < res.data.length; i++){
                  const obj = {
                    featureName: tempData[i]
                  }
                  console.log(obj)
                  this.dialogForm.fields.push(obj)
                }
                console.log(123)
            console.log(this.dialogForm.fields)
          
            // 把特征存为map的键
            for (const item of featureList) {
              this.$set(this.featuresMap, item, "diagnosis");
            }
           
      }  
      )
                }
      
      
  },
                next() {
     
            let clinical = ""
            let living = ""
            let social = ""

            const column = this.columnSelectForm.formData.selectedData
            console.log(column)
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

            // this.form.clinicalRepresentation = clinical
            // this.form.livingHabit = living
            // this.form.socialConnection = social
     
            if(this.columnSelectForm.formData.selectedData.length===0){
             // console.log(this.columnSelectForm.formData.selectedData.length,'123')
              alert('请选择要挖掘的特征，若无分层特征展示点击特征管理分层');
              return
            }
      console.log( social)
      this.m_changeTaskInfo({ m_province: this.province});//直接设置
      this.m_changeTaskInfo({ m_city: this.city});//直接设置
      this.m_changeTaskInfo({ m_county: this.district});//直接设置
      this.m_changeTaskInfo({ m_social: social });
      this.m_changeTaskInfo({ m_living: living });
      this.m_changeTaskInfo({ m_clinic: clinical });
      this.m_changeStep(4);
    },

    backStep() {
      this.m_changeStep(this.m_step - 1);
    },
              }
  }
</script>

<style scoped>

.Box {
  margin-left: 15vh;
}
/* 全局样式 */
.el-checkbox.radio {
  /* border-width: 2px !important; 自定义边框宽度 */
  border-radius: 5px !important; /* 自定义边框圆角 */
 
}

/* .radio{
  margin-top: -5px;
} */
.checkbox-container{
  margin: 10px;
}
.buttonGroup {
  margin-top: 20px;
  margin-left: 500px;
}
.select_feature_check_boxs {
  width: 100%; /* 确保容器宽度填满其父容器 */
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between; /* 横向均匀分布 */
}

.select_feature_check_boxs > div {
  width: calc(100% - 10%); /* 根据实际情况调整每个选项的宽度，留出适当的间隔 */
}

/* .center{
  margin-top: 5%;
  margin-left: 50%;
} */
.center{
  /* margin-top: 5%;
  margin-left: 50%; */
  display: flex;
  width: 90%;

  background: rgb(255, 255, 255);
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  position: fixed;
  bottom: 23px;
}
</style>
