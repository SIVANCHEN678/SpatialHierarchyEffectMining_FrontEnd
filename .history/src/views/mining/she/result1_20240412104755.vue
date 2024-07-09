<template>
   <div v-if="loading" class="loading">
    <!-- 这里放置加载动画的内容 -->
    <div class="loader"></div>
    <el-icon-loading>loading</el-icon-loading>
  </div>
  <div v-else>
    <el-card style="margin-right: 20px ;height: 250px; margin-top: 30px;">
      <div slot="header" class="clearfix">
              <span class="lineStyle">▍</span><span class="featureTitle">疾病危险因素挖掘信息</span>
              <el-button type="primary" @click="exportToPDF" style="margin-left: 70%;">导出结果</el-button>
        <!-- <el-button type="primary" @click="totask">查看任务</el-button> -->
        </div>
        <div class="taskBox1">
        <div class="taskInfoBox taskname">
          <span class="lineStyle">▍</span><span class="featureTitle">任务名称：</span>
          <span class="featureTitle"> {{this.xin.name}} </span>
        </div>
        <div class="taskInfoBox principal">
          <span class="lineStyle">▍</span><span class="featureTitle">任务负责人：</span>
          <!-- <span>{{ }}</span> --><span class="featureTitle"> {{this.xin.leader}} </span>
        </div>
        <div class="taskInfoBox participants">
          <span class="lineStyle">▍</span><span class="featureTitle">参与人：</span>
          <span class="featureTitle"> {{this.xin.participant}}</span>
        </div>
        <div class="taskInfoBox disease">
          <span class="lineStyle">▍</span><span class="featureTitle">研究病种：</span>
          <span class="featureTitle">{{ this.xin.diseaseName }}</span>

        </div>
        <div class="taskInfoBox dataset">
          <span class="lineStyle">▍</span><span class="featureTitle">所用数据：</span>
          <span class="featureTitle">{{ this.xin.tableName }}</span>
        </div>
        <div class="taskInfoBox algorithm">
          <span class="lineStyle">▍</span><span class="featureTitle">所用算法：</span>
          <span class="featureTitle">{{ this.xin.algorithmId }}</span>
        </div>
      </div>

 
    
    </el-card>
    <el-card 
                style="margin-right: 30px;margin-top: 50px;margin-left:10px; height: 650px;"
             
              >  <div slot="header" class="clearfix">
                 <span class="lineStyle">▍</span><span class="featureTitle">因果关系展示</span>
               </div>
                <el-col :span="24"> 
       
               <div class="header" >
                 <div class="aa" style="margin-left: 30%">
                  
                 <el-button type="success" round plain  style="border-radius: 20px; background-color: #D3FF93;">生活行为习惯</el-button>
                 <el-button type="default" round plain  style="border-radius: 20px; background-color: #FFD6E7; color: hsl(0, 30%, 95%);">社会环境</el-button>
                 <el-button type="warning" round plain  style="background-color: 	#CAFFFF;">临床表征</el-button>
                 <el-button type="danger" round v-if="this.xin.province !== undefined && this.xin.province !== ''">
                         {{ this.xin.province }}
                       </el-button>
                       <el-button type="danger" round v-if="this.xin.city !== undefined && this.xin.city !== ''">
                         {{ this.xin.city }}
                       </el-button>
                       <el-button type="danger" round v-if="this.xin.county !== undefined && this.xin.county !== ''">
                         {{ this.xin.county }}
                       </el-button>
