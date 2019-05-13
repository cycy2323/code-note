<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="150px" class="demo-ruleForm">
    <el-form-item
      class="el-radio1"
      label="充值金额(元)"
      prop="amount"
    >
      <div style="width: 300px;">
        <el-input
          v-model="ruleForm.amount"
          oninput="this.value=(this.value>=1)?this.value:'';"
          placeholder="请输入数字"
          @blur="getAmount()"/>
      </div>
    </el-form-item>
    <el-form-item style="margin: 15px 0 20px 20px">
      <span>最小限额： <span class="red-amount">{{ minAmount }}</span></span>
      <span style="margin-left: 30px;">最大限额： <span class="red-amount">{{ maxAmount }}</span></span>
    </el-form-item>
    <el-form-item label="选择充值银行" style="margin-top: 20px">
      <div
        style="border: #c0c4cc solid 1px; width: 670px; background: #eee;border-radius: 8px;min-height:100px;margin-left: 10px">
        <div
          v-for="(v,index) in list"
          :key="index"
          :class="{'selectedBank': index===bankIndex? true:false,'unSelectedBank': index===bankIndex? false:true,'banklist':true}"
          style="width: 190px;margin: 10px 15px;display: inline-block;"
          @click="()=>handleSelectBank(v,index)">
          <svg-icon
            :icon-class="v.bankName"
            class-name="card-panel-icon"
            style="width: 60px;font-size: 36px;top:10px;vertical-align: middle"/>
          {{ v.bankName }}
        </div>
      </div>
    </el-form-item>
    <el-form-item class="el-radio1">
      <el-button v-handle="submitBtn" :disabled="submitFormBtn" type="primary" @click="submitForm('ruleForm')">提交
      </el-button>
      <el-button @click="resetForm('ruleForm')">清空</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { getBankList, doRecharge } from '@/api/merchant/merchantInfo/merchantRecharge'
import { Message } from 'element-ui'

export default {
  name: 'MerchantRecharge',
  data() {
    return {
      minAmount: '- -',
      maxAmount: '- -',
      bankIndex: null,
      list: [],
      ruleForm: {
        amount: '',
        code: undefined
      },
      rules: {
        amount: [
          { required: true, message: '金额必须为大于1的数字且不能为空' }
        ]
      },
      submitFormBtn: false,
      submitBtn: 'merchantInfo:merchantRecharge:submitBtn'

    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getBankList().then(response => {
        this.list = response
      })
    },
    getAmount() {
      const row = this.ruleForm
      if (Number(row.amount) < 1 || row.amount < 1) {
        row.amount = ''
      } else {
        row.amount = parseFloat(row.amount).toFixed(2)
      }
    },
    submitForm(formName) {
      this.listLoading = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.ruleForm.code) {
            Message.error('请选择银行')
            this.listLoading = false
          } else {
            // 防止重复点击提交
            this.submitFormBtn = true
            this.ruleForm.bankCode = this.ruleForm.code
            doRecharge(this.ruleForm).then(response => {
              Message.success('提交成功')
              setTimeout(() => {
                window.open(response.payUrl)
              }, 1000)
              this.listLoading = false
              this.resetForm('ruleForm')
              this.submitFormBtn = false
            }).catch(() => {
              this.listLoading = false
              this.submitFormBtn = false
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleSelectBank(v, index) {
      this.bankIndex = index
      this.ruleForm.code = v.bankCode
      this.minAmount = this.list[index].minAmount
      this.maxAmount = this.list[index].maxAmount
    },
    resetForm(formName) {
      this.minAmount = '- -'
      this.maxAmount = '- -'
      this.bankIndex = null
      this.ruleForm.code = undefined
      this.ruleForm.bankCode = undefined
      this.ruleForm.amount = null
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style scoped>
  .demo-ruleForm {
    width: 1000px;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: -1px 1px 3px 0px #aaa;
    background: #FFF;
  }

  .el-input1 {
    margin: 0 10px;
  }

  .el-radio {
    margin: 5px 0;
  }

  .el-radio1 {
    margin: 5px 0 5px 10px;
  }

  .red-amount {
    color: red;
  }

  .unSelectedBank {
    background: #fff;
  }

  .banklist {
    border: transparent solid 2px;
    border-radius: 8px;
    line-height: 40px;
  }

  .selectedBank {
    border: 2px solid #30B08F;
    background: #fff;
  }

</style>

