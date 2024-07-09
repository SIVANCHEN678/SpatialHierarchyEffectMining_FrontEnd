<template>
  <div class="content">
    <div ref="charts" style="width: 1000px; height: 800px"></div>
  </div>
</template>


<script>

import zhongguo from "@/assets/mapJson/data-city.json"
import * as echarts from "echarts";

import { getMap } from "@/components/mixins/maputils";
export default {
  created () {
    this.$nextTick(() => {
      this.initCharts();
    })
  },
  methods: {
    initCharts() {
    
      const charts = echarts.init(this.$refs["charts"]);
       
        // 不传name默认会返回中国地图
        const [mapName, mapJson] = getMap();
        option.geo.map = mapName;
        // 地图注册，第一个参数的名字必须和option.geo.map一致
        echarts.registerMap(mapName, mapJson);

        charts.setOption(option);

        charts.on("click", ({ name }) => {
    const [mapName, mapJson] = getMap(name);
    option.geo.zoom = 0.8;
    option.geo.map = mapName;
    // 为了重新定位，这里使用了length
    const idx = option.graphic.length + 1;
    option.graphic.push({
        type: "text",
        left: `${idx * 10}%`,
        top: "10%",
        style: {
            text: name,
            font: 'bolder 1.5rem "Microsoft YaHei", sans-serif',
            fill: "#fff",
        },
    });
    echarts.registerMap(mapName, mapJson);
    charts.setOption(option, true);
});


    
      const option = {
        // 背景颜色
        backgroundColor: "#404a59",
        
        // 提示浮窗样式
        tooltip: {
          show: true,
          trigger: "item",
          alwaysShowContent: false,
          backgroundColor: "#0C121C",
          borderColor: "rgba(0, 0, 0, 0.16);",
          hideDelay: 100,
          triggerOn: "mousemove",
          enterable: true,
          textStyle: {
            color: "#DADADA",
            fontSize: "12",
            width: 20,
            height: 30,
            overflow: "break",
          },
          showDelay: 100
        },
        series: [
          {
            type: "map",
            roam: true,
            zoom: 1,
            geoIndex: 0,
            label: {
              // 通常状态下的样式
              normal: {
                show: true,
                textStyle: {
                  color: "#fff",
                },
              },
              // 鼠标放上去的样式
              emphasis: {
                textStyle: {
                  color: "#640000",
                },
              },
            },

            data: this.echartsData,
          },
          {
            type: "scatter",
            coordinateSystem: "geo",
            // 定位角标
            symbol: "pin",
            legendHoverLink: true,
            symbolSize: [18, 24],
            tooltip: {
          show: true,
          trigger: "item",
          alwaysShowContent: false,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          padding: [0, 10, 8, 10],
          roam: true,
          hideDelay: 100,
          triggerOn: "mousemove",
          enterable: true,
          borderColor: "rgba(0, 0, 0, 0.7)",
          //解决浮窗被遮挡
          confine: true,
          textStyle: {
            color: "#fff",
            fontSize: "12",
            width: 20,
            height: 30,
            overflow: "break",
          },
              showDelay: 100,
            },
      
            label: {
              normal: {
                show: true,
                formatter(value) {
                  return value.data.value;
                },
                color: "#fff",
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                padding: [10, 20, 10, 20],
                fontSize: "14",
                show: false,
                borderRadius: 5,
              },
              emphasis: {
                show: true,
              },
            },
            itemStyle: {
              normal: {
                color: "#26D17B",
                borderColor: "#fff",
                borderWidth: 1,
              },
            },
    
            data: this.scatterData,
            showEffectOn: "render",
            rippleEffect: {
              brushType: "stroke",
            },
            hoverAnimation: true,
            zlevel: 1,
          },
        ],
        // 地图配置
        geo: {
          map: "china",
          label: {
            // 通常状态下的样式
            normal: {
              show: true,
              textStyle: {
                color: "#fff",
              },
            },
            // 鼠标放上去的样式
            emphasis: {
              textStyle: {
                color: "#fff",
              },
            },
          },
          // 地图区域的样式设置
          itemStyle: {
            normal: {
              borderColor: "rgba(147, 235, 248, 1)",
              borderWidth: 1,
              areaColor: {
                type: "radial",
                x: 0.5,
                y: 0.5,
                r: 0.8,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(147, 235, 248, 0)", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(147, 235, 248, .2)", // 100% 处的颜色
                  },
                ],
                globalCoord: false, // 缺省为 false
              },
              shadowColor: "rgba(128, 217, 248, 1)",
              shadowOffsetX: -2,
              shadowOffsetY: 2,
              shadowBlur: 10,
            },
            // 鼠标放上去高亮的样式
            emphasis: {
              areaColor: "#389BB7",
              borderWidth: 0,
            },
          },
        },
      };
      // 地图注册，第一个参数的名字必须和option.geo.map一致
      echarts.registerMap("china",zhongguo)

      charts.setOption(option);
    },
  },
};
</script>

