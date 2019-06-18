<template>
  <div class="login-container">
    <loginHead></loginHead>
    <!--// 第一步修改登录密码-->
    <el-form class="login-form" :label-position="labelPosition" label-width="90px" v-if="active === 0">
      <el-form-item label="原密码">
        <el-input
          v-model="loginForm.oldPassword"
          :autofocus="true"
          name="username"
          type="text"
          clearable
        />
      </el-form-item>
      <el-form-item label="新密码">
        <el-input
          v-model="loginForm.newPassword"
          :autofocus="true"
          name="username"
          type="text"
          clearable
          @keyup.enter.native="handleLogin"
        />
      </el-form-item>
      <el-form-item label="确认新密码">
        <el-input
          v-model="loginForm.confirmarPassword"
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
    <!--第二步 设置支付密码-->
    <el-form class="login-form" :label-position="labelPosition" label-width="110px" v-if="active === 1">
      <el-form-item label="支付密码">
        <el-input
          v-model="loginForm.payPassword"
          :autofocus="true"
          name="username"
          type="text"
          clearable
        />
      </el-form-item>
      <el-form-item label="确定支付密码">
        <el-input
          v-model="loginForm.confirmarPayPassword"
          :autofocus="true"
          name="username"
          type="text"
          clearable
          @keyup.enter.native="handleLogin"
        />
      </el-form-item>
      <el-form-item label="验证码" label-width="110px">
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
    <!--第三步 绑定谷歌验证器-->
    <div class="google-img" v-if="active === 2"></div>
    <el-form class="login-form" style="width: 33%;margin-top: 35px" :label-position="labelPosition" label-width="90px" v-if="active === 2">
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
        <el-button type="primary">获取验证码</el-button>
      </el-form-item>
      <el-form-item label="谷歌验证码">
        <el-input
          v-model="loginForm.googleCodeNew"
          :autofocus="true"
          name="username"
          type="text"
          clearable
          style="width: 370px;"
          @keyup.enter.native="handleLogin"
        />
        <el-button type="primary" @click="nextActive">绑定</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
    <!--第四步 绑定登录IP-->
    <el-form class="login-form" :label-position="labelPosition" label-width="90px" v-if="active === 3">
      <el-form-item label="IP列表">
        <el-input
          v-model="loginForm.ipList"
          :autofocus="true"
          name="username"
          type="textarea"
          clearable
          class="height-170"
        />
      </el-form-item>
      <el-form-item label="谷歌验证码">
        <el-input
          v-model="loginForm.googleCodeNew"
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
    <!--第五步 成功-->
    <div class="active-4" v-if="active === 4">
      <span class="success-title">设置成功！请稍等，正在为您跳转至首页界面 ... 倒计时{{ fiveTime }}s</span>
      <el-button type="primary" style="border-radius: 2px;background: #02A5BD;" @click="homeIndex">点击立即跳转</el-button>
    </div>
    <el-button type="primary" v-if="active !== 2 && active !== 4" style="width: 278px; border-radius: 2px;background: #02A5BD;" @click.native.prevent="nextTwo">确定</el-button>
    <div class="footer" v-if="active ===2">
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
  name: 'index',
  components: { loginHead },
  data () {
    return {
      labelPosition: 'left',
      active: 0,
      loginForm: {
        oldPassword: undefined,
        newPassword: undefined,
        confirmarPassword: undefined,
        googleCode: undefined,
        confirmarPayPassword: undefined,
        payPassword: undefined,
        googleCodeNew: undefined,
        infoCode: undefined,
        ipList: undefined
      },
      fiveTime: 5
    }
  },
  created () {
    // this.handleLogin()
    this.fiveTime1()
  },
  activated () {
    window.setInterval(this.fiveTime1(), 1000)
  },
  methods: {
    fiveTime1 () {
      if (this.fiveTime === 0) {
        this.$router.push('/home')
      } else {
        this.fiveTime = this.fiveTime - 1
      }
    },
    nextTwo () {
      if (this.active++ > 4) {
        this.$router.push('/home')
      }
    },
    nextActive () {
      this.active++
    },
    homeIndex () {
      this.$router.push('/home')
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
    .active-4 {
      margin-top: 213px;
      display: flex;
      align-items: center;
      .success-title {
        font-size: 26px;
        color: #222222;
        letter-spacing: 0;
        margin-right: 20px;
      }
    }
    .Paso {
      width: 55%;
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
      /*display: flex;*/
      /*align-items: center;*/
      /*justify-content: center;*/
      /*position: fixed;*/
      /*bottom: 50px;*/
      /*left: 24%;*/
      /*right: 24%;*/
      /*.footer-title {*/
        /*font-size: 12px;*/
        /*color: #ccc;*/
        /*letter-spacing: 1.6px;*/
        /*margin: auto 10px;*/
      /*}*/
      /*.footer-line {*/
        /*display: inline-block;*/
        /*border-top: 1px solid #ccc;*/
        /*width: 303px;*/
      /*}*/
    }
    .title {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 117px;
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
        margin-bottom: 35px;
      }
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
      /*.el-form-item {*/
        /*.el-form-item__label {*/
          /*text-align: left;*/
        /*}*/
        /*.el-input {*/
          /*width: 370px;*/
          /*background: #FFFFFF;*/
          /*border: 1px solid #C5C5C5;*/
          /*border-radius: 2px;*/
        /*}*/
      /*}*/
    }
  }
</style>
