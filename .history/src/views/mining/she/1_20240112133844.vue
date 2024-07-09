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
                <el-select  v-model="graghChoice" placeholder="请选择相应的空间层次" @change="drawChart3" style="margin-right: 200px; float: right;">
                  <el-option
                    v-for="item in graghOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>  <div id="container" ref="container" >
       </div>
              <div id="chart3" style="width: 100%; height: 600px"></div>
            </el-card>
      </div>
      </div>
  </template>
  
  <script>
  import G6 from '@antv/g6';
  
  export default {
    data() {
      return {
        data: {
          // ... 节点和边数据
          nodes: [
      {
        id: '0',
        label: '0',
        cluster: 'a',
      },
      {
        id: '1',
        label: '1',
        cluster: 'a',
      },
      {
        id: '2',
        label: '2',
        cluster: 'a',
      },
      {
        id: '3',
        label: '3',
        cluster: 'a',
      },
      {
        id: '4',
        label: '4',
        cluster: 'a',
      },
      {
        id: '5',
        label: '5',
        cluster: 'a',
      },
      {
        id: '6',
        label: '6',
        cluster: 'a',
      },
      {
        id: '7',
        label: '7',
        cluster: 'a',
      },
      {
        id: '8',
        label: '8',
        cluster: 'a',
      },
      {
        id: '9',
        label: '9',
        cluster: 'a',
      },
      {
        id: '10',
        label: '10',
        cluster: 'a',
      },
      {
        id: '11',
        label: '11',
        cluster: 'a',
      },
      {
        id: '12',
        label: '12',
        cluster: 'a',
      },
      {
        id: '13',
        label: '13',
        cluster: 'b',
      },
      {
        id: '14',
        label: '14',
        cluster: 'b',
      },
      {
        id: '15',
        label: '15',
        cluster: 'b',
      },
      {
        id: '16',
        label: '16',
        cluster: 'b',
      },
      {
        id: '17',
        label: '17',
        cluster: 'b',
      },
      {
        id: '18',
        label: '18',
        cluster: 'c',
      },
      {
        id: '19',
        label: '19',
        cluster: 'c',
      },
      {
        id: '20',
        label: '20',
        cluster: 'c',
      },
      {
        id: '21',
        label: '21',
        cluster: 'c',
      },
      {
        id: '22',
        label: '22',
        cluster: 'c',
      },
      {
        id: '23',
        label: '23',
        cluster: 'c',
      },
      {
        id: '24',
        label: '24',
        cluster: 'c',
      },
      {
        id: '25',
        label: '25',
        cluster: 'c',
      },
      {
        id: '26',
        label: '26',
        cluster: 'c',
      },
      {
        id: '27',
        label: '27',
        cluster: 'c',
      },
      {
        id: '28',
        label: '28',
        cluster: 'c',
      },
      {
        id: '29',
        label: '29',
        cluster: 'c',
      },
      {
        id: '30',
        label: '30',
        cluster: 'c',
      },
     
    ],edges: [
      {
        source: '0',
        target: '1',
      },
      {
        source: '0',
        target: '2',
      },
      {
        source: '0',
        target: '3',
      },
      {
        source: '0',
        target: '4',
      },
      {
        source: '0',
        target: '5',
      },
      {
        source: '0',
        target: '7',
      },
      {
        source: '0',
        target: '8',
      },
      {
        source: '0',
        target: '9',
      },
      {
        source: '0',
        target: '10',
      },
      {
        source: '0',
        target: '11',
      },
      {
        source: '0',
        target: '13',
      },
      {
        source: '0',
        target: '14',
      },
      {
        source: '0',
        target: '15',
      },
      {
        source: '0',
        target: '16',
      },
      {
        source: '2',
        target: '3',
      },
      {
        source: '4',
        target: '5',
      },
      {
        source: '4',
        target: '6',
      },
      {
        source: '5',
        target: '6',
      },
      {
        source: '7',
        target: '13',
      },
      {
        source: '8',
        target: '14',
      },
      {
        source: '9',
        target: '10',
      },
      {
        source: '10',
        target: '22',
      },
      {
        source: '10',
        target: '14',
      },
      {
        source: '10',
        target: '12',
      },
      {
        source: '10',
        target: '24',
      },
      {
        source: '10',
        target: '21',
      },
      {
        source: '10',
        target: '20',
      },
      {
        source: '11',
        target: '24',
      },
      {
        source: '11',
        target: '22',
      },
      {
        source: '11',
        target: '14',
      },
      {
        source: '12',
        target: '13',
      },
      {
        source: '16',
        target: '17',
      },
      {
        source: '16',
        target: '18',
      },
      {
        source: '16',
        target: '21',
      },
      {
        source: '16',
        target: '22',
      },
      {
        source: '17',
        target: '18',
      },
      {
        source: '17',
        target: '20',
      },
      {
        source: '18',
        target: '19',
      },
      {
        source: '19',
        target: '20',
      },
      {
        source: '19',
        target: '33',
      },
      {
        source: '19',
        target: '22',
      },
      {
        source: '19',
        target: '23',
      },
      {
        source: '20',
        target: '21',
      },
      {
        source: '21',
        target: '22',
      },
      {
        source: '22',
        target: '24',
      },
      {
        source: '22',
        target: '25',
      },
      {
        source: '22',
        target: '26',
      },
      {
        source: '22',
        target: '23',
      },
      {
        source: '22',
        target: '28',
      },
      {
        source: '22',
        target: '30',
      },
  
   
   
      {
        source: '23',
        target: '28',
      },
      {
        source: '23',
        target: '27',
      },
      {
        source: '23',
        target: '29',
      },
      {
        source: '23',
        target: '30',
      },
   
     
     
    ],
        },
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
    mounted() {
        console.log(this.data.nodes)
        console.log(this.data.edges)
      this.initGraph();
    },
    methods: {
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
            size: 20,
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