<template>
   <div v-if="loading" class="loading">
    <!-- 这里放置加载动画的内容 -->
    <div class="loader"></div>
    <el-icon-loading>loading</el-icon-loading>
  </div>
  <div v-else>
    <el-card style="margin-right: 20px ;height: 250px; margin-top: 30px;">
      <div slot="header" class="clearfix">
              <span class="lineStyle">▍</span><span class="featureTitle">任务信息</span>
              <el-button type="primary" @click="exportToPDF">导出结果</el-button>
        <el-button type="primary" @click="totask">查看任务</el-button>
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
                
                style="margin-right: 30px;margin-top: 50px;margin-left:10px; height: 500px;"
             
              >   <el-button @click="exportToCSV" type="primary">导出数据</el-button>
             
                <el-table
              :data="patientTable"
              v-if="dataTableVision"
              style="width: 100%; margin-top: 20px"
              max-height="450px"
              border
              stripe
              v-loading="getData_loading"
              element-loading-text="正在获取数据"
              element-loading-spinner="el-icon-loading"
            >
              <el-table-column type="index"> </el-table-column>
              <el-table-column
                v-for="(key, index) in Object.keys(patientTable[0])"
                :key="index"
                :label="key"
                :prop="key"
              >
      </el-table-column>
    </el-table>
              </el-card>

    <el-row :gutter="40" class="panel-group">
      
      <div class="zhanshi"><el-col :span="12">
        <el-card style="margin-right: 20px ;height: 600px; margin-top: 50px;">
                <div slot="header" class="clearfix">
                  <span class="lineStyle">▍</span><span class="featureTitle">因果关系展示</span>
                </div>
                <div class="header" >
                  <div class="aa" style="margin-left: 100px">
                   
                  <el-button type="success" round plain  style="border-radius: 20px; background-color: #D3FF93;">生活行为习惯</el-button>
                  <el-button type="default" round plain  style="border-radius: 20px; background-color: #FFD6E7; color: hsl(0, 30%, 95%);">社会环境</el-button>
                  <el-button type="warning" round plain  style="background-color: 	#CAFFFF;">临床表征</el-button>
                  <el-button type="danger" round  >{{this.xin.city}}</el-button></div>
                  
                </div>   
                <div id="container" ref="container" >

                </div>
               
               
              </el-card>  </el-col>

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
     
        </div> </el-row>


    <el-row :gutter="40" class="panel-group">
      
  <div class="zhanshi">
       
       
        <el-card style="margin-right: 50px;margin-top: 50px;margin-left:30px; height: 350px;">
          <div slot="header" class="clearfix">
            <span class="lineStyle">▍</span><span class="featureTitle">空间层次效应挖掘</span>
          </div>
          <div>
              <el-header>
               
                  <h3>该数据的因果关系如下</h3>
                  <el-divider></el-divider>
              </el-header>
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
import XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import G6 from '@antv/g6';
import { postRequest, getRequest } from "@/utils/api";
import FileSaver from 'file-saver'; // 首先确保引入了FileSaver库
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
export default {
  data() {
    return {
      xin:null,
      loading: true ,// 初始加载状态为 true
      causalRelationshipsForm: {
          relationship: null,
          diseaseName: null,
           patientTable: [], // 假设这是你的表格数据
          tableName: null,
          algorithmName: null,
          priorKnowledgeName: null
        },
      qrcodeSrc: require('@/assets/she/she.png'),
      isIndeterminate: true,
      choice: 'cls',
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
  mounted() {
    this.form = this.$route.query.form;
    this.xin= this.form;
    console.log('这个form',this.form)
    this.$nextTick(() => {
      if (document.getElementById("chart3")) {
        this.drawChart3()
       
      }
    })
   this.getAllRelationships();

  this.g6();
  console.log('结点', this.data.nodes);
  console.log('边', this.data.edges);
  this.getData(this.tableName11);
 // this.qrcodeSrc= require('../../../assets/batch.png') // 图片路径,
},

created() {
  setTimeout(() => {
      // 将 loading 状态设置为 false，表示加载完成
      this.loading = false;
    }, 5000); // 模拟加载需要的时间，例如 2000ms

      this.form = this.$route.query.form
      this.getAllRelationships();
      this.getImage();
},
  methods: {
    
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

    async getImage(){
    

       getRequest("admin/mining/getImage/"+this.form.tableName+this.choice).then(
      response =>{
          this.qrcodeSrc = "data:image/png;base64," + response;
          console.log("已传递")
      }
  )      
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
      // 将表格数据转换为二维数组
      const tableData = this.patientTable.map(row => Object.values(row));

      // 添加表头
      const header = Object.keys(this.patientTable[0]);
      tableData.unshift(header);

      // 创建工作簿
      const workbook = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(tableData);

      // 添加工作表到工作簿
      XLSX.utils.book_append_sheet(workbook, ws, 'Patient Data');

      // 导出为CSV文件
      const wbout = XLSX.write(workbook, { bookType: 'csv', type: 'binary' });
      const filename = 'patient_data.csv';

      // 转换为二进制流并下载
      const blob = new Blob([this.s2ab(wbout)], { type: "application/octet-stream" });
      FileSaver.saveAs(blob, filename);
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
    initGraph() {
      const nodes = this.data.nodes;
      console.log('swiud',nodes)
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
      console.log('ddd',container)

      const width = container.clientWidth;
      const height = container.clientHeight || 500;

      const graph = new G6.Graph({
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
          center: [width / 2 - 50, height / 2], // 将中心位置左移200像素
          clusterSpacing: 25, // 设置每个聚类中节点之间的间距
        },
        animate: true,
        defaultNode: {
          size: 50,
        },
        defaultEdge: {
          style: {
            endArrow: {
              path: 'M 0,0 L 8,4 L 8,-4 Z',
              fill: '#e2e2e2',
            },
          },
        },
      });

      graph.data(this.data);
      graph.render();

      if (typeof window !== 'undefined') {
        window.onresize = () => {
          if (!graph || graph.get('destroyed')) return;
          if (!container || !container.clientWidth || !container.clientHeight) return;
          graph.changeSize(container.clientWidth, container.clientHeight);
        };
      }
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
                this.$message.success("保存成功")
                setTimeout(() => {
            // 在这里执行页面跳转
            this.$router.push({ path: '/relationships' });
        }, 3000);
                this.$router.push({ path: '/relationships' })
              
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
  animation: spin 1s linear infinite; /* 定义旋转动画 */
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
    font-weight: bold;
    font-size: 10px;
  }
  .el-table thead tr:first-child th {
    font-weight: bold;
  }

  /* 或者全局修改所有表格表头 */
  .el-table thead tr th {
    font-weight: bold;
   
  }
</style>
