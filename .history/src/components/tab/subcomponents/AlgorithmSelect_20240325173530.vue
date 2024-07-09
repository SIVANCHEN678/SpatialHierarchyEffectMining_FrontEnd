<template>
  <div v-loading="loading" element-loading-text="拼命运算中">
    <el-container>
      <el-tabs id="modelList" v-model="model" tab-position="left">
        <!-- tab-pane的name值必须与vuex里的算法名字一一对应 -->


        <el-tab-pane v-for="(tab, index) in tabPages" :key="index" :label="tab.algorithmName" >
          <div class="titleBox">{{ tab.algorithmName }}</div>
          <div class="introBox">
            <p>模型说明：</p>

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
                <!-- <el-input v-model.trim="SF_DRMB_form.K_OR" ></el-input>空间层次 -->
              <el-select  placeholder="请选择任务类型">
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
              

                <el-select  style="margin-top: 5px;" placeholder="请选择算法">
                          <el-option label="fges" value="fges"></el-option>
                          <el-option label="fci" value="fci"></el-option>
                          <el-option label="pc" value="pc"></el-option>
                          <!-- <el-option label="rfci" value="rfci"></el-option> -->
                      </el-select>
                <span class="valueRange"></span>
              </el-form-item>

              <el-form-item prop="K_and_PC">
                <template slot="label">
                  <span class="paramTitle"><span class="lineStyle">▍</span>任务描述</span>
                  <el-popover placement="right" trigger="hover">
                    <div>
                     对任务的定义，描述整个任务做了什么工作
                    </div>
                    <el-icon
                      slot="reference"
                      class="el-icon-warning-outline"
                    ></el-icon>
                  </el-popover>
                </template>
                <el-input v-model.trim="SF_DRMB_form.K_and_PC" style="margin-top: 10px; width: 220px;" ></el-input>
                <span class="valueRange"></span>
              </el-form-item>

              <el-form-item prop="K_and_PC">
                <template slot="label">
                  <span class="paramTitle"><span class="lineStyle">▍</span>任务描述</span>
                  <el-popover placement="right" trigger="hover">
                    <div>
                    该参数是对于
                    </div>
                    <el-icon
                      slot="reference"
                      class="el-icon-warning-outline"
                    ></el-icon>
                  </el-popover>
                </template>
                <el-input v-model.trim="SF_DRMB_form.K_and_PC" style="margin-top: 10px; width: 220px;" ></el-input>
                <span class="valueRange"></span>
              </el-form-item>

             
            </el-form>
            <div class="buttonBox">
              <el-button round @click="backStep()">上一步</el-button>
              <!-- <el-button round @click="resetForm('SF_DRMB_ref')"
                >恢复默认</el-button
              > -->
              <el-button
                type="primary"
                round
                @click="submit('/runtime_bus/submit')"
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
mounted(){
  this.searchAll(); // 在组件挂载后调用获取标签页数据的方法
},

  created() {

    console.log(this.$store)
    this.init();
    this.searchAll(); // 在组件挂载后调用获取标签页数据的方法
  },

  methods: {
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


      //提交整个任务
      submitForm() {

// 获取所有表单项的值
const { name,type, description, algorithmId } = this.form;
// 检查是否所有的表单项都有值
if (name  && description && algorithmId) {
// 执行提交表单的操作
console.log("提交表单");
} else {
// 显示错误提示
this.$message.error("请填写所有必填项");
// return;
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


   //把任务存进数据库，跳转到任务管理页面  结果显示
 postRequest("admin/mining/insert", this.form).then(
     response =>{
         console.log(response)
         if (response.code == "200") {
             this.$message.success("任务创建成功")
             // if (_this.form.type == "she_mining") {
             this.$router.push({ path: '/she/result' ,query: { form: this.form} })
            
             console.log(this.form)
             
         } else {
             this.$message.error("任务创建失败,请重新填写任务设置信息")
             // this.formLoading = false
         }
     }
 )


   }
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
