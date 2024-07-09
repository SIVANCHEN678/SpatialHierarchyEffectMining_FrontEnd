<template>
   <div v-if="loading" class="loading">
    <!-- 这里放置加载动画的内容 -->
    <div class="loader"></div>
    <el-icon-loading>loading</el-icon-loading>
  </div>
  <div v-else>
    <el-card style="margin-right: 2% ;height: 250px; margin-top: 30px;margin-left: 1%;">
      <div slot="header" class="clearfix">
              <span class="lineStyle">▍</span><span class="featureTitle"><strong>疾病危险因素因果关系挖掘信息</strong></span>
              <el-button type="primary" @click="back()" style="margin-left: 60%;">返回</el-button>
              <el-button type="primary" @click="exportToPDF()" >导出结果</el-button>
        <!-- <el-button type="primary" @click="totask">查看任务</el-button> -->
        </div> 
        <div class="taskBox1">
        <div class="taskInfoBox taskname">
          <span class="lineStyle">▍</span><span class="featureTitle"><strong>任务名称：</strong></span>
          <span class="featureTitle"> {{this.xin.name}} </span>
        </div>
     
        <div class="taskInfoBox participants">
          <span class="lineStyle">▍</span><span class="featureTitle"><strong>任务类型：</strong></span>
          <span class="featureTitle"> {{this.xin.type}}</span>
        </div>
        <div class="taskInfoBox principal">
          <span class="lineStyle">▍</span><span class="featureTitle"><strong>任务负责人：</strong></span>
          <!-- <span>{{ }}</span> --><span class="featureTitle"> {{this.xin.leader}} </span>
        </div>
        <div class="taskInfoBox disease">
          <span class="lineStyle">▍</span><span class="featureTitle"><strong>研究病种：</strong></span>
          <span class="featureTitle">{{ this.xin.diseaseName }}</span>

        </div>
        <div class="taskInfoBox dataset">
          <span class="lineStyle">▍</span><span class="featureTitle"><strong>所用数据：</strong></span>
          <span class="featureTitle">{{ this.xin.tableName }}</span>
        </div>
        <div class="taskInfoBox algorithm">
          <span class="lineStyle">▍</span><span class="featureTitle"><strong>所用算法：</strong></span>
          <span class="featureTitle">{{ this.xin.algorithmId }}</span>
        </div>
      </div>

 
    
    </el-card>
    <el-card 
                style="margin-right: 30px;margin-top: 50px;margin-left:10px; height: 650px;"
             
              >  <div slot="header" class="clearfix">
                 <span class="lineStyle">▍</span><span class="featureTitle"><strong>因果关系展示</strong></span>
                 <span class="featureTitle">▍点击下列按钮查看对应因果关系  </span>
               </div>
                <el-col :span="24"> 
       
               <div class="header" >
                 <div class="aa" style="margin-left: 30%">
                  
                 <el-button type="success" round plain @click="csvDialogVisible = true" style="border-radius: 20px; background-color: #D3FF93; ">生活行为习惯</el-button>
                 <el-button type="default" round plain @click="csvDialogVisible = true" style="border-radius: 20px; background-color: #FFD6E7; color: hsl(0, 30%, 95%);">社会环境</el-button>
                 <el-button type="warning" round plain @click="csvDialogVisible = true" style="background-color: 	#CAFFFF;">临床表征</el-button>
                 <el-button type="danger" round v-if="this.xin.province !== null && this.xin.province !== ''">
                         {{ this.xin.province }}
                       </el-button>
                       <el-button type="danger" round v-if="this.xin.city !== null && this.xin.city !== ''">
                         {{ this.xin.city }}
                       </el-button>
                       <el-button type="danger" round v-if="this.xin.county !== null && this.xin.county !== ''">
                         {{ this.xin.county }}
                       </el-button>

                       <el-dialog title="请选择详细查看的关系" :visible.sync="csvDialogVisible" width="60%" :before-close="handleCloseCSV"> 
                        
                        <el-row :gutter="4">
                            <h5 class="text" style="font-size: 20px;margin-bottom: 10px; font-weight: bold;">
                              <span class="lineStyle">▍</span>临床表征指标  <el-checkbox  :indeterminate="isIndeterminate3" v-model="selectAlll" @change="handleSelectAlll" /> 全选
                            </h5>
                            <el-col :span="24">

                                          <el-checkbox-group v-model="selectedclinical" @change="handleChangeClinical">
                                        <el-checkbox class="checkbox-item" v-for="item in clinical"  :label="item" :key="item">{{item}}</el-checkbox>
                                      </el-checkbox-group>

                            </el-col>
                          </el-row>
                      
                      <el-divider></el-divider>
          <!-- 社会环境指标 -->
          <el-row :gutter="4">
          <h5 class="text" style="font-size: 20px; font-weight: bold;"> <span class="lineStyle">▍</span>社会环境指标
            <el-checkbox :indeterminate="isIndeterminate1" v-model="selectAlls" @change="handleSelectAlls" /> 全选
          </h5>
           
        
          <el-col :span="24">

            <el-checkbox-group v-model="selectedsociol" @change="handleChangesocial">
            <el-checkbox class="checkbox-item" v-for="item in sociolOptions"  :label="item" :key="item">{{item}}</el-checkbox>
            </el-checkbox-group>

            </el-col>

        </el-row>
          <el-divider></el-divider>
          <!-- 生活行为习惯指标 -->
          <el-row :gutter="4">
            <h5 class="text" style="font-size: 20px; font-weight: bold;"> <span class="lineStyle">▍</span>生活行为习惯指标
              <el-checkbox v-model="selectAllss" :indeterminate="isIndeterminate2" @change="handleSelectAllss" /> 全选
            </h5>
            
            <el-col :span="24">
                             
              <el-checkbox-group v-model="selectedliving" @change="handleChangeliving">
            <el-checkbox class="checkbox-item" v-for="item in livingHabit"  :label="item" :key="item">{{item}}</el-checkbox>
            </el-checkbox-group>
          
         
            </el-col>
          </el-row>
          <span slot="footer" class="dialog-footer">
                          <el-button @click="handleCloseCSV">取 消</el-button>
                          <el-button type="primary" @click="find()">确定</el-button>
                        </span>
                      
                      </el-dialog>
