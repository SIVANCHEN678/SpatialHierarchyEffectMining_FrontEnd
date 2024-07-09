<template>
  <div style="width:1200px;height:1000px;margin-left: 10%;" ref="chartsDOM"></div>
</template>

<script>
import * as echarts from "echarts";
import map from "@/json/map.json";
import { getMap } from "@/components/mixins/maputils";
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
        }
      },
    };
    // 添加点击事件处理函数
    myChart.on('click', (params) => {
      if (params.name) {
        console.log('当前点击的城市：', params.name);
        // 这里可以根据当前点击的城市进行相应的逻辑处理
        // 例如获取下一级城市的数据，更新地图数据等操作
        const [grahpName, graphJson] = getMap(params.name);
        this.citylist.pop();
            // 很多操作重复了，你可以将公共部分抽离出来
            option.geo.map = grahpName;
            echarts.registerMap(grahpName, graphJson);
            this.charts.setOption(option, true);
      }
    });

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
