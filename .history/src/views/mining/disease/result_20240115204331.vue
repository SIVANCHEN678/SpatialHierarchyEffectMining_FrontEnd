<template>
  <div>
    <el-header>
      <h3>疾病关联关系挖掘</h3>
      <el-divider></el-divider>
    </el-header>
    <el-row>
      <el-col :span="10">
        <el-card style="margin-right: 20px; height: 450px">
          <div style="margin-top: 20px">
            <el-form :inline="true">
              <el-form-item label="选择疾病">
                <el-cascader
                  style="width: 300px"
                  placeholder="试试搜索：心脑血管"
                  :options="diseaseShow"
                  :props="{ multiple: true }"
                  v-model="disShow"
                  clearable
                  collapse-tags
                  filterable
                ></el-cascader>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="checkDisease"
                  style="width: 50px"
                  size="small"
                  >查询</el-button
                >
              </el-form-item>
            </el-form>
            <el-table
              :data="tableData"
              border
              style="width: 100%"
              max-height="310"
            >
              <af-table-column
                fixed
                prop="diseaseName"
                label="疾病"
              ></af-table-column>
              <af-table-column prop="associationDisease" label="相关联疾病">
              </af-table-column>
              <el-table-column fixed="right" label="操作" width="70">
                <template slot-scope="{ row }">
                  <el-button
                    size="mini"
                    @click="showTableGraph(row.diseaseName)"
                    >展示</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
      <el-col :span="7">
        <el-card style="height: 450px; margin-right: 10px">
          <div slot="header" class="clearfix">
            <span class="lineStyle">▍</span><span>所选病种关联图谱展示</span>
          </div>
          <div id="chart1" style="width: 100%; height: 350px"></div>
        </el-card>
      </el-col>
      <el-col :span="7">
        <el-card style="height: 450px">
          <div slot="header" class="clearfix">
            <span class="lineStyle">▍</span><span>单病种关联图谱展示</span>
          </div>
          <div id="chart2" style="width: 100%; height: 350px"></div>
        </el-card>
      </el-col>
    </el-row>
    <div style="margin-top: 30px">
      <el-row>
        <el-col :span="24">
          <el-card
            shadow="hover"
            id="card4"
            class="chart-center"
            style="width: 100%"
          >
            <div style="width: 1100px">
              <span class="lineStyle">▍</span
              ><span>需要显示的关联边数量：</span>

              <el-button type="text" @click="reDraw(0.1)">前10%</el-button>
              <el-button type="text" @click="reDraw(0.25)">前25%</el-button>
              <el-button type="text" @click="reDraw(0.5)">前50%</el-button>
              <el-button type="text" @click="reDraw(0.75)">前75%</el-button>
              <el-button type="text" @click="reDraw(1)">全部</el-button>
            </div>
            <div style="width: 100%">
              <span class="lineStyle">▍</span><span>图谱统计信息：</span>
              <span>病种数量：{{ diseaseNum }}</span>
              <el-divider direction="vertical"></el-divider>
              <span>关联边数量：{{ associationNum }}</span>
            </div>
            <!-- <el-statistic
          group-separator=","
          :value="diseaseNum"
          title="病种数量"
        ></el-statistic>
        <el-statistic
          group-separator=","
          :value="associationNum"
          title="关联数量"
          style="font-size: medium"
        ></el-statistic> -->
            <!-- <el-row :gutter="20">
          <el-col :span="12">
            <el-select
              style="width: 300px"
              v-model="value"
              placeholder="请选择要展示的关联边的数量"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-button type="primary" @click="reDraw">确认</el-button>
          </el-col>
          <el-col :span="5">
            <div>
              <el-statistic
                group-separator=","
                :value="diseaseNum"
                title="病种数量"
              ></el-statistic>
            </div>
          </el-col>
          <el-col :span="5">
            <div>
              <el-statistic
                group-separator=","
                :value="associationNum"
                title="关联数量"
              ></el-statistic>
            </div>
          </el-col>
        </el-row> -->
            <div
              id="chart4"
              style="width: 100%; height: 1000px; margin-top: 30px"
            ></div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { postRequest } from "@/utils/api";
