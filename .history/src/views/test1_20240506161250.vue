<template>
  <div style="width:1200px;height:1000px;margin-left: 10%;" ref="chartsDOM"></div>
</template>

<script>
import * as echarts from "echarts";
import map from "@/json/map.json";

export default {
  mounted() {
    var myChart = echarts.init(this.$refs["chartsDOM"]);
    myChart.showLoading();
    echarts.registerMap('GX', map);
    var option = {
      geo: {
        map: 'GX',
        roam: true, // 开启地图缩放和平移
        zoom: 1, // 默认缩放比例
        label: {
          show: true
        },
        itemStyle: {
            areaColor: '#ff7f50', // 地图区域的填充颜色
            borderColor: '#999', // 地图区域的边框颜色
            borderWidth: 0.5 // 地图区域的边框宽度
          },
      
      },
      
    };
    myChart.setOption(option);
    myChart.hideLoading();
  },
};
</script>

<style lang="scss">
.chinaMapBox {
  width: 100%;
  }
</style>
