<template>



   <div v-if="loading" class="loading">
    <!-- 这里放置加载动画的内容 -->
    <div class="loader"></div>
    <p>Loading...</p>
  </div>
  
  <div v-else>
  <div class="topBigDiv">
        <div class="left">
          <h3>疾病危险因素空间层次效应可视化展示</h3>
            <div class="header">
              <el-select v-model="choice" placeholder="请选择相应的空间层次" @change="getImage" size="medium">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div >
              <img :src="qrcodeSrc" alt="image" width="800" height="800" >  
            </div>
        </div>
        <div class="right">
          
          <el-card style="margin-right: 20px">
            <div slot="header" class="clearfix">
              <span class="lineStyle">▍</span><span>因果关系展示</span>
            </div>

              <div class="header">
        <el-select v-model="graghChoice" placeholder="请选择相应的空间层次" @change="drawChart3" size="medium" style="margin-left: 200px;">
          <el-option
            v-for="item in graghOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
       
      </div>
            <div id="chart3" style="width: 100%; height: 500px"></div>
          </el-card>

          
          <div>
              <el-header>
                <el-divider></el-divider>
                  <h3>该数据的空间层次效应如下</h3>
 
              </el-header>
          </div>
          <div id="mainform" font-size="60px">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" >全选</el-checkbox>
              <div style="margin: 15px 0;"></div>
              <el-checkbox-group v-model="checkedRelationships" @change="handleCheckedCitiesChange">
                <el-checkbox v-for="causal in causalOptions" :label="causal" :key="causal">{{causal}}</el-checkbox>
            </el-checkbox-group>
          <div id="center">
                <el-button type="primary" @click="save">保存</el-button>
            </div>
          </div>
          
        </div>

        
	</div>
</div>
</template>


   
  <script>
  import { postRequest, getRequest } from "@/utils/api";
  export default {

    data() {
      return {
        demoOptions: [],
        physioOptions: [],
        sociolOptions: [],
        myChart3: null,
        graghChoice: 'c',



        loading: true ,// 初始加载状态为 true




        nodes: [],
        links: [],


        options: [{
          value: 'c',
          label: '临床表征'
        }, {
          value: 'l',
          label: '生活行为习惯'
        }, {
          value: 's',
          label: '社会环境'
        }, {
          value: 'cl',
          label: '临床表征-生活行为习惯'
        }, {
          value: 'ls',
          label: '生活行为习惯-社会环境'
        }, {
          value: 'cls',
          label: '临床表征-生活行为习惯-社会环境'
        }
        ],

        graghOptions: [{
          value: 'c',
          label: '临床表征'
        }, {
          value: 'l',
          label: '生活行为习惯'
        }, {
          value: 's',
          label: '社会环境'
        }
        ],


        causalOptions:[],
        checkAll: false,
        checkedRelationships: [],
        isIndeterminate: true,

        causalRelationshipsForm: {
          relationship: null,
          diseaseName: null,
          tableName: null,
          algorithmName: null,
          priorKnowledgeName: null
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
        // qrcodeSrc: require('@/assets/she/she.png'),
        qrcodeSrc: '',
        choice: 'cls'
      }
    },


    created() {

        // 在 created 钩子函数中模拟一个异步操作，例如从后端获取数据
    // 这里使用 setTimeout 模拟一个异步操作
    setTimeout(() => {
      // 将 loading 状态设置为 false，表示加载完成
      this.loading = false;
    }, 5000); // 模拟加载需要的时间，例如 2000ms

      this.form = this.$route.query.form
      this.getAllRelationships();
      this.getImage();
    },

    mounted() {




    this.$nextTick(() => {
      if (document.getElementById("chart3")) {
        this.drawChart3()
      }
    })

  },



    methods: {
    
       async getImage(){
    

          getRequest("admin/mining/getImage/"+this.form.tableName+this.choice).then(
            response =>{
                this.qrcodeSrc = "data:image/png;base64," + response;
                console.log("已传递")
            }
        )      
      },


      circledNodesPosition({x=500,y=500}, index, nodesLen, radius = 20) {
            const avd = 360 / nodesLen;
            const ahd = avd * Math.PI / 180
            return {
                x: Math.sin((ahd*index))*radius + x,
                y: Math.cos((ahd*index))*radius + y
            }
        },

      

      drawChart3() {
          this.myChart3 = this.$echarts.init(document.getElementById("chart3"));
          console.log("节点",this.nodes)
          console.log("边",this.links)

          this.nodes = []
          if(this.graghChoice == "c"){
            const clinicalNode = this.form.clinicalRepresentation.split(",")

            const x = 500
            const y = 500
            const nodesLen = clinicalNode.length
            const avd = 360 / nodesLen;
            const ahd = avd * Math.PI / 180
            const radius = 20
            for(let item in clinicalNode){
              // var xRandom = Math.random()*1000
              // var yRandom = Math.random()*1000
              var xRandom = Math.sin((ahd*item))*radius + x
              var yRandom = Math.cos((ahd*item))*radius + y
              const obj = {
                name: clinicalNode[item],
                x: xRandom,
                y: yRandom
              }
              this.nodes.push(obj)
            }
          }
          if(this.graghChoice == "l"){
            let liveNode = this.form.livingHabit.split(",")

            const x = 500
            const y = 500
            const nodesLen = liveNode.length
            const avd = 360 / nodesLen;
            const ahd = avd * Math.PI / 180
            const radius = 20
            for(let item in liveNode){
              var xRandom = Math.sin((ahd*item))*radius + x
              var yRandom = Math.cos((ahd*item))*radius + y
              const obj = {
                name: liveNode[item],
                x: xRandom,
                y: yRandom
              }
              this.nodes.push(obj)
            }
          }
          if(this.graghChoice == "s"){
            let socialNode = this.form.socialConnection.split(",")

            const x = 500
            const y = 500
            const nodesLen = socialNode.length
            const avd = 360 / nodesLen;
            const ahd = avd * Math.PI / 180
            const radius = 20
            for(let item in socialNode){
              var xRandom = Math.sin((ahd*item))*radius + x
              var yRandom = Math.cos((ahd*item))*radius + y
              const obj = {
                name: socialNode[item],
                x: xRandom,
                y: yRandom
              }
              this.nodes.push(obj)
            }
          }

          var option;
          option = {
            tooltip: {},
            animationDurationUpdate: 1500,
            animationEasingUpdate: 'quinticInOut',
            series: [
              {
                type: 'graph',
                layout: 'none',
                symbolSize: 50,
                roam: true,
                label: {
                  show: true
                },
                edgeSymbol: ['circle', 'arrow'],
                edgeSymbolSize: [4, 10],
                edgeLabel: {
                  fontSize: 20
                },
                data : this.nodes,
              links: this.links,
              lineStyle: {
                opacity: 0.9,
                width: 2,
                curveness: 0
              }
            }
          ]
        };

      this.myChart3.setOption(option);
    },

      getAllRelationships(){

        postRequest("admin/mining/runing",this.form).then(
          response => {
            const options = response.data
            this.causalOptions = options
            for (let re in options){
              var sc = options[re].split(" -> ")
              const obj = {
                source: sc[0],
                target: sc[1]
              }
              this.links.push(obj)
            }
          },

        )

        },
        save(){
          for(var causal in this.causalOptions){
            this.causalRelationshipsForm.relationship = this.causalOptions[causal];
            this.causalRelationshipsForm.diseaseName = this.form.diseaseName;
            this.causalRelationshipsForm.algorithmName = this.form.algorithmId;
            this.causalRelationshipsForm.tableName = this.form.tableName;
            this.causalRelationshipsForm.priorKnowledgeName = this.form.priorKnowledge;

            postRequest("admin/mining/save", this.causalRelationshipsForm).then(
            response =>{
              if (response.code == "200") {
                // this.$router.push({ path: '@/views/relationships/index'})
                this.$router.push({ path: '/relationships' })
                this.$message.success("保存成功")
              }
              else{
                this.$message.error("保存失败")
              }
            }
          )
          }
        },

      handleCheckAllChange(val) {
        this.checkedRelationships = val ? this.causalOptions : [];
        this.isIndeterminate = false;
      },
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.causalOptions.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.causalOptions.length;
      },
    },
  }
  </script>

