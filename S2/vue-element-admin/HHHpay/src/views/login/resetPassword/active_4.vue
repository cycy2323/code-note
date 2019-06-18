<template>
  <div class="login-container">
    <loginHead></loginHead>
    <div class="Paso">
      <img src="../../../assets/images/active_4.png" alt="">
    </div>
    <el-form class="login-form" :label-position="labelPosition" label-width="90px">
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
    <el-button type="primary" style="width: 278px; border-radius: 2px;background: #02A5BD;" @click.native.prevent="siguiente">确定</el-button>
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
        oldPassword: undefined,
        newPassword: undefined,
        confirmarPassword: undefined,
        code: undefined
      }
    }
  },
  methods: {
    siguiente () {
      this.$router.push('/login/active_5')
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
    .login-form {
      width: 24%;
      margin-top: 70px;
      margin-bottom: 43px;
      margin-left: auto;
      margin-right: auto;
    }
  }
</style>
