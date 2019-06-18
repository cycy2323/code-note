<template>
  <div class="login-container">
    <loginHead></loginHead>
    <div class="Paso">
      <img src="../../../assets/images/active_3.png" alt="">
    </div>
    <div class="google-img"></div>
    <el-form class="login-form" style="width: 33%;margin-top: 35px" :label-position="labelPosition" label-width="90px">
      <el-form-item label="验证码" label-width="90px">
        <el-input
          v-model="loginForm.code"
          :autofocus="true"
          name="username"
          type="text"
          clearable
          @keyup.enter.native="handleLogin"
          style="width: 173px;"
        />
      </el-form-item>
      <el-form-item label="短信验证码">
        <el-input
          v-model="loginForm.infoCode"
          :autofocus="true"
          name="username"
          type="text"
          clearable
          style="width: 370px;"
          @keyup.enter.native="handleLogin"
        />
        <el-button type="primary" style="background: #02A5BD;">获取验证码</el-button>
      </el-form-item>
      <el-form-item label="谷歌验证码">
        <el-input
          v-model="loginForm.googleCode"
          :autofocus="true"
          name="username"
          type="text"
          clearable
          style="width: 370px;"
          @keyup.enter.native="handleLogin"
        />
        <el-button type="primary" style="background: #02A5BD;" @click="nextActive">绑定</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
    <div class="footer">
      <h3>使用帮助</h3>
      <ul>
        <li>1.安装谷歌身份验证器，登录谷歌商店或App Store搜寻<span style="color: #2B99C9;">[ Iphone设备Google Authenticator ] 或 [ Android设备 谷歌身份验证器 ]</span></li>
        <li>2.下载并安装应用程式</li>
        <li>3.添加您绑定的谷歌帐号，然后用谷歌身份验证器App扫描二维码（QR CODE）</li>
        <li>4.输入谷歌身份验证器产生的验证码</li>
        <li>5.提交后将本账号绑定谷歌身份验证器整个流程完成</li>
        <li>6.如需更改谷歌验证帐号请联系客服人员</li>
        <li style="color: #2B99C9;">7.更多详情请查看Google官方指南</li>
      </ul>
    </div>
  </div>
</template>

<script>
import loginHead from '@/components/loginHead'
export default {
  name: 'active_1',
  components: { loginHead },
  data () {
    return {
      labelPosition: 'right',
      active: 0,
      loginForm: {
        infoCode: undefined,
        code: undefined,
        googleCode: undefined
      }
    }
  },
  methods: {
    nextActive () {
      this.$router.push('/login/active_4')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: url("../../../assets/images/BG_image2.png") no-repeat bottom;
    position: fixed;
    width: 100%;
    height: 100%;
    padding: 0 !important;
    margin: 0 !important;
    .Paso {
      width: 55%;
    }
    .google-img {
      width: 145px;
      height: 142px;
      margin-top: 20px;
      background: url("../../../assets/images/3.jpg") no-repeat;
    }
    .login-form {
      width: 24%;
      margin-top: 70px;
      margin-bottom: 43px;
      margin-left: auto;
      margin-right: auto;
    }
    .footer {
      ul {
        padding-left: 0;
        li {
          list-style: none;
          font-size: 14px;
          color: #333333;
          letter-spacing: 2px;
          line-height: 20px;
        }
      }
    }
  }
</style>
