<template>
  <div>
    <select 
      v-model="selectedProvince" 
      @change="fetchCities"
      @click="shouldReset && resetSelections()"
    >
      <option value="">---请选择省---</option>
      <option v-for="province in provinces" :key="province.value" :value="province.value">{{ province.name }}</option>
    </select>
    <select 
      v-model="selectedCity" 
      @change="fetchDistricts"
      @click="shouldReset && resetSelections()"
    >
      <option value="">---请选择市---</option>
      <option v-for="city in cities" :key="city.value" :value="city.value">{{ city.name }}</option>
    </select>
    <select v-model="selectedDistrict" @click="shouldReset && resetSelections()">
      <option value="">---请选择区---</option>
      <option v-for="district in districts" :key="district.value" :value="district.value">{{ district.name }}</option>
    </select>
    <button @click="resetSelections">重置选择</button>
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
      if (!this.selectedProvince) return;
      try {
        const response = await  getRequest(`/admin/cmn/dict/findChildData/${this.selectedProvince}`).then(
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
        const response = await getRequest(`/admin/cmn/dict/findChildData/${this.selectedCity}`); // 根据城市代码获取区县数据
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
    }
  }
};
</script>