</div>
                 
               </div>   
               <div v-if="isLoading" class="loading-container">
                 <el-spinner class="loading-spinner" />
                 <p>Loading...</p>
               </div>
             
               <div id="container" ref="container"></div>
            
              </el-col> 
      </el-card>

    <el-row :gutter="40" class="panel-group">
     
      
      <div class="zhanshi">
    

              <el-col :span="12">
    <el-card style="margin-right: 20px ;height: 600px; margin-top: 50px;">
            <div slot="header" class="clearfix">
              <span class="lineStyle">▍</span><span class="featureTitle">疾病危险因素空间层次效应可视化展示</span>
            </div>
            <el-select v-model="choice" placeholder="请选择相应的空间层次" @change="getImage" size="medium" style="margin-left: 200px;">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
         
         
                <div >

                  
                  <img :src="qrcodeSrc" v-if="qrcodeSrc" alt="image" width="600" height="600" style="margin-top: -50px;">
               
                </div>
                     
          </el-card> 
         </el-col>



         <el-col :span="12">
    <el-card style="margin-right: 20px ;height: 600px; margin-top: 50px;">
            <div slot="header" class="clearfix">
              <span class="lineStyle">▍</span><span class="featureTitle">各层次因果关系统计</span>
            </div>
            <!-- <div id="main" style="width: 600px; height: 400px;"></div> -->
            <div id="chart1" style="width: 100%; height: 400px"></div>     
          </el-card> 
         </el-col>
     
        </div> </el-row>

    <el-row :gutter="40" class="panel-group">
      
  <div class="zhanshi">
       
       
        <el-card style="margin-right: 50px;margin-top: 10px;margin-left:30px; height: 350px;">
          <div slot="header" class="clearfix">
            <span class="lineStyle">▍</span><span class="featureTitle">选择要保存的因果关系</span>
          </div>
          <div>
              <!-- <el-header>
               
                 <h3>该数据的因果关系如下</h3>
                  <el-divider></el-divider>
              </el-header> -->
          </div>
          <div id="mainform" font-size="60px">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" >全选</el-checkbox>
              <div style="margin: 15px 0;"></div>
              <el-checkbox-group v-model="checkedRelationships" @change="handleCheckedCitiesChange">
                <el-checkbox v-for="causal in causalOptions" :label="causal" :key="causal">{{causal}}</el-checkbox>
            </el-checkbox-group>
          <div id="center">
                <el-button type="primary" @click="save" style="margin-top: 20px;">保存</el-button>
            </div>
          </div>
        </el-card>

 
    </div> </el-row>
   
    </div>
</template>

<script>
import * as echarts from 'echarts';
import XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import G6 from '@antv/g6';
import { postRequest, getRequest } from "@/utils/api";

import FileSaver from 'file-saver'; // 首先确保引入了FileSaver库
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { Parser } from 'json2csv';
export default {
  data() {
    return {
      myChart1: null,
      chartData: [],//各层统计的信息
      xin:null,
      loading: true ,// 初始加载状态为 true
      causalRelationshipsForm: {
          relationship: null,
          diseaseName: null,
           patientTable: [], // 假设这是你的表格数据c:\Users\hp-pc\Pictures\1.png
          tableName: null,
          algorithmName: null,
          priorKnowledgeName: null
        },
        qrcodeSrc: require('../../../assets/she/she.png'), // 图片初始为空
        
        isLoading: true, // 页面加载时默认为加载状态，
      isIndeterminate: true,
    
      myChart3: null,
      graghChoice: 'c',
      tableName11:'lungcancer',
        data: {
            nodes:[],
            edges:[]
        },
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
      nodesAntv: [],
      nodesEchart: [],
      links: [],
       nodeId:0,
      graghChoice: null,
       choice:'s',
      checkAll: false,
      checkedRelationships: [],
      causalOptions:[],
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
      colors: [
        // ... 一组颜色
        '	#CAFFFF',
        '#D3FF93',
       '#FFD6E7',

      ],
      strokes: [
        // ... 一组边框颜色
         '#FFFFFF',
  //       '#FFFFB9',
  // '#FF99C3',


      ],
    };
  },
  computed: {
    option() {
      return {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 1048, name: 'Search Engine' },
              { value: 735, name: 'Direct' },
              { value: 580, name: 'Email' },
              { value: 484, name: 'Union Ads' },
              { value: 300, name: 'Video Ads' }
            ]
          }
        ]
      };
    }
  },
  mounted() {

  this.getImage1()
    this.form = this.$route.query.form;//这里传整个表单过来
    this.xin= this.form;
    console.log('这个form',this.form)
    this.$nextTick(() => {
      if (document.getElementById("chart3")) {
        this.drawChart3()
       
      }
    })
    this.$nextTick(() => {
      if (document.getElementById("main")) {
        this.initChart()
       
      }
    })
   this.getAllRelationships();

  this.g6();
  console.log('结点', this.data.nodes);
  console.log('边', this.data.edges);
  this.getData(this.tableName11);
  this.initChart();
  this.drawChart1();
 
},

