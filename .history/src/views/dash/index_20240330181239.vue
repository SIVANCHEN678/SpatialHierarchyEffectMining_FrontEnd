<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="quickLink(0)">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-file-name="tree-table" style="font-size: 40px; font-weight: 500"/>
          <div style="text-align: center">空间层次效应管理</div>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            空间层次效应总数
          </div>
          <div>
            <el-row>
              <el-col :span="12"><el-statistic
                    group-separator=","
                    :value="causalRelationshipsNum"
                    class="card-panel-num"
                  >
                </el-statistic></el-col>
              <el-col :span="12" style="font-size: 16px ;">个</el-col>
            </el-row>
            
            
          </div>
                
          <!-- <count-to :start-val="0" :end-val="102400" :duration="2600" class="card-panel-num" /> -->
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="quickLink(1)">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-file-name="excel" style="font-size: 40px; font-weight: 500"/>
          <div style="text-align: center">数据管理</div>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            数据总数
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
      <div class="card-panel" @click="quickLink(2)">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-file-name="component" style="font-size: 40px; font-weight: 500"/>
          <div style="text-align: center">模型管理</div>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            算法模型总数
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
      <div class="card-panel" @click="quickLink(3)">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-file-name="clipboard" style="font-size: 40px; font-weight: 500"/>
          <div style="text-align: center">任务日志管理</div>
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
                  >
                </el-statistic></el-col>
              <el-col :span="12" style="font-size: 16px ;">个</el-col>
            </el-row>
        </div>
      </div>
    </el-col>
    <el-col :span="8">
      <el-card style="margin-right: 20px">
        <div slot="header" class="clearfix">
          <span class="lineStyle">▍</span><span>空间层次效应统计</span>
        </div>
        <div id="chart1" style="width: 100%; height: 300px"></div>
      </el-card>
    </el-col>
    <el-col :span="8" >
      <el-card>
        <div slot="header" class="clearfix">
          <span class="lineStyle">▍</span><span>数据统计</span>
        </div>
        <div id="chart2" style="width: 100%; height: 300px"></div>
      </el-card>
    </el-col>
    <el-col :span="8" >
      <el-card>
    <div slot="header" class="clearfix">
            <span class="lineStyle">▍</span><span>近期新建任务数</span>
            <!-- <el-select class="chartSelect" v-model="charttype" placeholder="请选择" size="mini" @change="changeChart">
              <el-option v-for="item in chartOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option> -->
            <!-- </el-select> -->
            <div id="chartBox" style="height: 400px;width: 500px;">
            <TaskCountChart :task-data="formattedChartData" />
           
          </div>
      </div>
    
     
    
    
    </el-card>
      </el-col>
    <!-- <el-col :span="8" >
      <el-card>
        <div slot="header" class="clearfix">
          <span class="lineStyle">▍</span><span>近期任务数</span>
        </div>
        <div id="chart3" style="width: 100%; height: 300px"></div>
      </el-card>
    </el-col> -->
    <!-- <el-col :span="8">
      <el-card style="margin-right: 5px;margin-top: 2px;">
        <div slot="header" class="clearfix">
          <span class="lineStyle">▍</span><span>数据统计</span>
        </div>
        <div id="chart4" style="width: 100%; height: 300px;"></div>
      </el-card>
    </el-col> -->
    <el-col :span="24">
    <div class="bottomStatistic">
      <el-card class="bottom_statistic_card">
        <div slot="header" class="clearfix">
          <span class="lineStyle">▍</span><span>正负样本占比</span>
        </div>
        <div id="chartBox">
          <Bar  v-if="this.bar_x.length !==0 && this.bar_pos.length!==0 && this.bar_neg.length!=0" style="height: 400px;width: 1400px;" :bar_x="bar_x" :bar_neg="bar_neg" :bar_pos="bar_pos">
          </Bar>
        </div>
      </el-card>
    </div></el-col>
  </el-row>

</template>

