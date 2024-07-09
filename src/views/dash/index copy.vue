<template>
  <el-row :gutter="40" class="panel-group">
    <el-card style="margin-right: 20px;margin-left: 20px;margin-bottom: 10px;">
     
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <span class="lineStyle">▍</span><span>危险因素因果关系图谱快捷入口</span>
      <div class="card-panel" @click="quickLink(0)">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-file-name="tree-table" style="font-size: 40px; font-weight: 500"/>
         
          <div style="text-align: center">因果关系图谱</div>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            因果关系总数
          </div>
          <div>
            <el-row>
              <el-col :span="12"><el-statistic
                    group-separator=","
                    :value="causalRelationshipsNum"
                    class="card-panel-num"
                    style="margin-top: 3px;"
                  >
                </el-statistic></el-col>
              <el-col :span="12" style="font-size: 16px ;">个</el-col>
            </el-row>
          </div>           
        </div>
      </div>
    </el-col>   
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <span class="lineStyle">▍</span><span>数据表管理快捷入口</span>
      <div class="card-panel" @click="quickLink(1)">
        
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-file-name="excel" style="font-size: 40px; font-weight: 500"/>
          <div style="text-align: center">数据查看</div>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            数据表总数
          </div>
          <el-row>
              <el-col :span="12"><el-statistic
                    group-separator=","
                    :value="dataNum"
                    class="card-panel-num"
                  >
                </el-statistic></el-col>
              <el-col :span="12" style="font-size: 16px ;">个</el-col>
            </el-row>
        </div>
      </div>

    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <span class="lineStyle">▍</span><span>空间层次效应挖掘快捷入口</span>
      <div class="card-panel" @click="quickLink(2)">
        
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-file-name="component" style="font-size: 40px; font-weight: 500"/>
          <div style="text-align: center">任务创建</div>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            模型总数
          </div>
          <el-row>
              <el-col :span="12"><el-statistic
                    group-separator=","
                    :value="algorithmNum"
                    class="card-panel-num"
                  >
                </el-statistic></el-col>
              <el-col :span="12" style="font-size: 16px ;">个</el-col>
            </el-row>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <span class="lineStyle">▍</span><span>历史挖掘任务查看快捷入口</span>
      <div class="card-panel" @click="quickLink(3)">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-file-name="clipboard" style="font-size: 40px; font-weight: 500"/>
          <div style="text-align: center">任务查看</div>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            任务总数
          </div>
      
            <el-row>
              <el-col :span="12"><el-statistic
                    group-separator=","
                    :value="miningNum"
                    class="card-panel-num"
                    style="margin-top: 5px;"
                  >
                </el-statistic></el-col>
              <el-col :span="12" style="font-size: 16px ;">个</el-col>
            </el-row>
        </div>
      </div>
    </el-col> </el-card>
    <el-col :span="8">
      <el-card style="margin-right: 20px">
        <div slot="header" class="clearfix">
          <span class="lineStyle">▍</span><span>各病种因果关系挖掘统计</span>
        </div>
        <div id="chart1" style="width: 100%; height: 400px"></div>
      </el-card>
    </el-col>
    <el-col :span="8" >
      <el-card>
        <div slot="header" class="clearfix">
          <span class="lineStyle">▍</span><span>已挖掘病种展示</span>
        </div>
        <Charts style="width: 100%; height: 400px; margin-left: -5%;" ></Charts>
       
      </el-card>
    </el-col>
    <el-col :span="8" >
      <el-card>
        <div slot="header" class="clearfix">
        <span class="lineStyle">▍</span><span>各病种数据表数量统计</span></div>
        <div id="chart2" style="width: 100%; height: 400px" ></div>
    </el-card>
      </el-col>
  </el-row>

</template>

<script>
import Charts from '../../views/knowledgeGraph/KnowledgeGraph1.vue' // 替换为你的Charts组件的实际路径
import * as echarts from 'echarts';
import TaskCountChart from '@/components/tab/TaskCountChart.vue';
import { getRequest, postRequest } from "@/utils/api";
import Bar from "@/components/tab/subcomponents/Bar.vue";
import LineChartVue from "@/components/tab/subcomponents/LineChart.vue";
import task1 from "@/views/task1.vue";
import{
        expendNodes,
    } from '../../views/knowledgeGraph/mock'
    