created() {
  setTimeout(() => {
      // 将 loading 状态设置为 false，表示加载完成
      this.loading = false;
    }, 2000); // 模拟加载需要的时间，例如 2000ms

      this.form = this.$route.query.form

      this.getAllRelationships();
      
      this.getImage();
      this.$nextTick(() => {
      setTimeout(() => {
        this.isLoading = false;
      }, 10000); // 设置3秒后隐藏加载动画
      // 如果有异步数据请求或其他初始化操作，确保在此处执行
    });
    this.initChart();
    this.drawChart1();
},
  methods: {
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
      { value: 11, name: '糖尿病' ,itemStyle: { color: '#FF8C00' }},
              { value: 12, name: '肺癌' ,itemStyle: { color: '	#FFB5B5' }},
              { value: 13, name: '前列腺癌',itemStyle: { color: '#FFFFB9' } },
              { value: 14, name: '结直肠癌' ,itemStyle: { color: '#D9FFFF' }},	
              { value: 15, name: '高血压',itemStyle: { color: '#FFD0FF' } }
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
    initChart() {
      const chart = ECharts.init(document.getElementById('chart'));
      chart.setOption(this.option);
    }, 
    // initChart() {
    //   var chartDom = document.getElementById('main');
    //   var myChart = echarts.init(chartDom);
    //   var option;

    //   // 从后端获取数据
    //   postRequest('admin/mining/getPie/'+this.form.clinicalRepresentation+'/'+this.form.livingHabit+'/'+this.form.socialConnection

    //    // tableName: tablename,
    // )
    //     .then(response => {
    //       const data = response.data;
    //       console.log('各层关系',response.data)
          
    //       // 假设后端返回的数据格式是一个包含各个数据项的数组

    //       option = {
    //         tooltip: {
    //           trigger: 'item'
    //         },
    //         legend: {
    //           top: '5%',
    //           left: 'center'
    //         },
    //         series: [
    //           {
    //             name: 'Access From',
    //             type: 'pie',
    //             radius: ['40%', '70%'],
    //             avoidLabelOverlap: false,
    //             itemStyle: {
    //               borderRadius: 10,
    //               borderColor: '#fff',
    //               borderWidth: 2
    //             },
    //             label: {
    //               show: false,
    //               position: 'center'
    //             },
    //             emphasis: {
    //               label: {
    //                 show: true,
    //                 fontSize: 40,
    //                 fontWeight: 'bold'
    //               }
    //             },
    //             labelLine: {
    //               show: false
    //             },
    //             data: data // 将后端返回的数据填充到echarts的data中
    //           }
    //         ]
    //       };

    //       option && myChart.setOption(option); // 更新echarts图表
    //     })
    //     .catch(error => {
    //       console.error('Error fetching data:', error);
    //     });
    // },
 
  
  
    s2ab(s) {
      // 将字符串转换为 ArrayBuffer
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    },
 
    totask(){
      this.$router.push({ path: '/task/newlist' })
    },

    async  getImage1(){
    

      getRequest("admin/mining/getI").then(
    response => {
        // 检查response是否是有效的Base64字符串，如果不是，打印错误信息以调试
        if (typeof response === 'string') {
          console.log(response,111)
          this.qrcodeSrc = "data:image/png;base64," +response; // 注意trim()用于去除可能存在的多余空白字符
            console.log("已传递");
        } else {
            console.error("Invalid response from server:", response);
        }
    },
    error => {
        console.error("请求失败", error);
    }
);
},
async getImage() {


  try {
    const response = await getRequest(`admin/mining/getImage/${this.form.tableName}${this.choice}`);
    this.qrcodeSrc = `data:image/png;base64,${response}`;
    console.log(this.qrcodeSrc)
    console.log("已传递");
  } catch (error) {
    console.error('获取图片失败:', error);
  } 
  
},
// async getImage() {
//       this.qrcodeSrc = ''; // 清空旧图片
//       try {
//         const response = await getRequest(`admin/mining/getImage/${this.form.tableName}${this.choice}`);
//         if (response) {
//           this.qrcodeSrc = `data:image/png;base64,${response}`;
//           console.log("已传递");
//         }
//       } catch (error) {
//         console.error('获取图片失败:', error);
//       }
//     },
handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.causalOptions.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.causalOptions.length;
      },