</div>
                 
               </div>   
               <!-- <div v-if="isLoading" class="loading-container"> -->
                 <!-- <el-spinner class="loading-spinner" />
                 <p>Loading...</p> -->
               <!-- </div> -->
               <div class="tablePlaceholder" v-if="close1">
                  请等待！！ 正在加载
                </div>
                <div id="container" ref="container" v-if="!close1">
                  <!-- 这里是你的布局内容 -->
                </div>

               
            
              </el-col> 
      </el-card>

    <el-row :gutter="40" class="panel-group" v-show="showPanel">
     
      
      <div class="zhanshi"   v-if="exits1">
    

              <el-col :span="12">
           <el-card style="margin-right: 2% ;height: 600px; margin-top: 50px;margin-left: 1%;">
            <div slot="header" class="clearfix">
              <span class="lineStyle">▍</span><span class="featureTitle"><strong>疾病危险因素空间层次效应可视化展示</strong></span>
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
              <span class="lineStyle">▍</span><span class="featureTitle"><strong>各层次因果关系统计</strong></span>
            </div>
            <!-- <div id="main" style="width: 600px; height: 400px;"></div> -->

             <task1 v-if="causalOptions.length > 0" :clinical-representation="form.clinicalRepresentation"
             :living-habit="form.livingHabit"
             :social-connection="form.socialConnection"
             :causalRelationships="causalOptions"/>
          </el-card> 
         </el-col>
    
        </div> 
       
      
      </el-row>

    <el-row :gutter="40" class="panel-group">
      
  <div class="zhanshi">
       
       
        <el-card style="margin-right: 2%;margin-top: 10px;margin-left:2%; height: 350px;">
          <div slot="header" class="clearfix">
            <span class="lineStyle">▍</span><span class="featureTitle"><strong>选择要保存的因果关系</strong></span>
          </div>
          <div>
              <!-- <el-header>
               
                 <h3>该数据的因果关系如下</h3>
                  <el-divider></el-divider>
              </el-header> -->
          </div>
          <div id="mainform" font-size="60px">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" >全选</el-checkbox>
            <el-button type="primary" @click="save" size="mini">保存</el-button>
              <div style="margin: 15px 0;"></div>
              <el-checkbox-group v-model="checkedRelationships" @change="handleCheckedCitiesChange">
                <el-checkbox v-for="causal in causalOptions" :label="causal" :key="causal">{{causal}}</el-checkbox>
            </el-checkbox-group>
          <!-- <div id="center">
                <el-button type="primary" @click="save" style="margin-top: 20px;">保存</el-button>
            </div> -->
          </div>
        </el-card>

 
    </div> </el-row>
   
    </div>