<script>
import TaskCountChart from '@/components/tab/subcomponents/TaskCountChart.vue';
import { getRequest, postRequest } from "@/utils/api";
import Bar from "@/components/tab/subcomponents/Bar.vue";
import LineChartVue from "@/components/tab/subcomponents/LineChart.vue";
export default {
  name: "index",
  components: {  Bar ,LineChartVue,TaskCountChart},
  
  data() {
    return {
      formattedChartData: [  ],
      
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
          title: "空间层次效应",
          img: require("../../assets/dataManage.png"),
          router: "/DisFactor",
        },
        {
          title: "数据管理",
          img: require("../../assets/ModelManage.png"),
          router: "/data/newdatas",
        },
        {
          title: "模型管理",
          img: require("../../assets/mutipile.png"),
          router: "/model/list",
        },
        {
          title: "任务日志",
          img: require("../../assets/feiai.png"),
          router: "/task/newlist",
        },
      ],
    };
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
      getRequest("admin/index/getCausalRelationshipsNum").then((response => {
        this.causalRelationshipsNum = response;
      }))
    },

    getDataNum(){
      getRequest("admin/index/getDataNum").then((response => {
        this.dataNum = response;
      }))
    },
    changeChart() {
      switch (this.charttype) {
        case 1: {
          this.chartLegend = ["当天任务数"];
          this.chartData = this.taskTotal;
          break;
        }
        case 2: {
          this.chartLegend = this.modelName;
          this.chartData = this.taskModel;
          break;
        }
      }
    },
    getMiningNum(){
      getRequest("admin/index/getMiningNum").then((response => {
        this.miningNum = response;
      }))
    },

    getAlgorithmNum(){
      getRequest("admin/index/getAlgorithmNum").then((response => {
        this.algorithmNum = response;
      }))
    },

    async getAll() {
      postRequest("admin/index/getAllRelationships", {}).then(
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
      await postRequest("admin/index/getData", {}).then(
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
      await postRequest("admin/index/getPriorData", {}).then(
        (response) => {
          this.pirorKnowledge = response
          var lenDiabetes = 0
          var lenLung = 0
          var lenProstate = 0
          var lenColorectal = 0
          var lenHypertension = 0

          for(var p in this.pirorKnowledge){
            if(this.pirorKnowledge[p].diseaseName == "糖尿病"){
              lenDiabetes++
            }
            else if(this.pirorKnowledge[p].diseaseName == "肺癌"){
              lenLung++
            }
            else if(this.pirorKnowledge[p].diseaseName == "前列腺癌"){
              lenProstate++
            }
            else if(this.pirorKnowledge[p].diseaseName == "结直肠癌"){
              lenColorectal++
            }
            else if(this.pirorKnowledge[p].diseaseName == "高血压"){
              lenHypertension++
            }
          }
          this.priorChart.diabetes = lenDiabetes
          this.priorChart.lung = lenLung
          this.priorChart.prostate = lenProstate
          this.priorChart.colorectal = lenColorectal
          this.priorChart.hypertension = lenHypertension

          console.log(this.priorChart.diabetes)
        }
      )
      getRequest("/admin/stastic/get_pos_neg").then(
        (res) => {
          console.log('正负样本',res)
          if (res.code == 200) {
              this.bar_x=Object.keys(res.data);
              let array = Object.values(res.data);
              for (let index = 0; index < array.length; index++) {
                  const element = array[index];
                  this.bar_neg.push(element.neg);
                  this.bar_pos.push(element.pos);
              }
              console.log('this.bar_neg',this.bar_neg)
              console.log('this.bar_pos',this.bar_pos)
          }
          else {
            this.$message.error("获取数据失败");
          }
        }
      );
    },
    init() {
  getRequest("/admin/stastic/7DaysAlgorithmUsage").then((res) => {
    console.log('原始返回结果:', res);

    res.forEach((dayData) => {
      this.formattedChartData.push({
        formattedDate: dayData.formattedDate,
        total: dayData.total,
      });
    });

    console.log('处理后的formattedChartData:', this.formattedChartData);
  }).catch((error) => {
    console.error('请求失败:', error);
  });
},


    drawChart1() {
      this.myChart1 = this.$echarts.init(document.getElementById("chart1"));

      var option;
      option = {
      
      title: {
    text: '数据集使用分布',
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
          type: 'value',
          boundaryGap: [0, 0.01]
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
    drawChart3() {
      this.myChart3 = this.$echarts.init(document.getElementById("chart3"));

      var option;
      option = {
  xAxis: {
    type: 'category',
    data: ['3-22', '3-23', '3-24', '3-25', '3-26', '3-27', '3-28']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [1, 2, 5, 3, 2, 1, 3],
      type: 'line',
      symbol: 'triangle',
      symbolSize: 20,
      lineStyle: {
        color: '#5470C6',
        width: 4,
        type: 'dashed'
      },
      itemStyle: {
        borderWidth: 3,
        borderColor: '#EE6666',
        color: 'yellow'
      }
    }
  ]
      };

      this.myChart3.setOption(option);
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
      this.drawChart3();
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