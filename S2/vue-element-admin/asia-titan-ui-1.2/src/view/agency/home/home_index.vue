<template>
  <div class="app-container">
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-transaction-order">
            <svg-icon icon-class="payOrder" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">今日交易订单(笔)</div>
            <span class="card-panel-num">{{ transactionOrder }}</span>
            <!--<count-to :start-val="0" :end-val="transactionOrder" :duration="2600" class="card-panel-num"/>-->
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-paid-order">
            <svg-icon icon-class="paidOrder" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">今日代付订单(笔)</div>
            <span class="card-panel-num">{{ paidOrder }}</span>
            <!--<count-to :start-val="0" :end-val="paidOrder" :duration="3000" class="card-panel-num"/>-->
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-transaction-flow">
            <svg-icon icon-class="payStatistics" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">今日交易流水(元)</div>
            <span class="card-panel-num">{{ tradingFlow }}</span>
            <!--<count-to :start-val="0" :end-val="tradingFlow" :duration="3200" class="card-panel-num"/>-->
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-paid-flow">
            <svg-icon icon-class="paidStatistics" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">今日代付流水(元)</div>
            <span class="card-panel-num">{{ paidFlow }}</span>
            <!--<count-to :start-val="0" :end-val="paidFlow" :duration="3600" class="card-panel-num"/>-->
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-withdraw">
            <svg-icon icon-class="payment" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">可提现金额(元)</div>
            <span class="card-panel-num">{{ withdrawMoney }}</span>
            <!--<count-to :start-val="0" :end-val="withdrawMoney" :duration="3600" class="card-panel-num"/>-->
            <el-button type="primary" style="padding-left: 20px" size="mini" @click="withdrawApply">提现</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row class="panel-group">
      <el-col :xs="12" :sm="12" :lg="10" class="card-panel-col">
        <el-date-picker
          v-model="tempCopy.startDate"
          type="date"
          format="yyyy-MM-dd"
          placeholder="开始时间"/>
        &nbsp;
        至
        &nbsp;
        <el-date-picker
          v-model="tempCopy.endDate"
          type="date"
          style="margin-right: 20px"
          format="yyyy-MM-dd"
          placeholder="结束时间"/>
        <el-button
          class="filter-item pan-btn green-btn"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        >{{ $t('merchantList.search') }}
        </el-button>
      </el-col>
    </el-row>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart
        ref="lineChart"
        :start-date="tempCopy.startDate"
        :end-date="tempCopy.endDate"
        :pay-order-amount="payOrderAmount"
        :remit-order-amount="remitOrderAmount"
        :total-order-amount="totalOrderAmount"
        :chart-data="lineChartData"/>
    </el-row>
    <el-dialog :visible.sync="dialogVisible" title="提现" width="30%">
      <el-form
        ref="dataForm"
        :model="temp"
        :rules="rules"
        label-position="right"
        label-width="99px"
        style="width: 400px; margin-left:50px;">
        <el-form-item
          :label="$t('order.withdrawMoney')"
          prop="withdrawAmount">
          <el-input v-model="temp.withdrawAmount" clearable style="width: 199px;"/>
        </el-form-item>
        <el-form-item :label="$t('order.google')" prop="googleCode">
          <el-input v-model.number="temp.googleCode" clearable style="width: 199px;"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="withdrawSubmit">{{ $t('order.confirm') }}</el-button>
        <el-button @click="dialogVisible = false">{{ $t('order.cancel') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import lineChart from './LineChart'
import { orderFlow, cashWithdrawal } from '@/api/agency/home'
import { Message } from 'element-ui'
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
  name: 'Home',
  components: {
    CountTo,
    lineChart
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      transactionOrder: undefined,
      paidOrder: undefined,
      tradingFlow: undefined,
      paidFlow: undefined,
      withdrawMoney: undefined,
      dialogVisible: false,
      payOrderAmount: [], // 交易流水
      remitOrderAmount: [], // 代付流水
      totalOrderAmount: [], // 总流水
      listQuery: {
        pageNo: 1,
        pageSize: 20,
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
      rules: {
        withdrawAmount: [
          { required: true, message: '提现金额不能为空' },
          { pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/, message: '提现金额必须为数字' }
        ],
        googleCode: [
          { required: true, message: '谷歌验证码不能为空' },
          { type: 'number', message: '谷歌验证码必须为数字' }
        ]
      }
    }
  },
  created() {
    this.getDataInfo()
  },
  methods: {
    // 获取今日订单 今日流水数据
    getDataInfo() {
      orderFlow().then(data => {
        this.transactionOrder = data.payTotalOrder
        this.paidOrder = data.remitTotalOrder
        this.tradingFlow = data.payTotalOrderAmount
        this.paidFlow = data.remitTotalOrderAmount
        this.withdrawMoney = data.withdrawalAmount
      }).catch(err => {
        Message.error(err)
      })
    },
    // 提现
    withdrawSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          cashWithdrawal(this.temp).then(response => {
            this.$message({
              message: '提现申请成功',
              type: 'success'
            })
            this.getDataInfo()
            this.dialogVisible = false
          }).catch(err => {
            Message.error(err)
          })
        } else return false
      })
    },
    // handleSetLineChartData(type) {
    //   this.$emit('handleSetLineChartData', type)
    // },
    withdrawApply() {
      // for (const key in this.temp) {
      //   this.temp[key] = ''
      // }
      if (this.$refs['dataForm']) {
        this.$refs['dataForm'].resetFields()
      }
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].resetFields()
      // })
      this.dialogVisible = true
    },
    // 根据时间查询订单流水信息
    handleFilter() {
      this.$refs.lineChart.getCharts()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .panel-group {
    margin-top: 18px;
    .card-panel-col{
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
          background: #40FFF2;
        }
        .icon-paid-order {
          background: #40FFF2;
        }
        .icon-transaction-flow {
          background: #40FFF2;
        }
        .icon-paid-flow {
          background: #40FFF2
        }
        .icon-withdraw {
          background: #40FFF2;
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
        font-weight: bold;
        margin: 26px 0;
        text-align: center;
        .card-panel-text {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          margin-bottom: 12px;
        }
        .card-panel-num {
          font-size: 20px;
        }
      }
    }
  }
</style>

