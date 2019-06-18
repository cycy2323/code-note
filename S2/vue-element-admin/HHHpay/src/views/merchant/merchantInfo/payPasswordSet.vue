<template>
  <div class="app-main-container">
    <el-form :model="formPassword" ref="formPassword" label-width="120px" class="form-container">
      <el-form-item label="新支付密码" >
        <el-input type="text" placeholder="请输入IP"></el-input>
      </el-form-item>
      <el-form-item label="图形验证码" >
        <el-input placeholder="请输入图形验证码" style="width: 50%"></el-input>
        <br>
        <span class="fuzzy">看不清?换一张</span>
      </el-form-item>
      <el-form-item label="谷歌验证码" >
        <el-input placeholder="请输入谷歌验证码"></el-input>
      </el-form-item>
      <el-button type="primary" style="background: #02A5BD; width: 120px;margin: 20px auto">提交</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'payPasswordSet',
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
    .form-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 40%;
      margin: 50px auto;
      .el-form-item {
        .fuzzy {
          font-size: 12px;
          color: #02A5BD;
          letter-spacing: 0;
          cursor: pointer;
        }
      }
    }
  }

</style>
