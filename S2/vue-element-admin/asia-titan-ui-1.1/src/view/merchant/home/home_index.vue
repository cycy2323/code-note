<template>
  <div v-if="data" class="app-container" style="width: 100%; ">
    <el-container>
      <el-aside style="width: 270px;height: 248px; background: #fff; border-radius: 4px;margin: 40px 0 0 40px">
        <el-row>
          <el-col style="text-align: center;padding: 15px">
            <svg-icon icon-class="mario" class-name="card-panel-icon" style="width:100%;height: 50px;"/>
          </el-col>
          <el-col style="text-align: center">
            <div style="font-weight: 700;font-size: 16px;color: #666;margin-bottom: 5px">{{ phone| phonePlusXing }}&nbsp;&nbsp;欢迎回来!</div>
            <div style="display: flex;flex-direction:column;padding-bottom: 10px;align-items: center">
              <div style="text-align: left">
                <div class="transition-box" style="padding-bottom: 5px">{{ email| plusXing }}</div>
                <div class="transition-box" style="padding-bottom: 5px">商户id：{{ merchantId }}</div>
                <div class="transition-box" style="padding-bottom: 15px">账户id：{{ accountId }}</div>
              </div>
              <div style="width: 65px ; border-bottom: 1px solid #ddd"/>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="24" class="card-panel-col" style="text-align: center;margin-top: 10px">
            <el-button
              v-handle="merchantRecharge"
              class="green-btn home-btn"
              style="width: 100px;height: 32px;border: none"
              type="primary"
              @click="goToCharge">
              商户充值
            </el-button>
            <el-button
              v-handle="merchantWithdrawModel"
              class="green-btn home-btn"
              style="width: 100px;height: 32px;border: none"
              type="primary"
              @click="goToWithdraw">
              提现
            </el-button>
          </el-col>
        </el-row>
      </el-aside>
      <el-main v-handle="reportForm" style="margin-left: 2.5%">
        <el-row :gutter="40" class="panel-group">
          <el-col :xs="12" :sm="12" :md="12" :lg="6" class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon-wrapper icon-paid-order">
                <svg-icon icon-class="jiaoyiliushui" class-name="card-panel-icon"/>
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">账户总余额</div>
                <!--<span class="card-panel-num">{{ totalAmount }}</span>-->
                <count-to :start-val="0" :end-val="totalAmount" :duration="2000" :decimals="numberAmount" class="card-panel-num"/>
              </div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="6" class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon-wrapper icon-transaction-flow">
                <svg-icon icon-class="wallet" class-name="card-panel-icon"/>
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">可提现金额</div>
                <!--<span class="card-panel-num">{{ withdrawAmount }}</span>-->
                <count-to
                  :start-val="0"
                  :end-val="withdrawAmount"
                  :duration="3000"
                  :decimals="numberAmount"
                  class="card-panel-num"/>
              </div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="6" class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon-wrapper icon-transaction-flow">
                <svg-icon icon-class="depositAmount" class-name="card-panel-icon"/>
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">总充值金额</div>
                <!--<span class="card-panel-num">{{ rechargeAmount }}</span>-->
                <count-to
                  :start-val="0"
                  :end-val="rechargeAmount"
                  :duration="3200"
                  :decimals="numberAmount"
                  class="card-panel-num"/>
              </div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="6" class="card-panel-col">
            <div class="card-panel">
              <div class="card-panel-icon-wrapper icon-withdraw">
                <svg-icon icon-class="freeze" class-name="card-panel-icon"/>
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">已冻结金额</div>
                <!--<span class="card-panel-num">{{ freezeAmount }}</span>-->
                <count-to
                  :start-val="0"
                  :end-val="freezeAmount"
                  :duration="3600"
                  :decimals="numberAmount"
                  class="card-panel-num"/>
              </div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="6" class="card-panel-col">
            <div class="card-panel" @click="handleSetLineChartData('shoppings')">
              <div class="card-panel-icon-wrapper icon-paid-order">
                <svg-icon icon-class="withdrawCount" class-name="card-panel-icon"/>
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">今日代付订单条数</div>
                <!--<span class="card-panel-num">{{ remitOrderCount }}</span>-->
                <count-to :start-val="0" :end-val="remitOrderCount" :duration="3600" class="card-panel-num"/>
              </div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="6" class="card-panel-col">
            <div class="card-panel" @click="handleSetLineChartData('shoppings')">
              <div class="card-panel-icon-wrapper icon-paid-order">
                <svg-icon icon-class="withdrawAmount" class-name="card-panel-icon"/>
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">今日代付总金额</div>
                <!--<span class="card-panel-num">{{ remitAmount }}</span>-->
                <count-to
                  :start-val="0"
                  :end-val="remitAmount"
                  :duration="3600"
                  :decimals="numberAmount"
                  class="card-panel-num"/>
                  <!--<el-button type="primary" @click="withdrawApply">提现</el-button>-->
              </div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="6" class="card-panel-col">
            <div class="card-panel" @click="handleSetLineChartData('shoppings')">
              <div class="card-panel-icon-wrapper icon-paid-order">
                <svg-icon icon-class="daifuliushui" class-name="card-panel-icon"/>
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">今日支付订单条数</div>
                <!--<span class="card-panel-num">{{ payOrderCount }}</span>-->
                <count-to :start-val="0" :end-val="payOrderCount" :duration="3600" class="card-panel-num"/>
                <!--<el-button type="primary" @click="withdrawApply">提现</el-button>-->
              </div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="6" class="card-panel-col">
            <div class="card-panel" @click="handleSetLineChartData('shoppings')">
              <div class="card-panel-icon-wrapper icon-paid-order">
                <svg-icon icon-class="rmb" class-name="card-panel-icon"/>
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">今日支付总金额</div>
                <!--<span class="card-panel-num">{{ payAmount }}</span>-->
                <count-to
                  :start-val="0"
                  :end-val="payAmount"
                  :duration="3600"
                  :decimals="numberAmount"
                  class="card-panel-num"/>
                  <!--<el-button type="primary" @click="withdrawApply">提现</el-button>-->
              </div>
            </div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import lineChart from './LineChart'
