<template>
    <div id="chart"></div>
  </template>
  
  <script>
  
import ECharts from 'echarts';
import { getRequest, postRequest } from '@/api/user';
  
  export default {
    props: {
    clinicalRepresentation: String,
    livingHabit: String,
    socialConnection: String
  },
    data() {
      return {
        name:'task1',
        relationships:[],
        y:null,
        s:null,
        shui:null,
      
        
       
      };
    },
    methods: {


        async getAll() {
          console.log('this.clinicalRepresentation,',this.clinicalRepresentation)
          await   postRequest('admin/mining/getPie/'+this.clinicalRepresentation+'/'+this.livingHabit+'/'+this.socialConnection).then(
        (response) => {
          this.relationships = response.data
          console.log('this.relationships.临床表征',this.relationships.临床表征)

         this.y=this.relationships.临床表征
         this.s=this.relationships.生活行为习惯
         this.shui=this.relationships.社会环境

          
        }
      )
     
     
     
    },


    async   initAndRenderChart() {
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
                fontSize: 25,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: this.y, name: '临床表征', itemStyle: { color: '#ffd9e6' }},
              { value: this.s, name: '生活行为习惯', itemStyle: { color: '#ff735a' }},
              { value: this.shui, name: '社会环境', itemStyle: { color: '#7fff00' }},
            ]
          }
        ]
      };

      chart.setOption(option);
    }
    },


    created() {
      this.getAll().then(() => {
        this.initAndRenderChart();
    })
    }
  };
  </script>
  
  <style scoped>
  #chart {
    width: 100%;
    height: 400px;
  }
  </style>