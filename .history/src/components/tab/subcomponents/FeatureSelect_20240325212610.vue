<template>
  <div class="Box">
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
          <el-checkbox class="radio" v-model="checkedDemoOptions" :label="item.columnName" border>
            {{ item.columnName }}
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
                  </el-checkbox>
                </el-tooltip>
              </div>
            </el-col>
            <el-radio-group v-model="target" >
                <el-radio v-for="feature in fea" :key="feature" :label="feature" style="display: inline-block;" >
                  
                  <el-progress :percentage="featuresMissingRate[item]"
                               :format="format"
                               :color="getProgressStatus(featuresMissingRate[item])"
                               style="width: 100%;"></el-progress>
                </el-radio>
                </el-radio-group>
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
      featuresMissingRate: {},
        target: "",
        trainFea: [],
      
        fea:[],
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
    this.getMissingRates()

  },
  mounted(){
    this.init();
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
    
    getProgressStatus(missingRate) {
        if (missingRate < 30) {
          return '#25bef5';
        } else if (missingRate < 70) {
          return '#e6a23c';
        } else {
          return '#ff0000';
        }
  
      },
  
      format(percentage) {
        return percentage === 100 ? '满' : `${percentage}%`;
      },
    getMissingRates(){//得到缺失率
       let tableName = "field_management"
       let schemaName="software8"
        getRequest(`/admin/feature/getMissingRates/${tableName}/${schemaName}`).then(res =>{
          this.featuresMissingRate = res
          console.log(res)
        })
      },
    handleCheckedCitiesChange(value) {
        const minSelection = 5; // 设置最小选项数为五个
        let checkedCount = value.length;
 
        
        this.checkAll = checkedCount === this.causalOptions.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount <= this.causalOptions.length;
      },

    isAtLeastOneCheckboxSelected() {
        const selectedData = this.columnSelectForm.formData.selectedData;
        return selectedData && selectedData.length > 0;
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

    init() {
      this.table1='lungcancer'
      this.disease='肺癌'
      getRequest(`admin/mining/getFeatures/${this.table1}/${this.disease}/`).then(
                    (response) => {
                    console.log("特征返回",response.data)
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
                )},
                next() {
     
     
      this.m_changeTaskInfo({ dataset: this.chosenData });
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


.checkbox-container{
  margin: 10px;
}
.buttonGroup {
  margin-top: 20px;
  margin-left: 500px;
}
</style>
