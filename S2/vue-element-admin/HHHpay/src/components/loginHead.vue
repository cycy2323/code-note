<template>
  <div class="header-container">
    <div class="title">
      <p class="first-title">HHH PAY</p>
      <p class="Secondary-title">HHH支付商户管理平台</p>
    </div>
    <!--<div class="Paso">-->
      <!--<img src="../assets/images/active_1.png" alt="">-->
    <!--</div>-->
  </div>
</template>

<script>
export default {
  name: 'loginHead'
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .header-container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column
  }
  /*.Paso {*/
    /*width: 55%;*/
  /*}*/
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
</style>
