<template>
  <div style="width:800px;height:600px" ref="chartsDOM"></div>
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
      series: [
        {
          name: '中国地图',
          type: 'map',
          map: 'GX',
          label: {
            show: true
          },
          // 设置地图样式和颜色
          itemStyle: {
            areaColor: '#f5f5f5', // 地图区域的填充颜色
            borderColor: '#999', // 地图区域的边框颜色
            borderWidth: 0.5 // 地图区域的边框宽度
          },
          data: [
            { name: '广西', value: 100 }, // 示例数据，可以根据实际情况设置
            // 其他省份数据...
          ],
          // 可以根据数据设置不同区域的颜色，例如通过 visualMap
          visualMap: {
            min: 0,
            max: 200,
            calculable: true,
            inRange: {
              color: ['#e0ffff', '#006edd'] // 范围内颜色渐变
            },
            textStyle: {
              color: '#fff' // 文字颜色
            }
          }
        }
      ]
    };
    myChart.setOption(option);
    myChart.hideLoading();
  },
};
</script>

<style lang="scss">
.chinaMapBox {
  width: 50%;
}
</style>
