import Vue from 'vue'
import Vuex from 'vuex'
import taskModule from "./taskModule";
import storage from '../utils/storage'
import { getRequest } from "@/api/user";
Vue.use(Vuex)
//要放在全局数据的文件  将vuex挂在到vue上
export default new Vuex.Store({
  state: {
    toolBar : true,
    allTableData:[],//所有的数据源 变量存放，全局的状态 this在store里面
    dataList: [],
    taskList: [],
    modelList: [],
  },
  getters: {
    getAllTableData(state){
      state.allTableData=storage.get("allTableData");
      return state.allTableData;
    },
    // 获取有数据的疾病列表
    dataDisList(state) {
      let newArray = [];
      state.dataList.forEach(({ disease }) => {
        if (newArray.indexOf(disease) === -1) {
          //去重
          newArray.push(disease);
        }
      });
      return newArray;
    },
    dataCreatorList(state) {
      let newArray = [];
      state.dataList.forEach(({ creator }) => {
        if (newArray.indexOf(creator) === -1) {
          //去重
          newArray.push(creator);
        }
      });
      return newArray;
    },
    taskLeaderList(state) {
      let newArray = [];
      state.taskList.forEach(({ leader }) => {
        if (newArray.indexOf(leader) === -1) {
          //去重
          newArray.push(leader);
        }
      });
      return newArray;
    },
    taskDiseaseList(state) {
      let newArray = [];
      state.taskList.forEach(({ disease }) => {
        if (newArray.indexOf(disease) === -1) {
          //去重
          newArray.push(disease);
        }
      });
      return newArray;
    },
  },
  //专门用来修改值的集合 修改state的数据  mutation内的函数不支持异步函数，如向后端发起请求
  mutations: {  //修改state值，用窜过来的参数修改
    changeToolBar(state) {  
      state.toolBar = !state.toolBar
      state.toolBar = !state.toolBar
    },
    setAllTableData(state,allTableData){
      state.allTableData=allTableData
    },
    SetDataList(state, value) {
      state.dataList = value;
    },
    SetTaskList(state, value) {
      state.taskList = value;
    },
    SetModelList(state, value) {
      state.modelList = value;
    },
  },
  //专门用来调用mutation修改状态 支持异步
  actions: {
    getDataList(context) {
      getRequest("/DataTable/upall")
        .then((res) => {
          context.commit("SetDataList", res.reverse());
        })
        .catch((err) => {
          console.log("数据列表获取错误，请联系管理员。");
          console.log(err);
        });
    },
    getTaskList(context,uid) {
      getRequest(`/Task/all?uid=${uid}`)
        .then((res) => {
          context.commit("SetTaskList", res.reverse());
        })
        .catch((err) => {
          console.log("任务列表获取错误，请联系管理员。");
          console.log(err);
        });
    },
    getModelList(context) {
      getRequest("/Model/all")
        .then((res) => {
          context.commit("SetModelList", res);
        })
        .catch((err) => {
          console.log("模型列表获取错误，请联系管理员。");
          console.log(err);
        });
    },
  },
  modules: {
    disFactor: taskModule,
    f_Factor: taskModule,
    factorDis: taskModule,
  }
})
