<template>
  <div class="app-main-container">
    <div class="prompt-title">
      <div>
        <img src="../../../assets/images/time.png" alt="">
        <span class="transfer-title">每日对账时间</span>
        <span class="transfer-num">00:30:00～01:00:00</span>
        <span class="transfer-other">（对账期间禁止提现）</span>
      </div>
      <div>
        <img src="../../../assets/images/balance.png" alt="">
        <span class="transfer-title">每日对账时间</span>
        <span class="transfer-num">¥ 83838374.838</span>
      </div>
      <div>
        <img src="../../../assets/images/transfer.png" alt="">
        <span class="transfer-title">每日对账时间</span>
        <span class="transfer-num">¥ 83838374.838</span>
      </div>
    </div>
    <el-form :model="formPassword" ref="formPassword" label-width="120px" class="form-container">
      <el-form-item label="商户号" >
        <el-input placeholder="转入商户号"></el-input>
      </el-form-item>
      <el-form-item label="商户ID" >
        <el-input placeholder="转入商户ID"></el-input>
      </el-form-item>
      <el-form-item label="转账金额" >
        <el-input placeholder="请输入转账金额"></el-input>
      </el-form-item>
      <el-form-item label="绑定手机号">
        <el-input></el-input>
      </el-form-item>
      <el-form-item label="支付密码" >
        <el-input placeholder="请输入支付密码"></el-input>
      </el-form-item>
      <el-form-item label="图形验证码" >
        <el-input placeholder="请输入图形验证码" style="width: 50%"></el-input>
        <br>
        <span style="font-size: 12px;color: #02A5BD;letter-spacing: 0;">看不清楚？ 换一张</span>
      </el-form-item>
      <el-form-item label="谷歌验证码" >
        <el-input placeholder="请输入谷歌验证码"></el-input>
      </el-form-item>
      <el-button type="primary" style="background: #02A5BD; width: 120px;margin: 20px auto">申请转账</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'transferApplication',
  data () {
    return {
      formPassword: {}
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-main-container {
    display: flex;
    /*justify-content: center;*/
    flex-direction: column;
    /*padding-bottom: 100px;*/
    .prompt-title {
      width: 90%;
      height: 60px;
      background: url("../../../assets/images/BG.png") no-repeat;
      border: 1px solid #E4E3ED;
      border-radius: 2px;
      font-size: 14px;
      color: #4E4E74;
      letter-spacing: 1px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      /*padding-left: 20px;*/
      margin: 50px auto;
      div {
        display: flex;
        align-items: center;
        .transfer-title {
          font-size: 16px;
          color: #4E4E74;
          margin-left: 10px;
          margin-right: 10px;
        }
        .transfer-num {
          font-size: 16px;
          color: #02A5BD;
        }
        .transfer-other {
          font-size: 12px;
          color: #FF6978;
        }
      }
    }
    .form-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 40%;
      margin: 1px auto;
    }
  }

</style>
