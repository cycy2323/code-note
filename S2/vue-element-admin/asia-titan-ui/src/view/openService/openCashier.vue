<!--suppress ALL -->
<template>
  <div class="peripheral-container">
    <div class="open-cashier-header-img"/>
    <div class="open-cashier-container">
      <div class="open-cashier-title-1 fl-left">
        <el-container>
          <el-header style="height: 18px;">
            支付操作提示
          </el-header>
          <el-main class="el-main-title" style="padding: 10px;">
            <span>1.支持多种支付方式，微信、支付宝、QQ钱包、财付通、京东钱包、手机网银等便捷支付！</span><br>
            <span>2.在手机或者电脑浏览器输入支付网址：open.gt.com，一键入款，立即到账！</span><br>
            <span>3.支付宝或微信存款金额范围为1-50000元，需要大额入款可分多次存入或使用其他方式存款！</span>
          </el-main>
        </el-container>
      </div>
      <div class="open-cashier-title-2 fl-left">
        <el-container>
          <el-header style="height: 18px;">
            支付流程
          </el-header>
          <el-main>
            <ul style="list-style-type: none">
              <li>
                <i class="el-icon-edit"/>
                <span>1.输入正确的会员账号</span>
              </li>
              <li class="ul-num-2">
                <i class="el-icon-rank"/>
                <span>2.选择支付类型</span>
              </li>
              <li class="ul-num-2">
                <i class="el-icon-edit-outline"/>
                <span>3.输入充值额度</span>
              </li>
              <br>
              <li>
                <i class="el-icon-location-outline"/>
                <span>4.点击确认支付</span>
              </li>
              <li class="ul-num-5">
                <i class="el-icon-check"/>
                <span>5.付款成功后10秒自动到账</span>
              </li>
            </ul>
          </el-main>
        </el-container>
      </div>

      <el-form v-loading="listLoading" ref="ruleForm" :model="ruleForm" :rules="rules1" label-width="100px" class="demo-ruleForm">
        <el-form-item
          label="会员账号"
          prop="account"
        >
          <el-input
            v-model="ruleForm.account"
            placeholder="请输入您要充值的会员账号"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="确定账号"
          prop="confirmAccount"
        >
          <el-input
            v-model="ruleForm.confirmAccount"
            placeholder="请确定您要充值的会员账号"
            clearable
          />
        </el-form-item>
        <el-form-item label="选择金额" prop="btnMoney" >
          <el-button
            v-for="item in quickAmount.split(',')"
            v-model="ruleForm.btnMoney"
            :key="item"
            type="success"
            size="mini"
            plain
            @click="getMoney(item)"
          >
            {{ item }}
          </el-button>
          <br>
          <span class="small-small-title">（大额存单可多次充值）</span>
        </el-form-item>
        <el-form-item
          label="确定金额"
          prop="confirmMoney"
        >
          <el-input
            v-model.number="ruleForm.confirmMoney"
            placeholder="请确定您要充值的金额"
            clearable
          />
        </el-form-item>
        <el-form-item label="选择支付方式">
          <div v-for="item in payConf" v-if="item.terminalType === judgeUser" ref="getPayType" :key="item.payType" class="small-div-container">
            <el-radio v-model="payTypeRadio" :label="item.payType">  <!-- v-if="item.isRecommend===2 ? payTypeRadio = item.payType : true " -->
              <svg-icon v-if="item.icon" :icon-class="item.icon" class="pay-logo"/>
              <span>{{ changPayment[item.payType] }}</span>
              <div class="div-display-in">
                <svg-icon v-if="item.isRecommend===2" icon-class="recommend" class="recommend"/>
                <span>选择</span>
                <i class="el-icon-arrow-right"/>
              </div>
            </el-radio>
          </div>
        </el-form-item>
        <el-form-item label="充值时间">
          <el-input
            :disabled="true"
            :placeholder=" new Date() | parseTime('{y}-{m}-{d} {h}:{i}:{s}')"
          />
          <br>
          <span class="small-small-title">（系统自动记录，无需填写）</span>
        </el-form-item>
        <br><br>
        <el-form-item class="el-button-success">
          <el-button size="medium" type="primary" @click="submitForm('ruleForm')">确定支付</el-button>
          <el-dialog
            :visible.sync="dialogPvVisible"
            :before-close="handleClose"
            title="扫码支付"
            width="250px"
            height="auto"
            show-close="false"
            center="true">
            <vue-qr :logo-src="config.imagePath" :text="config.value" :size="200" :margin="0" />
          </el-dialog>
        </el-form-item>
      </el-form>
    </div>
  </div>

</template>

<script>
import { openService, openServicePay } from '@/api/common/openPayment'
import * as Message from 'element-ui'
import elDragDialog from '@/directive/el-dragDialog'
import VueQr from 'vue-qr'
// import QRCode from 'qrcode'
// import { parseTime } from '@/utils'

const changPayment = {
  'ZFB': '支付宝',
  'BANK': '网银',
  'QQ': 'QQ支付',
  'QQ_H5': 'QQ支付H5',
  'ZFB_H5': '支付宝H5',
  'ZFB_WAP': '支付宝WAP'
}

