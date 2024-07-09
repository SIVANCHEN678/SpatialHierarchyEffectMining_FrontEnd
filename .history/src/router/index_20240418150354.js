import Vue from 'vue'
import VueRouter from 'vue-router'

import login from '@/views/login/login.vue'
import usersetting from '@/views/login/usersetting.vue'
import register from '@/views/login/register.vue'
import SideBar from '@/components/sideBar/index.vue'
import dash from '@/views/dash/index.vue'
import dataList from '@/views/data/list.vue'

import dataList1 from '@/views/data/newdatas.vue'
import dataEdit from '@/views/data/edit.vue'
import dataUpload from '@/views/data/upload.vue'
import modelList from '@/views/model/list.vue'
import modelEdit from '@/views/model/edit.vue'
import modelUpload from '@/views/model/upload.vue'
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
import task from '@/views/task.vue'
import task1 from '@/views/task1.vue'
import knowledgeGraph from '@/views/knowledgeGraph/KnowledgeGraph.vue'


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
    path: '/',
    name: 'dash',
    redirect: '/login',
    component: SideBar,
    children: [
      {
        path: '/knowledgeGraph/Charts',
        name: 'knowledgeGraph',
        component: knowledgeGraph,
      },
      {
      path:'/usersetting',
      name: 'usersetting',
        component: usersetting,
      },
      {
        path: '/mining/renewindex',
        name: 'renewindex',
        component: renewindex,
      },
      {
        path: '/DisFactor',
        name: 'DisFactor',
        component: DisFactor
      },
     
      
      {
        path: '/dataselect',
        name: 'DisFactor',
        component: dataselect
      },
      {
        path: '/FeatureSelect',
        name: 'FeatureSelect',
        component: FeatureSelect
      },
      {
        path: '/log',
        name: 'log',
        component: log
      },
      {
        path: "DisFactor",
        name: "DisFactor",
        component: DisFactor,
      },

      {
        path: '/user/list',
        name: 'user/ist',
        component: userList
      },
      {
        path: '/user/edit',
        name: 'user/edit',
        component: userEdit
      },

      {
        path: '/dash',
        name: 'dash',
        component: dash
      },
      {
        path: '/introduce',
        name: 'introduce',
        component: introduce
      },
      {
        path: 'data/list',
        name: 'dataList',
        component: dataList
      },
      {
        path: 'data/newdatas',
        name: 'dataList1',
        component: dataList1
      },
      {
        path: 'data/edit',
        name: 'dataEdit',
        component: dataEdit
      },
      {
        path: 'data/upload',
        name: 'dataUpload',
        component: dataUpload
      },
      {
        path: 'model/list',
        name: 'modelList',
        component: modelList
      },
      {
        path: 'model/edit',
        name: 'modelEdit',
        component: modelEdit
      },
      {
        path: 'model/upload',
        name: 'modelUpload',
        component: modelUpload
      },
      {
        path: 'task/list',
        name: 'tasklList',
        component: taskList
      },
      {
        path: 'task/listgai',
        name: 'tasklListgai',
        component: listgai
      },
      {
        path: 'task/newlist',
        name: 'newtasklList',
        component: taskList1
      },
      {
        path: 'task/edit',
        name: 'taskEdit',
        component: taskEdit
      },
      {
        path: '/mining',
        name: 'mining',
        component: mining,
      },
      {
        path: 'mining/DisFactor',
        name: 'DisFactor',
        component: mining1,
      },

      {
        path: 'she/result',
        name: 'sheResult',
        component: sheResult
      },

      {
        path: '/relationships',
        name: 'relationships',
        component: relationships
      },

      {
        path: 'comorbidity',
        name: 'comorbidity',
        component: comorbidity
      },

      {
        path: '/feature',
        name: 'feature',
        component: feature
      },
      {
        path: '/feature/newfeature',
        name: 'newfeature',
        component: feature1
      },

      {
        path: 'feature/edit',
        name: 'featureEdit',
        component: featureEdit
      },

      {
        path: '/test',
        name: 'test',
        component: test
      },
      {
        path: '/task',
        name: 'task',
        component: task
      },
      {
        path: '/task1',
        name: 'task1',
        component: task1
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
