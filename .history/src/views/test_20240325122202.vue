<template>
  <div >
    <head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="initial-scale=1.0, user-scalable=no, width=device-width">
  <link rel="stylesheet" href="https://a.amap.com/jsapi_demos/static/demo-center/css/demo-center.css" />
  <link rel="stylesheet" type="text/css" href="https://a.amap.com/jsapi_demos/static/demo-center/css/prety-json.css">
  <style>
    html,
    body,
    #container {
      width: 100%;
      height: 100%;
    }
  </style>
  <title>获取地图当前行政区</title>
</head>
  </div>
</template>
 
<script>
export default {
  data() {
    return {
      weatcherData: {
        adcode: "",
        city: "",
        humidity: "",
        info: "",
        province: "",
        reportTime: "",
        temperature: 0,
        weather: "",
        windDirection: "",
        windPower: "",
      },
    };
  },
  mounted() {
    this.getCity();
    <script src="https://webapi.amap.com/maps?v=2.0&key=您申请的key值"></script>
  <script type="text/javascript" src="https://a.amap.com/jsapi_demos/static/demo-center/js/jquery-1.11.1.min.js" ></script>
  <script type="text/javascript" src="https://a.amap.com/jsapi_demos/static/demo-center/js/underscore-min.js" ></script>
  <script type="text/javascript" src="https://a.amap.com/jsapi_demos/static/demo-center/js/backbone-min.js" ></script>
  <script type="text/javascript" src='https://a.amap.com/jsapi_demos/static/demo-center/js/prety-json.js'></script>
  <script>
    //初始化地图
    var map = new AMap.Map('container', {
      resizeEnable: true, //是否监控地图容器尺寸变化
      zoom: 11, //初始地图级别
    });

    //获取并展示当前城市信息
    function logMapinfo(){
      map.getCity( function(info){
        var node = new PrettyJSON.view.Node({
            el: document.querySelector("#map-city"),
            data: info
        });
      });
    }

    logMapinfo();

    //绑定地图移动事件
    map.on('moveend', logMapinfo);
  </script>
  },
  methods: {
    getCity() {
      let that = this;
      AMap.plugin("AMap.CitySearch", function () {
        var citySearch = new AMap.CitySearch();
        citySearch.getLocalCity(function (status, result) {
          if (status === "complete" && result.info === "OK") {
            // 查询成功，result即为当前所在城市信息
            that.getWeather(result.city);
          }
        });
      });
    },
    // 获取天气
    getWeather(city) {
      let that = this;
      //加载天气查询插件
      AMap.plugin("AMap.Weather", function () {
        //创建天气查询实例
        let weather = new AMap.Weather();
        //执行实时天气信息查询
        weather.getLive(city, function (err, data) {
          console.log(data);
          if (data.info == "OK") {
            that.weatcherData = data;
            console.log(that.weatcherData, "天气");
          }
        });
      });
    },
  },
};
</script>
 
<style scoped>
.box {
  display: flex;
  align-items: center;
  color: #5e5757;
  margin-right: 20px;
}
.boxTemperature {
  font-size: 18px;
}
.boxWeather {
  font-size: 14px;
  margin: 0 0 0 15px;
}
.boxCity {
  margin-left: 10px;
  font-size: 16px;
}
</style>