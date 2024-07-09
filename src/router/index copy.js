import Vue from 'vue'
import VueRouter from 'vue-router'

import userManage from '@/views/login/userManage.vue'
import inform from '@/views/login/inform.vue'
import dataManage from '@/views/login/dataManage.vue'
import logManager from '@/views/login/logManager.vue'
import diseaseManager from '@/views/login/diseaseManager.vue'
import opration from '@/views/introduce/opertion.vue'


import compare from '@/views/mining/she/compare.vue'
import login from '@/views/login/Login.vue'
import usersetting from '@/views/login/userCenter.vue'
import pwd from '@/views/login/updatePassword.vue'
import register from '@/views/login/register1.vue'
import forget from '@/views/login/forget.vue'
import SideBar from '@/components/sideBar/index.vue'
import dash from '@/views/dash/index.vue'
import dataList from '@/views/data/list.vue'

import dataList1 from '@/views/data/newdatas.vue'
import dataEdit from '@/views/data/edit.vue'
import dataUpload from '@/views/data/upload.vue'
import modelList from '@/views/model/list.vue'
import modelEdit from '@/views/model/edit.vue'
import taskList from '@/views/task/list.vue'
import taskList1 from '@/views/task/newlist.vue'
import listgai from '@/views/task/list gai.vue'
import taskEdit from '@/views/task/edit.vue'
import mining from '@/views/mining/index.vue'
import renewindex from '@/views/mining/renewindex.vue'
import mining1 from '@/views/mining/DisFactor.vue'
import dataselect from '@/components/subcomponents/DataSelect.vue'
import sheResult from '@/views/mining/she/result1.vue'
import FeatureSelect from '@/components/subcomponents/FeatureSelect.vue'
import DisFactor from "@/components/tab/DisFactor.vue"

import comorbidity from '@/views/comorbidity/index.vue'
import introduce from '@/views/introduce/index.vue'
import relationships from '@/views/relationships/index.vue'
import feature from '@/views/feature/index.vue'
import feature1 from '@/views/feature/newfeature.vue'
import featureEdit from '@/views/feature/edit.vue'
import log from '@/views/log/list.vue'
import userList from '@/views/user/list.vue'
import userEdit from '@/views/user/edit.vue'
import test from '@/views/test.vue'
import test1 from '@/views/test1.vue'
import task from '@/views/task.vue'
import task1 from '@/views/task1.vue'
import knowledgeGraph from '@/views/knowledgeGraph/KnowledgeGraph.vue'

// 新数据挖掘

import TaskInfoNew from '@/views/SHEMining/Mining.vue'
import DataSelectNew from '@/views/SHEMining/DataSelect.vue'
import RegionSelectNew from '@/views/SHEMining/RegionSelect.vue'
import AlgorithmSelectNew from '@/views/SHEMining/AlgorithmSelect.vue'
import ResultNew from '@/views/SHEMining/Result/result.vue'


// import test from '@/views/mining/she/result.vue'



Vue.use(VueRouter)




