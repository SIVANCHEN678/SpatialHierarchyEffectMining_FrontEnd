<template>
  <div>
    <el-container class="con">
      <el-header class="header">
        <el-menu
          :default-active="activeIndex"
          background-color="#071135"
          text-color="#fff"
          active-text-color="#fff"
          class="el-menu-demo"
          mode="horizontal"
        >
          <span index="1" style="float: left; color: cornflowerblue">
            <i class="el-icon-box"></i>
            <span style="font-size: 20px"
              >疾病危险因素空间层次效应挖掘工具软件</span
            ></span
          >
          <!--            <template slot="title">当前服务器：</template>-->
          <el-menu-item index="2" style="float: right">
            <el-dropdown trigger="click" index="4" style="float: right; color: #fff">
            <span class="el-dropdown-link">
              {{user.name}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item  >
                <div @click="userSetting()">
                  用户设置
                </div>
              </el-dropdown-item>
              <el-dropdown-item  >
                <div @click="logout()">
                  退出登录
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
            </el-menu-item
          >
          <span index="3" style="float: right; color: #fff"
            ><i class="el-icon-user"></i>欢迎您</span
          > 

        </el-menu>
      </el-header>
      <el-container>
        <el-aside width="200px" class="side">
          <el-menu
            default-active="1"
            router
            class="el-menu-vertical-demo"
            background-color="#071135"
            text-color="#fff"
            active-text-color="#ffd04b"
          >
            <el-menu-item index="/dash">
              <i class="el-icon-menu"></i>
              <span slot="title">首页</span>
            </el-menu-item>

            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>任务创建与查看</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/task/newlist">
                  <i class="el-icon-location"></i>
                  <span slot="title">历史任务查看</span>
                </el-menu-item>
              </el-menu-item-group>
              <el-menu-item index="/DisFactor">
                  <i class="el-icon-location"></i>
                  <span slot="title">因果关系挖掘</span>
                </el-menu-item>
           </el-submenu>


           <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>危险因素知识库</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/knowledgeGraph/Charts">
                  <i class="el-icon-location"></i>
                  <span slot="title">关系图谱</span>
                </el-menu-item>
              </el-menu-item-group>
              <el-menu-item index="/relationships">
                  <i class="el-icon-location"></i>
                  <span slot="title">因果关系管理</span>
                </el-menu-item>
           </el-submenu>


                <el-menu-item index="/data/newdatas">
                <i class="el-icon-location"></i>
                <span slot="title">数据集管理</span>
              </el-menu-item>
            

            
            <el-menu-item index="/model/list">
              <i class="el-icon-location"></i>
              <span slot="title">模型管理</span>
            </el-menu-item>
           

           <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>系统管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/user/list">
                  <i class="el-icon-user-solid"></i>
                  <span slot="title">用户管理</span>
                </el-menu-item>
              </el-menu-item-group>
              <el-menu-item index="/log">
                  <i class="el-icon-camera"></i>
                  <span slot="title">用户日志</span>
                </el-menu-item>

           </el-submenu>



            <!-- <el-menu-item index="/test">
              <i class="el-icon-camera"></i>
              <span slot="title">测试</span>
            </el-menu-item> -->



            <div class="menu-footer">
              <el-menu-item index="/introduce"> 软件介绍</el-menu-item>
              <el-menu-item> 操作手册</el-menu-item>
            </div>
          </el-menu>
        </el-aside>
        <el-main class="main">

          <!-- <app-main></app-main> -->

          <!-- <app-main>   右侧的位置子路由位置</app-main> -->


          <!-- <app-main></app-main> -->

          <router-view></router-view>
        </el-main>
      </el-container>

      <el-footer>
        <h1>
          重庆邮电大学 大数据智能计算创新研发团队 @CopyRight 2020-2023 All
          Rights Reserved
        </h1>
      </el-footer>
    </el-container>
  </div>
</template>

<script>

// import AppMain from "@/components/AppMain";
export default {
  // components: { AppMain },
  data() {
    return { 

      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},


      activeIndex: "0",
      // describVision: false,
      // description1: "基于多任务学习的多病种疾病风险预测软件是一款医疗健康软件，通过调用相关算法，用户可以进行多种疾病（共病）的风险预测，可以帮助用户更好",
      // description2:"地管理自己的健康状况。本软件现有首页，健康咨询、单例预测和批量预测等功能，具体流程如此下图:"
    };
  },
  methods: {


    userSetting(){
      this.$router.replace("/usersetting")
    },


    logout(){
      localStorage.removeItem("user");
      // this.$router.push("/login");

      this.$router.replace("/login")
    }
    // openDialog(){
    //   this.describVision = true;
    //   console.log("open",this.describVision)
    // },
    // handleOpen(key, keyPath) {
    //   console.log(key, keyPath);
    // },
    // closedialog(){
    //   this.describVision = false;
    //   console.log('close',this.describVision)
    // }
  },
};
</script>

<style scoped>
.el-icon-mobile-phone {
  color: white;
}
.el-menu-item {
  color: aliceblue;
}

.el-menu-vertical-demo span {
  font-size: 14px;
}
.el-menu-vertical-demo {
  /*解决侧边栏颜色无法撑起整个高度问题*/
  height: 100%;
  /*解决侧边栏凸起问题*/

  border-right: none;
}
.header {
  background-color: #071135;
  color: #333;
  /* text-align: center; */
  line-height: 60px;
}

.side {
  /*background-color: #071135;*/
  color: #333;
  /*text-align: center;*/
  /*line-height: 200px;*/
  height: calc(100vh - 81px);
}

.main {
  height: calc(100vh - 81px);
  /* overflow: hidden; */
}

.el-footer {
  height: 21px !important;
  font-size: 10px;
  background-color: #929399bb;
  color: #252525;
  display: flex;
  justify-content: center;
  align-items: center;
}

.menu-footer {
  position: absolute;
  bottom: 0;
  margin-left: 40px;
}
</style>
