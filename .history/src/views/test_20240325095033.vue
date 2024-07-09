<template>
  <div class="box">
    <p class="boxTemperature">{{ weatcherData.temperature }}°</p>
    <p class="boxWeather">{{ weatcherData.weather }}</p>
    <p class="boxCity">{{ weatcherData.city }}</p>
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