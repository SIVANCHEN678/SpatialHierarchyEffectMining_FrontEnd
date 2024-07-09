<!-- TaskCountChart.vue 组件 -->
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
  watch: {
    // 监听 taskData 的变化并更新图表
    taskData: {
      immediate: true,
      handler(newVal) {
        if (this.chartInstance && newVal.length > 0) {
          this.updateChartData(newVal);
        } else if (!this.chartInstance && newVal.length > 0) {
          this.initChart();
        }
      },
    },
  },
  methods: {
    initChart() {
      this.chartInstance = echarts.init(this.$refs.chartContainer);

      // 初始化图表配置，这里假设是折线图示例
      const option = {
        xAxis: {
          type: 'category',
          data: [], // 这里应该填充 x 轴对应的标签数据
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: [], // 这里应该填充实际的数值数据
            type: 'line',
          },
        ],
      };

      this.updateChartData(this.taskData, option);
      this.chartInstance.setOption(option);
    },
    updateChartData(taskData) {
  const xAxisData = taskData.map(item => item.formattedDate);
  const seriesData = taskData.map(item => item.total);

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

  if (this.chartInstance) {
    this.chartInstance.setOption(option, true); // 第二个参数为true，表示强制重绘
  } else {
    this.initChart();
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