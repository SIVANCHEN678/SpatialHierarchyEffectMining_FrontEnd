<template>
  <div class="Box">
    <!-- ------------------------------------选择目标特征 ------------------------------->
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
      <el-button @click="backStep">上一步</el-button>
      <el-button @click="next">下一步</el-button>
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
      allFeatures: [],
      peopleFeatures: [],
      physiologicalFeatures: [],
      socialFeatures: [],
      checkAll_1: false,
      checkAll_2: false,
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
    this.init();
    this.columnSelectForm.isShow = true;
  },

  methods: {

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
      getRequest("/tTableManager/tablemanager", {
        tableName: this.m_dataset,     //传的整个刚才选择的数据集在步骤2中
      }).then((res) => {
        res.forEach((item) => {
          if (item) {
            if (item.is_demography == 1) {
              this.allFeatures.push(item.field_name);
              this.peopleFeatures.push(item.field_name);
            } else if (item.is_physiological == 1) {
              this.allFeatures.push(item.field_name);
              this.physiologicalFeatures.push(item.field_name);
            } else if (item.is_sociology == 1) {
              this.allFeatures.push(item.field_name);
              this.socialFeatures.push(item.field_name);
            } else if (item.is_label == 1) {
              console.log(this.moduleName);
              //上面判断是否是标签列
              if (this.moduleName === "disFactor") {
                this.targetFeature.push(item.field_name);
              }
            }
          }
        });
        // 同步vuex里的数据
        this.computeFeatures = this.m_use_features;
        this.knownFeatures = this.m_known_features;
        this.changeBox_1();
        this.changeBox_2();
        if (this.moduleName !== "disFactor") {
          this.targetFeature = this.m_target_feature;
          this.changeBox_target();
        }
      });
    },

    changeBox_1() {
      if (this.computeFeatures.length === this.allFeatures.length) {
        this.checkAll_1 = true;
      } else {
        this.checkAll_1 = false;
      }
    },

    changeBox_2() {
      if (this.knownFeatures.length === this.allFeatures.length) {
        this.checkAll_2 = true;
      } else {
        this.checkAll_2 = false;
      }
    },

    changeBox_target() {
      if (this.targetFeature.length === this.allFeatures.length) {
        this.checkAll_target = true;
      } else {
        this.checkAll_target = false;
      }
    },

    getDeficiency() {
      let rate = (Math.random() * 100).toFixed(3);
      return `缺失率：${rate}%`;
    },

    next() {
      // if (this.targetFeature.length < 1) {
      //   alert("该数据没有标签特征，请重新选择或上传数据表");
      //   return;
      // }
      // if (this.computeFeatures.length < 5) {
      //   this.$message({
      //     type: "warning",
      //     message: "请选择至少5个特征参与运算",
      //   });
      //   return;
      // }
      this.m_changeTaskInfo({
        use_features: this.computeFeatures,
        known_features: this.knownFeatures,
        target_feature: this.targetFeature,
      });
      this.m_changeStep(this.m_step + 1);
    },

    backStep() {
      this.m_changeStep(this.m_step - 1);
    },
  },
};
</script>

<style scoped>
.Box {
  margin-left: 25vh;
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
.featureTitle {
  font-size: 30px;
  margin-right: 30px;
  margin-bottom: 20px;
}

.featureSubTitle {
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 18px;
}

.el-checkbox-group {
  padding-top: 10px;
  display: grid;
  grid-template-columns: repeat(7, 150px);
  grid-gap: 20px;
  grid-template-rows: 20px, 20px;
}

.el-checkbox--small {
  padding-bottom: 10px;
}

.el-checkbox-group .el-checkbox {
  width: 120px;
}

.el-checkbox span {
  display: block;
  width: 100px;
}

/* 使用popover以后省略号就没用了 */
.el-checkbox-group >>> .el-checkbox__label {
  margin-top: 5px;
  line-height: 10px;
  width: 80px;
  overflow: hidden;
  white-space: nowrap; /* 防止文本换行 */
  text-overflow: ellipsis; /* 显示省略号 */
}

.lineStyle {
  color: rgb(100, 172, 231);
  font-weight: 100;
  font-size: 25px;
}

.buttonGroup {
  margin-top: 20px;
}
</style>
