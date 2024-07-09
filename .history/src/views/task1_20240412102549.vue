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
        y:1,
        s:2,
        shui:3,

        clinicalRepresentation:'FrequentCold,chronicLungDisease,ChestPain,Fatigue,Wheezing,OccuPationalHazards,DryCough,Gender,SwallowingDifficulty,Snoring,ShortnessofBreath,DustAllergy,CoughingofBlood,ClubbingofFingerNails,Age,',
        livingHabit:'Obesity,AlcoholUse,WeightLoss,AirPollution,GeneticRisk,BalancedDiet,',
        socialConnection:'PassiveSmoker,Smoking,',
      };
    },
    methods: {


        async getAll() {
            postRequest('admin/mining/getPie/'+this.clinicalRepresentation+'/'+this.livingHabit+'/'+this.socialConnection).then(
        (response) => {
          this.relationships = response.data
          console.log(this.relationships.临床表征)

         this.y=this.relationships.临床表征,
         this.s=this.relationships.生活行为习惯
         this.shui=this.relationships.社会环境

    
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
      center: ['50%', '70%'],
      // adjust the start and end angle
      startAngle: 180,
      endAngle: 360,
              data: [
                { value: this.y, name: '临床表征' ,itemStyle: { color: '#ff7f50' }},
                { value: this.s, name: '生活行为习惯',itemStyle: { color: '#ff735a' } },
                { value: this.shui, name: '社会环境' ,itemStyle: { color: '#7fff00' }},
               
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
    async   mounted() {

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