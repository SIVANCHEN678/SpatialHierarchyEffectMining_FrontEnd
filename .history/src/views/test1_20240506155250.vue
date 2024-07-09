<template>
  <div style="width:800px;height:600px" ref="chartsDOM"></div>
  <div v-if="currentClickedCity" class="zi" style="margin-left: 5%;margin-top: 1%;">
    <p>当前点击的地区：{{ currentClickedCity }}</p>
  </div>
</template>

<script>
import * as echarts from "echarts";
import map from "@/json/map.json";

export default {
  data() {
    return {
      currentClickedCity: '',
    };
  },
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
          // 添加点击事件处理函数
          // event 参数包含了事件信息，其中的 data 包含了点击的区域信息
          // 更新 currentClickedCity 数据并在页面展示
          // 可以根据需要进行逻辑处理
          // 这里示例直接取省份名称作为当前点击地区的信息
          // 实际情况根据地图数据结构可能会有所不同
          // 可以通过 console.log(event) 查看具体数据结构
          event: {
            'click': (event) => {
              if (event.data) {
                this.currentClickedCity = event.data.name;
              }
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
.zi {
  font-size: 20px;
  color: #237ec4;
}
</style>
