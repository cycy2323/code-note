<template>
  <el-container>
    <el-header>
      <svg-icon icon-class="cashier-pay" style="width: 50px;height: 50px;margin-right: 10px"/>
      <div style="color: #E96165">
        <span style="font-size: 35px">我的收银台</span><br>
        <span>CASHIER DESK</span>
      </div>
    </el-header>
    <el-main>
      <div style="background: pink;display: flex;justify-content: space-between;align-items: center">
        <div>
          <p>订单号：123456789</p>
          <p>订单金额：123456789元</p>
        </div>
        <div>
          订单支付剩余时间: 20
        </div>
      </div>
      <div style="display: flex;justify-content: center;margin-top: 100px">
        <vue-qr :logo-src="config.imagePath" :text="config.value" :size="200" :margin="0" />
      </div>
    </el-main>
    <el-footer/>
  </el-container>
</template>

<script>
import VueQr from 'vue-qr'
export default {
  name: 'Cashier',
  components: { VueQr },
  data() {
    return {
      config: {
        value: 'hello-world'
        // imagePath: require('../../assets/images/registerLogo.jpg')
      }
    }
  },
  methods: {}
}
</script>

<style scoped>
  .el-container {
    width: 50%;
    margin: 10% auto;
    border: 0 solid #FFFFFF;
    background: #FFFFFF;
    border-radius: 3rem;
  }
  .el-header {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f3f3f3;
    margin-top: 0;
    border-top-left-radius: 3rem;
    border-top-right-radius: 3rem;
    padding-top: 3rem;
    padding-bottom: 3rem;
  }
  .el-footer {
    /*background: #E96165;*/
    background: pink;
    border-bottom-left-radius: 3rem;
    border-bottom-right-radius: 3rem;
  }
  .el-main {
    height: 500px;
    padding: 0;
  }
</style>
