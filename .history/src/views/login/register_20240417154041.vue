<template>
  <div>
    <el-form
     element-loading-text="正在注册..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      ref="registerForm"
      :model="registerForm"
      :rules="rules"
      class="registerContainer"
    >
      <h3 class="registerTitle" style="margin-left: 40%;">用户注册</h3>
      <el-form-item prop="name">
        <el-input
          type="text"
          auto-complete="false"
          v-model="registerForm.userName"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          show-password
          type="password"
          auto-complete="false"
          v-model="registerForm.password"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
<el-form-item prop="repPassword">
        <el-input
        show-password
          type="password"
          auto-complete="false"
          v-model="registerForm.repPassword"
          placeholder="请重复输入密码"
        ></el-input>
      </el-form-item>

      <el-button type="primary" style="width: 100%" @click="subitRegister"
        >提交</el-button
      >
    
    </el-form>
  </div>
</template>

<script>
import { postRequest, getRequest } from "@/utils/api";
export default {
  name: "Login",
  data() {
      let checkPwd2=((rule,value,callback)=>{
      if(value.trim().length==0){
        callback(new Error("请确认密码不能为空"));
      }else if(value !=this.registerForm.password){
        callback(new Error("输入密码不一致，请重新输入"));
      }else{
        callback();
      }
      })

    return {
        
      registerForm: {
        userName: "",
        password: "",
        repPassword:"",
      },
      loading: false,
      checked: true,
      
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        repPassword:[{validator:checkPwd2,trigger:"blur"}]
      },
    };
  },
  methods: {
    subitRegister() {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          const params={
              name:this.registerForm.userName,
              password:this.registerForm.password,
          }
          postRequest("/admin/user/register", params).then((resp) => {
            if (resp) {
              this.loading = false;
              console.log(resp);
              if (resp.code == "200") {
                this.$router.replace("/login");
              }
              this.$message.success("注册成功，欢迎登录系统");
              //   const tokenStr = resp.obj.tokenHead + resp.obj.token;
              //   window.sessionStorage.setItem("tokenStr", tokenStr);

              //   postRequest("/getrole", this.loginForm.id).then((resp) => {
              //     if (resp[0].nameZh === "管理员") {
              //       this.$router.replace("/portal");
              //     } else {
              //       this.$router.replace("/home");
              //     }
              //   });
            }
          });
        } else {
          this.$message.error("请正确填写注册信息");
          return false;
        }
      });
    },
 
  },
};
</script>

<style>
.registerContainer {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 15px 35px 15px 35px;
  background: white;
  border: 1px solid #eaeaee;
  box-shadow: 0 0 25px #cac6c6;
}
.registerTitle {
  margin: 0px auto 40px auto;
  text-align: center;
}

.el-form-item__content {
  display: flex;
  align-items: center;
}
</style>  