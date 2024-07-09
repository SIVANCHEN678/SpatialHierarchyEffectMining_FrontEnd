<template>
 
    
 
  <div class="myMain">
    <div>
      <div class="mainRight">
        <img
          src="http://www.cqupt.edu.cn/dfiles/13011/cqupt/img/favicon_128x128.ico"
          style="height: 100px; width: 100px"
        />
        <h1>疾病危险因素空间层次效应挖掘工具软件</h1>
      </div>
      <div class="mainImg">
        <img
          class="gif"
          src="https://img.benmu-health.com/sanyi-health/gif.gif"
        />
        <img
          class="png"
          src="https://img.benmu-health.com/sanyi-health/main-pic-new.png"
        />
      </div>
      <div class="loginDiv">
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
    </div>
    <div class="cooperation">
      <el-row class="text-coop">
        <el-col :span="24">合作单位：</el-col>
      </el-row>
      <el-row class="text-photo1" style="margin-top: 5px">
        <el-col :span="6">
          <img
            src="@/assets/cqupt.png"
            alt="重庆邮电大学"
            style="height: 45px"
          />
        </el-col>
        <el-col :span="5">
          <img src="@/assets/sdu.png" alt="山东大学" style="height: 45px" />
        </el-col>
        <el-col :span="5">
          <img
            src="@/assets/sanjun.jpg"
            alt="陆军军医大学"
            style="height: 45px"
          />
        </el-col>
        <el-col :span="7">
          <img
            src="@/assets/sfu.png"
            alt="山东第一医科大学"
            style="height: 45px"
          />
        </el-col>
      </el-row>
      <el-row class="text-photo1">
        <el-col :span="6">
          <img src="@/assets/lrjk.png" alt="联仁健康" style="height: 45px" />
        </el-col>
        <el-col :span="5">
          <img src="@/assets/hhrj.png" alt="互惠软件" style="height: 45px" />
        </el-col>
        <el-col :span="5">
          <img src="@/assets/ft.png" alt="富通" style="height: 45px" />
        </el-col>
        <el-col :span="7">
          <img
            src="@/assets/sdhl.png"
            alt="山东华链医疗科技有限公司"
            style="height: 45px"
          />
        </el-col>
      </el-row>
    </div>
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
* {
  box-sizing: border-box;
}
.myMain {
  width: 100%;
  background: url("https://img.benmu-health.com/sanyi-health/bg1-new.png")
    no-repeat;
  background-size: 100% 100%;
  height: 95vh;
}

.loginContainer {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 20px 10px;
  margin-bottom: 150px;
  width: 400px;
  height: 500px;
  padding: 55px 35px 15px 35px;
  background: white;
  border: 1px solid #eaeaee;
  box-shadow: 0 0 25px #cac6c6;
}

.loginTitle {
  margin: 0px auto 40px auto;
  text-align: center;
}

.loginDiv {
  position: absolute;
  right: 80px;
  margin-top: 40px;
}

img.gif {
  position: absolute;
  top: 479px;
  left: 909px;
}

img.png {
  position: absolute;
  top: 315px;
  left: 612px;
}

.mainRight {
  position: absolute;
  top: 8px;
  left: 100px;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.mainRight h1 {
  display: block;
  color: white;
  font-size: 40px;
  letter-spacing: 4px;
  margin-top: -10px;
}
.mainImg {
  display: block;
  position: absolute;
  left: -480px;
  top: -200px;
}

.cooperation {
  background-color: white;
  position: absolute;
  bottom: 0px;
  width: 99%;
  height: 150px;
}
.cooperation .text-coop {
  margin-left: 20px;
  text-align: left;
  font-size: 20px;
  font-weight: 1000;
  color: black;
}
.cooperation img {
  margin-left: 10px;
}
.loginRemember {
  text-align: left;
  margin: 0px 0px 15px 0px;
}
.el-form-item__content {
  display: flex;
  align-items: center;
}

.form-toggle {
    margin: 20px 0;
    text-align: center
  }
.form-toggle b {
  font-size: 20px;
  cursor: pointer;
}
</style>  