<template>
  <div id="app">
<!--    <nav>-->
<!--      <router-link to="/">Home</router-link> |-->
<!--      <router-link to="/about">About</router-link>-->
<<<<<<< HEAD
<<<<<<< HEAD
<!--    </nav>-->
    <router-view v-if="isRouterAlive"/>
=======
<!--     组件呈现样式 </nav>-->
    <router-view v-if="isRouterAlive"/>

>>>>>>> 968a5ae (yy第一次提交)
=======
<!--    </nav>-->
    <router-view v-if="isRouterAlive"/>
>>>>>>> e73a6b49db1d1575e7062fc8d56f22f1bd4829c2
  </div>
</template>
<script>
export default {
  data () {
    return {
      isRouterAlive: true
    }
  },
}
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  //text-align: center;
  color: #2c3e50;
}
*{
  margin:0;
  padding:0;
  border:0
}
html,body{
  height: 100%;
}
//注明的样式
.explain{
  color: red;
  font-size: 12px;
}
//表单头的样式
.whiteItem .el-form-item__label {
  color: #fff;
}
.title {
  font-size: 26px;
  margin: 10px auto 10px auto;
  text-align: center;
  font-weight: bold;
}
.caret-wrapper{
  padding: 0px;
}
.InfoData{
  width: 100%; margin: 10px auto;padding: 0;
}
.el-table{
  ::v-deep th{
    padding: 0;
  }
  ::v-deep td {
    padding: 0;
  }
}
#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

//::-webkit-scrollbar {
//  width: 0 !important;
//}
//::-webkit-scrollbar {
//  width: 0 !important;
//  height: 0;
//}
//html,body,#app {
//  height: 100%;
//}
</style>