export default {
  name: "index",
  components: {  Bar ,LineChartVue,TaskCountChart,Charts},
  
  data() {
    return {

      //获取登录用户的id
      userId: sessionStorage.getItem("userid"),

      formattedChartData: [ ],
      
      charttype: 1,
      sevendays: [],
      chartLegend: [],
      chartData: [],
      chartOptions: [
        {
          value: 1,
          label: "总数",
        },
        {
          value: 2,
          label: "分任务",
        },
      ],
      causalRelationshipsNum: 0,
      dataNum: 0,
      algorithmNum: 0,
      miningNum: 0,
      bar_x:[],
      bar_neg:[],
      bar_pos:[],
      causalRelationships: {
        relationships: 0,
        diabetes: 0,
        lung: 0,
        prostate: 0,
        colorectal: 0,
        hypertension: 0
      },

      dataChart: {
        diabetes: 0,
        lung: 0,
        prostate: 0,
        colorectal: 0,
        hypertension: 0
      },

      priorChart: {
        diabetes: 0,
        lung: 0,
        prostate: 0,
        colorectal: 0,
        hypertension: 0
      },

      relationships:[],
      data:[],
      pirorKnowledge: [],
      myChart1: null,
      myChart2: null,
      myChart3: null,
      myChart4: null,

      quickEntry: [
        {
          title: "因果关系图谱",
          img: require("../../assets/dataManage.png"),
          router: "/knowledgeGraph/Charts",
        },
        {
          title: "数据查看",
          img: require("../../assets/ModelManage.png"),
          router: "/data/newdatas",
        },
        {
          title: "任务创建",
          img: require("../../assets/mutipile.png"),
          router: "/DisFactor",
        },
        {
          title: "任务日志",
          img: require("../../assets/feiai.png"),
          router: "/task/newlist",
        },
      ],
    };
  },
  mounted(){
   // this.init();
  },
  methods: {

    quickLink(index) {
      console.log(this.quickEntry[index].router);
      this.$router.replace(this.quickEntry[index].router); 
    },

    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },

     getCausalRelationshipsNum(){
      getRequest(`api/index/getKnowledgeGraphs/${this.userId}`).then((response => {
        this.causalRelationshipsNum = response.data;
      }))
    },

    getDataNum(){
      getRequest(`api/index/getTables/${this.userId}`).then((response => {
        this.dataNum = response.data;
      }))
    },

    getMiningNum(){
      getRequest(`api/index/getMinings/${this.userId}`).then((response => {
        this.miningNum = response.data;
      }))
    },

    getAlgorithmNum(){
      getRequest("api/index/getAlgorithmNum").then((response => {
        this.algorithmNum = response;
      }))
    },

    async getAll() {
      postRequest("api/index/getAllRelationships", {}).then(
        (response) => {
          this.relationships = response

          var lenRelationships = 0
          var lenDiabetes = 0
          var lenLung = 0
          var lenProstate = 0
          var lenColorectal = 0
          var lenHypertension = 0

          for(var rel in this.relationships){
            if(this.relationships[rel].diseaseName == "糖尿病"){
              lenDiabetes++
            }
            else if(this.relationships[rel].diseaseName == "肺癌"){
              lenLung++
            }
            else if(this.relationships[rel].diseaseName == "前列腺癌"){
              lenProstate++
            }
            else if(this.relationships[rel].diseaseName == "结直肠癌"){
              lenColorectal++
            }
            else if(this.relationships[rel].diseaseName == "高血压"){
              lenHypertension++
            }
            lenRelationships++
          }
          this.causalRelationships.relationships = lenRelationships
          this.causalRelationships.diabetes = lenDiabetes
          this.causalRelationships.lung = lenLung
          this.causalRelationships.prostate = lenProstate
          this.causalRelationships.colorectal = lenColorectal
          this.causalRelationships.hypertension = lenHypertension
        }
      )
      await postRequest("api/index/getData", {}).then(
        (response) => {
          this.data = response
          var lenDiabetes = 0
          var lenLung = 0
          var lenProstate = 0
          var lenColorectal = 0
          var lenHypertension = 0

          for(var d in this.data){
            if(this.data[d].diseaseName == "糖尿病"){
              lenDiabetes++
            }
            else if(this.data[d].diseaseName == "肺癌"){
              lenLung++
            }
            else if(this.data[d].diseaseName == "前列腺癌"){
              lenProstate++
            }
            else if(this.data[d].diseaseName == "结直肠癌"){
              lenColorectal++
            }
            else if(this.data[d].diseaseName == "高血压"){
              lenHypertension++
            }
          }
          this.dataChart.diabetes = lenDiabetes
          this.dataChart.lung = lenLung
          this.dataChart.prostate = lenProstate
          this.dataChart.colorectal = lenColorectal
          this.dataChart.hypertension = lenHypertension

          console.log(this.dataChart.diabetes)
        }
      )

    },
    init() {

},


    drawChart1() {
      this.myChart1 = this.$echarts.init(document.getElementById("chart1"));

      var option;
      option = {
      
      title: {
    //text: '因果关系分布',
  //  subtext: 'Fake Data',
    left: 'center'
  },
  tooltip: {
    trigger: 'item', formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: '50%',
      data: [
      { value: this.causalRelationships.diabetes, name: '糖尿病' ,itemStyle: { color: '#FF8C00' }},
              { value: this.causalRelationships.lung, name: '肺癌' ,itemStyle: { color: '	#FFB5B5' }},
              { value: this.causalRelationships.prostate, name: '前列腺癌',itemStyle: { color: '#FFFFB9' } },
              { value: this.causalRelationships.colorectal, name: '结直肠癌' ,itemStyle: { color: '#D9FFFF' }},	
              { value: this.causalRelationships.hypertension, name: '高血压',itemStyle: { color: '#FFD0FF' } }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]}
      this.myChart1.setOption(option);
    },

    drawChart2() {
      this.myChart2 = this.$echarts.init(document.getElementById("chart2"));
      var data = this.dataChart.diabetes
      console.log("数据",data)
      var option;
      option = {
    
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          interval: 1,
          type: 'value',
          boundaryGap: [0, 0.01],
          axisLabel: {
    formatter: function (value) {
      return Math.ceil(value); // 格式化刻度值，只显示整数部分
    }
  },
         
        },
        yAxis: {
          type: 'category',
          data: ['结直肠癌', '前列腺癌', '高血压', '肺癌', '糖尿病']
        },
        series: [
          {
            name: '数据集',
            type: 'bar',
            data: [this.dataChart.colorectal, this.dataChart.prostate, this.dataChart.hypertension, this.dataChart.lung, this.dataChart.diabetes]
          },
          
        ]

      };
      this.myChart2.setOption(option);
    }, 
    drawChart4() {

      this.myChart4 = this.$echarts.init(document.getElementById("chart4"));

      var option;
      option = {
        legend: {},
  tooltip: {},
  dataset: {
    source: [
      ['product', '糖尿病', '高血压', '肺癌'],
      ['离散数据', 23.3, 35.8, 33.7],
      ['连续数据', 13.1, 23.4, 45.1],
      ['缺失数据', 26.4, 25.2, 42.5],
    
      
    ]
  },
  xAxis: { type: 'category' },
  yAxis: {},
  // Declare several bar series, each will be mapped
  // to a column of dataset.source by default.
  series: [{ 
        type: 'bar',
        itemStyle: { color: '#4DFFFF' } // 设置柱形图的颜色
      },
      { 
        type: 'bar',
        itemStyle: { color: 'yellow' } // 设置柱形图的颜色
      },
      { 
        type: 'bar',
        itemStyle: { color: '#28FF28' } // 设置柱形图的颜色
      }]
      };

      this.myChart4.setOption(option);
    }
  },
  created() {
    this.init();
  
    this.getCausalRelationshipsNum();
    this.getDataNum();
    this.getAlgorithmNum();
    this.getMiningNum();
    this.getAll()
    this.getAll().then(() => {
      this.drawChart1();
      this.drawChart2();
      this.drawChart4();
    })
  },
}
</script>

<style lang="scss" scoped>

.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #e5eeee;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
.quickEntryBox {
  /*border: 1px red solid;*/
  /*box-sizing: border-box;*/
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.quickEntryBox .singleBox {
  /*border: 1px red solid;*/
  /*box-sizing: border-box;*/
  width: 80px;
  height: 80px;
  border-radius: 20%;
}
.quickEntryBox .imgStyle {
  width: 90%;
  height: 90%;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
#chartBox {
  width: 100%;
  height: 100%;
}
.bottomStatistic {
  width: 100%;
}
.bottom_statistic_card {
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
  width: 100%;
  height: 100%;
}

</style>