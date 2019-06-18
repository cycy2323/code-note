<template>
  <div class="app-main-container">
    <div class="prompt-title">
      <span>提示：密码必须为6-32位包含小写、大写和数字格式。例：Kaa123</span>
    </div>
    <el-form :model="formPassword" ref="formPassword" label-width="120px" class="form-container">
      <el-form-item label="原密码" >
        <el-input placeholder="请输入原密码"></el-input>
      </el-form-item>
      <el-form-item label="新密码" >
        <el-input placeholder="请输入新密码"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" >
        <el-input placeholder="请再次输入新密码"></el-input>
      </el-form-item>
      <el-button type="primary" style="background: #02A5BD; width: 120px;margin: 20px auto">提交</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'changePassword',
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
    }
  }

</style>
