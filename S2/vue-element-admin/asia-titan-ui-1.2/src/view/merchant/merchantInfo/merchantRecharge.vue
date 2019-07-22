<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="150px" class="demo-ruleForm">
    <div class="warning-tip">
      <div>
        <svg-icon icon-class="warning"/>
        <strong>&nbsp;&nbsp;&nbsp;注意：严厉禁止使用私人银行卡对公充值的行为！</strong>
      </div>
      <p>一经发现：</p>
      <p>1、该笔订单作废，充值资金<font>不予以返还</font>；</p>
      <p>2、<font>永久关闭</font>商户充值功能；</p>
      <p>3、如若造成严重后果，<font>冻结</font>商户相应<font>余额</font>。</p>
    </div>
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
      <div class="bank-tab">
        <span :class="bankType === 'B2B' ? 'active' : ''" @click="bankType = 'B2B'">企业银行卡充值</span>
        <span :class="bankType === 'C2B' ? 'active' : ''" @click="bankType = 'C2B'">个人银行卡充值</span>
      </div>
      <div
        v-if="bankType === 'B2B'"
        style="border: #c0c4cc solid 1px; width: 670px; background: #eee;border-radius: 0 8px 8px 8px;min-height:100px;margin-left: 10px">
        <div
          v-for="(v,index) in listB2B"
          :key="index"
          :class="{'selectedBank': index===bankIndex? true:false,'unSelectedBank': index===bankIndex? false:true,'banklist':true}"
          style="width: 190px;margin: 10px 15px;display: inline-block;cursor:pointer;"
          @click="()=>handleSelectBank(v,index)">
          <svg-icon
            :icon-class="v.bankName"
            class-name="card-panel-icon"
            style="width: 60px;font-size: 36px;top:10px;vertical-align: middle"/>
          {{ v.bankName }}
        </div>
      </div>
      <div
        v-else
        style="border: #c0c4cc solid 1px; width: 670px; background: #eee;border-radius: 0 8px 8px 8px;min-height:100px;margin-left: 10px">
        <div
          v-for="(v,index) in listC2B"
          :key="index"
          :class="{'selectedBank': index===bankIndex? true:false,'unSelectedBank': index===bankIndex? false:true,'banklist':true}"
          style="width: 190px;margin: 10px 15px;display: inline-block;cursor:pointer;"
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
      bankType: 'C2B',
      listC2B: [],
      listB2B: [],
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
      getBankList({ businessType: 'C2B' }).then(response => {
        this.listC2B = response
      })
      getBankList({ businessType: 'B2B' }).then(response => {
        this.listB2B = response
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
            this.ruleForm.businessType = this.bankType
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
      this.minAmount = v.minAmount
      this.maxAmount = v.maxAmount
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
  .bank-tab{
    margin-left: 10px;
    display: flex;
    align-items: center;
    height: 30px;
    line-height: 30px;
  }
  .bank-tab span{
    display: inline-block;
    padding: 0 20px;
    border: 1px solid rgb(192, 196, 204);
    border-radius: 8px 8px 0 0;
    color: #d0caca;
    position: relative;
    margin-right: 2px;
    cursor: pointer;
    background: rgb(238, 238, 238);
  }
  .bank-tab span:hover, .bank-tab .active{
    background: rgb(238, 238, 238);
    border-bottom: 0;
    border-bottom-color: rgb(238, 238, 238);
    color: #333;
  }
  .warning-tip{
    background: #FFFBCC;
    border: 1px solid #F3A533;
    width: 721px;
    padding: 20px;
    border-radius: 2px;
    margin-left: 50px;
    margin-bottom: 50px;
    margin-top: 30px;
  }
  .warning-tip div{
    font-size: 18px;
    color: #555555;
    letter-spacing: 0;
    text-align: justify;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
  }
  .warning-tip p{
    font-size: 14px;
    color: #555555;
    letter-spacing: 0;
    text-align: justify;
    line-height: 26px;
    margin: 0;
  }
  .warning-tip font{
    color: #D42828;
  }
</style>