// import { cashWithdrawal, fetchList } from '@/api/agency/home'
import { homeInfo, getReport } from '@/api/merchant/merchantHome/homeInfo'

const lineChartData = {
  newVisitis: {
    totalFlowData: [],
    transactionFlData: [],
    paidFlData: []
  }
}
var Date1 = new Date()
var Date7 = new Date(Date1.getTime() - 144 * 60 * 60 * 1000)
// var currentdate1
// var xname1
export default {
  components: {
    CountTo,
    lineChart
  },
  filters: {
    plusXing(str) {
      str = str.toString()
      const len = str.length - 3 - 8
      let xing = ''
      for (let i = 0; i < len; i++) {
        xing += '*'
      }
      return str.substring(0, 3) + xing + str.substring(str.length - 8)
    },
    phonePlusXing(str) {
      str = str.toString()
      const len = str.length - 3 - 4
      let xing = ''
      for (let i = 0; i < len; i++) {
        xing += '*'
      }
      return str.substring(0, 3) + xing + str.substring(str.length - 4)
    }
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      data: null,
      totalAmount: undefined,
      withdrawAmount: undefined,
      rechargeAmount: undefined,
      freezeAmount: undefined,
      remitOrderCount: undefined,
      payOrderCount: undefined,
      remitAmount: undefined,
      payAmount: undefined,
      show3: false,
      phone: undefined,
      email: undefined,
      merchantId: undefined,
      accountId: undefined,

      dialogVisible: false,
      payOrderAmount: [], // 交易流水
      remitOrderAmount: [], // 代付流水
      totalOrderAmount: [], // 总流水
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        auditStat: undefined,
        state: undefined,
        orderStatus: undefined,
        payType: undefined,
        orderNo: undefined,
        ZFBOrderNo: undefined,
        startDate: undefined,
        endDate: undefined,
        sort: '+id'
      },
      temp: {
        googleCode: undefined,
        withdrawAmount: undefined
      },
      tempCopy: {
        startDate: Date7,
        endDate: Date1
      },
      numberAmount: 2, // 保留三位小数
      merchantWithdrawModel: 'merchantInfo:merchantWithdrawModel',
      merchantRecharge: 'merchantInfo:merchantRecharge',
      reportForm: 'home:reportForm'
    }
  },
  created() {
    this.getDataInfo()
    // this.orderFlowInfo()
  },
  methods: {
    // 订单流水echarts信息
    // orderFlowInfo() {
    //   fetchList(this.tempCopy).then(data => {
    //     // debugger
    //     data.forEach(item => {
    //       this.payOrderAmount.push(item.payOrderAmount)
    //       this.remitOrderAmount.push(item.remitOrderAmount)
    //       this.totalOrderAmount.push(item.totalOrderAmount)
    //     })
    //     this.lineChartData.totalFlowData = this.totalOrderAmount
    //     this.lineChartData.transactionFlData = this.payOrderAmount
    //     this.lineChartData.paidFlData = this.remitOrderAmount
    //   })
    // },
    // 获取今日订单 今日流水数据
    getDataInfo() {
      var getCodeList = localStorage.getItem('codeList')
      var myCodeList = getCodeList ? JSON.parse(getCodeList) : []
      if (myCodeList.indexOf('home:reportForm') > -1) {
        getReport().then(data => {
          this.totalAmount = data.totalAmount
          this.withdrawAmount = data.withdrawAmount
          this.rechargeAmount = data.rechargeAmount
          this.freezeAmount = data.freezeAmount
          this.remitOrderCount = data.remitOrderCount
          this.payOrderCount = data.payOrderCount
          this.remitAmount = data.remitAmount
          this.payAmount = data.payAmount
        })
      }
      homeInfo().then(data => {
        this.data = data
        this.phone = data.phone
        this.email = data.email
        this.merchantId = data.merchantId
        this.accountId = data.accountId
      })
    },
    // 提现
    // withdrawSubmit() {
    //   cashWithdrawal(this.temp).then(response => {
    //     // console.log(response)
    //     if (response.code === 200) {
    //       // alert(123)
    //       this.$message({
    //         message: '提现申请成功',
    //         type: 'success'
    //       })
    //     }
    //     this.dialogVisible = false
    //   }).catch(err => {
    //     Message.error(err)
    //   })
    // },
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
    withdrawApply() {
      this.dialogVisible = true
    },
    // 根据时间查询订单流水信息
    handleFilter() {
      this.orderFlowInfo()
    },
    goToCharge() {
      this.$router.push('/merchantInfo/merchantRecharge')
    },
    goToWithdraw() {
      this.$router.push('/merchantInfo/merchantWithdrawModel')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .infoList {
    padding-left: 10px;
  }

  .panel-group {
    margin-top: 18px;

    .card-panel-col {
      min-width: 300px;
      margin-bottom: 32px;
    }

    .card-panel {
      height: 108px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);

      &:hover {
        .card-panel-icon-wrapper {
          color: #fff;
        }

        .icon-transaction-order {
          background: #40A3FF;
        }

        .icon-paid-order {
          background: #40FFF2;
        }

        .icon-transaction-flow {
          background: #A640FF;
        }

        .icon-paid-flow {
          background: #FF40EF
        }

        .icon-withdraw {
          background: red;
        }
      }

      .icon-transaction-order {
        color: #40A3FF;
      }

      .icon-paid-order {
        color: #40FFF2;
      }

      .icon-transaction-flow {
        color: #A640FF;
      }

      .icon-paid-flow {
        color: #FF40EF
      }

      .icon-withdraw {
        color: red;
      }

      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }

      .card-panel-icon {
        float: left;
        font-size: 48px;
      }

      .card-panel-description {
        float: right;
        font-weight: bold;
        margin: 26px;
        margin-left: 0px;

        .card-panel-text {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.8);
          font-size: 16px;
          margin-bottom: 12px;
        }

        .card-panel-num {
          float: right;
          margin-left: 0px;
          font-size: 20px;
        }
      }
    }
  }

  .transition-box {
    color: #898989;
    font-size: 14px;
  }

  .home-btn {
    color: #ffffff;
  }
</style>
