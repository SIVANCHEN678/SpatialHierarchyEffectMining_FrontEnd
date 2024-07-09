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
    socialConnection: String,
    causalRelationships: Array
  },
    data() {
      return {
        name:'task1',
        relationships:[],
        y:null,
        s:null,
        shui:null,
        requestForm:{
          clinicalRepresentation: null,
          livingHabit: null,
          socialConnection: null,
          causalRelationships: null
        }
      
        
       
      };
    },
    methods: {


        async getAll() {
          this.requestForm.clinicalRepresentation = this.clinicalRepresentation
          this.requestForm.livingHabit = this.livingHabit
          this.requestForm.socialConnection = this.socialConnection
          this.requestForm.causalRelationships = this.causalRelationships
          console.log('！！！！！！！！this.requestForm,',this.requestForm)
          await  postRequest('api/mining/getPie/',this.requestForm).then(
        (response) => {
          if(response.code === 200){
            this.relationships = response.data
            console.log('this.relationships.临床表征',this.relationships)

          this.y=this.relationships.clinicalRepresentation
          this.s=this.relationships.livingHabit
          this.shui=this.relationships.socialConnection
          }
          

          
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
          top: '3%',
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
              { value: this.shui, name: '社会环境', itemStyle: { color: '#fff8DC' }},
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