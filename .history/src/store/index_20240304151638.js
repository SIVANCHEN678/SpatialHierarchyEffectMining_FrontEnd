import Vue from 'vue'
import Vuex from 'vuex'
import taskModule from "./taskModule";
import storage from '../utils/storage'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    toolBar : true,
    allTableData:[],
  },
  getters: {
    getAllTableData(state){
      state.allTableData=storage.get("allTableData");
      return state.allTableData;
    }
  },
  mutations: {
    changeToolBar(state) {
      state.toolBar = !state.toolBar
      state.toolBar = !state.toolBar
    },
    setAllTableData(state,allTableData){
      state.allTableData=allTableData
    }
  },
  actions: {
    
  },
  modules: {
    disFactor: taskModule
  }
})
