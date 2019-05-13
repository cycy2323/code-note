<template>
  <div class="container">
    <div class="data-form" >
      <h2 style="padding:0 0 30px 30px;">系统设置-绑定IP</h2>
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="130px" class="demo-ruleForm">
        <el-form-item label="绑定IP" prop="userBindIp">
          <el-input v-model="ruleForm.userBindIp" type="textarea" placeholder="请绑定IP"/>
          <div style="font-size: 12px;color: red;">注意：多个ip之间用 英文符号“;”分隔。如：127.0.0.2;127.0.0.1</div>
        </el-form-item>
        <el-form-item label="谷歌验证码" prop="googleCode">
          <el-input v-model="ruleForm.googleCode" class="pw-input" placeholder="请输入谷歌验证码"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">确认</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { setloginIp, getLoginIp } from '@/api/merchant/sysSetting/bindIP'
import { Message } from 'element-ui'
export default {
  name: 'BindIP',
  data() {
    return {
      ruleForm: {
        googleCode: '',
        userBindIp: ''
      },
      rules: {
        userBindIp: [
          { required: true, message: '请输入ip', trigger: 'blur' }
        ],
        googleCode: [
          { required: true, message: '请输入谷歌验证码', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    getLoginIp().then((res) => {
      this.ruleForm.userBindIp = res.userBindIp
    })
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = Object.assign({}, this.ruleForm)
          setloginIp(data).then(() => {
            Message({
              message: '操作成功',
              type: 'success',
              duration: 5 * 1000
            })
            this.ruleForm.googleCode = ''
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
    width: 555px;
    padding: 30px 30px 30px;
    border-radius: 5px;
  }
</style>
