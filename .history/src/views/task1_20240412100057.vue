<template>
    <div id="chart"></div>
  </template>
  
  <script>
  
  import ECharts from 'echarts';
import { getRequest, postRequest } from '@/api/user';
  
  export default {
    data() {
      return {

        relationships:[],


        clinicalRepresentation:'Pregnancies,BMI,',
        livingHabit:'BloodPressure,DiabetesPedigreeFunction,Outcome,Glucose,SkinThickness,Age,',
        socialConnection:'Insulin,',
      };
    },
    methods: {


        async getAll() {
            postRequest('admin/mining/getPie/'+this.clinicalRepresentation+'/'+this.livingHabit+'/'+this.socialConnection).then(
        (response) => {
          this.relationships = response.data
          console.log(this.relationships)

         
    
        }
      )
     
    
     
    },

      createOption() {
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
                { value: 1048, name: 'Search Engine' ,itemStyle: { color: '#ff7f50' }},
                { value: 735, name: 'Direct',itemStyle: { color: '#ff735a' } },
                { value: 580, name: 'Email' ,itemStyle: { color: '#7fff00' }},
               
              ]
            }
          ]
        };
      },
      initChart() {
        const chart = ECharts.init(document.getElementById('chart'));
        chart.setOption(this.createOption());
      }
    },
    mounted() {

        this.getAll().then(() => {
            this.initChart();
      
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