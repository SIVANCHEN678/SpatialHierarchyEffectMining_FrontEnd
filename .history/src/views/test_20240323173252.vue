<template>
  <div>
    <div id="container"></div>
    <div class="info" id="text">
      {{ infoText }}
    </div>
    <div class="input-card" style="width:16rem">
      <h4>地图点击相关事件</h4>
      <div>
        <div class="input-item">
          <button id="clickOn" class="btn" style="margin-right:1rem;" @click="bindEvents">绑定事件</button>
          <button id="clickOff" class="btn" @click="unbindEvents">解绑事件</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript" src="https://webapi.amap.com/maps?v=2.0&key=您申请的key值"></script>
<script src="https://a.amap.com/jsapi_demos/static/demo-center/js/demoutils.js"></script>
<script>
export default {
  name: "MapEventSystem",
  data() {
    return {
      map: null,
      infoText: '请用鼠标在地图上操作试试'
    };
  },
  mounted() {
    this.map = new AMap.Map("container", {
      zoom: 11
    });
  },
  methods: {
    showInfoClick(e) {
      this.infoText = '您在 [ ' + e.lnglat.getLng() + ',' + e.lnglat.getLat() + ' ] 的位置单击了地图！';
    },
    showInfoDbClick(e) {
      this.infoText = '您在 [ ' + e.lnglat.getLng() + ',' + e.lnglat.getLat() + ' ] 的位置双击了地图！';
    },
    showInfoMove() {
      this.infoText = '您移动了您的鼠标！';
    },
    bindEvents() {
      console.log("绑定事件!");
      this.map.on('click', this.showInfoClick);
      this.map.on('dblclick', this.showInfoDbClick);
      this.map.on('mousemove', this.showInfoMove);
    },
    unbindEvents() {
      console.log("解除事件绑定!");
      this.map.off('click', this.showInfoClick);
      this.map.off('dblclick', this.showInfoDbClick);
      this.map.off('mousemove', this.showInfoMove);
    }
  }
};
</script>

<style scoped>
#container {
  width: 100%;
  height: 100%;
}

.info {
  margin-top: 20px;
  font-size: 18px;
  text-align: center;
}

.input-card {
  width: 16rem;
  margin-top: 20px;
}

.btn {
  cursor: pointer;
  padding: 8px 12px;
  font-size: 14px;
}

.btn + .btn {
  margin-left: 5px;
}
</style>
