<template>
  <div class="baseInfo-container">
    <el-form :model="formBaseInfo" :rules="rules" ref="formBaseInfo" label-width="130px" class="el-form-wrapper">
      <el-form-item label="商户名" >
        <el-input></el-input>
      </el-form-item>
      <el-form-item label="公司名称">
        <el-input></el-input>
      </el-form-item>
      <el-form-item label="公司机构代码">
        <el-input></el-input>
      </el-form-item>
      <el-form-item label="网站地址">
        <el-input></el-input>
      </el-form-item>
      <el-form-item label="商户ID">
        <el-input></el-input>
      </el-form-item>
      <el-form-item label="法人身份证">
        <el-input></el-input>
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input></el-input>
      </el-form-item>
      <el-form-item label="联系QQ">
        <el-input></el-input>
      </el-form-item>
      <el-form-item label="邮箱地址">
        <el-input></el-input>
      </el-form-item>
      <el-form-item label="开户银行">
        <el-input></el-input>
      </el-form-item>
      <el-form-item label="开户账户">
        <el-input></el-input>
      </el-form-item>
      <el-form-item label="开户名称">
        <el-input></el-input>
      </el-form-item>
      <el-form-item label="开户支行">
        <el-input></el-input>
      </el-form-item>
      <el-button type="primary" style="background: #02A5BD;width: 120px;margin: 1px auto">提交</el-button>
    </el-form>

  </div>
</template>

<script>
export default {
  name: 'baseInfo',
  data () {
    return {
      formBaseInfo: {},
      rules: {}
    }
  },
  created () {
  },
  methods: {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .baseInfo-container {
    width: 61.7%;
    margin: 20px auto;
    background-color: #FFFFFF;
    display: flex;
    justify-content: center;
    .el-form-wrapper {
      width: 40%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin: 40px auto;
    }
  }
</style>
