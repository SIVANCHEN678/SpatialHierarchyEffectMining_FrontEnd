<template>
  <div class="app-container">
    <el-header>
      <h3>任务设置</h3>
      <el-divider></el-divider>
    </el-header>
    <el-steps :active="active" finish-status="success" style="margin-top: 50px">
      <el-step title="病种选择"></el-step>
      <el-step title="特征选择"></el-step>
      <el-step title="基本信息"></el-step>
      <el-step title="数据与算法选择"></el-step>
    </el-steps>
    <div v-if="active == 0">
      <div id="mainform">
        <el-form
          ref="form"
          :model="form"
          label-width="120px"
          style="margin-top: 100px"
        >
          <el-divider></el-divider>
          <el-form-item label="病种选择">
            <el-checkbox
              :indeterminate="isIndeterminateDisease"
              v-model="diseaseCheckAll"
              @change="handleCheckDiseaseAllChange"
              >全选</el-checkbox
            >
            <div style="margin: 15px 0"></div>
            <el-checkbox-group
              v-model="disease"
              @change="handleCheckedDiseasesChange"
            >
              <el-checkbox v-for="d in diseases" :label="d" :key="d">{{
                d
              }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-divider></el-divider>
        </el-form>
      </div>
      <div id="center">
        <el-button type="primary" @click="prev">上一步</el-button>
        <el-button type="primary" @click="next">下一步</el-button>
      </div>
    </div>
    <div v-if="active == 1">
      <div id="mainform">
        <el-form
          ref="form"
          :model="form"
          label-width="120px"
          style="margin-top: 100px"
        >
          <el-divider></el-divider>
          <el-form-item label="特征选择">
            <el-checkbox
              :indeterminate="isIndeterminateFactor"
              v-model="factorCheckAll"
              @change="handleCheckFactorAllChange"
              >全选</el-checkbox
            >
            <div style="margin: 15px 0"></div>
            <el-checkbox-group
              v-model="factor"
              @change="handleCheckedFactorsChange"
            >
              <el-checkbox v-for="f in factors" :label="f" :key="f">{{
                f
              }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-divider></el-divider>
        </el-form>
      </div>
      <div id="center">
        <el-button type="primary" @click="prev">上一步</el-button>
        <el-button type="primary" @click="next">下一步</el-button>
      </div>
    </div>
    <div v-if="active == 2">
      <!-- <el-container id="maintest"> -->
      <div id="mainform">
        <el-form
          ref="form"
          :model="form"
          label-width="120px"
          style="margin-top: 100px"
        >
          <el-form-item label="任务名称" required>
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="任务类型" required>
            <el-select v-model="form.type" placeholder="请选择任务类型">
              <el-option
                label="疾病关联挖掘"
                value="disease_mining"
              ></el-option>
              <el-option
                label="危险因素关联挖掘"
                value="factor_mining"
              ></el-option>
              <el-option
                label="疾病-危险因素关联挖掘"
                value="disease_factor_mining"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务描述">
            <el-input v-model="form.description"></el-input>
          </el-form-item>
          <!-- <el-form-item label="使用模型">
            <el-select v-model="form.model" placeholder="请选择使用模型">
              <el-option label="SimRank" value="apriori"></el-option>
              <el-option label="GIPs" value="svm"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="buttonDM" id="button1">
            <el-button type="primary" @click="onSubmitDM">运行</el-button>
          </el-form-item> -->
        </el-form>
      </div>
      <el-button
        style="margin-top: 12px; margin-left: 50%"
        type="primary"
        @click="next"
        >下一步</el-button
      >
    </div>
    <div v-if="active == 3">
      <div id="mainform">
        <el-form
          ref="form"
          :model="form"
          label-width="120px"
          style="margin-top: 100px"
        >
          <el-form-item label="数据选择" required>
            <el-select v-model="form.tableName" placeholder="请选择数据">
              <el-option label="association" value="association"></el-option>
              <el-option label="table1" value="table1"></el-option>
              <el-option label="table2" value="table2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模型选择" required>
            <el-select v-model="form.algorithmName" placeholder="请选择模型">
              <el-option label="SimRank" value="SimRank"></el-option>
              <el-option label="GIPs" value="GIPs"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div id="center">
        <el-button type="primary" @click="prev">上一步</el-button>
        <!-- <el-button type="primary" @click="next(), getDiseaseAndFactor()"
          >下一步</el-button
        > -->
        <el-button type="primary" @click="submitForm">提交</el-button>
      </div>
    </div>
  </div>
</template>
 
 
<script>
import { getRequest, postRequest } from "@/utils/api";
export default {

  data() {
    return {
      active: 0,//步骤条初始化
      form: {
        id: null,
        name: null,
        type: null,
        description: null,
        disease: null,
        factor: null,
        tableName: null,
        algorithmName: null,
      },
      diseaseCheckAll: false,
      factorCheckAll: false,
      disease: [],
      diseases: [],
      factor: [],
      factors: [],
      isIndeterminateDisease: true,
      isIndeterminateFactor: true
    };
  },
  created() {
    getRequest("mining/getDisease/" + "association").then(
      (response) => {
        console.log(response.length)
        var dis = []
        for (var i = 0; i < response.length; i++) {
          dis.push(response[i].disease)
        }
        this.diseases = dis
      }
    )
    getRequest("mining/getFactor/" + "association").then(
      (response) => {
        console.log(response)
        var fac = []
        for (var j = 0; j < response.length; j++) {
          fac.push(response[j].factor)
        }
        this.factors = fac
      }
    )
  },

  methods: {
    //下一页
    next() {
      if (this.active++ > 3) this.active = 0;
      console.log(this.form)
    },
    //上一页
    prev() {
      if (this.active > 0) this.active--;
    },
    handleCheckDiseaseAllChange(val) {
      this.disease = val ? this.diseases : [];
      this.isIndeterminateDisease = false;
    },
    handleCheckFactorAllChange(val) {
      this.factor = val ? this.factors : [];
      this.isIndeterminateFactor = false;
    },
    handleCheckedDiseasesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.diseases.length;
      this.isIndeterminateDisease = checkedCount > 0 && checkedCount < this.diseases.length;
    },
    handleCheckedFactorsChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.factors.length;
      this.isIndeterminateFactor = checkedCount > 0 && checkedCount < this.factors.length;
    },
    getDiseaseAndFactor() {
      getRequest("mining/getDisease/" + this.form.tableName).then(
        (response) => {
          console.log(response.length)
          var dis = []
          for (var i = 0; i < response.length; i++) {
            dis.push(response[i].disease)
          }
          this.diseases = dis
        }
      )
      getRequest("mining/getFactor/" + this.form.tableName).then(
        (response) => {
          console.log(response)
          var fac = []
          for (var j = 0; j < response.length; j++) {
            fac.push(response[j].factor)
          }
          this.factors = fac
        }
      )
    },
    submitForm() {
      let _this = this
      this.form.disease = this.disease.toString()
      this.form.factor = this.factor.toString()
      console.log(this.form)
      postRequest("mining/insert", this.form).then(
        response => {
          console.log(response)
          if (response === true) {
            _this.$message.success("任务创建成功")

            if (_this.form.type == "disease_mining") {
              _this.$router.push('/disease/result')
            }
            else if (_this.form.type == "factor_mining") {
              _this.$router.push('/factor/result')
            }
            else if (_this.form.type == "disease_factor_mining") {
              _this.$router.push('/diseaseFactor/result')
            }

          } else {
            _this.$message.error("任务创建失败")
            _this.formLoading = false
          }
        })
    },

  }
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
</style>