<template>
  <div v-loading="loading" element-loading-text="拼命运算中">
    <el-container>
      <el-tabs id="modelList" v-model="model" tab-position="left">
        <!-- tab-pane的name值必须与vuex里的算法名字一一对应 -->
        <el-tab-pane
          label="PC"
          :disabled="moduleName !== 'disFactor'"
          name="PC"
        >
          <div class="titleBox">PC</div>
          <div class="introBox">
            <p>模型说明：</p>
            <p>
              SF-DRMB是一种因果特征选择算法，可用于挖掘疾病和危险因素之间存在的因果关系。
            </p>
          </div>
          <div class="paramBox">
            <el-form
              :model="SF_DRMB_form"
              class=""
              label-position="top"
              ref="SF_DRMB_ref"
            >

            
            
              <!-- <el-form-item prop="K_OR">
                <template slot="label">
                  <span class="paramTitle">K_OR</span>
                  <el-popover placement="right" trigger="hover">
                    <div>
                      K_OR参数用于控制恢复假阴性特征数，值越大计算越复杂，计算时间更长，结果不一定更好
                    </div>
                    <el-icon
                      slot="reference"
                      class="el-icon-warning-outline"
                    ></el-icon>
                  </el-popover>
                </template>
                <el-input v-model.trim="SF_DRMB_form.K_OR"></el-input>
                <span class="valueRange">(取值范围为 0 - 1 )</span>
              </el-form-item> -->

              <!-- <el-form-item prop="K_and_PC">
                <template slot="label">
                  <span class="paramTitle">K_and_PC</span>
                  <el-popover placement="right" trigger="hover">
                    <div>
                      K_and_pc参数用于控制剔除父子假阳性特征数，值越大计算越复杂，计算时间更长，结果不一定更好
                    </div>
                    <el-icon
                      slot="reference"
                      class="el-icon-warning-outline"
                    ></el-icon>
                  </el-popover>
                </template>
                <el-input v-model.trim="SF_DRMB_form.K_and_PC"></el-input>
                <span class="valueRange">(取值范围为 0.15 - 0.3 )</span>
              </el-form-item>

              <el-form-item prop="K_and_SP">
                <template slot="label">
                  <span class="paramTitle">K_and_SP</span>
                  <el-popover placement="right" trigger="hover">
                    <div>
                      K_and_sp参数用于控制剔除配偶假阳性特征数，值越大计算越复杂，计算时间更长，结果不一定更好
                    </div>
                    <el-icon
                      slot="reference"
                      class="el-icon-warning-outline"
                    ></el-icon>
                  </el-popover>
                </template>
                <el-input v-model.trim="SF_DRMB_form.K_and_SP"></el-input>
                <span class="valueRange">(取值范围为 0.4 - 0.8 )</span>
              </el-form-item> -->
    
<!--                   
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
                  </el-form-item> -->

              </el-form>
     
            <div class="buttonBox">
              <el-button round @click="backStep()">上一步</el-button>
              <el-button round @click="resetForm('SF_DRMB_ref')"
                >恢复默认</el-button
              >
              <el-button
                type="primary"
                round
                @click="submit('/runtime_bus/submit')"
                >提交运算</el-button
              >
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="IAMB" name="IAMB">
          <div class="titleBox">IAMB</div>
          <div class="introBox">
            <p>模型说明：</p>
            <p>
              IAMB是一种因果特征选择算法，可用于挖掘疾病和危险因素之间存在的因果关系。
            </p>
          </div>
          <div class="buttonBox">
            <el-button round @click="backStep()">上一步</el-button>
            <el-button
              type="primary"
              round
              @click="submit('/runtime_bus/submit_Task2')"
              >提交运算</el-button
            >
          </div>
          <div class="paramBox"></div>
        </el-tab-pane>

        <el-tab-pane label="SSP-Tree" :disabled="true">SSP-Tree</el-tab-pane>
        <el-tab-pane label="FP-Growth" :disabled="true">FP-Growth</el-tab-pane>
        <el-tab-pane label="Logistic Regression" :disabled="true"
          >Logistic Regression</el-tab-pane
        ><el-tab-pane label="SSP-Tree" :disabled="true">SSP-Tree</el-tab-pane>
       
        <el-tab-pane v-for="(tab, index) in tabPages" :key="index" :label="tab.algorithmName" >
      {{ tab.algorithmDescription }}

    </el-tab-pane>
      </el-tabs>

      <!-- <el-tabs v-model="activeTab">
      <el-tab-pane v-for="(tab, index) in tabPages" :key="index" :label="tab.algorithmName" >
      {{ tab.algorithmName }}
    </el-tab-pane>
  </el-tabs> -->
    </el-container>
  </div>
</template>

<script>
  import { postRequest, getRequest } from "@/utils/api";
import { resetForm } from "@/components/mixins/mixin.js";
import vuex_mixin from "@/components/mixins/vuex_mixin";
export default {
  name: "AlgorithmSelect",
  mixins: [resetForm, vuex_mixin],
  props: {
    moduleName: {
      type: String,
      default: "disFactor",
    },
  },
  computed: {},
  data() {
    return {
      activeTab: 'pc',
      tabPages: [], // 从后端获取的标签页数据
      model: "",
      loading: false,
      SF_DRMB_form: {
        K_OR: 0,
        K_and_PC: 0,
        K_and_SP: 0,
      },
      res: "",
    };
  },

  created() {
    this.init();
    this.searchAll(); // 在组件挂载后调用获取标签页数据的方法
  },

  methods: {

    searchAll () {
          this.listLoading = true
          getRequest('admin/algorithm/getAll',{}).then(
                  (response)=>{
                    console.log('1',response)
                    this.tabPages = response;
          // 如果需要默认激活某个标签页，可以在这里设置activeTab的值
                  }
                );
      },
    // fetchTabPages() {
    //   axios.get('/api/tabPages')
    //     .then(response => {
    //       this.tabPages = response.data;
    //       // 如果需要默认激活某个标签页，可以在这里设置activeTab的值
    //     })
    //     .catch(error => {
    //       console.error('Error fetching tab pages:', error);
    //     });
    // },
  
    init() {
      this.SF_DRMB_form = this.m_SF_DRMB;
      if (this.moduleName === "disFactor") {
        this.model = "SF_DRMB";
      } else {
        this.model = "IAMB";
      }
    },

    backStep() {
      this.m_changeStep(this.m_step - 1);
    },

    submit(url) {
      this.loading = true;
      this.m_SF_DRMB_update(this.SF_DRMB_form);
      let payload = {
        tablename: this.m_dataset,
        targetcolumn: this.m_target_feature,
        fea: this.m_use_features,
        K_OR: Number(this.m_SF_DRMB.K_OR),
        K_and_pc: Number(this.m_SF_DRMB.K_and_PC),
        K_and_sp: Number(this.m_SF_DRMB.K_and_SP),
        knowledge: this.m_known_features,
      };
      postRequest(url, payload)
        .then((res) => {
          console.log(res);
          if(isNaN(res.ratio)){
            console.log("ration:");
            res.ratio = 0;
            console.log(res.ratio);
          }
          
          this.m_changeTaskInfo({ algorithm: this.model, result: res });
          this.loading = false;
          this.m_changeStep(this.m_step + 1);
        })
        .catch((err) => {
          this.loading = false;
          this.$message({
            showClose:true,
            type:"error",
            message:`发生错误：${err}`
          });
        });
    },
  },
};
</script>

<style scoped>
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
</style>
