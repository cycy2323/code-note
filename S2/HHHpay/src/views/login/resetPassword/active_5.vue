<template>
  <div class="login-container">
    <loginHead></loginHead>
    <div class="Paso">
      <img src="../../../assets/images/active_5.png" alt="">
    </div>
    <div class="active-4">
      <span class="success-title">设置成功！请稍等，正在为您跳转至首页界面 ... 倒计时{{ fiveTime }}s</span>
      <el-button type="primary" style="border-radius: 2px;background: #02A5BD;" @click="homeIndex">点击立即跳转</el-button>
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
      fiveTime: 5
    }
  },
  created () {
    setInterval(() => {
      this.cuentaRegresiva()
    }, 1000)
  },
  destroyed () {
    clearInterval(setInterval(() => {
      this.cuentaRegresiva()
    }, 1000))
    console.log(123)
  },
  methods: {
    homeIndex () {
      this.$router.push('/home')
    },
    cuentaRegresiva () {
      if (this.fiveTime === 0) {
        this.$router.push('/home')
      } else {
        this.fiveTime = this.fiveTime - 1
      }
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
  }
</style>
