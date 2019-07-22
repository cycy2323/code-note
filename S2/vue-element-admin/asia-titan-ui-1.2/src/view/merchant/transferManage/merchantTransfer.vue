<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="150px" class="demo-ruleForm">
    <el-form-item label="接收者商户ID" prop="receiverMerchantId">
      <el-input
        v-model="ruleForm.receiverMerchantId"
        placeholder="请输入数字"
        oninput="this.value=(this.value>=1)?this.value:'';"
        style="width: 200px"/>
    </el-form-item>
    <!--<el-form-item label="接收者账户ID" prop="receiverAccountId">-->
    <!--<el-input v-model.number="ruleForm.receiverAccountId" oninput="this.value=this.value.replace(/e|-/g,'');this.value=this.value.replace(/\./g,'');" type="number" style="width: 200px"/>-->
    <!--</el-form-item>-->
    <el-form-item label="接收者手机号" prop="receiverPhoneNumber">
      <el-input v-model="ruleForm.receiverPhoneNumber" style="width: 200px"/>
    </el-form-item>
    <!--<el-form-item label="接收者邮箱" prop="receiverEmail">-->
    <!--<el-input v-model="ruleForm.receiverEmail" style="width: 200px"/>-->
    <!--</el-form-item>-->
    <el-form-item label="转账金额" prop="transferAmount">
      <el-input
        v-model="ruleForm.transferAmount"
        oninput="this.value=(this.value>=1)?this.value:'';"
        placeholder="请输入数字"
        style="width: 200px"
        @blur="getAmount(ruleForm.transferAmount)"/>
    </el-form-item>
    <el-form-item label="支付密码" prop="payPassword">
      <el-input
        v-model="ruleForm.payPassword"
        type="text"
        onfocus="this.type='password'"
        autocomplete="off"
        style="width: 200px"/>
    </el-form-item>
    <el-form-item label="谷歌验证码" prop="googleVerificationCode">
      <el-input
        v-model="ruleForm.googleVerificationCode"
        oninput="this.value=(this.value>=1)?this.value:'';"
        placeholder="请输入数字"
        style="width: 200px"/>
    </el-form-item>
    <el-form-item>
      <el-button v-handle="submitBtn" type="primary" @click="submitForm('ruleForm')">转账</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { innerTransfer } from '@/api/merchant/merchantTransfer/merchantTransfer'
import { Message } from 'element-ui'

export default {
  name: 'MerchantTransfer',
  data() {
    return {
      ruleForm: {
        receiverMerchantId: undefined,
        receiverAccountId: undefined,
        receiverPhoneNumber: undefined,
        // receiverEmail: undefined,
        transferAmount: undefined,
        payPassword: undefined,
        googleVerificationCode: undefined
      },
      rules: {
        receiverMerchantId: [
          { required: true, message: '接收者商户ID必须为数字值且不为空', trigger: 'change' }
        ],
        receiverAccountId: [
          { required: true, message: '请输入接收者账户ID', trigger: 'blur' },
          { type: 'number', message: '接收者账户ID必须为数字值' }
        ],
        receiverPhoneNumber: [
          { required: true, message: '请输入接收者手机号', trigger: 'change' }
        ],
        // receiverEmail: [
        //   { required: true, message: '请输入接收者邮箱', trigger: 'blur' }
        // ],
        transferAmount: [
          { required: true, message: '请输入转账金额且必须为数字', trigger: 'blur' }
        ],
        payPassword: [
          { required: true, message: '请输入支付密码', trigger: 'blur' }
        ],
        googleVerificationCode: [
          { required: true, message: '谷歌验证码必须为数字值且不为空', trigger: 'change' }
        ]
      },
      submitBtn: 'transferManage:merchantTransfer:submitBtn'
    }
  },
  methods: {
    getAmount() {
      if (Number(this.ruleForm.transferAmount) < 1 || this.ruleForm.transferAmount < 1) {
        this.ruleForm.transferAmount = ''
      } else {
        this.ruleForm.transferAmount = parseFloat(this.ruleForm.transferAmount).toFixed(2)
      }
    },
    submitForm(formName) {
      this.listLoading = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = Object.assign({}, this.ruleForm)
          // 加密参数
          params.transferAmount = Number(params.transferAmount).toFixed(2)
          params.payPassword = this.$md5(params.payPassword)

          // 提交接口
          innerTransfer(params).then(response => {
            Message({
              message: '操作成功',
              type: 'success',
              duration: 5 * 1000
            })
            this.resetForm('ruleForm')
            this.listLoading = false
          }).catch(() => {
            this.listLoading = false
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
  .demo-ruleForm {
    width: 50%;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background: #FFF;
    box-shadow: 0px 0px 3px 0px #aaa;
  }
</style>

