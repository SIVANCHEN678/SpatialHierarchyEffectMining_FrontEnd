<template>
  <div v-loading="loading" element-loading-text="拼命运算中">
    <el-container>
      <el-tabs id="modelList" v-model="model" tab-position="left">
        <!-- tab-pane的name值必须与vuex里的算法名字一一对应 -->


        <el-tab-pane v-for="(tab, index) in tabPages" :key="index" :label="tab.algorithmName" v-model="activeTab"   @tab-click="onTabClick">
          <div class="titleBox">{{ tab.algorithmName }}</div>
          <div class="introBox">
            <p>算法说明：</p>

            <p>
               {{tab.algorithmDescription}}
              
             </p>
           </div>
           <div class="paramBox">
            <el-form
              :model="SF_DRMB_form"
              class=""
              label-position="top"
              ref="SF_DRMB_ref"
            >
              <el-form-item prop="K_OR">
                <template slot="label">
                  <span class="paramTitle"><span class="lineStyle">▍</span>任务选择</span>
                  <el-popover placement="right" trigger="hover">
                    <div>
                      根据需求选择不同的任务类型挖掘数据
                    </div>
                    <el-icon
                      slot="reference"
                      class="el-icon-warning-outline" 
                    ></el-icon>
                  </el-popover>
                </template>
              
              <el-select  v-model="selectedtask" placeholder="请选择任务类型">
                          <el-option
                                  label="空间层次效应挖掘"
                                  value="she_mining"
                          ></el-option>
                    
                          <el-option
                                  label="临床表征-疾病危险因素因果关系挖掘"
                                  value="clinical_features_mining"
                          ></el-option>
                      </el-select>

                <span class="valueRange"></span>
              </el-form-item>

              <el-form-item prop="K_and_SP">
                <template slot="label">
                  <span class="paramTitle" style="margin-bottom: 10px;"><span class="lineStyle">▍</span>算法选择</span>
                  <el-popover placement="right" trigger="hover">
                    <div>
                      根据数据的类型选择合适的算法参与运算
                    </div>
                    <el-icon
                      slot="reference"
                      class="el-icon-warning-outline"
                    ></el-icon>
                  </el-popover>
                </template>
              

                <!-- <el-select v-model="selectedAlgorithm" style="margin-top: 5px;" placeholder="请选择算法">
                  <el-option v-for="(tab, index) in tabPages" :key="index" :label="tab.algorithmName"   :value="tab.algorithmName">
                              </el-option>
                          <el-option label="rfci" value="rfci"></el-option> -->
                      <!-- </el-select>  -->

                      <el-form-item label="请输入或选择算法名称：" prop="algorithm">
                        <el-input
                          v-model="ll"
                          placeholder="请输入算法名称"
                          clearable
                        ></el-input>
                      </el-form-item>
                <span class="valueRange"></span>
              </el-form-item>

              <el-form-item prop="K_and_PC">
                <template slot="label">
                  <span class="paramTitle"><span class="lineStyle">▍</span>max_degree</span>
                  <el-popover placement="right" trigger="hover">
                    <div>
                      设置最大节点度数，即在搜索过程中允许的最大边数量，默认为3
                    </div>
                    <el-icon
                      slot="reference"
                      class="el-icon-warning-outline"
                    ></el-icon>
                  </el-popover>
                </template>
                <el-input v-model="selectedmax" style="margin-top: 10px; width: 220px;" ></el-input>
                <span class="valueRange"></span>
              </el-form-item>

              <el-form-item prop="K_and_PC">
                <template slot="label">
                  <span class="paramTitle"><span class="lineStyle">▍</span>评分函数</span>
                  <el-popover placement="right" trigger="hover">
                    <div>
                      指定用于评价和选择因果图模型的评分方法
                    </div>
                    <el-icon
                      slot="reference"
                      class="el-icon-warning-outline"
                    ></el-icon>
                  </el-popover>
                </template>
                <el-select v-model="selectedss" style="margin-top: 5px;" placeholder="请选择评分函数">
                          <el-option label="cg-bic-score" value="cg-bic-score"></el-option>
                          <el-option label="bdeu-score" value="bdeu-score"></el-option>
                          <el-option label="sem-bic" value="sem-bic"></el-option>
                          <!-- <el-option label="rfci" value="rfci"></el-option> -->
                      </el-select>
                <span class="valueRange"></span>
              </el-form-item>

             
            </el-form>
            <div class="buttonBox">
              <el-button round @click="backStep()">上一步</el-button>
            
              <el-button
                type="primary"
                round
                @click="submitForm()"
                >提交运算</el-button
              >
            </div></div>
        </el-tab-pane>
          <el-tab-pane label="notears" :disabled="true">notears</el-tab-pane>
           <el-tab-pane label="dagma" :disabled="true">dagma</el-tab-pane>
         
      
      </el-tabs>

    
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
      activeTab: '',
      ll: '',
      
     
      selectedtask:'',
      activeTab: 'pc',
      form:{

      },
      selectedss:'cg-bic-score',
     selectedmax: 0.3,
     selectedtask:'',
     selectedAlgorithm: '', // 新增变量，用于保存选中的算法

      tabPages: [], // 从后端获取的标签页数据
     
      model: "",
      loading: false,
     
      SF_DRMB_form: {
        K_OR: 0,
        K_and_PC: 0,
        K_and_SP: 0,
      },