export default {
  data() {
    return {
      diseaseNum: null,
      associationNum: null,
      associationNum2: null,
      categoryNum: null,
      diseaseName: '',
      associationDisease: '',
      form: {
        id: null,
        name: null,
        type: null,
        description: null,
        disease: null,
        factor: null,
        tableName: null,
        algorithmName: null,
      },
      tableData: [],
      myChart4: {},
      myChart1: {},
      myChart2: {},
      graph: {},
      graph1: { nodes: [], links: [], categories: [] },
      graph2: { nodes: [], links: [], categories: [] },
      graphAll: {},
      options: [{
        value: 0.1,
        label: '前10%'
      }, {
        value: 0.25,
        label: '前25%'
      }, {
        value: 0.5,
        label: '前50%'
      }, {
        value: 0.75,
        label: '前75%'
      }, {
        value: 1,
        label: '前100%'
      }],
      value: null,
      disShow: [],
      diseaseShow: [{
        value: 'cardiovascular_cerebrovascular',
        label: '心脑血管',
        children: []
      }, {
        value: 'metabolic_system',
        label: '代谢系统',
        children: []
      }, {
        value: 'cancer',
        label: '恶性肿瘤',
        children: []
      }, {
        value: 'mental_disorder',
        label: '精神疾病',
        children: []
      }, {
        value: 'respiratory_system',
        label: '呼吸系统',
        children: []
      }, {
        value: 'others',
        label: '其他',
        children: []
      }],
      categories: [
        { name: "心脑血管疾病" }, { name: "代谢系统疾病" }, { name: "恶性肿瘤疾病" }, { name: "精神疾病" }, { name: "呼吸系统疾病" }, { name: "其他疾病" }
      ]
    };
  },
  created() {
    // console.log(this.$route.query.form)
    this.form = this.$route.query.form
    this.getGraph().then(() => {
      this.drawChart();
      this.getCheckDisease();
      this.defaultShow();
    }).catch((error) => {
      console.log(error)
    });
  },
  methods: {
    async getGraph() {
      await postRequest("mining/runing", this.form).then(
        response => {
          console.log(response)
          this.graphAll = response
          var lenD = 0
          var nodes = []
          // 删除孤立点
          for (var n in this.graphAll.nodes) {
            for (var l in this.graphAll.links) {
              if (this.graphAll.links[l].source == n || this.graphAll.links[l].target == n) {
                nodes.push(this.graphAll.nodes[n])
                break;
              }
            }
          }
          // 对每个节点根据关联数赋权值
          for (var e in nodes) {
            lenD++
            e
          }
          var a = 0
          if (lenD < 40) {
            a = 8
          } else if (lenD > 80) {
            a = 2
          } else {
            a = 4
          }
          var symbolSize = a
          for (n in this.graphAll.nodes) {
            for (l in this.graphAll.links) {
              if (this.graphAll.links[l].source == n || this.graphAll.links[l].target == n) {
                symbolSize += a
              }
            }
            this.graphAll.nodes[n].symbolSize = symbolSize
            symbolSize = a
          }
          this.graph.nodes = nodes
          this.graph.links = this.graphAll.links
          this.graph.categories = this.graphAll.categories
        })
      var lenD = 0
      for (var e in this.graph.nodes) {
        lenD++
        e
      }
      this.diseaseNum = lenD
      var lenA = 0
      for (var a in this.graph.links) {
        lenA++
        a
      }
      this.associationNum = lenA
      this.associationNum2 = lenA
      var lenC = 0
      for (var c in this.graph.categories) {
        lenC++
        c
      }
      this.categoryNum = lenC
    },
    getCheckDisease() {
      for (var n in this.graph.nodes) {
        var check = { value: null, label: null }
        if (this.graph.nodes[n].category == 0) {
          check.value = this.graph.nodes[n].name
          check.label = this.graph.nodes[n].name
          this.diseaseShow[0].children.push(check)
        } else if (this.graph.nodes[n].category == 1) {
          check.value = this.graph.nodes[n].name
          check.label = this.graph.nodes[n].name
          this.diseaseShow[1].children.push(check)
        } else if (this.graph.nodes[n].category == 2) {
          check.value = this.graph.nodes[n].name
          check.label = this.graph.nodes[n].name
          this.diseaseShow[2].children.push(check)
        } else if (this.graph.nodes[n].category == 3) {
          check.value = this.graph.nodes[n].name
          check.label = this.graph.nodes[n].name
          this.diseaseShow[3].children.push(check)
        } else if (this.graph.nodes[n].category == 4) {
          check.value = this.graph.nodes[n].name
          check.label = this.graph.nodes[n].name
          this.diseaseShow[4].children.push(check)
        } else if (this.graph.nodes[n].category == 5) {
          check.value = this.graph.nodes[n].name
          check.label = this.graph.nodes[n].name
          this.diseaseShow[5].children.push(check)
        }
      }
    },
    defaultShow() {
      var check = []
      for (var i in this.diseaseShow[0].children) {
        check[0] = 'cardiovascular_cerebrovascular'
        check[1] = this.diseaseShow[0].children[i].value
        this.disShow.push(check)
        check = []
        if (i >= 1) {
          break
        }
      }
      for (i in this.diseaseShow[1].children) {
        check[0] = 'metabolic_system'
        check[1] = this.diseaseShow[1].children[i].value
        this.disShow.push(check)
        check = []
        if (i >= 1) {
          break
        }
      }
      for (i in this.diseaseShow[2].children) {
        check[0] = 'cancer'
        check[1] = this.diseaseShow[2].children[i].value
        this.disShow.push(check)
        check = []
        if (i >= 1) {
          break
        }
      }
      for (i in this.diseaseShow[3].children) {
        check[0] = 'mental_disorder'
        check[1] = this.diseaseShow[3].children[i].value
        this.disShow.push(check)
        check = []
        if (i >= 1) {
          break
        }
      }
      this.checkDisease();
      this.showTableGraph(this.disShow[0][1]);

    },
    checkDisease() {
      // let dis = this.form.disease.split(",")
      // console.log(this.disShow.length)
      this.associationDisease = ''
      this.tableData = []
      this.graph1 = { nodes: [], links: [], categories: [] }
      var links = []
      var assDis = []
      var tableItem = { diseaseName: null, associationDisease: null }
      for (var i = 0; i < this.disShow.length; i++) {
        for (var j in this.graph.nodes) {
          if (this.graph.nodes[j].name == this.disShow[i][1]) {
            this.graph1.nodes.push(this.graph.nodes[j])
            break;
          }
        }
        for (var p in this.graph.links) {
          if (this.graph.links[p].source == this.graph1.nodes[i].id) {

            assDis.push("(" + this.graphAll.nodes[this.graph.links[p].target].name + "," + this.graph.links[p].value + ")")
            links.push(this.graph.links[p])
          } else if (this.graph.links[p].target == this.graph1.nodes[i].id) {
            assDis.push("(" + this.graphAll.nodes[this.graph.links[p].source].name + "," + this.graph.links[p].value + ")")
            links.push(this.graph.links[p])
          }
        }
        tableItem.diseaseName = this.disShow[i][1]
        tableItem.associationDisease = assDis
        this.tableData.push(tableItem)
        tableItem = []
        // this.associationDisease = this.associationDisease.concat((i + 1) + "." + this.disShow[i][1] + ":" + assDis.toString() + "\n")
        assDis = []
      }
      this.graph1.links = links
      console.log(this.graph1)
      this.drawChart1();
      this.showTableGraph(this.disShow[0][1])

    },
    showTableGraph(diseaseName) {
      this.graph2 = { nodes: [], links: [], categories: [] }
      var id
      var node = { id: null, name: null, value: null, symbolSize: null, label: null, category: null }
      for (var i in this.graph.nodes) {
        if (this.graph.nodes[i].name == diseaseName) {
          id = this.graph.nodes[i].id.toString()
          node.id = this.graph.nodes[i].id
          node.name = this.graph.nodes[i].name
          node.symbolSize = 15
          node.category = this.graph.nodes[i].category
          this.graph2.nodes.push(node)
          break
        }
      }
      node = { id: null, name: null, value: null, symbolSize: null, label: null, category: null }
      for (var j in this.graph.links) {
        if (this.graph.links[j].source == id) {
          this.graph2.links.push(this.graph.links[j])
          node.id = this.graphAll.nodes[this.graph.links[j].target].id
          node.name = this.graphAll.nodes[this.graph.links[j].target].name
          node.symbolSize = 6
          node.category = this.graphAll.nodes[this.graph.links[j].target].category
          this.graph2.nodes.push(node)
        } else if (this.graph.links[j].target == id) {
          this.graph2.links.push(this.graph.links[j])
          // node = this.graphAll.nodes[this.graph.links[j].source]
          node.id = this.graphAll.nodes[this.graph.links[j].source].id
          node.name = this.graphAll.nodes[this.graph.links[j].source].name
          node.symbolSize = 4
          node.category = this.graphAll.nodes[this.graph.links[j].source].category
          this.graph2.nodes.push(node)
        }
        node = { id: null, name: null, value: null, symbolSize: null, label: null, category: null }
      }
      // this.graph2.categories = this.graph.categories
      console.log(this.graph2)
      this.drawChart2();
    },
    
    reDraw(value) {
      this.associationNum = Math.ceil(value * this.associationNum2)
      var w
      if (value == 1) {
        w = 2
      } else if (value == 0.75) {
        w = 6
      } else if (value == 0.5) {
        w = 8
      } else if (value == 0.25) {
        w = 12
      } else if (value == 0.1) {
        w = 18
      }
      this.graph = { nodes: [], links: [], categories: [] }
      // this.graph.nodes = this.graphAll.nodes
      this.graph.categories = this.graphAll.categories
      for (var i = 0; i < this.associationNum; i++) {
        this.graph.links.push(this.graphAll.links[i])
      }
      var symbolSize = w
      var nodes = []
      var lenD = 0
      // 对每个节点根据关联数赋权值
      for (var n in this.graphAll.nodes) {
        for (var l in this.graph.links) {
          if (this.graph.links[l].source == n || this.graph.links[l].target == n) {
            symbolSize += w
          }
        }
        this.graphAll.nodes[n].symbolSize = symbolSize
        symbolSize = w
      }
      // 删除孤立点
      for (n in this.graphAll.nodes) {
        for (l in this.graph.links) {
          if (this.graph.links[l].source == n || this.graph.links[l].target == n) {
            nodes.push(this.graphAll.nodes[n])
            lenD++
            break;
          }
        }
      }
      this.diseaseNum = lenD
      this.graph.nodes = nodes
      this.drawChart();
      var diseaseShow = [{
        value: 'cardiovascular_cerebrovascular',
        label: '心脑血管',
        children: []
      }, {
        value: 'metabolic_system',
        label: '代谢系统',
        children: []
      }, {
        value: 'cancer',
        label: '恶性肿瘤',
        children: []
      }, {
        value: 'mental_disorder',
        label: '精神疾病',
        children: []
      }, {
        value: 'respiratory_system',
        label: '呼吸系统',
        children: []
      }, {
        value: 'others',
        label: '其他',
        children: []
      }]
      this.diseaseShow = diseaseShow
      this.getCheckDisease();
    },
    drawChart() {
      this.myChart4 = this.$echarts.init(document.getElementById("chart4"));

      this.graph.nodes.forEach(function (node) {
        node.label = {
          show: node.symbolSize > 20
        };
      });

      let option = {
        title: {
          text: '疾病关联图',
          subtext: 'Circular layout',
          top: 'bottom',
          left: 'right'
        },
        tooltip: {},
        legend: [
          {
            data: this.categories.map(function (a) {
              return a.name;
            })
          }
        ],
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
          {
            // name: 'Les Miserables',
            type: 'graph',
            layout: 'circular',
            circular: {
              rotateLabel: true
            },
            data: this.graph.nodes,
            links: this.graph.links,
            categories: this.categories,
            roam: true,
            label: {
              position: 'right',
              formatter: '{b}'
            },
            lineStyle: {
              color: 'source',
              curveness: 0.3
            },
            emphasis: {
              focus: 'adjacency',
              lineStyle: {
                width: 10
              }
            }
          }
        ]
      };
      this.myChart4.setOption(option);
    },
    drawChart1() {
      this.myChart1 = this.$echarts.init(document.getElementById("chart1"));

      this.graph1.nodes.forEach(function (node) {
        node.label = {
          show: node.symbolSize > 2
        };
      });

      let option = {
        tooltip: {},
        legend: [
          {
            data: this.graph1.categories.map(function (a) {
              return a.name;
            })
          }
        ],
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
          {
            // name: 'Les Miserables',
            type: 'graph',
            layout: 'circular',
            circular: {
              rotateLabel: true
            },
            data: this.graph1.nodes,
            links: this.graph1.links,
            categories: this.graph.categories,
            roam: true,
            label: {
              position: 'right',
              formatter: '{b}'
            },
            lineStyle: {
              color: 'source',
              curveness: 0.3
            },
            emphasis: {
              focus: 'adjacency',
              lineStyle: {
                width: 10
              }
            }
          }
        ]
      };
      this.myChart1.setOption(option);
    },
    drawChart2() {
      this.myChart2 = this.$echarts.init(document.getElementById("chart2"));

      this.graph2.nodes.forEach(function (node) {
        node.label = {
          show: node.symbolSize > 2
        };
      });

      let option = {
        tooltip: {},
        legend: [
          {
            data: this.graph2.categories.map(function (a) {
              return a.name;
            })
          }
        ],
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
          {
            // name: 'Les Miserables',
            type: 'graph',
            layout: 'circular',
            circular: {
              rotateLabel: true
            },
            data: this.graph2.nodes,
            links: this.graph2.links,
            categories: this.graph.categories,
            roam: true,
            label: {
              position: 'right',
              formatter: '{b}'
            },
            lineStyle: {
              color: 'source',
              curveness: 0.3
            },
            emphasis: {
              focus: 'adjacency',
              lineStyle: {
                width: 10
              }
            }
          }
        ]
      };
      this.myChart2.setOption(option);
    },
  },
  mounted() {
    // this.drawChart();
    // this.$nextTick(() => {
    //   let WindowBrowerHeight = window.innerHeight;
    //   if (this.WindowScreenHeight == WindowBrowerHeight) {
    //     this.fullscreen = true;
    //   } else {
    //     this.fullscreen = false;
    //   }
    // });

    // const initChart = () => {
    //   this.myChart4.resize({ width: 600, height: 400 });
    // };
    // const checkFull = () => {
    //   let isFull =
    //     document.fullscreenElement ||
    //     document.mozFullScreenElement ||
    //     document.webkitFullscreenElement;
    //   if (isFull === undefined) isFull = false;
    //   return isFull;
    // };
    // const flag = this;
    // window.onresize = function () {
    //   const fullDom = checkFull();
    //   if (!fullDom) {
    //     initChart();
    //     flag.$set(flag.isFull, "ok", false);
    //   }
    // };
  },
};
</script>
<style lang="scss">
#center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.chart-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>