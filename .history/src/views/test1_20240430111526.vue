<template>

<!-- 
  <div ref="ct" style="width: 100% ; height: 100%;" >
    
    <el-button @click="back1()" type="success">上一步</el-button>
    <el-button @click="next()" type="primary">确认当前选择地区</el-button>
    <div v-if="currentClickedCity" class="zi" style="margin-left: 5%;margin-top: 1%;">
      
      <p>当前点击的地区：{{ currentClickedCity }}</p>
    </div>
    

    
 -->
   
    <div style="width:800px;height:600px" ref="chartsDOM"></div> 

 

</template>
<script>

import mixins from "@/components/mixins/mixins";

import { getMap } from "@/components/mixins/maputils";
import { left } from "@antv/g2plot/lib/plots/sankey/sankey";
import vuex_mixin from "@/components/mixins/vuex_mixin";
import * as echarts from "echarts";
import { resetForm, debounce } from "@/components/mixins/mixin.js";

import getGuangXiMap  from "@/api/getGuangXiMap"
import map from "@/json/map.json"

export default {
  
  data() {
    return {
      currentClickedCity: '',
      citylist: [{ 中国: "401200965" }],
      lastCity: {},
      index:1,
    };
  },
  mounted(){
  
    // 初始化统计图对象
    var myChart = echarts.init(this.$refs["chartsDOM"]);
    // 显示 loading 动画
    myChart.showLoading();
    // 再得到数据的基础上，进行地图绘制
    getGuangXiMap.then(res => {
      // 得到结果后，关闭动画
      myChart.hideLoading();
      // 注册地图(数据放在axios返回对象的data中哦)
      echarts.registerMap('GX', res.data);
      var option = {
        series: [
          {
            name: '中国地图',
            type: 'map',
            map: 'GX',// 这个是上面注册时的名字哦，registerMap（'这个名字保持一致'）
            label: {
              show: true
            }
          }
        ]
      };
      myChart.setOption(option);
    })
  },

  
  methods: {
    back(){
      this.m_changeStep(this.m_step - 1);
  this.$router.push('/DisFactor')
      
},
back1(){
  this.m_changeStep(2);
  this.$router.push('/DisFactor')
},
   
  },
};

</script>

<style lang="scss">

.chinaMapBox {
  width: 50%;
 
}
.zi{
  font-size: 20px;
  color: #237ec4;
}
</style>

