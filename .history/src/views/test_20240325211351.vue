
<template>
    <div>
      <div style="border-bottom: #868585 solid 1px; padding-bottom: 10px">
        <el-steps :active="active">
          <el-step title="任务信息" icon="el-icon-edit"></el-step>
          <el-step title="选择数据" icon="el-icon-upload"></el-step>
          <el-step title="特征选择" icon="el-icon-picture"></el-step>
          <el-step title="算法选择" icon="el-icon-picture"></el-step>
          <el-step title="运算结果" icon="el-icon-picture"></el-step>
        </el-steps>
      </div>
      <div>
        <!-- 特征选择 -->
        <div>
          <div style="text-align: center;margin-top: 10px;background: #c5c5c5;border-radius: 50px">
            <span style="font-weight: bold">特征下方为该特征在数据集中该特征的缺失率</span>
          </div>
          <div style="margin-top: 10px;margin-left: 20px ">
            <div>
              <span class="lineStyle">▍</span>
              <span class="featureTitle">选择作为标签的特征(因变量)：</span>
              <span style="">(请先选择因变量，才可进行自变量的选择)</span>
            </div>
            <div class="left-align" style="margin-top: 20px;display: flex; flex-wrap: wrap;">
              <el-radio-group v-model="target" >
                <el-radio v-for="feature in fea" :key="feature" :label="feature" style="display: inline-block;" >
                  <span style="width: 260px; height: 20px; display: inline-block; line-height: 20px;">{{ feature }}</span>
                  <el-progress :percentage="featuresMissingRate[feature]"
                               :format="format"
                               :color="getProgressStatus(featuresMissingRate[feature])"
                               style="width: 100%;"></el-progress>
                </el-radio>
              </el-radio-group>
            </div>
  
            <div style="margin-top: 30px">
           <span class="lineStyle">▍</span
           ><span class="featureTitle">参与训练的特征(自变量):</span>
              <el-checkbox style="margin-left: 50px" v-model="selectAll" @change="handleSelectAll" :disabled="target === ''"/> 全选
            </div>
  
            <div class="left-align" style="margin-top: 20px;display: flex; flex-wrap: wrap;">
              <el-checkbox-group v-model="trainFea">
                <el-checkbox  v-for="feature in availableFeatures" :key="feature"  :label="feature" :disabled="target === ''" style="display: inline-block;">
                  <span style="width: 260px; height: 20px; display: inline-block; line-height: 20px;">{{ feature }}</span>
                  <el-progress   :percentage="featuresMissingRate[feature]"
                                 :format="format"
                                 :color="getProgressStatus(featuresMissingRate[feature])"
                               style="width: 100%;"></el-progress>
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div class="center-align" style="margin-top: 30px">
            <el-button @click="featureToData()">
              上一步
            </el-button>
            <el-button @click="toAlChoose()">
              下一步
            </el-button>
          </div>
        </div>
      </div>
  
    </div>
  </template>
  
  <script>
  
  
  
  import {getRequest} from "@/utils/api";
  import {percent} from "@antv/g2plot/lib/utils/transform/percent";
  
  export default {
    name: "featureChoose",
    computed: {
      
      availableFeatures() {
        return this.fea.filter((feature) => feature !== this.target);
      },
  
  
      
  
    },
    data() {
      return {
        active:3,
        featuresMissingRate: {},
        target: "",
        trainFea: [],
        selectAll: false, // 全选状态
        fea:['aa','bb','cc']
      }
    },
  
    watch: {
      trainFea(newValue) {
          // 如果一键全选框被取消选中，且 selectedFeatures 的长度大于 0，则将其置为 false
        this.selectAll = newValue.length === this.fea.length - 1;
      }
    },
  
    created() {
      this.getMissingRates()
    },
    methods: {
      percent,
      toAlChoose() {
        const dataToUpdate = {
          target: this.target,
          trainFea: this.trainFea,
        };
  
        // Dispatch the action to update the data in the store
        if(this.target === '' && this.trainFea.length === 0){
          this.$message.error('请选择目标特征和训练特征');
        }
        else if(this.trainFea.length === 0){
          this.$message.error('请选择训练特征');
        }
        else if(this.target === ''){
          this.$message.error('请选择目标特征');
        }else {
          this.$store.dispatch('updateFeatureChooseData', dataToUpdate);
          this.$router.replace('/alChoose')
        }
  
      },
      featureToData() {
        this.$router.replace('/dataChoose')
      },
  
      // 全选按钮点击事件
      handleSelectAll() {
        if (this.selectAll) {
          this.trainFea = this.fea.filter((feature) => feature !== this.target);
        } else {
          // 如果一键全选按钮未选中，则清空已选择数组
          this.trainFea = [];
        }
      },
  
      getMissingRates(){//得到缺失率
       let tableName = "field_management"
       let schemaName="software8"
        getRequest(`/admin/feature/getMissingRates/${tableName}/${schemaName}`).then(res =>{
          this.featuresMissingRate = res
          console.log(res)
        })
      },
  
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
  
      test(){
        console.log(this.featuresMissingRate['PCT'])
      },
    },
  }
  </script>
  
  
  <style scoped>
  
  /*页面布局*/
  .container {
    display: flex;
    height: calc(100vh - 190px);
  }
  
  .left {
    flex: 20%;
    border-right: #868585 1px solid;
  }
  
  .right {
    flex: 80%;
  }
  .lineStyle {
    color: rgb(100, 172, 231);
    font-weight: 100;
    font-size: 30px;
  }
  
  .featureTitle {
    font-weight: 1000;
    font-size: 30px;
  }
  
  .center-align {
    text-align: center;
    margin-bottom: 10px;
  }
  
  .left-align {
    text-align: left;
  }
  
  .custom-large-radio {
    font-size: 20px; /* 调整字体大小 */
    margin-right: 20px; /* 可选，调整单选框之间的间距 */
    margin-bottom: 10px;
  
  }
  
  .custom-large-radio input {
    /* 修改单选框的大小 */
    width: 20px;
    height: 15px;
  }
  
  .custom-large-checkbox {
    font-size: 20px; /* 调整字体大小 */
    margin-right: 20px; /* 可选，调整单选框之间的间距 */
    margin-bottom: 10px;
  }
  
  .custom-large-checkbox input {
    width: 20px;
    height: 15px;
    margin-right: 10px; /* 调整多选框和文字之间的间距 */
  }
  
  
  
  </style>