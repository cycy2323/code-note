<template>
  <div class="container">
    <div class="data-form" >
      <h2 style="padding:0 0 30px 30px;">系统设置-修改支付密码</h2>
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="130px" class="demo-ruleForm">
        <el-form-item label="旧支付密码" prop="oldPassword">
          <el-input v-model="ruleForm.oldPassword" type="password" class="pw-input" placeholder="请输入账户旧支付密码"/>
        </el-form-item>
        <el-form-item label="新支付密码" prop="newPassword">
          <el-input v-model="ruleForm.newPassword" type="password" class="pw-input" placeholder="请输入账户新支付密码"/>
        </el-form-item>
        <el-form-item label="确认新支付密码" prop="confirmPassword">
          <el-input v-model="ruleForm.confirmPassword" type="password" class="pw-input" placeholder="请确认账户新支付密码"/>
        </el-form-item>
        <el-form-item label="谷歌验证码" prop="googleCode">
          <el-input v-model="ruleForm.googleCode" class="pw-input" placeholder="请输入谷歌验证码"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">确认修改</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { resetPayPass } from '@/api/merchant/sysSetting/resetPayPassword'
import { Message } from 'element-ui'
export default {
  name: 'ResetPayPassword',
  data() {
    return {
      ruleForm: {
        oldPassword: '',
        confirmPassword: '',
        googleCode: '',
        newPassword: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: '请输入账户旧支付密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入账户新支付密码', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请确认账户新支付密码', trigger: 'blur' }
        ],
        googleCode: [
          { required: true, message: '请输入谷歌验证码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = Object.assign({}, this.ruleForm)
          data.oldPassword = this.$md5(data.oldPassword)
          data.confirmPassword = this.$md5(data.confirmPassword)
          data.newPassword = this.$md5(data.newPassword)
          resetPayPass(data).then(() => {
            Message({
              message: '操作成功',
              type: 'success',
              duration: 5 * 1000
            })
            this.resetForm('ruleForm')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style scoped>
.container{
  border-radius: 5px;
  background: #fff;
  margin: 30px;
  height: calc(100vh - 144px);
  overflow: auto;
}
  .pw-input{
    width: 200px;
  }
  .data-form{
    padding: 30px 60px 30px 30px;
    margin: 0 auto;
    border-radius: 5px;
  }
</style>