<style scoped>

/* 加载动画的样式 */
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 填充整个视口高度 */
}

/* 旋转加载动画的样式 */
.loader {
  border: 4px solid #f3f3f3; /* 加载动画的边框 */
  border-top: 4px solid #3498db; /* 加载动画的顶部边框 */
  border-radius: 50%; /* 创建一个圆形 */
  width: 50px; /* 加载动画的宽度 */
  height: 50px; /* 加载动画的高度 */
  animation: spin 1s linear infinite; /* 定义旋转动画 */
}

/* 旋转动画的关键帧 */
@keyframes spin {
  0% { transform: rotate(0deg); } /* 旋转开始的角度 */
  100% { transform: rotate(360deg); } /* 旋转结束的角度 */
}

.container {
	overflow: hidden;
	position: relative;
    min-height: 100vh;
    background-color: #0b2838;
}
.canvas {
  position: relative;
  min-width: 1200px;
  text-align:center;
    margin-top: 10px;
	height: calc(100vh - 110px);
}
.center {
  color: #1863a0;
  font-size: 30px;
	position: relative;

	min-width: 1200px;
	margin: 0 auto;
    width: 85%;
}
.header {
    display:block;
    margin: 0 auto;
    text-align:center;
	padding-top: 30px;
}
.ipt {
	border: 1px solid #9093c7;
    text-align:center;
	border-radius: 20px;
	width: 374px;
	height: 44px;
	line-height: 44px;
	box-sizing: border-box;
    color: #555;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ccc;
}

.tips {
	font-size: 14px;
	color: #ccc;
	line-height: 17px;
	margin-top: 5px;
}

.topBigDiv {
  overflow: hidden;
	position: relative;
    min-height: 100vh;
    background-color: #fafcfd;
  box-sizing: border-box;
  height: 30vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.topBigDiv .left {
  box-sizing: border-box;
  width: 49%;
  height: 100%;
}
.topBigDiv .right {
  box-sizing: border-box;
  width: 49%;
  height: 100%;
}

.bottomBigDiv {
  box-sizing: border-box;
  height: 55vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}
</style>