<template>
  <div class="login-container" style="background-color: #FFFFFF">
    <div :style="styleObject" class="bgImgContent"/>
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" :hide-required-asterisk="false" class="login-form" auto-complete="on" label-position="top">

      <div class="bg-img"/>
      <div class="title-container">
        <h3 class="title">{{ title }}</h3>
      </div>

      <el-form-item prop="username" label="账号">
        <el-input
          v-model="loginForm.username"
          :class="focusCtr===1?'on-focus':'un-focus'"
          :autofocus="true"
          clearable
          name="username"
          type="text"
          auto-complete="on"
          @focus="changeFocus(1)"
          @blur="removeFocus()"
        />
      </el-form-item>

      <el-form-item prop="password" label="密码">
        <el-input
          :type="passwordType"
          v-model="loginForm.password"
          :class="focusCtr=== 2 ? 'on-focus':'un-focus'"
          clearable
          name="password"
          auto-complete="on"
          @focus="changeFocus(2)"
          @blur="removeFocus()"
          @keyup.enter.native="handleLogin" />
      </el-form-item>

      <el-form-item label="谷歌验证码">
        <el-input
          v-model="loginForm.googleCode"
          :class="focusCtr===3?'on-focus':'un-focus'"
          clearable
          name="googleCode"
          type="text"
          auto-complete="on"
          @focus="changeFocus(3)"
          @blur="removeFocus()"
          @keyup.enter.native="handleLogin" />
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;margin-top:40px;background: #5E75BE" @click.native.prevent="handleLogin">{{ $t('login.logIn') }}</el-button>
    </el-form>
  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'
import LangSelect from '@/components/LangSelect'
import SocialSign from './socialsignin'

export default {
  name: 'Login',
  components: { LangSelect, SocialSign },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value && value.length < 6) {
        callback(new Error('密码不能小于 6 位'))
      } else {
        callback()
      }
    }
    return {
      focusCtr: 1,
      loginForm: {
        username: undefined,
        password: undefined,
        googleCode: ''
      },
      loginRules: {
        username: [{ trigger: 'blur', validator: validateUsername }],
        password: [{ trigger: 'blur', validator: validatePassword }]
      },
      styleObject: {
        overflow: 'hidden',
        background: '',
        backgroundPosition: ''
      },
      passwordType: 'password',
      loading: false,
      showDialog: false,
      redirect: undefined,
      title: ''
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('hashchange', this.afterQRScan)
  },
  mounted() {
    if (document.domain === this.MerchantHost) {
      this.title = 'Hey! 欢迎登录商户后台系统'
      this.styleObject.background = 'url(/static/img/merchant.png) no-repeat'
      this.styleObject.backgroundPosition = 'right top'
    } else if (document.domain === this.ManageHost) {
      this.title = 'Hey! 欢迎登录总管理后台系统'
      this.styleObject.background = 'url(/static/img/admin.png) no-repeat'
      this.styleObject.backgroundPosition = 'right top'
    } else if (document.domain === this.AgentHost) {
      this.title = 'Hey! 欢迎登录代理后台系统'
      this.styleObject.background = 'url(/static/img/agent.png) no-repeat'
      this.styleObject.backgroundPosition = 'right top'
    }
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  },
  methods: {
    changeFocus(num) {
      this.focusCtr = num
    },
    removeFocus() {
      this.focusCtr = ''
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    handleLogin() {
      if (!this.loginForm.username) {
        this.$message.error('账号不能为空')
        return
      }
      if (!this.loginForm.password) {
        this.$message.error('密码不能为空')
        return
      }
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('LoginByUsername', this.loginForm).then(response => {
            this.loading = false
            if (response.bindGoogle === 0) {
              this.$router.push({ name: 'reset', params: { typeId: '3302' }})
            } else if (response.resetFlag === 1) {
              this.$router.push({ name: 'reset', params: { typeId: '3301' }})
            } else {
              this.$router.push({ path: this.redirect || '/' })
            }
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg:#FFFFFF;
  $light_gray:#FFFFFF;
  $cursor: #253262;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input{
      color: $cursor;
      &::first-line {
        color: $cursor;
      }
    }
  }

  /* reset element-ui css */
  .login-container {
    .bgImgContent {
      width: 50%;
      height: 100%;
      position: absolute;
      right: 0;
      top: 0;
    }
    .el-input {
      display: inline-block;
      /*height: 47px;*/
      width: 100%;
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 0px;
        /*font-size: 18px;*/
        color: #333333;
        line-height: 18px;
        /*<!--color: $light_gray;-->*/
        /*height: 47px;*/
        caret-color: $cursor;
        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }
    .el-form-item {
      /*border: 1px solid rgba(255, 255, 255, 0.1);*/
      /*background: rgba(0, 0, 0, 0.1);*/
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  padding-bottom: 30px;
  /*background: url("../../../static/img/admin.png") no-repeat;*/
  /*background-size: cover;*/
  background-position: right top;
  .login-form {
    background: #FFFFFF;
    box-shadow: 0 0 40px 0 rgba(56,48,172,0.10);
    border-radius: 10px;
    position: absolute;
    left: 30%;
    top: 50%;
    transform: translate(-50%, -50%);
    right: 0;
    width: 443px;
    max-width: 100%;
    height: 663px;
    padding: 35px 35px 15px 35px;
    /*margin: 94px auto 120px auto;*/
    .el-input:focus {
      outline-color: #253262;
    }
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title-container {
    position: relative;
    .title {
      font-size: 28px;
      color: #253262;
      letter-spacing: -0.9px;
      line-height: 30px;
      margin: 100px auto 50px auto;
      opacity: 0.5;
      font-weight: bold;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
    }
  }
  .bg-img {
    width: 158px;
    height: 65px;
    position: absolute;
    top: 40px;
    /*border: 1px solid #ccc;*/
    background: url("../../assets/images/logo.png") no-repeat;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
  .un-focus{
    border: 0 none;
    border-bottom: 1px solid #F0F1F3;
    border-radius: 0;
  }
  .on-focus{
    border: 0 none;
    border-bottom: 1px solid #253262;
    border-radius: 0;
  }
}
</style>
<style>
  .login-container .el-form--label-top .el-form-item__label{
    padding: 0;
    color: #9095A9;
    font-size: 12px;
  }
</style>

