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
        <div class="myForm">
          <el-form
      element-loading-text="正在登陆..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      ref="loginForm"
      :model="loginForm"
      :rules="rules"
      class="loginContainer"
    >
      <h1 class="loginTitle" style="margin-left: 20px;margin-bottom: 10px;">用户登陆</h1>
      <el-form-item prop="name">
        <el-input
          type="text"
          auto-complete="false"
          v-model="loginForm.name"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          show-password
          type="password"
          auto-complete="false"
          v-model="loginForm.password"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>

      <el-button type="primary" style="width: 100%" @click="submitlogin"
        >登录</el-button
      >
      <el-button
        style="width: 100%; margin-top: 20px; margin-left: 0px"
        @click="register"
        >注册</el-button
      >
    </el-form>
        </div>
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
import { postRequest } from "@/utils/api";
import { mapActions } from "vuex";
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      loading: false,
      checked: true,
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  methods: {
    submitlogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;

          postRequest("/admin/user/login", this.loginForm).then((resp) => {
            if (resp) {
              this.loading = false;
              console.log(resp);
              if (resp.code == "200") {
                this.$router.replace("/dash");
                 sessionStorage.setItem("user",JSON.stringify(resp.data));
                 localStorage.setItem("user", JSON.stringify(resp.data))
              

          console.log(this.loginForm.password)
          console.log()
          postRequest("/admin/user/login", this.loginForm).then((resp) => {
  
            if (resp) {
              console.log("登录请求:"+resp)
              console.log(2)
              this.loading = false;
              if (resp.code == "200") {
                this.$router.replace("/introduce");
                localStorage.setItem("user", JSON.stringify(resp.data))
              
              }else {
                this.$message.error("用户名或密码错误");
            
                return false;

              }
                
            }
          });
        } else {
          this.$message.error("用户名或密码错误");
          return false;
        }

            }else{
              console.log("3")
            }
          });
        } 

      });
    },
    register() {
      this.$router.replace("/register");
    },
  },
};
</script>

<style scoped>
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
</style>
