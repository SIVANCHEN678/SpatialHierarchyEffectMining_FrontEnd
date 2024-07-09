<template>
  <div>
    <div class="container">
      <div style="font-size: 50px">疾病危险因素空间层次效应挖掘工具软件</div>
      <div class="size-icon">
        <div class="icon" @click="pathTo1">
          <img
            style="width: 200px; height: 200px"
            src="@/assets/symptom.png"
            alt="空间层次效应挖掘"
          />
          <h3 style="font-size: 30px">空间层次效应挖掘</h3>
        </div>
        <div class="icon" @click="pathTo2">
          <img
            style="width: 200px; height: 200px"
            src="@/assets/data1.jpg"
            alt="数据管理"
          />
          <h3 style="font-size: 30px">数据管理</h3>
        </div>

        <div class="icon" @click="pathTo3">
          <img
            style="width: 200px; height: 200px"
            src="@/assets/model3.jpg"
            alt="模型管理"
          />
          <h3 style="font-size: 30px">模型管理</h3>
        </div>
        <div class="icon" @click="pathTo4">
          <img
            style="width: 200px; height: 200px"
            src="@/assets/data.jpg"
            alt="任务日志"
          />
          <h3 style="font-size: 30px">任务日志</h3>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  setup() { },
  methods: {
    pathTo1() {
      this.$router.push({ path: "/mining/DisFactor" })
    },
    pathTo2() {
      this.$router.push({ path: "/data/newdatas" })
    },
    pathTo3() {
      this.$router.push({ path: "/model/list" })
    },
    pathTo4() {
      this.$router.push({ path: "/task/newlist" })
    },
  }
};
</script>
<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  flex-flow: column;
}
.size-icon {
  font-size: 80px;
  display: grid;

  grid-template-columns: repeat(2, 300px);
  grid-template-rows: repeat(2, 300px);
  gap: 5px;
  justify-items: center;
  align-items: center;
}
.icon {
  display: grid;
  place-items: center;
  text-align: center;
}
.icon svg-icon {
  max-width: 100%;
  vertical-align: middle;
}
.icon h3 {
  margin-top: 10px;
}
</style>