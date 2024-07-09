import Vue from 'vue'
import VueRouter from 'vue-router'

import unauthorized from "@/views/introduce/unauthorized.vue"

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

import dataUserManage from '@/views/data/newdatas.vue'
import dataEdit from '@/views/data/edit.vue'
import dataUpload from '@/views/data/upload.vue'
import modelList from '@/views/model/list.vue'
import modelEdit from '@/views/model/edit.vue'
import taskList from '@/views/task/newlist.vue'
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

// // 新数据挖掘

// import TaskInfoNew from '@/views/SHEMining/Mining.vue'
// import DataSelectNew from '@/views/SHEMining/DataSelect.vue'
// import RegionSelectNew from '@/views/SHEMining/RegionSelect.vue'
// import AlgorithmSelectNew from '@/views/SHEMining/AlgorithmSelect.vue'
// import ResultNew from '@/views/SHEMining/Result/result.vue'

import { getRequest } from '@/api/user'
Vue.use(VueRouter)


const routes = [
  {
    path: '/',
    component: "/SideBar",
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
    path: '/SideBar',
    name: 'SideBar',
    redirect: '/introduce',
    component: SideBar,
    meta: { roles: ['1', '0'] }, // 只允许管理员0和普通用户1访问
    children: [
      {
        path: '/knowledgeGraph',
        name: 'knowledgeGraph',
        component: knowledgeGraph,
        meta: { roles: ['1', '0'] },
      },
      {
        path: '/unauthorized',
        name: 'unauthorized',
        component: unauthorized,
        meta: { roles: ['1', '0'] },
      },
      {
        path: '/usersetting',
        name: 'usersetting',
        component: usersetting,
        meta: { roles: ['1', '0'] },
      },

      {
        path: '/pwd',
        name: 'pwd',
        component: pwd,
        meta: { roles: ['1', '0'] },
      },
      {
        path: '/mining',
        name: 'mining',
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

      // {
      //   path: '/userlist',
      //   name: 'userist',
      //   component: userList
      // },
      // {
      //   path: '/user/edit',
      //   name: 'user/edit',
      //   component: userEdit,
      //   meta: { roles: ['1', '0'] },
      // },

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
      // {
      //   path: 'data/list',
      //   name: 'dataList',
      //   component: dataList,
      //   meta: { roles: ['1', '0'] }, compare
      // },
      {
        path: '/compare',
        name: 'compare',
        component: compare,
        meta: { roles: ['1', '0'] },
      },
      {
        path: '/dataUserManage',
        name: 'dataUserManage',
        component: dataUserManage,
        meta: { roles: ['1', '0'] },
      },
      // {
      //   path: 'data/edit',
      //   name: 'dataEdit',
      //   component: dataEdit,
      //   meta: { roles: ['1', '0'] },
      // },
      // {
      //   path: 'data/upload',
      //   name: 'dataUpload',
      //   component: dataUpload,
      //   meta: { roles: ['1', '0'] },
      // },
      {
        path: '/modelList',
        name: 'modelList',
        component: modelList,
        meta: { roles: ['1', '0'] },
      },
      {
        path: '/modelEdit',
        name: 'modelEdit',
        component: modelEdit,
        meta: { roles: ['1', '0'] },
      },

      {
        path: '/taskList',
        name: 'taskList',
        component: taskList,
        meta: { roles: ['1', '0'] },
      },
      {
        path: '/taskEdit',
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
        path: 'DisFactor',
        name: 'DisFactor',
        component: mining1,
        meta: { roles: ['1', '0'] },
      },

      {
        path: '/sheResult',
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
      // {
      //   path: '/feature/newfeature',
      //   name: 'newfeature',
      //   component: feature1,
      //   meta: { roles: ['1', '0'] },
      // },

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
        path: '/logManager',
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


router.beforeEach(async (to, from, next) => {
  try {
      //无权限页面不需要判断用户信息就放行
      if(to.path == '/unauthorized'){
        return next();
      }
    // 检查 session 里的用户信息
    const userName = sessionStorage.getItem('userName');

    // 如果没有用户信息
    if (!userName) {
      // 检查 URL 参数
      const repKey = to.query?.repKey;
      console.log("repKey:", repKey);
      if (repKey) {
        // 绵阳单点登录
        const resp = await getRequest(`/admin/user/login?repKey=${repKey}`);
        if (resp) {
          console.log("后台回复的code", resp.code);
          console.log("后台回复的UserName", resp.data.userName);
          console.log("后台回复的UserCode", resp.data.uid);
          if (resp.code == "200") {
            sessionStorage.setItem("userName", resp.data.userName);
            sessionStorage.setItem("userid", resp.data.uid);
            sessionStorage.setItem("userrole", resp.data.role);
            return next('/dash'); // 跳转到 SoftwareIntro 页面
          } else {
            return next('/unauthorized');
          }
        } else {
          return next('/unauthorized');
        }
      } else {
        // 跳转到未授权页面
        return next({ path: '/unauthorized' });
      }
    }
    else {
      console.log('👉');
      return next();
      // //这里写你原来的路由逻辑，下面是我的代码示例
      // // 如果有用户信息，检查白名单
      // if (whiteList.indexOf(to.path) !== -1) {
      //   // 如果在白名单中，则直接放行
      //   return next();
      // } else {
      //   const userRoles = sessionStorage.getItem('userrole'); // 从 sessionStorage 获取用户角色信息
      //   let record = to.matched[to.matched.length - 1]; // 获取当前匹配路由的最右侧路由
      //   let isAuthorized = false; // 初始化权限标志为 false

      //   if (record.meta.roles) {
      //     // 检查用户角色是否在路由允许的角色列表中
      //     if (record.meta.roles.includes(userRoles)) {
      //       isAuthorized = true; // 如果找到匹配的角色，设置权限标志为 true
      //     }
      //   }

      //   if (isAuthorized) {
      //     if (to.path === "/TaskResult") {
      //       store.commit("SetSideBarPath", "/taskManage");
      //     } else {
      //       store.commit("SetSideBarPath", to.path);
      //     }
      //     return next(); // 用户有权限，允许访问
      //   } else if (to.matched.some(record => record.meta.roles)) {
      //     return next({ path: '/unauthorized' }); // 用户无权限，重定向到未授权页面
      //   } else {
      //     if (to.path === "/TaskResult") {
      //       store.commit("SetSideBarPath", "/taskManage");
      //     } else {
      //       store.commit("SetSideBarPath", to.path);
      //     }
      //     return next(); // 如果没有定义 roles 元数据，允许所有用户访问
      //   }
      // }
    }
  } catch (error) {
    // 如果代码有问题，可以在这里捕获并处理错误
    console.error('导航守卫出错:', error);
    // 跳转到未授权页面
    return next({ path: '/unauthorized' });
  }
});


export default router