all:null,
xin:null,
//插入到任务管理的表单

      form: {
                  id: null,
                  name: null,
                  type: null,
                  city:null,
                  leader:null,
                  participant:null,
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
                  socialConnection: null,
                  county:null,
                  province:null

              },
      res: "",
    };
  },
  watch: {
  selectedAlgorithm(newVal) {
    console.log('Selected algorithm:', newVal);
    // 在这里执行你需要的操作，例如调用方法
    this.handleAlgorithmSelection(newVal);
  },
  selectedtask(newVal){
    console.log('Selected task:', newVal);
    // 在这里执行你需要的操作，例如调用方法
    this.handleAlgorithmtask(newVal);
  }

},
mounted(){
  this.all=this.$store.state.disFactor;
  console.log('all',this.all)
  this.search1();
  this.searchAll(); // 在组件挂载后调用获取标签页数据的方法
  

},

  created() {

    console.log(this.$store.state)
    this.init();
    this.searchAll(); // 在组件挂载后调用获取标签页数据的方法
  },

  methods: {
    onTabClick(tab) {
      this.activeTab = tab.name || tab.label; // 根据你的实际结构选择name或label
      this.ll = this.activeTab;
    },

    search1 () {
        
          getRequest('admin/algorithm/getAll',{}).then(
                  (response)=>{
                    console.log('1',response)
                    this.tableData=response
                    this.listLoading=false
                  }
                );
                this.selectedmax = response.scoreId
            this.selectedss = response.maxDegree



                
      },
    handleAlgorithmtask(task) {
    // 在这里处理选定算法的逻辑
    console.log('Algorithm selected:', task);
    // ... 具体业务逻辑 ...
  },

    handleAlgorithmSelection(algorithm) {
    // 在这里处理选定算法的逻辑
    console.log('Algorithm selected:', algorithm);
    // ... 具体业务逻辑 ...
  },
// 在searchAll方法内部，确保处理响应数据时设置默认激活的tab页
searchAll () {
  this.listLoading = true
  getRequest('admin/algorithm/getAll', {}).then(
    (response) => {
      console.log('1', response)
      this.tabPages = response;

      // 添加这一行，尝试找到 'pc' 算法并激活对应的选项卡
      this.activeTab = 'pc'; // 假设 'pc' 一定存在于返回的 response 中

      // 如果希望更精确地找到 algorithmDescription 为 '123' 的 'pc' 算法选项卡，可以这样做：
      const pcTab = response.find(tab => tab.algorithmName === 'pc' && tab.algorithmDescription === '123');
      if (pcTab) {
        this.activeTab = pcTab.algorithmName;
      } else {
        // 如果找不到则激活列表中的第一个选项卡
        this.activeTab = response[0].algorithmName;
      }
    }
  );
},

 //提交整个任务
      submitForm() {

  
      if (this.selectedss  && this.selectedmax && this.selectedAlgorithm &this.selectedtask) {
      // 执行提交表单的操作
        console.log("提交表单");}
      // } else {
      // // 显示错误提示
      // this.$message.error("请填写所有必填项");
      // // return;
      // }

      this.form.diseaseName = this.all.m_disease //疾病名字
      this.form.tableName = this.all.m_dataset; //选择的哪个表名

      this.form.scoreId=this.selectedss;
      this.form.maxDegree=this.selectedmax;
      this.form.algorithmId=this.selectedAlgorithm ;
      this.form.type=this.selectedtask;
      this.form.clinicalRepresentation=this.all.m_clinic;
      this.form.livingHabit=this.all.m_living;
      this.form.socialConnection=this.all.m_social;
      this.form.leader=this.all.principal;
      this.form.participant=this.all.participants;
      this.form.name=this.all.taskName;
      this.form.description=this.all.label;
      this.form.city=this.all.m_city;
      this.form.county=this.all.m_county;
      this.form.province=this.all.m_province;





      

      // console.log("数据类型",this.tableTypes)
      // for(var i in this.dataOptions){
      //   if(this.dataOptions[i].tableName == this.form.tableName){    //数据类型
      //     console.log("6666666")
      //     console.log("数据类型",this.tableTypes[i].tableType)
      //     if(this.tableTypes[i].tableType == "离散数据"){
      //       this.form.dataType = "discrete"
      //     }else{
      //       this.form.dataType = "continuous"
      //     }
      //   }
      // }

      console.log("提交数据",this.form)
      

        //把任务存进数据库，跳转到任务管理页面  结果显示
      postRequest("admin/mining/insert", this.form).then(
          response =>{
              console.log(response)
              if (response.code == "200") {
                  this.$message.success("任务创建成功")
                
                  this.$router.push({ path: '/she/result' ,query: { form: this.form} })
                
                  console.log(this.form)
                
              } else {
                  this.$message.error("任务创建失败,请重新填写任务设置信息")
                  // this.formLoading = false
              }
          }
      )
     

        },




  
    init() {
      this.SF_DRMB_form = this.m_SF_DRMB;
     
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
  height: 80vh;
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
  height: 8vh;
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
  margin-top: 30px;
  margin-right: auto;
  margin-left: auto;
}

.lineStyle {
  color: rgb(100, 172, 231);
}
</style>