const routes = [
  {
    path: '/login',
    name: 'login',
    component: login,
  },

  {
    path: '/register',
    name: 'register',
    component: register,
  },
  {
    path: '/forget',
    name: 'forget',
    component: forget,
  },

  {
    path: '/',
    name: 'dash',
    redirect: '/login',
    component: SideBar,

    children: [
      {
        path: '/knowledgeGraph/Charts',
        name: 'knowledgeGraph',
        component: knowledgeGraph,
        meta: { roles: ['1', '0'] },
      },
      {
      path:'/usersetting',
      name: 'usersetting',
        component: usersetting,
        meta: { roles: ['1', '0'] },
      },

      {
        path:'/pwd',
        name: 'pwd',
          component: pwd,
          meta: { roles: ['1', '0'] },
        },
      {
        path: '/mining/renewindex',
        name: 'renewindex',
        component: renewindex,
        meta: { roles: ['1', '0'] },
      },
      {
        path: '/DisFactor',
        name: 'DisFactor',
        component: DisFactor,
        meta: { roles: ['1', '0'] },
      },
     
      
      {
        path: '/dataselect',
        name: 'DisFactor',
        component: dataselect,
        meta: { roles: ['1', '0'] },
      },
      {
        path: '/FeatureSelect',
        name: 'FeatureSelect',
        component: FeatureSelect,
        meta: { roles: ['1', '0'] },
      },
      {
        path: '/log',
        name: 'log',
        component: log,
        meta: { roles: ['1', '0'] },
      },
      {
        path: "DisFactor",
        name: "DisFactor",
        component: DisFactor,
        meta: { roles: ['1', '0'] },
      },

      {
        path: '/user/list',
        name: 'user/ist',
        component: userList
      },
      {
        path: '/user/edit',
        name: 'user/edit',
        component: userEdit,
        meta: { roles: ['1', '0'] },
      },

      {
        path: '/dash',
        name: 'dash',
        component: dash,
        meta: { roles: ['1', '0'] },
      },
      {
        path: '/introduce',
        name: 'introduce',
        component: introduce,
        meta: { roles: ['1', '0'] },
      },
      {
        path: 'data/list',
        name: 'dataList',
        component: dataList,
        meta: { roles: ['1', '0'] },compare
      },
      {
        path: '/compare',
        name: 'compare',
        component: compare,
        meta: { roles: ['1', '0'] },
      },
      {
        path: 'data/newdatas',
        name: 'dataList1',
        component: dataList1,
        meta: { roles: ['1', '0'] },
      },
      {
        path: 'data/edit',
        name: 'dataEdit',
        component: dataEdit,
        meta: { roles: ['1', '0'] },
      },
      {
        path: 'data/upload',
        name: 'dataUpload',
        component: dataUpload,
        meta: { roles: ['1', '0'] },
      },
      {
        path: 'model/list',
        name: 'modelList',
        component: modelList,
        meta: { roles: ['1', '0'] },
      },
      {
        path: 'model/edit',
        name: 'modelEdit',
        component: modelEdit,
        meta: { roles: ['1', '0'] },
      },
      
      {
        path: 'task/list',
        name: 'tasklList',
        component: taskList,
        meta: { roles: ['1', '0'] },
      },
      {
        path: 'task/listgai',
        name: 'tasklListgai',
        component: listgai,
        meta: { roles: ['1', '0'] },
      },
      {
        path: 'task/newlist',
        name: 'newtasklList',
        component: taskList1,
        meta: { roles: ['1', '0'] },
      },
      {
        path: 'task/edit',
        name: 'taskEdit',
        component: taskEdit,
        meta: { roles: ['1', '0'] },
      },
      {
        path: '/mining',
        name: 'mining',
        component: mining,
        meta: { roles: ['1', '0'] },
      },
      {
        path: 'mining/DisFactor',
        name: 'DisFactor',
        component: mining1,
        meta: { roles: ['1', '0'] },
      },

      {
        path: 'she/result',
        name: 'sheResult',
        component: sheResult,
        meta: { roles: ['1', '0'] },
      },

      {
        path: '/relationships',
        name: 'relationships',
        component: relationships,
        meta: { roles: ['1', '0'] },
      },

      {
        path: 'comorbidity',
        name: 'comorbidity',
        component: comorbidity,
        meta: { roles: ['1', '0'] },
      },

      {
        path: '/feature',
        name: 'feature',
        component: feature,
        meta: { roles: ['1', '0'] },
      },
      {
        path: '/feature/newfeature',
        name: 'newfeature',
        component: feature1,
        meta: { roles: ['1', '0'] },
      },

      {
        path: 'feature/edit',
        name: 'featureEdit',
        component: featureEdit,
        meta: { roles: ['1', '0'] },
      },

      {
        path: '/test',
        name: 'test',
        component: test,
        meta: { roles: ['1', '0'] },
      },
      {
        path: '/test1',
        name: 'test1',
        component: test1,
        meta: { roles: ['1', '0'] },
      },
      {
        path: '/task',
        name: 'task',
        component: task,
        meta: { roles: ['1', '0'] },
      },
      {
        path: '/task1',
        name: 'task1',
        component: task1,
        meta: { roles: ['1', '0'] },
      },
      {
        path: '/opration',
        name: 'opration',
        component: opration,
        meta: { roles: ['1', '0'] },
      },

      {
        path: '/TaskInfoNew',
        name: 'TaskInfoNew',
        component: TaskInfoNew,
        meta: { roles: ['1', '0'] },
      },
      {
        path: '/DataSelectNew',
        name: 'DataSelectNew',
        component: DataSelectNew,
        meta: { roles: ['1', '0'] },
      },
      {
        path: '/RegionSelectNew',
        name: 'RegionSelectNew',
        component: diseaseManager,
        meta: { roles: ['1', '0'] },
      },
      {
        path: '/AlgorithmSelectNew',
        name: 'AlgorithmSelectNew',
        component: AlgorithmSelectNew,
        meta: { roles: ['1', '0'] },
      },
      {
        path: '/ResultNew',
        name: 'ResultNew',
        component: ResultNew,
        meta: { roles: ['1', '0'] },
      },

/**
 * 管理员
 */


      {
        path: '/userManage',
        name: 'userManage',
        component: userManage,
        meta: { roles: ['0'] },
      },
      {
        path: '/inform',
        name: 'inform',
        component: inform,
        meta: { roles: ['0'] },
      },
    
      {
        path: '/dataManage',
        name: 'dataManage',
        component: dataManage,
        meta: { roles: ['0'] },
      },
      {
        path: '/log1',
        name: 'logManager',
        component: logManager,
        meta: { roles: ['0'] },
      },
      {
      path: '/diseaseManager',
      name: 'diseaseManager',
      component: diseaseManager,
      meta: { roles: ['0'] },
    },



    ],
  },

]


const router = new VueRouter({
  routes
})

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

// const originalPush = Router.prototype.push;
// Router.prototype.push = function push(location, onResolve, onReject) {
//   if (onResolve || onReject)
//     return originalPush.call(this, location, onResolve, onReject);
//   return originalPush.call(this, location).catch((err) => err);
// };

// router.beforeEach( (to , from, next ) => {
//   if(to.path === '/login') {
//     next();
//   }
//   const user = sessionStorage.getItem("user");
//   if(!user && to.path !== '/login'){
//     return next('/login')
//   }
//   next();
// })

// // 页面跳转路由拦截
// router.beforeEach((to, from, next) => {
//   if (to.path === '/login') {
//     next();
//   } else {
//     let token = sessionStorage.getItem('token');
//     if (!token) {
//       next('/login');
//     } else {
//       next();
//     }
//   }
// });


export default router
