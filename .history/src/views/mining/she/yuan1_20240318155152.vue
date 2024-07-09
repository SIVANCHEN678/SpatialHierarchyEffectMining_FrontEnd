<template>
  <div>
    <el-card style="margin-right: 20px ;height: 300px; margin-top: 30px;">
      <div slot="header" class="clearfix">
              <span class="lineStyle">▍</span><span class="featureTitle">任务信息</span>
              <el-button type="primary" @click="exportToPDF">导出结果</el-button>
        <el-button type="primary" @click="totask">查看任务</el-button>
        </div>
        <div class="taskBox1">
        <div class="taskInfoBox taskname">
          <span class="lineStyle">▍</span><span class="featureTitle">任务名称：</span>
          <!-- <span>{{ taskName }}</span> -->
        </div>
        <div class="taskInfoBox principal">
          <span class="lineStyle">▍</span><span class="featureTitle">任务负责人：</span>
          <!-- <span>{{ }}</span> -->
        </div>
        <div class="taskInfoBox participants">
          <span class="lineStyle">▍</span><span class="featureTitle">参与人：</span>
          <!-- <span>{{  }}</span> -->
        </div>
        <div class="taskInfoBox disease">
          <span class="lineStyle">▍</span><span class="featureTitle">研究病种：</span>
          <!-- <span>{{ }}</span> -->
        </div>
        <div class="taskInfoBox dataset">
          <span class="lineStyle">▍</span><span class="featureTitle">所用数据：</span>
          <!-- <span>{{  }}</span> -->
        </div>
        <div class="taskInfoBox algorithm">
          <span class="lineStyle">▍</span><span class="featureTitle">所用算法：</span>
          <!-- <span>{{ }}</span> -->
        </div>
      </div>

      <div class="taskInfoBox use_features">
        <span class="lineStyle">▍</span><span class="featureTitle">所用特征：</span>
        <span>{{ }}</span>
      </div>
    
    

    
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
                  <el-button type="danger" round  >重庆</el-button></div>
                  
                </div>   
                <div id="container" ref="container" >

                </div>
               
               
              </el-card>  </el-col>
              <el-col :span="12">
        <el-card style="margin-right: 20px;margin-top: 50px;height: 600px;">
          <div slot="header" class="clearfix">
            <span class="lineStyle">▍</span><span class="featureTitle">空间层次效应挖掘</span>
          </div>
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
        </el-card></el-col>
     
        </div> </el-row>


    <el-row :gutter="40" class="panel-group">
      
  <div class="zhanshi"><el-col :span="12">
    <el-card style="margin-right: 20px ;height: 700px; margin-top: 50px;">
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
            <img :src="qrcodeSrc" alt="image" width="800" height="800" style="margin-top: -50px;">  
            </div>
           
           
          </el-card> 
         </el-col>
          <el-col :span="12">
            <el-card style="margin-right: 20px;margin-top: 50px;height: 700px;">
      <div slot="header" class="clearfix">
        <span class="lineStyle">▍</span><span class="featureTitle">各层关系展示</span>
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
      <div id="chart3" style="width: 80%; height: 380px ; margin-top: 80px;margin-left: 50px;"></div>
    </el-card></el-col>
 
    </div> </el-row>
    </div>
</template>

<script>
import G6 from '@antv/g6';
import { postRequest, getRequest } from "@/utils/api";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
export default {
  data() {
    return {
      
      causalRelationshipsForm: {
          relationship: null,
          diseaseName: null,
          tableName: null,
          algorithmName: null,
          priorKnowledgeName: null
        },
      qrcodeSrc: require('../../../assets/batch.png'), // 图片路径,
      isIndeterminate: true,
      choice: 'cls',
      myChart3: null,
      graghChoice: 'c',
      choice: null ,// 或者初始化为其他适当的默认值
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
    this.$nextTick(() => {
      if (document.getElementById("chart3")) {
        this.drawChart3()
       
      }
    })
   
    this.form = this.$route.query.form;
  this.getAllRelationships();

  this.g6();
  console.log('结点', this.data.nodes);
  console.log('边', this.data.edges);
  this.qrcodeSrc= require('../../../assets/batch.png') // 图片路径,
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
    totask(){
      this.$router.push({ path: '/task/newlist' })
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
    async getImage(){
    

    getRequest("admin/mining/getImage/"+this.form.tableName+this.choice).then(
      response =>{
          this.qrcodeSrc = "data:image/png;base64," + response;
          console.log("已传递")
      }
  )      
},
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

    getAllRelationships(){
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
          console.log("!!!!!!边",this.links)
          this.initGraph();
        },


        
      )
     
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
    },     save(){
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
</style>
