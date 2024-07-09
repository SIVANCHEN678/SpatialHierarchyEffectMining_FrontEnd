<template>
  <div>
    <select v-model="selectedProvince" @change="fetchCities">
      <option value="">---请选择省---</option>
      <option v-for="province in provinces" :key="province.code" :value="province.code">{{ province.name }}</option>
    </select>
    <select v-model="selectedCity" @change="fetchDistricts">
      <option value="">---请选择市---</option>
      <option v-for="city in cities" :key="city.code" :value="city.code">{{ city.name }}</option>
    </select>
    <select v-model="selectedDistrict">
      <option value="">---请选择区---</option>
      <option v-for="district in districts" :key="district.code" :value="district.code">{{ district.name }}</option>
    </select>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
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
    async fetchProvinces() {
      try {
        const response = await axios.get('/api/provinces'); // 假设这是获取省份数据的API路径
        this.provinces = response.data;
      } catch (error) {
        console.error('Failed to fetch provinces', error);
      }
    },
    async fetchCities() {
      if (!this.selectedProvince) return;
      try {
        const response = await axios.get(`/api/cities?provinceCode=${this.selectedProvince}`); // 根据省份代码获取城市数据
        this.cities = response.data;
        this.selectedCity = ''; // 清空城市和区县选择，等待重新选择
        this.districts = []; // 清空区县列表
      } catch (error) {
        console.error('Failed to fetch cities', error);
      }
    },
    async fetchDistricts() {
      if (!this.selectedCity) return;
      try {
        const response = await axios.get(`/api/districts?cityCode=${this.selectedCity}`); // 根据城市代码获取区县数据
        this.districts = response.data;
      } catch (error) {
        console.error('Failed to fetch districts', error);
      }
    }
  }
};
</script>