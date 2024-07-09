<template>
  <div id="mainBox">
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
        <el-input v-model="form.name"></el-input>
      </el-form-item>

      <el-form-item prop="principal" class="inputBox shortItem">
        <template slot="label">
          <span class="lineStyle">▍</span>
          <span>任务负责人</span>
        </template>
        <el-input v-model="user.name" :disabled="true"></el-input>
      </el-form-item>

      <!-- <el-form-item prop="principal" class="inputBox shortItem">
                <template slot="label">
                  <span class="lineStyle">▍</span>
                  <span>任务负责人</span>
                </template>
                <el-input v-model="taskInfoForm.principal" :disabled="true"></el-input>
        </el-form-item> -->
      <!-- <el-form-item prop="participants" class="inputBox shortItem">
        <template slot="label">
          <span class="lineStyle">▍</span>
          <span>参与人员</span>
        </template>
        <el-input v-model="taskInfoForm.participants"></el-input>
      </el-form-item> -->
      <el-form-item prop="participants" class="inputBox shortItem">
        <template slot="label">
          <span class="lineStyle">▍</span>
          <span>任务类型</span>
        </template>
        <el-select v-model="form.type" placeholder="请选择任务类型">
                          <el-option
                                  label="空间层次效应挖掘"
                                  value="she_mining"
                          ></el-option>
                          <el-option
                                  label="临床表征因果关系挖掘"
                                  value="clinical_features_mining"
                          ></el-option>
                      </el-select>
      </el-form-item>
      <el-form-item prop="disease">
        <template slot="label">
          <span class="lineStyle">▍</span>
          <span>研究病种</span>
        </template>
        <el-radio-group
          id="disGroup"
          v-model="form.diseaseName"
          ref="disGroup"
        >
          <el-radio
            v-for="item in disOptions"
            :key="item.value"
            :label="item.label"
            class="disGroup-item"
            border
            >{{ item.value }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm('form')" round>重置</el-button>
        <el-button type="primary" @click="next()" round>下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { disOptions } from "@/views/job/constData.js";
import { resetForm } from "@/components/mixins/mixin.js";
import vuex_mixin from "@/components/mixins/vuex_mixin";

export default {
  name: "TaskInfo",
  mixins: [resetForm, vuex_mixin],
  props: {
    moduleName: {
      type: String,
      default: "disFactor",
    },
  },
  watch: {},
  computed: {},
  data() {
    return {
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},

      disOptions: [{
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
                }],
      taskInfoForm: {
        taskName: "",
        principal: "",
        participants: "",
        disease: "",
      },

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
    };
  },

  // TODO:初始化两遍，还可把数据放到localStorage里解决这个问题
  created() {
    console.log(sessionStorage.getItem("user"))
    this.init();
    this.$watch("m_dataDisList", () => {
      this.init();
      this.$message({
        message: "数据更新成功",
        type: "success",
      });
    });
  },

  methods: {
    // ...mapMutations("disFactor",["ChangeStep","ChangeTaskInfo"]),
    init() {
      console.log(sessionStorage.getItem("username"))
      //和vuex内数据同步
      console.log("当前模块名👉", this.moduleName);
      console.log("👉",sessionStorage.getItem("username"));
      this.taskInfoForm.taskName = this.m_taskName;
    //  this.taskInfoForm.principal = (JSON.parse(localStorage.getItem("user"))).name;
      this.taskInfoForm.principal = sessionStorage.getItem("username");
      this.taskInfoForm.participants = this.m_participants;
      this.taskInfoForm.disease = this.m_disease;
      if (this.m_disease.length < 1 && this.moduleName != "factorDis") {

        for (const item of this.m_dataDisList) {
          let index = this.disOptions.findIndex(({ name }) => name === item);
          if (index != -1) {
            this.disOptions[index].disable = false;
          }
        }
        // 只有第三个挖掘功能的时候才允许选择多疾病
        this.disOptions[0].disable = true;
        // 设置默认疾病
        for (const item of this.disOptions) {
          if (!item.disable) {
            this.taskInfoForm.disease = item.name;
            break;
          }
        }
        return;
      }

      // 第三个挖掘功能可选疾病设置
      if (this.moduleName == "factorDis") {
        for (const item of this.disOptions) {
          item.disable = true;
        }
        // 数据列表中有多疾病数据就显示
        if (this.m_dataDisList.findIndex(item=>item== "多疾病") != -1) {
          this.disOptions[0].disable = false;
          this.taskInfoForm.disease = this.disOptions[0].name;
        }else{
          this.$message({
            type:'warning',
            message:'暂无多疾病数据集'
          })
        }
      }
    },

    next() {
      if (
        this.form.name.length < 1 ||
        this.form.type.length < 1 ||
        this.form.diseaseName.length < 1
      ) {
        this.$message("请填写任务名称和负责人");
        return;
      }
      this.m_changeTaskInfo(this.taskInfoForm);
      this.m_changeStep(2);
    },
  },
};
</script>

<style scoped>
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
</style>
