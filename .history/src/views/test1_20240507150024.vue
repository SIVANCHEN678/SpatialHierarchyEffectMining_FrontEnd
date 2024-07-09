<template>
  <div class="home page-component">
 

    <!-- 搜索 -->
    <!-- 搜索 -->
   

    <!-- bottom -->
    <div class="bottom">
      <div class="left">
        <div class="home-filter-wrapper">
          <div class="title" @click="as"> 选择展示因果关系的地区</div>
          <div>
            <div class="filter-wrapper">
              <span class="label" >省市：</span>
              <div class="condition-wrapper">
                <span class="item v-link clickable" :class="hostypeActiveIndex == index ? 'selected' : ''" v-for="(item,index) in hostypeList" :key="item.id" @click="hostypeSelect(item.value, index)">  {{ item.name }} </span>
              </div>
            </div>
            <div class="filter-wrapper">
              <span class="label">地区：</span>
              <div class="condition-wrapper">
                <span class="item v-link clickable" :class="provinceActiveIndex == index ? 'selected' : ''" v-for="(item,index) in districtList" :key="item.id" @click="districtSelect(item.value, index)"> {{ item.name }} </span>
              </div>
            </div>
          </div>
        </div>
        <div class="v-scroll-list hospital-list">
          <div class="v-card clickable list-item" v-for="item in list" :key="item.id">
            <div class="">
              <div class="hospital-list-item hos-item" index="0" @click="show(item.hoscode)">
                <div class="wrapper">
                  <div class="hospital-title"> {{ item.hosname }}</div>
                  <div class="bottom-container">
                    <div class="icon-wrapper">
                      <span class="iconfont"></span>{{ item.param.hostypeString }}
                    </div>
                    <div class="icon-wrapper">
                      <span class="iconfont"></span>每天{{ item.bookingRule.releaseTime }}放号
                    </div>
                  </div>
                </div>
                <img :src="'data:image/jpeg;base64,'+item.logoData" :alt="item.hosname" class="hospital-img">
              </div>
            </div>
          </div>
        </div>
      </div>
     
    </div>

  </div>
</template>

<script>
import { getRequest, postRequest } from '@/api/user';
export default {
  // asyncData：渲染组件之前异步获取数据
  asyncData({ params, error }) {
    return hospitalApi.getPageList(1, 10, null).then(response => {
      console.log(response.data);
      return {
        list: response.data.content,
        pages : response.data.totalPages
      }
    });
  },
  data() {
    return {
      searchObj: {},
      page: 1,
      limit: 10,
      dictcode:'Province',
      hosname: '',
      hostypeList: [],
      districtList: [],

      hostypeActiveIndex: 0,
      provinceActiveIndex: 0
    }
  },

  created() {
    this.init()
    console.log('11',this.hostypeList)
  },

  mounted() {
   document.getElementById("search").style.display = 'none';

    //添加滚动事件，检测滚动到页面底部
   window.addEventListener('scroll', this.load, true)
   this.init()
   console.log(this.hostypeList)
  },

  destroyed(){
    // 页面关闭的同时，记得将这个监听器关闭，节省性能
    window.removeEventListener('scroll', this.load, false)
  },

  methods: {
    init() {
   let id =510000
    getRequest(`/admin/cmn/dict/findByDictCode/${this.dictcode}`).then(
        (response) => {
          if(response.code === 200){
            this.relationships = response.data
            this.relationships = response.data;
          // 使用forEach遍历数组
          this.hostypeList = []
          this.hostypeList.push({"name":"全部", "value":""})
          for(let i in response.data){
          this.hostypeList.push(response.data[i]);
        }
console.log(this.hostypeList[0].name,'this.hostypeList')
         
          }
          

        })
        getRequest(`/admin/cmn/dict/findChildData/${id}`).then(
        (response) => {
          if(response.code === 200){
            
          // 使用forEach遍历数组
          this.districtList = []
        this.districtList.push({"name":"全部", "value":""})
        for(let i in response.data){
          this.districtList.push(response.data[i]);
        }
console.log(this.districtList[0].name,'this.districtList')
         
          }
        
        })

      // dictApi.findByDictCode("Hostype").then(response => {
      //   this.hostypeList = []
      //   this.hostypeList.push({"name":"全部", "value":""})
      //   for(let i in response.data){
      //     this.hostypeList.push(response.data[i]);
      //   }
      // })
      // dictApi.findByDictCode('Beijin').then(response => {
      //   this.districtList = []
      //   this.districtList.push({"name":"全部", "value":""})
      //   for(let i in response.data){
      //     this.districtList.push(response.data[i]);
      //   }
      // }
      
    },
    

    load(event) {
      // 滚动条高度为430 页面搜索消失，头部搜索显示
      if(event.target.scrollTop > 430) {
        document.getElementById("search").style.display = 'block';
      } else {
        document.getElementById("search").style.display = 'none';
      }

      if(event.target.clientHeight + event.target.scrollTop >= event.target.scrollHeight){
        if(this.page < this.pages){      //先判断下一页是否有数据
          this.page = this.page + 1
          this.getList();              //拉取接口数据
        }
      }
    },

    getList() {
      hospitalApi.getPageList(this.page, this.limit, this.searchObj).then(response => {
        for(let i in response.data.content){
          this.list.push(response.data.content[i]);
        }
        this.pages = response.data.totalPages
      })
    },

    querySearchAsync(queryString, cb) {
      this.searchObj = []
      if(queryString == '') return
      hospitalApi.getByHosname(queryString).then(response => {
        for (let i = 0, len = response.data.length; i < len; i++) {
          response.data[i].value = response.data[i].hosname
        }
        cb(response.data)
      })
    },

    handleSelect(item) {
      window.location.href = '/hospital/' + item.hoscode
    },

    hostypeSelect(hostype, index) {
      this.list = []
      this.page = 1
      this.hostypeActiveIndex = index
      this.searchObj.hostype = hostype
      this.getList();
    },

    districtSelect(districtCode, index) {
      this.list = []
      this.page = 1
      this.provinceActiveIndex = index
      this.searchObj.districtCode = districtCode
      this.getList();
    },

    show(hoscode) {
      window.location.href = '/hospital/' + hoscode
    }
  }
}
</script>

