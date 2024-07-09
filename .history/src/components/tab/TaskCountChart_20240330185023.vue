<!-- TaskCountChart.vue -->
<template>
  <div ref="chartContainer" style="width: 100%; height: 400px;"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  props: {
    taskData: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      chartInstance: null,
    };
  },
  mounted() {
    this.initChart();
  },
  updated() {
    if (this.chartInstance && this.taskData.length > 0) {
      this.updateChartData();
    }
  },
  methods: {
    initChart() {
      this.chartInstance = echarts.init(this.$refs.chartContainer);
      this.updateChartData();
    },
    updateChartData() {
      // 获取横轴数据
      const xAxisData = this.taskData.map(item => item.formattedDate);
      
      // 获取系列数据
      const seriesData = this.taskData.map(item => item.total);

      // 构建option对象
      const option = {
        xAxis: {
          type: 'category',
          data: xAxisData,
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: seriesData,
            type: 'line',
            smooth: true,
            lineStyle: {
              color: '#5470c6',
            },
            symbol: 'emptyCircle',
            symbolSize: 8,
          },
        ],
        tooltip: {
          trigger: 'axis',
        },
      };

      // 设置并更新图表数据
      if (this.chartInstance) {
        this.chartInstance.setOption(option, true); // 第二个参数为true表示强制重绘
        this.chartInstance.resize(); // 调整图表大小以适应容器
      } else {
        console.error('ECharts实例未初始化');
      }
    },
  },
  beforeDestroy() {
    if (this.chartInstance) {
      this.chartInstance.dispose();
    }
  },
};
</script>