handleCheckAllChange(val) {
        this.checkedRelationships = val ? this.causalOptions : [];
        this.isIndeterminate = false;
      },
drawChart3() {
          this.myChart3 = this.$echarts.init(document.getElementById("chart3"));

          console.log("边",this.links)

          this.nodesEchart = []
         
          if(this.graghChoice == "c"){
            const clinicalNode = this.form.clinicalRepresentation.split(",")

            const x = 500
            const y = 500
            const nodesLen = clinicalNode.length
            const avd = 360 / nodesLen;
            const ahd = avd * Math.PI / 180
            const radius = 20
            for(let item in clinicalNode){
        
              var xRandom = Math.sin((ahd*item))*radius + x
              var yRandom = Math.cos((ahd*item))*radius + y
              const obj = {
                name: clinicalNode[item],
                x: xRandom,
                y: yRandom
              }
              this.nodesEchart.push(obj)
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
              this.nodesEchart.push(obj)
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
              this.nodesEchart.push(obj)
            }
          }
          console.log("节点",this.nodesEchart)

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
                data : this.nodesEchart,
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

    getAllRelationships(){//关系挖掘   要从任务表中传过来from
      console.log('表格',this.form)
      postRequest("admin/mining/runing",this.form).then(
        
        response => {
          const options = response.data

          console.log("因果关系",options)
          this.causalOptions = options
          for (let re in options){
            var sc = options[re].split(" -> ")
            const obj = {
              source: sc[0],
              target: sc[1]
            }
            this.links.push(obj)
            this.data.edges.push(obj)
          } 
          console.log('feom')
          console.log(this.form)
          console.log("!!!!!!边",this.links)
          this.initGraph();
        },


        
      )
     
    },
    exportToCSV() {
  const fields = Object.keys(this.patientTable[0]);
  const opts = { fields };

  try {
    const parser = new Parser(opts);
    const csv = parser.parse(this.patientTable);

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(blob, 'patient_data.csv');
  } catch (err) {
    console.error(err.message);
  }
},
    s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    },
    g6(){
            const clinicalNode = this.form.clinicalRepresentation.split(",")
          for(let item in clinicalNode){
            const obj = {
                id: clinicalNode[item],
                label: clinicalNode[item],
                cluster: 'a'
              }
            
              this.data.nodes.push(obj)
           
          }
          let liveNode = this.form.livingHabit.split(",")
          for(let item in liveNode){
            const obj = {
                id: liveNode[item],
                label: liveNode[item],
                cluster: 'b'
              }
             // this.nodesAntv.push(obj);
              this.data.nodes.push(obj)
            
          }
          
          let socialNode = this.form.socialConnection.split(",")
          for(let item in socialNode){
            const obj = {
                id: socialNode[item],
                label: socialNode[item],
                cluster: 'c'
              }
                this.data.nodes.push(obj)
         
          }

        console.log(this.data.edges);
        },    
        getData() {
      console.log(this.tableName11)
      this.getData_loading = true;
//展示的数据
      getRequest('admin/mining/DataTable/getInfoByTableName/'+this.form.tableName
       // tableName: tablename,
    ).then((res) => {
      console.log('shujuyulan')
      console.log(res.data);
        this.patientTable = res.data;
        this.getData_loading = false;
        this.dataTableVision = true;
      })},
    
    save(){

          for(var causal in this.causalOptions){
            this.causalRelationshipsForm.relationship = this.causalOptions[causal];
            this.causalRelationshipsForm.diseaseName = this.form.diseaseName;
            this.causalRelationshipsForm.algorithmName = this.form.algorithmId;
            this.causalRelationshipsForm.tableName = this.form.tableName;
            this.causalRelationshipsForm.priorKnowledgeName = this.form.priorKnowledge;

console.log('因果关系明细',this.causalRelationshipsForm.relationship)

保存第一层
postRequest("/admin/knowledgeGraph/saveDisease2Factor", this.causalRelationshipsForm).then(
            response =>{
              if (response.code == "200") {
                // this.$router.push({ path: '@/views/relationships/index'})
                this.$message.success("保存成功")
                setTimeout(() => {
            // 在这里执行页面跳转
           // this.$router.push({ path: '/relationships' });
        }, 3000);
                this.$router.push({ path: '/knowledgeGraph/Charts' })
              
              }
              else{
                this.$message.error("保存失败")
              }
            }
          )










            postRequest("admin/mining/save", this.causalRelationshipsForm).then(
            response =>{
              if (response.code == "200") {
                // this.$router.push({ path: '@/views/relationships/index'})
                this.$message.success("保存成功")
                setTimeout(() => {
            // 在这里执行页面跳转
           // this.$router.push({ path: '/relationships' });
        }, 3000);
                this.$router.push({ path: '/knowledgeGraph/Charts' })
              
              }
              else{
                this.$message.error("保存失败")
              }
            }
          )
          }
        },

        exportToPDF() {
      // 获取要导出的页面内容的DOM元素
      const element = this.$el;

      // 使用 html2canvas 将页面内容渲染成图像
      html2canvas(element, { useCORS: true }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');

        // 计算 PDF 页面的尺寸和方向
        const pdf = new jsPDF({
          orientation: 'portrait', // 可以设置为 'landscape' 表示横向
          unit: 'pt', // 点（1/72英寸）
          format: 'a4' // 使用 A4 尺寸
        });

        // 将图像添加到 PDF 中
        pdf.addImage(imgData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());

        // 将 PDF 保存为文件
        pdf.save('exported-document.pdf');
      });
    },


  },
};
</script>

