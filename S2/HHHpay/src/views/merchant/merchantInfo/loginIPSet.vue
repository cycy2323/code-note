<template>
  <div class="app-main-container">
    <div class="prompt-title">
      <span>添加多个IP地址格式提示：IP用逗号分隔，例如：127.0.0.1，192.168.1.1)</span>
    </div>
    <el-form :model="formPassword" ref="formPassword" label-width="120px" class="form-container">
      <el-form-item label="IP列表" >
        <el-input type="textarea" placeholder="请输入IP"></el-input>
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
  name: 'loginIPSet',
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
      height: 38px;
      background: #FFFFFF;
      border: 1px solid #E4E3ED;
      border-radius: 2px;
      font-size: 14px;
      color: #4E4E74;
      letter-spacing: 1px;
      display: flex;
      align-items: center;
      padding-left: 20px;
      margin: 50px auto;
    }
    .form-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 40%;
      margin: 1px auto;
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
