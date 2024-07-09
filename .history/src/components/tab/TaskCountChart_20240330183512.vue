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
    updateChartData(data, option = null) {
      // 将任务数据转换成 ECharts 图表所需格式
      let xAxisData = data.map(item => item.xAxisLabel); // 假设这是 x 轴标签
      let seriesData = data.map(item => item.seriesValue); // 假设这是系列数据

      // 更新或创建选项
      if (option) {
        option.xAxis.data = xAxisData;
        option.series[0].data = seriesData;
      } else {
        const newOption = {
          xAxis: { data: xAxisData },
          series: [{ data: seriesData }],
        };
        this.chartInstance.setOption(newOption);
      }

      // 自动适应容器大小
      this.chartInstance.resize();
    },
  },
  beforeDestroy() {
    if (this.chartInstance) {
      this.chartInstance.dispose();
    }
  },
};
</script>