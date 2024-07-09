<template>
  <div class="Box">
    <div style="text-align: center;margin-top: 10px;background: #ffd9e6;border-radius: 50px">
          <span style="font-weight: bold">特征下的进度条为该特征的填充率</span>
        </div>
    <!-- ------------------------------------选择目标特征 ------------------------------->
    <h3><strong>选择下列指标参与运算</strong></h3>
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
          <el-row :gutter="8">
    <h5 class="text" style="font-size: 20px;margin-bottom: 10px; font-weight: bold; ">
      <span class="lineStyle">▍</span>临床表征指标
    </h5>
    <el-col v-for="item in demoOptions" :key="item.columnName" :span="8">
      <div v-if="item.columnisR" class="checkbox-container">
        <el-tooltip effect="light" :content="item.columnDesc" placement="top">
          <el-checkbox class="radio"  :label="item.columnName"  border>
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
          <!-- 社会环境指标 -->
          <el-row :gutter="8">
          <h5 class="text" style="font-size: 20px; font-weight: bold;"> <span class="lineStyle">▍</span>社会环境指标</h5>

         

          <el-col v-for="item in sociolOptions" :key="item.columnName" :span="8">
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
          <el-row :gutter="20">
            <h5 class="text" style="font-size: 20px; font-weight: bold;"> <span class="lineStyle">▍</span>生活行为习惯指标</h5>
            <el-col v-for="item in physioOptions" :key="item.columnName" :span="8">
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
          <h5 class="text" style="font-size: 20px;margin-left: 15px; font-weight: bold;"> <span class="lineStyle">▍</span>已选特征</h5></el-row>

          <div class="select_feature_check_boxs">
  <el-checkbox-group v-model="selectedFeatures">
    <div v-for="item in selectedFeatures" :key="item" style="display: inline-block;">
  
        <el-checkbox :label="item">
          {{ findItemLabel(item) }}
          <el-progress
            :percentage="featuresMissingRate[item]"
            :color="getProgressStatus(featuresMissingRate[item])"
          
          ></el-progress>
        </el-checkbox>
      
    </div>
  </el-checkbox-group>
</div>
    <div class="center" style="font-size: 16px; margin-left: 500px;">
      <el-button  @click="backStep">上一步</el-button>
      <el-button type="primary" @click="next">下一步</el-button>
    </div>
  </div>
</template>

<script>
import { getRequest } from "@/api/user.js";
import vuex_mixin from "@/components/mixins/vuex_mixin";
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
  data() {
    return {
      selectedFeatures: [], // 新增：存储已选特征
      selectdata:[],
      featuresMissingRate: {},
        target: "",
        trainFea: [],
      
      fea:[],
      checkAll:'',
      allFeatures: [],
      isCheckboxSelected: false,
      demoOptions: [],//临床
      physioOptions: [],
      disease:'',
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
   
    this.columnSelectForm.isShow = true;
 

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
    findItemLabel(columnName) {//用来挑选保存已选特征的
    let foundItem = this.demoOptions.find(option => option.columnName === columnName) ||
                   this.sociolOptions.find(option => option.columnName === columnName) ||
                   this.physioOptions.find(option => option.columnName === columnName);
    return foundItem ? foundItem.columnName : '';
  },
    getProgressStatus(missingRate) {
      
        if (missingRate < 30) {
          return '#e5edfe';
        } else if (missingRate < 70) {
          return '#ffead1';
        } else {
          return '#ccff00';
        }
  
      },
  
      format(percentage) {
        
        return  `${percentage}%`;
      },
      getMissingRates(){//得到缺失率       这个现在都是这个
       let tableName = this.$store.state.disFactor.m_dataset
       let schemaName="software8"
        getRequest(`/admin/feature/getMissingRates/${tableName}/${schemaName}`).then(res =>{
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

    isAtLeastOneCheckboxSelected() {
        const selectedData = this.columnSelectForm.formData.selectedData;
        return selectedData && selectedData.length > 0;
      },
      checkSelection() {
    const selectedData = this.columnSelectForm.formData.selectedData;
    console.log('selectedData',selectedData)
    if (selectedData && selectedData.length > 0) {
      this.isCheckboxSelected = true;
    } else {
      this.isCheckboxSelected = false;
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
     
      getRequest(`admin/mining/getFeatures/${this.table1}/${this.disease}`).then(
                    (response) => {
                    console.log("所有的特征返回",response.data)
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
              console.log('社会',this.sociolOptions)
              
              },
                next() {
     
            var clinical = ""
            var living = ""
            var social = ""

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
            let all=social.length+living.length+clinical.length
            if(all<6){
              alert('所选特征总数请大于5');
              return
            }
      console.log( social)

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
  width: calc(30% - 10px); /* 根据实际情况调整每个选项的宽度，留出适当的间隔 */
}
</style>