const changeBank = {
  'cca': '中国银行',
  'ccb': '中国建设银行'
}

export default {
  name: 'OpenCashier',
  components: { VueQr },
  directive: { elDragDialog },
  data() {
    // 表单验证
    const validateAccount = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入账号'))
      } else {
        if (this.ruleForm.confirmAccount !== '') {
          this.$refs.ruleForm.validateField('confirmAccount')
        }
        callback()
      }
    }
    const validateConfirmAccount = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入账号'))
      } else if (value !== this.ruleForm.account) {
        callback(new Error('两次输入账号不一致，请重新输入'))
      } else {
        callback()
      }
    }
    const validateConfirmMoney = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入金额'))
      } else if (!Number.isInteger(value)) {
        callback(new Error('请输入正整数'))
      } else if (value < 0 || value > 100000000) {
        callback(new Error('请输入有效金额'))
      } else {
        callback()
      }
    }

    // ------------------------------------------------------------
    return {
      listLoading: false,
      changPayment,
      dialogPvVisible: false,
      zfbContent: '',
      payTypeRadio: '',
      changeBank,
      payConf: [],
      payType: '',
      sortNum: '',
      quickAmount: [],
      authCode: undefined,
      resType: '',
      judgeUser: '',
      payBank: '',
      filter: '',
      config: {
        value: 'zfbContent', // 显示的值、跳转的地址
        // 中间logo的地址
        imagePath: require('../../assets/images/zfb.png')
      },
      rules1: {
        account: [
          { validator: validateAccount, trigger: 'blur' }
        ],
        confirmAccount: [
          { validator: validateConfirmAccount, trigger: 'blur' }
        ],
        confirmMoney: [
          { validator: validateConfirmMoney, trigger: 'blur' }
        ]
      },
      ruleForm: {
        account: '',
        confirmAccount: '',
        confirmMoney: '',
        merUUID: ''
      },
      temp: {
        account: undefined,
        confirmAccount: undefined,
        // payType: 'BANK',
        // bankCode: 'ccb',
        money: undefined,
        rechargeDate: new Date(),
        // terminalType: 'PC',
        authCode: undefined
      }
    }
  },
  created() {
    this.getMethods()
  },
  mounted() {
    // this.qrcode()
  },

  methods: {
    payTypeIcon(item) {
      switch (item.payType) {
        case 'ZFB': {
          item.icon = 'zfb'
          break
        }
        case 'BANK': {
          item.icon = 'wangyin'
          break
        }
        case 'QQ': {
          item.icon = 'QQPay'
          break
        }
        case 'QQ_H5': {
          item.icon = 'QQPay'
          break
        }
        case 'ZFB_H5': {
          item.icon = 'zfb'
          break
        }
        case 'ZFB_WAP': {
          item.icon = 'zfb'
          break
        }
      }
    },
    getMethods() {
      this.listLoading = true
      openService(this.ruleForm.merUUID).then(response => {
        const data = response.data
        this.payConf = data.payConf
        this.payBank = data.payBank
        this.payType = this.payTypeRadio
        this.quickAmount = data.baseConf.quickAmount
        this.authCode = data.authCode
        this.listLoading = false
        this.sortNum = data.payConf[0].payType
        this.payTypeRadio = this.sortNum
        if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
          this.judgeUser = 'WAP'
          this.filterPC = data.payConf.forEach(item => {
            item.filter(item.terminalType === 'PC')
            console.log(item)
          })
        } else {
          this.judgeUser = 'PC'
        }
        this.payConf.forEach(item => {
          this.payTypeIcon(item)
        })
      }).catch(err => {
        Message.error(err)
        this.listLoading = false
      })
    },
    getMoney(index) {
      this.ruleForm.confirmMoney = index
    },
    submitForm(self) {
      // alert(this.payTypeRadio)
      this.listLoading = true
      this.$refs[self].validate((valid) => {
        if (valid) {
          openServicePay(
            {
              account: this.ruleForm.account,
              confirmAccount: this.ruleForm.confirmAccount,
              money: this.ruleForm.confirmMoney,
              payType: this.payTypeRadio,
              bankCode: this.temp.bankCode,
              // payType: this.temp.payType,
              rechargeDate: this.temp.rechargeDate,
              terminalType: this.judgeUser,
              authCode: this.authCode
            }
          ).then(response => {
            // this.listLoading = false
            const data = response.data
            // console.log(data.content)
            this.resType = data.resType

            if (data.resType === 1) {
              // console.log(data.content)
              if (this.payTypeRadio === 'ZFB') {
                this.dialogPvVisible = true
                this.zfbContent = data.content
                this.listLoading = false
              } else if (this.payTypeRadio === 'BANK') {
                window.location.href = data.content
                this.listLoading = false
              }
            } else {
              this.listLoading = false
              return false
            }
          }).catch(err => {
            Message.error(err)
            this.listLoading = false
          })
        } else {
          console.log('submit error')
          this.listLoading = false
          return false
        }
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？').then(_ => { done() }).catch(_ => {})
    }
  }
}
</script>

<style scoped>
  @import "../../style/openCashier.css";
</style>
