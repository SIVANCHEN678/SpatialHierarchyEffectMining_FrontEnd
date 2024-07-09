<template>
  <div>
    <select 
      v-model="selectedProvince" 
      @change="fetchCities"
      @click="shouldReset && resetSelections()"
      
    >
      <option value="">---请选择省---</option>
      <option v-for="province in provinces" :key="province.value" :value="province">{{ province.name }}</option>
    </select>
    <select 
      v-model="selectedCity" 
      @change="fetchDistricts"
      @click="shouldReset && resetSelections()"
    >
      <option value="">---请选择市---</option>
      <option v-for="city in cities" :key="city.value" :value="city">{{ city.name }}</option>
    </select>

    <select v-model="selectedDistrict" @click="shouldReset && resetSelections()" @change="districtChanged">
      <option value="">---请选择区---</option>
      <option v-for="district in districts" :key="district.value" :value="district">{{ district.name }}</option>
    </select>
    <el-button  @click="resetSelections" style="margin-left: 10px;"> 重置</el-button>
  </div>
</template>

<script>
import { getRequest, postRequest } from '@/api/user';

export default {
  data() {
    return {
      shouldReset: false, // 新增一个标识，用于控制是否需要重置
      dictcode:'Province',
      provinces: [],
      cities: [],
      districts: [],
      selectedProvince: '',
      selectedCity: '',
      selectedDistrict: ''
    };
  },
  async created() {
    await this.fetchProvinces();
  },
  methods: {
    resetSelections() {
      this.shouldReset = false; // 重置标识，防止无限循环
      this.selectedProvince = '';
      this.selectedCity = '';
      this.selectedDistrict = '';
      this.fetchProvinces(); // 重新获取省份数据
    },
    async fetchProvinces() {
      try {
        const response = await     getRequest(`/admin/cmn/dict/findByDictCode/${this.dictcode}`).then(
        (response) => {
          if(response.code === 200){
            
          // 使用forEach遍历数组
          this.provinces = []
          //this.hostypeList.push({"name":"全部", "value":""})
          for(let i in response.data){
          this.provinces.push(response.data[i]);
        }
console.log(this.provinces[0].name,'this.hostypeList')
         
          }
          

        }); // 假设这是获取省份数据的API路径
       
      } catch (error) {
        console.error('Failed to fetch provinces', error);
      }
    },
    async fetchCities() {
      console.log(this.selectedProvince)
      if (!this.selectedProvince) return;
      try {
        const response = await  getRequest(`/admin/cmn/dict/findChildData/${this.selectedProvince.value}`).then(
        (response) => {
          if(response.code === 200){
            
          // 使用forEach遍历数组
          this.cities = []
      
        for(let i in response.data){
          this.cities.push(response.data[i]);
        }
console.log(this.cities[0].name,'this.cities')
         
          } this.selectedCity = ''; // 清空城市和区县选择，等待重新选择
        this.districts = []; // 清空区县列表
        
        }); // 根据省份代码获取城市数据
        
       
      } catch (error) {
        console.error('Failed to fetch cities', error);
      }
    },

    async fetchDistricts() {
    
      if (!this.selectedCity) return;
      try {
        const response = await getRequest(`/admin/cmn/dict/findChildData/${this.selectedCity.value}`); // 根据城市代码获取区县数据
        if(response.code === 200){
            
            // 使用forEach遍历数组
            this.districts = []
        
          for(let i in response.data){
            this.districts.push(response.data[i]);
          }
  console.log(this.districts[0].name,'this.cities')
           
            }
       

      } catch (error) {
        console.error('Failed to fetch districts', error);
      }
    },

  }
};
</script>
<style scoped>
/* 如果使用scoped样式，则仅对此组件内的元素生效 */
select {
  border: 1px solid #ccc; /* 设置边框颜色和宽度 */
  border-radius: 4px; /* 可选，设置边框圆角 */
  padding: 10px; /* 可选，增加一些内边距以提升用户体验 */
  appearance: none; /* 移除浏览器默认样式，确保跨浏览器一致性 */
  -webkit-appearance: none; /* 针对 WebKit 内核的浏览器 */
  -moz-appearance: none; /* 针对 Firefox */
  margin-left: 10px;
}

/* 如果希望在聚焦时改变边框颜色，可以添加以下规则 */
select:focus {
  outline: none; /* 移除默认轮廓，可选 */
  border-color: #4CAF50; /* 示例：聚焦时边框变为绿色 */
}
</style>