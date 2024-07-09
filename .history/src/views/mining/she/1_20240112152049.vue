<template>
    <div>
  
    <div class="zhanshi">
      <el-card style="margin-right: 20px ;height: 600px; margin-top: 550px;">
              <div slot="header" class="clearfix">
                <span class="lineStyle">▍</span><span>因果关系展示</span>
              </div>
              <div class="header">
                <el-button type="primary" round>社会环境</el-button>
    <el-button type="success" round>生活行为习惯</el-button>
    <el-button type="warning" round>临床表征</el-button>
              
              </div>  <div id="container" ref="container" >
       </div>
              <div id="chart3" style="width: 100%; height: 600px"></div>
            </el-card>
      </div>
      </div>
  </template>
  
  <script>
  import G6 from '@antv/g6';

import { postRequest, getRequest } from "@/utils/api";
  export default {
    data() {
      return {
        data: {
          // ... 节点和边数据
          nodes:[],edges:[],
        },nodeid:0,
        colors: [
          // ... 一组颜色
          '#FFD8B8',
    '#00FFFF',
    '#FFD6E7',
    '#BDEFDB',
    '#FBE5A2',
    '#C2C8D5',
    '#F6C3B7',
    '#B6E3F5',
    '#D3C6EA',
    '#FFD8B8',
    '#AAD8D8',
    '#FFD6E7',
        ],
        strokes: [
          // ... 一组边框颜色
          '#FF9D4D',
    '#5B8FF9',
    '#FF99C3',
    '#5AD8A6',
    '#F6BD16',
    '#5D7092',
    '#E8684A',
    '#6DC8EC',
    '#9270CA',
    '#FF9D4D',
    '#269A99',
    '#FF99C3',
  
        ],
      };
    },
    created(){
    this.form = this.$route.query.form
    this.getAllRelationships();
    this.g6();
    this.initGraph();
  },
    mounted() {
        console.log(this.data.nodes)
        console.log(this.data.edges)
      this.initGraph();
    },
    methods: {
        g6(){
            const clinicalNode = this.form.clinicalRepresentation.split(",")
          for(let item in clinicalNode){
            const obj = {
                id: this.nodeId,
                label: clinicalNode[item],
                cluster: 'a'
              }
             
           //    this.nodesAntv.push(obj);
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
                id: liveNode[item],
                label: socialNode[item],
                cluster: 'c'
              }
           //   this.nodesAntv.push(obj);
              this.data.nodes.push(obj)
         
          }
        },    getAllRelationships(){
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

            //this.links.push(obj)
            this.data.edges.push(obj)
          } 
          const ab={
            source: 'AlcoholUse',
              target:'Age'
          }
          this.data.edges.push(ab)
          console.log("边目标",this.data.edges)
        },
      )
    },
      initGraph() {
        const nodes = this.data.nodes;
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
  
        const graph = new G6.Graph({
          container,
          width,
          height,
          modes: {
            default: ['drag-canvas', 'drag-node'],
          },
          layout: {
            type: 'fruchterman',
            gravity: 10,
            speed: 5,
            clustering: true,
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
  </style>