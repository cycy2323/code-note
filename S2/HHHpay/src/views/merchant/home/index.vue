<template>
  <div class="home-container">
    <p class="AnuncioInfo-container" @click="anuncioDialog"><img src="../../../assets/images/notice.png" alt="" style="margin-right: 10px">{{AnuncioInfo}}</p>
    <div>
      <h4 class="operate-title">快捷操作</h4>
      <div class="operate-container">
        <p><img src="../../../assets/images/payment.png" alt="">充值</p>
        <p><img src="../../../assets/images/rejected-check.png" alt="">订单查询</p>
        <p><img src="../../../assets/images/cuestion.png" alt="">即时下发</p>
        <p><img src="../../../assets/images/Grabar.png" alt="">即时记录</p>
      </div>
    </div>
    <div class="main-content">
      <div class="moneyInfo">
        <h4 class="operate-title">金额信息</h4>
        <div>
          <img src="../../../assets/images/totalaccount.png" alt="">
          <span class="chinese-title">总账户余额</span>
          <span class="english-title">Total account balance</span>
          <span class="money">￥ {{ totalOverage }}</span>
        </div>
        <div>
          <img src="../../../assets/images/Liquidacion.png" alt="">
          <span class="chinese-title">可结算金额</span>
          <span class="english-title">Billable amount</span>
          <span class="money">￥ {{ BillableOverage }}</span>
        </div>
        <div>
          <img src="../../../assets/images/totalaccount.png" alt="">
          <span class="chinese-title">不可结算金额</span>
          <span class="english-title">Unsettable amount</span>
          <span class="money">￥ {{UnsettableOverage}}</span>
        </div>
        <div>
          <img src="../../../assets/images/totalaccount.png" alt="">
          <span class="chinese-title">已冻结金额</span>
          <span class="english-title">Frozen amount</span>
          <span class="money">￥ {{freezeOverage}}</span>
        </div>
      </div>
      <div style="width: 76%;">
        <div style="width: 100%;">
          <h4 class="operate-title">交易系统图</h4>
          <div style="height: 378px;width: 100%;background-color: #FFFFFF"></div>
        </div>
        <div>
          <h4 class="operate-title">交易环比</h4>
          <div style="height: 288px;width: 100%;background-color: #FFFFFF"></div>
        </div>
      </div>
    </div>

    <!--// 通告栏弹框-->
    <el-dialog
      :title="AnuncioInfo"
      :visible.sync="dialogVisible"
      width="30%"
      id="tishi"
      >
      <span class="dialogLine"></span>
      <span class="dialog-content">{{ AnuncioContent }}</span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      AnuncioInfo: '信息平台最新系统消息，请及时跟进并作出调整。',
      dialogVisible: false,
      AnuncioContent: '歌词是诗歌的一种，入乐的叫歌，不入乐的叫诗（或词）。入乐的歌在感情抒发、形象塑造上和诗没有任何区别，但在结构上、节奏上要受音乐的制约，在韵律上要照顾演唱的方便，在遣词炼字上要考虑听觉艺术的特点，因为它要入乐歌唱。歌词与诗的分别，主要是诗不一定要入乐（合乐），歌词是要合乐的。合乐成...',
      totalOverage: '1145456',
      BillableOverage: '245465',
      UnsettableOverage: '3454564',
      freezeOverage: '44654654'
    }
  },
  created () {
    this.test()
  },
  methods: {
    test () {
      // console.log(this.$route)
    },
    anuncioDialog () {
      this.dialogVisible = true
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .home-container {
    width: 61.7%;
    margin: 20px auto;
    .AnuncioInfo-container {
      cursor: pointer;
      display: flex;
      align-items: center;
      padding-left: 15px;
      padding-right: 15px;
      margin: 0;
      width: 100%;
      height: 43px;
      background-color: #FFFFFF;
      border-radius: 3px;
      font-size: 14px;
      color: #222222;
    }
    .el-dialog {
      .dialogLine {
        display: inline-block;
        width: 100%;
        border-top: 1px solid #ccc;
      }
      .dialog-content {
        font-size: 14px;
        color: #717171;
        letter-spacing: 2.1px;
        line-height: 21px;
      }
    }
    #tishi /deep/ {
      .el-dialog__body {
        padding-top: 0;
      }
    }
    .operate-title {
      font-size: 20px;
      color: #222222;
      margin-bottom: 22px;
    }
    .operate-container {
      display: flex;
      justify-content: space-between;
      p {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 260px;
        height: 44px;
        background: #FFFFFF;
        border: 1px solid #E4E3ED;
        border-radius: 4px;
        font-size: 14px;
        color: #9090AB;
        margin-top: 0;
        img {
          margin-right: 9px;
        }
      }
    }
    .operate-title::before {
      content: '';
      width: 11px;
      height: 11px;
      display: inline-block;
      background-color: #02A5BD;
      margin-right: 5px;
    }
    .main-content {
      width: 100%;
      display: flex;
      .moneyInfo {
        width: 20%;
        margin-right: 45px;
        display: flex;
        flex-direction: column;
        div {
          border: 1px solid #FFFFFF;
          border-radius: 2px;
          background-color: #FFFFFF;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin-bottom: 20px;
          img {
            margin-top: 10px;
            margin-bottom: 15px;
          }
          .money {
            font-size: 22px;
            color: #42CBE0;
            margin-top: 22px;
            margin-bottom: 20px;
          }
          .chinese-title {
            font-size: 16px;
            color: #4E4E74;
          }
          .english-title {
            font-size: 12px;
            color: #9090AB;
          }
        }
      }
    }
  }
</style>