</template>

<script>
  import ECharts from 'echarts';
import * as echarts from 'echarts';
import XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import G6 from '@antv/g6';
import { postRequest, getRequest } from "@/utils/api";

import FileSaver from 'file-saver'; // 首先确保引入了FileSaver库
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { Parser } from 'json2csv';
import task from '@/views/task.vue';
import task1 from '@/views/task1.vue';
export default {
  components: { task1 },
  data() {
    return {
      selectAlll: false, // 全选状态
      selectAlls: false, // 全选状态
      selectAllss: false, // 全选状态
      find1:false,
      selectedclinical: [], // 选中的临床表征指标
      selectedsociol: [], // 选中的临社会指标
      selectedliving: [], // 选中的人口指标

      showPanel: true, // 或者 false，三层
      //获取登录用户的id
      userid: sessionStorage.getItem("userid"),
      exits1:false,
      isIndeterminate3: false,
      isIndeterminate1:false,
      isIndeterminate2:false,

      requstForm:{
        stringFactor: null,
        diseaseName: null,
        listStr: null,
        uid: sessionStorage.getItem("userid")
      },
      sociolOptions:null,
      livingHabit:null,
      clinical:null,
      csvDialogVisible: false,
      relationships:[],
        y:1,
        s:2,
        shui:3,
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
     // tableName11:'lungcancer',
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
       close1:true,
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
   
  },
  mounted() {

    
  //this.getImage1()
    this.form = this.$route.query.form;//这里传整个表单过来
    if(this.form.type=="临床表征-疾病危险因素因果关系挖掘"){
  this.exits1=false
}else{
  this.exits1=true
}
    this.xin= this.form;
    console.log('这个form',this.form)
    this.getlayer()
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
  this.getData();

  this.getAll().then(() => {
        this.initAndRenderChart();
    })
},

created() {
  setTimeout(() => {
      // 将 loading 状态设置为 false，表示加载完成
      this.loading = false;
    }, 2000); // 模拟加载需要的时间，例如 2000ms

      this.form = this.$route.query.form

      this.getAllRelationships();
      this.getAll().then(() => {
        this.initAndRenderChart();
    })
    this.getlayer()
      this.getImage();
      this.$nextTick(() => {
      setTimeout(() => {
        this.isLoading = false;
      }, 1000); // 设置3秒后隐藏加载动画
      // 如果有异步数据请求或其他初始化操作，确保在此处执行
    });
    
},
  methods: {

 
   find(){
    this.csvDialogVisible=false,
this.g6find();
this.initGraph();

   },

    handleSelectAlll(val) {
        this.selectedclinical = val ? this.clinical : [];
        this.isIndeterminate3 = false;
      },
      handleChangeClinical(item, isChecked) {
    // 更新单个选项的状态
    this.$set(this.selectedclinical, item, isChecked);

    // 计算已选中项的数量
    let checkedCount = Object.values(this.selectedclinical).filter(Boolean).length;

    // 更新全选按钮的状态
    this.selectAlll = checkedCount === this.clinical.length; // 如果所有选项都被选中，则全选按钮也被选中
    this.isIndeterminate3 = checkedCount > 0 && checkedCount < this.clinical.length; // 如果有部分选项被选中，则全选按钮处于不确定状态
  },




  handleSelectAlls(val) {
        this.selectedsociol = val ? this.sociolOptions : [];
        this.isIndeterminate = false;
      },
      handleChangeClinical(item, isChecked) {
    // 更新单个选项的状态
    this.$set(this.selectedsociol, item, isChecked);

    // 计算已选中项的数量
    let checkedCount = Object.values(this.selectedsociol).filter(Boolean).length;

    // 更新全选按钮的状态
    this.selectAlls = checkedCount === this.sociolOptions.length; // 如果所有选项都被选中，则全选按钮也被选中
    this.isIndeterminate = checkedCount > 0 && checkedCount < this.sociolOptions.length; // 如果有部分选项被选中，则全选按钮处于不确定状态
  },


  handleSelectAllss(val) {
        this.selectedliving = val ? this.livingHabit : [];
        this.isIndeterminate = false;
      },
      handleChangeliving(item, isChecked) {
    // 更新单个选项的状态
    this.$set(this.selectedliving, item, isChecked);

    // 计算已选中项的数量
    let checkedCount = Object.values(this.selectedliving).filter(Boolean).length;

    // 更新全选按钮的状态
    this.selectAllss = checkedCount === this.livingHabit.length; // 如果所有选项都被选中，则全选按钮也被选中
    this.isIndeterminate = checkedCount > 0 && checkedCount < this.livingHabit.length; // 如果有部分选项被选中，则全选按钮处于不确定状态
  },
  
 
//获取每层的特征
    getlayer(){
      const items  =this.form.socialConnection.split(',')
      this.sociolOptions = items.map(item => item.trim()).filter(item => item);


      const filteredItems1 =this.form.livingHabit.split(',')
      this.livingHabit = filteredItems1.map(item => item.trim()).filter(item => item);

      
      const filteredItems2 =this.form.clinicalRepresentation.split(',')
      this.clinical = filteredItems2.map(item => item.trim()).filter(item => item);


      console.log(this.sociolOptions,'this.sociolOptions')
      console.log(this.livingHabit,'this.livingHabit')
      console.log(this.clinical,'this.clinical')
    },
    handleCloseCSV() {
      this.selectedFields = [];
      this.csvDialogVisible = false;
    },



    async   initAndRenderChart() {
      console.log('初始')
      const chart = ECharts.init(document.getElementById('chart'));

      const option = {
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
                fontSize: 20,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: this.y, name: '临床表征', itemStyle: { color: '#ff7f50' }},
              { value: this.s, name: '生活行为习惯', itemStyle: { color: '#ff735a' }},
              { value: this.shui, name: '社会环境', itemStyle: { color: '#7fff00' }},
            ]
          }
        ]
      };

      chart.setOption(option);
    },



    initGraph() {
  this.find1 = true;
  this.close1 = false;
  const nodes = this.data.nodes;
  console.log('所选结点', nodes);
  console.log('所选边', this.data.edges);
  const clusterMap = new Map();
  let clusterId = 0;

  nodes.forEach((node) => {
    if (node.cluster && clusterMap.get(node.cluster) === undefined) {
      clusterMap.set(node.cluster, clusterId);
      clusterId++;
    }
    const cid = clusterMap.get(node.cluster);
    if (!node.style) {
      this.$set(node, 'style', {});
    }
    node.style.fill = this.colors[cid % this.colors.length];
    node.style.stroke = this.strokes[cid % this.strokes.length];
  });

  const container = this.$refs.container;
  const width = container.clientWidth;
  const height = container.clientHeight || 500;

  // 如果已经有了图形实例，则直接更新数据并重新渲染，否则创建新的图形实例
  if (this.graph) {
    this.graph.changeData(this.data);
    this.graph.render();
  } else {
    this.graph = new G6.Graph({
      container,
      width,
      height,
      modes: {
        default: ['drag-canvas', 'drag-node'],
      },
      layout: {
        type: 'fruchterman',
        gravity: 4,
        speed: 5,
        clustering: true,
        center: [width / 2, height / 2],
        clusterSpacing: 25,
      },
      animate: true,
      defaultNode: {
        size: 50,
      },
      defaultEdge: {
        style: {
          stroke: '#fa8072',
          endArrow: {
            path: 'M 0,0 L 8,4 L 8,-4 Z',
            fill: '#e2e2e2',
          },
        },
      },
    });

    this.graph.data(this.data);
    this.graph.render();
  }

  // 监听窗口大小变化
  if (typeof window !== 'undefined') {
    window.onresize = () => {
      if (!this.graph || this.graph.get('destroyed')) return;
      if (!container || !container.clientWidth || !container.clientHeight) return;
      this.graph.changeSize(container.clientWidth, container.clientHeight);
    };
  }
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

//     async  getImage1(){//请求一个固定图片
    

//       getRequest("admin/mining/getI").then(
//     response => {
//         // 检查response是否是有效的Base64字符串，如果不是，打印错误信息以调试
//         if (typeof response === 'string') {
//           console.log(response,111)
//           this.qrcodeSrc = "data:image/png;base64," +response; // 注意trim()用于去除可能存在的多余空白字符
//             console.log("已传递");
//         } else {
//             console.error("Invalid response from server:", response);
//         }
//     },
//     error => {
//         console.error("请求失败", error);
//     }
// );
// },
async getImage() {


  try {
    const response = await getRequest(`api/mining/getImage/${this.form.tableName}${this.choice}`);
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
      postRequest("api/mining/runing",this.form).then(
        
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
            this.data.edges.push(obj)//加入边g6的
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
            for (let item in clinicalNode) {
    // 判断 label 是否为空
    if (clinicalNode[item].trim() !== "") {
      const obj = {
        id: clinicalNode[item],
        label: clinicalNode[item],
        cluster: 'a'
      };
      this.data.nodes.push(obj);
    }
  }
          let liveNode = this.form.livingHabit.split(",")
          for (let item in liveNode) {
    // 判断 label 是否为空
    if (liveNode[item].trim() !== "") {
      const obj = {
        id: liveNode[item],
        label: liveNode[item],
        cluster: 'b'
      };
      this.data.nodes.push(obj);
    }
  }
          
          let socialNode = this.form.socialConnection.split(",")
          for (let item in socialNode) {
    // 判断 label 是否为空
    if (socialNode[item].trim() !== "") {
      const obj = {
        id: socialNode[item],
        label: socialNode[item],
        cluster: 'c'
      };
      this.data.nodes.push(obj);
    }
  }
        console.log(this.data.edges);
        },    



        g6find(){
          this.data.nodes=[],
          console.log(this.data.nodes,'结点情况')
            const clinicalNode = this.selectedclinical
          for(let item in clinicalNode){
            const obj = {
                id: clinicalNode[item],
                label: clinicalNode[item],
                cluster: 'a'
              }
            
              this.data.nodes.push(obj)
           
          }
          let liveNode = this.selectedliving
          for(let item in liveNode){
            const obj = {
                id: liveNode[item],
                label: liveNode[item],
                cluster: 'b'
              }
             // this.nodesAntv.push(obj);
              this.data.nodes.push(obj)
            
          }
          
          let socialNode = this.selectedsociol
          for(let item in socialNode){
            const obj = {
                id: socialNode[item],
                label: socialNode[item],
                cluster: 'c'
              }
                this.data.nodes.push(obj)
         
          }

        console.log(this.data.edges,'边');
        },  


//         getData() {
   
//       this.getData_loading = true;
// //展示的数据
//       getRequest('api/mining/DataTable/getInfoByTableName/'+this.form.tableName
//        // tableName: tablename,
//     ).then((res) => {
//       console.log('shujuyulan')
//       console.log(res.data);
//         this.patientTable = res.data;
//         this.getData_loading = false;
//         this.dataTableVision = true;
//       })}, 

      save(){
        let context= this.form.socialConnection+this.form.livingHabit+this.form.clinicalRepresentation

        this.requstForm.stringFactor = context
        this.requstForm.diseaseName = this.form.diseaseName
        this.requstForm.listStr = this.causalOptions
        this.userid = sessionStorage.getItem("userid")
        postRequest("api/knowledgeGraph/saveCausalityArray",this.requstForm
       // tableName: tablename,
        ).then((res) => {
            if(res.code === 200){
              this.$message.success("因果关系保存成功")
              this.$router.push({ path: '/knowledgeGraph/Charts' })

            }else{
              this.$message.error("因果关系保存失败")
            }
        })
      },
    
//     async save(){
//       let context= this.form.socialConnection+this.form.livingHabit+this.form.clinicalRepresentation

//       // 封装第二层的请求
//       this.requstForm.stringFactor = context
//       this.requstForm.diseaseName = this.form.diseaseName
//       this.requstForm.listStr = this.causalOptions
//       console.log("HHHHHH",this.requstForm.listStr)
//       console.log("zzzzzz",this.requstForm.stringFactor)


//       console.log('abc',context)
//      let diseaseName=this.form.diseaseName
//      console.log('diseaseName.',diseaseName)
//           for(var causal in this.causalOptions){
//             this.causalRelationshipsForm.relationship = this.causalOptions[causal];
//             this.causalRelationshipsForm.diseaseName = this.form.diseaseName;
//             this.causalRelationshipsForm.algorithmName = this.form.algorithmId;
//             this.causalRelationshipsForm.tableName = this.form.tableName;
//             this.causalRelationshipsForm.priorKnowledgeName = this.form.priorKnowledge;

// console.log('因果关系明细',this.causalRelationshipsForm.relationship)

// //保存第一层
// await this.saveFirst()
  
// let relations=this.causalOptions
// console.log('relations,',relations)
// //保存第二层
//  postRequest(`api/knowledgeGraph/saveFactor2Factor`, this.requstForm).then(
//             response =>{
//               console.log('第二层',response.data)
//               if (response.code == "200") {
//             //    this.$router.push({ path: '/relationships'})
//                this.$message.success("保存成功")
              
//                 this.$router.push({ path: '/knowledgeGraph/Charts' })
              
//               }
//               else{
//                this.$message.error("第二层保存失败")
//               }
//             }
//           )


//         //     postRequest("admin/mining/save", this.causalRelationshipsForm).then(
//         //     response =>{
//         //       if (response.code == "200") {
//         //         // this.$router.push({ path: '@/views/relationships/index'})
//         //         this.$message.success("保存成功")
//         //         setTimeout(() => {
//         //     // 在这里执行页面跳转
//         //     this.$router.push({ path: '/relationships' });
//         // }, 3000);
//         //         // this.$router.push({ path: '/knowledgeGraph/Charts' })
              
//         //       }
//         //       else{
//         //         this.$message.error("保存失败")
//         //       }
//         //     }
//         //   )
       
//           }
//         },

        saveFirst(){
          let context= this.form.socialConnection+this.form.livingHabit+this.form.clinicalRepresentation
          let diseaseName=this.form.diseaseName
          getRequest(`api/knowledgeGraph/saveDisease2Factor/${context}/${diseaseName}/${this.userid}`).then(
            response =>{
              console.log('第一层',response.data)
              if (response.code == "200") {
                // this.$router.push({ path: '@/views/relationships/index'})
              //  this.$message.success("保存成功")
              
                // this.$router.push({ path: '/knowledgeGraph/Charts' })
              
              }
              else{
              //  this.$message.error("第一层保存失败")
              }
            }
          )
        },

      
back(){
  this.$router.push({ path: '/DisFactor'})
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
  width: 10%;
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
.tablePlaceholder {
  height: 100%;
  text-align: center;
  line-height: 600px;
  background-color: rgba(179, 178, 178, 0.144);
  font-weight: bold;
  color: rgba(58, 57, 57, 0.651);
  user-select: none;
  margin-top: 20px;
}
.featureTitle {
  font-size: 20px;
  margin-right: 30px;
  margin-bottom: 20px;
}

h3 {
  display: inline;
  margin-right: 15%;
}
#chart {
    width: 100%;
    height: 400px;
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
/* 假设这是在全局样式文件或组件的<style>标签内 */
.checkbox-item {
  display: inline-block; /* 使元素成为内联块级元素，便于控制宽度 */
  width: 300px; /* 设定每个复选框的宽度，根据实际需要调整 */
  margin-right: 10px; /* 控制复选框间的水平间距 */
}

/* 假设这是在全局样式文件或组件的<style>标签内 */

</style>
