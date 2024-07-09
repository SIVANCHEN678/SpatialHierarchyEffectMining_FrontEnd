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
      geo: {
        map: 'GX',
        roam: true, // 开启地图缩放和平移
        zoom: 1.2, // 默认缩放比例
        label: {
          show: true
        },
        itemStyle: {
          areaColor: '#ff7f50',
          borderColor: '#999',
          borderWidth: 0.5
        }
      },
      series: [
        {
          name: '中国地图',
          type: 'map',
          map: 'GX',
          label: {
            show: true
          },
          data: [
            { name: '广西', value: 100 },
            // 其他省份数据...
          ],
          visualMap: {
            min: 0,
            max: 200,
            calculable: true,
            inRange: {
              color: ['#e0ffff', '#006edd']
            },
            textStyle: {
              color: '#fff'
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
