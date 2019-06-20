<template>
    <div class="login-container">
      <el-form class="login-form" :label-position="labelPosition" label-width="90px">
        <div class="title">
          <p class="first-title">HHH PAY</p>
          <p class="Secondary-title">HHH支付商户管理平台</p>
        </div>
        <el-form-item label="用户名">
          <el-input
            v-model="loginForm.username"
            :autofocus="true"
            name="username"
            type="text"
            clearable
          />
        </el-form-item>
        <el-form-item label="用户邮箱">
          <el-input
            v-model="loginForm.email"
            :autofocus="true"
            name="username"
            type="text"
            clearable
          />
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="loginForm.password"
            :autofocus="true"
            name="username"
            type="text"
            clearable
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>
        <el-form-item label="验证码" label-width="90px">
          <el-input
            v-model="loginForm.googleCode"
            :autofocus="true"
            name="username"
            type="text"
            clearable
            @keyup.enter.native="handleLogin"
            style="width: 173px;"
          />
        </el-form-item>
      </el-form>
      <el-button type="primary" style="width: 278px; border-radius: 2px;background: #02A5BD;" @click.native.prevent="handleLogin">登录</el-button>
      <!--<div class="footer">-->
        <!--<span class="footer-line"></span>-->
        <!--<span class="footer-title">Copyright 2018 支付平台,lnc,All rights reserved.</span>-->
        <!--<span class="footer-line"></span>-->
      <!--</div>-->
    </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      labelPosition: 'left',
      loginForm: {
        username: undefined,
        password: undefined,
        googleCode: undefined,
        email: undefined
      }
    }
  },
  created () {
    // this.handleLogin()
  },
  methods: {
    handleLogin () {
      this.$router.push('/login/active_1')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: url("../../assets/images/BG_image.png") no-repeat bottom;
    position: fixed;
    width: 100%;
    height: 100%;
    padding: 0 !important;
    margin: 0 !important;
    .footer {
      display: flex;
      align-items: center;
      justify-content: center;
      position: fixed;
      bottom: 50px;
      left: 24%;
      right: 24%;
      .footer-title {
        font-size: 12px;
        color: #ccc;
        letter-spacing: 1.6px;
        margin: auto 10px;
      }
      .footer-line {
        display: inline-block;
        border-top: 1px solid #ccc;
        width: 303px;
      }
    }
    .login-form {
      width: 24%;
      margin: 70px auto;
      .title {
        display: flex;
        flex-direction: column;
        align-items: center;
        .first-title {
          font-size: 50px;
          color: #02A5BD;
          margin-bottom: 20px;
          margin-top: 0;
        }
        .Secondary-title {
          font-size: 40px;
          color: #02A5BD;
          margin-top: 0;
          margin-bottom: 125px;
        }
      }
      .login-form-item {
        .el-form-item__label {
          text-align: left;
        }
        .el-input {
          width: 370px;
          background: #FFFFFF;
          border: 1px solid #C5C5C5;
          border-radius: 2px;
        }
      }
    }
  }
</style>