<style>
#chart {
  width: 100%;
  height: 400px;
}
#container {
  width: 100%;
  height: 100%;
  margin-left: 10px;
};
.zhanshi{
  margin-top: 100px;;
  height: 500px;
}
.taskBox1 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.taskInfoBox {
  margin-bottom: 20px;
}

.lineStyle {
  color: rgb(100, 172, 231);
  font-weight: 100;
  font-size: 25px;
}

.featureTitle {
  font-size: 25px;
  margin-right: 30px;
  margin-bottom: 20px;
}

h3 {
  display: inline;
  margin-right: 15%;
}
/* 首先包含原始样式 */
.loader {
  border: 4px solid #f3f3f3; /* 加载动画的边框 */
  border-top: 4px solid #3498db; /* 加载动画的顶部边框 */
  border-radius: 50%; /* 创建一个圆形 */
  width: 50px; /* 加载动画的宽度 */
  height: 50px; /* 加载动画的高度 */
  animation: spin 3s linear infinite; /* 定义旋转动画 */
}

/* 然后定义关键帧动画 */
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 如果需要兼容旧版浏览器，还需加上 vendor prefixes */
@-webkit-keyframes spin {
  to { -webkit-transform: rotate(360deg); }
}
@-moz-keyframes spin {
  to { -moz-transform: rotate(360deg); }
}
@-o-keyframes spin {
  to { -o-transform: rotate(360deg); }
}
@-ms-keyframes spin {
  to { -ms-transform: rotate(360deg); }
}
.graphBox {
  width: 100%;
  height: 40vh;

  margin-top: 20px;
}

.treeBox {
  width: 100%;
  height: 50vh;

  margin-top: 20px;
}

.buttonGroup {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  gap: 20px;
}

span {
  white-space: pre-wrap;
  word-wrap: break-word;
}
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 填充整个视口高度 */
}
 /* 仅针对当前组件内的表格 */
 .el-table th.is-leaf {

    font-size: 14px;
  }
  .el-table thead tr:first-child th {
    font-weight: bold;
  }

  /* 或者全局修改所有表格表头 */
  .el-table thead tr th {
    font-weight: bold;
   
  }
  .fade-enter-active,
.fade-leave-active {
  transition: opacity .5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.loading-mask {
  position: absolute;
  top: 0;
  left: 10%;
  width: 100%;
  
  height: 100%;
  background-color: rgba(49, 93, 182, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-container{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 10vh; /* 填充整个视口高度 */
  margin-top: 180px;
  margin-left: 100px;
 
}

</style>
