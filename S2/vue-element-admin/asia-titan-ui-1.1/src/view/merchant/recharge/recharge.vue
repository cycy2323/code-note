<template>
  <div class="recharge">
    <div class="mask"/>
    <div class="r-header">
      <div class="cont">
        <img src="data:image/png;base64,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" alt="">
        <span>收银台</span>
      </div>
    </div>
    <div v-if="merchantInfo.extendId" class="r-body">
      <div :class="{ 'active': secondStep }" class="step">
        <svg-icon icon-class="gen" class-name="card-panel-icon"/>
        <svg-icon v-if="secondStep" icon-class="gen" class-name="card-panel-icon gan-2"/>
        <svg-icon v-else icon-class="gen2" class-name="card-panel-icon gan-2"/>
      </div>
      <div class="step-cont step-1-cont">
        <h5>填写您的汇款账号</h5>
        <p class="tip">
          注意：
          <br>
          <font color="">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1、请务必在汇款备注中填上您的转账备注码：<strong style="font-size: 16px;">{{ orderNoTen }}</strong></font>
          <br>
          <font color="">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2、我们会优先处理填写转账备注码的转账，未填写的会在24小时之后处理</font>
          <!-- <br> -->
          <!-- <font>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3、为保证充值及时到账，请在转账备注中输入您的商户ID：{{ merchantInfo.extendId }}</font> -->
        </p>
        <div class="info">
          <h6>持卡人姓名</h6>
          <el-input v-model="card.name" placeholder="请输入持卡人姓名" />
          <h6>您的银行卡号</h6>
          <el-input v-model="card.number" placeholder="您的银行卡号" />
          <el-button :class="{ 'active': card.number && card.name }" @click="goNext">下一步</el-button>
        </div>
      </div>
      <div class="step-cont step-2-cont">
        <h5>请汇款至以下银行账户</h5>
        <p class="tip">
          注意：
          <br>
          <font color="">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1、请务必在汇款备注中填上您的转账备注码：<strong style="font-size: 16px;">{{ orderNoTen }}</strong></font>
          <br>
          <font color="">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2、我们会优先处理填写转账备注码的转账，未填写的会在24小时之后处理</font>
          <!-- <br> -->
          <!-- <font>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3、为保证充值及时到账，请在转账备注中输入您的商户ID：{{ merchantInfo.extendId }}</font> -->
        </p>
        <div v-if="secondStep" class="info result">
          <div>
            <span class="lab">开户人姓名</span>
            <span>{{ info.bankCardName }}</span>
            <span class="copy" @click="copyToClipBoard('bankCardName')">点此复制</span>
          </div>
          <div>
            <span class="lab">银行名称</span>
            <span>{{ info.bankName }}</span>
            <span class="copy" @click="copyToClipBoard('bankName')">点此复制</span>
          </div>
          <div>
            <span class="lab">支行信息</span>
            <span>{{ info.subbranceBankName }}</span>
            <span class="copy" @click="copyToClipBoard('subbranceBankName')">点此复制</span>
          </div>
          <div>
            <span class="lab">专属汇款账号</span>
            <span>{{ info.bankCardNo }}</span>
            <span class="copy" @click="copyToClipBoard('bankCardNo')">点此复制</span>
          </div>
          <div>
            <span class="lab">转账备注码</span>
            <span class="s-c">{{ orderNoTen }}</span>
            <span class="copy" @click="copyToClipBoard('orderNoTen')">点此复制</span>
            <span class="s-c">（请务必在汇款备注中填上！！！）</span>
          </div>
          <div>
            <span class="lab">应付金额</span>
            <span>{{ info.amount }}元</span>
            <span class="copy" @click="copyToClipBoard('amount')">点此复制</span>
          </div>
          <el-button :class="{ 'active': secondStep }" @click="doneStep">已完成汇款</el-button>
        </div>
        <div ref="copyText" style="opacity:0">
          {{ copyText }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import request from '@/utils/request'
export default {
  data() {
    return {
      card: {
        name: '',
        number: ''
      },
      merchantInfo: {},
      orderNo: '',
      orderNoTen: '',
      info: {},
      copyText: '000',
      secondStep: false
    }
  },
  created() {
    var cke = Cookies.get('oauth2_info')
    var id = this.$route.params.id
    this.orderNo = id
    if (id.length > 10) {
      this.orderNoTen = id.substring(id.length - 10, id.length)
    } else {
      this.orderNoTen = id
    }
    if (cke) {
      this.merchantInfo = JSON.parse(cke)
    }
  },
  methods: {
    goNext() {
      if (this.card.name && this.card.number) {
        var params = {
          orderNo: this.orderNo,
          bankCardNo: this.card.number,
          bankCardName: this.card.name
        }
        request({
          url: '/order/pay/setManualPayOrderBank',
          method: 'post',
          data: params
        }).then(response => {
          this.info = response || {}
          this.secondStep = true
        })
      }
    },
    doneStep() {
      var vm = this
      var timer = document.getElementById('set-time-out')
      if (timer) timer.innerHTML = 5
      this.$confirm('<img src="/static/img/done.png"/><p><span id="set-time-out">5</span>秒后自动跳转</p><h5>您操作已完成，将关闭此页面</h5>', {
        confirmButtonText: '确定',
        showCancelButton: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        showClose: false,
        confirmButtonClass: 'sure',
        dangerouslyUseHTMLString: true,
        customClass: 'done-step',
        center: true
      }).then(() => {
        vm.closeCurrentPage()
      }).catch(() => {})
      this.fiveTimeOUt()
    },
    fiveTimeOUt() {
      var vm = this
      var timer = document.getElementById('set-time-out')
      var num = 5
      if (timer) {
        var clearTimer = setInterval(() => {
          if (num > 1) {
            num--
            timer.innerHTML = num
          } else {
            clearInterval(clearTimer)
            vm.closeCurrentPage()
          }
        }, 1000)
      } else {
        setTimeout(() => {
          this.fiveTimeOUt()
        }, 10)
      }
    },
    closeCurrentPage() {
      var userAgent = navigator.userAgent
      if (userAgent.indexOf('Firefox') !== -1 || userAgent.indexOf('Chrome') !== -1) {
        window.location.href = 'about:blank'
        window.close()
      } else {
        window.opener = null
        window.open('', '_self')
        window.close()
      }
    },
    copyToClipBoard(txt) {
      if (txt === 'orderNoTen') {
        this.copyText = this[txt]
      } else {
        this.copyText = this.info[txt]
      }
      this.$nextTick(() => {
        var node = this.$refs.copyText
        var range = document.createRange()
        var selection = document.getSelection()
        range.selectNodeContents(node)
        selection.removeAllRanges()
        selection.addRange(range)
        document.execCommand('Copy')
      })
    }
  }
}
</script>

<style scoped>
  .mask{
    background: #eef1f4;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
  }
  .recharge .cont{
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }
  .recharge .r-header{
    background: #fdfdfd;
    height: 60px;
    line-height: 60px;
    box-shadow: 0 1px 0 0 #D9D9D9;
  }
  .recharge .r-header .cont{
    display: flex;
    align-items: center;
  }
  .recharge .r-header .cont img{
    height: 40px;
  }
  .recharge .r-header .cont span{
    color: rgba(37, 50, 98, 0.51);
    font-weight: bold;
    font-size: 18px;
    position: relative;
    padding-left: 10px;
    margin-left: 10px;
  }
  .recharge .r-header .cont span::before{
    content: '';
    border-left: 1px solid rgba(37, 50, 98, 0.51);
    height: 12px;
    position: absolute;
    top: 50%;
    left: 0;
    margin-top: -6px;
  }
  .r-body{
    width: 700px;
    margin: 0 auto;
    padding: 0 25px;
    position: relative;
    margin-top: 50px;
  }
  .r-body .step{
    position: absolute;
    left: 0;
    top: 0;
    width: 1px;
    height: 440px;
    width: 20px;
  }
  .r-body .step::before{
    content: '';
    height: 434px;
    width: 1px;
    background: rgba(94, 117, 190, 0.5);
    position: absolute;
    left: 0;
    top: 0;
    box-shadow: 0 0 1px rgba(94, 117, 190, 0.5);
  }
  .r-body .step::after{
    content: '';
    height: 184px;
    width: 1px;
    background: rgba(94, 117, 190, 1);
    box-shadow: 0 0 1px rgba(94, 117, 190, 1);
    position: absolute;
    left: 0;
    top: 0;
  }
  .r-body .step.active::after{
    height: 388px;
  }
  .r-body .step .svg-icon{
    font-size: 20px;
    margin-left: -10px;
    position: relative;
    z-index: 999;
  }
  .r-body .step .gan-2{
    margin-top: 400px;
  }
  .r-body .step-cont h5{
    color: #333333;
    font-weight: normal;
    font-size: 16px;
    line-height: 20px;
    margin: 0;
  }
  .r-body .step-cont .tip{
    font-size: 14px;
    color: #ff0707;
    margin: 0;
    margin-top: 8px;
  }
  .r-body .step-cont .info{
    background:#fff;
    padding: 25px;
    border-radius: 3px;
    margin-top: 20px;
  }
  .r-body .step-cont .info h6{
    font-weight: normal;
    color: #253262;
    font-size: 14px;
    margin: 0;
    margin-bottom: 10px;
  }
  .r-body .step-cont .info .el-input{
    margin-bottom: 15px;
  }
  .r-body .step-cont .info .el-button{
    background: #5E75BE;
    color: #fff;
    width: 100%;
    opacity: 0.4;
    margin-top: 20px;
  }
  .r-body .step-cont .info .el-button.active{
    opacity: 1;
  }
  .r-body .step-cont .result{
    font-size: 14px;
    line-height: 40px;
  }
  .r-body .step-cont .result .lab{
    color: #9A9A9A;
    width: 110px;
    display: inline-block;
  }
  .r-body .step-cont .result .s-c{
    color: #EC3746;
  }
  .r-body .step-cont .result .copy{
    color: #5E75BE;
    margin-left: 10px;
    cursor: pointer;
  }
  .step-2-cont{
    margin-top: 50px;
  }
</style>

<style>
  .done-step{
    padding-bottom: 0;
  }
  .done-step .el-message-box__btns{
    border-top: 1px solid #F1F0F0;
    padding: 15px;
  }
  .done-step .sure{
    width: 100%;
    background: #5E75BE;
  }
  #set-time-out{
    color: #EC3746;
    display: inline-block;
    padding-right: 5px;
  }
  .done-step p,.done-step h5{
    margin: 0;
  }
  .done-step h5{
    font-size: 14px;
  }
</style>
