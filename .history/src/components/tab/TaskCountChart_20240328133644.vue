<!-- TaskCountChart.vue -->
<template>
  <div ref="chartContainer" style="width: 100%; height: 400px;"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'TaskCountChart',
  props: {
    taskData: {
      type: Array,
      required: true,
      default: () => [],
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
  beforeDestroy() {
    this.disposeChart();
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
      const reversedDates = this.taskData.slice().reverse().map(item => item.formattedDate);
      const counts = this.taskData.slice().reverse().map(item => item.total);

      const option = {
        xAxis: {
          type: 'category',
          data: reversedDates,
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: counts,
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

      this.chartInstance.setOption(option);
    },
    disposeChart() {
      if (this.chartInstance) {
        this.chartInstance.dispose();
        this.chartInstance = null;
      }
    },
  },
};
</script>