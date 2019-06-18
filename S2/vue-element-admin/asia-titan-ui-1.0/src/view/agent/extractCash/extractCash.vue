<template>
  <el-container>
    <el-header style="height: auto">
      提现结算
    </el-header>
    <el-main>
      <div style="display: flex;width: 100%">
        <moneyExhibition
          :title="'预估收入'"
          :enable-end-time="true"
          :end-time="new Date()"
          :enable-button="false"
          :dialog-object="{dialogVisible:false}"
          :amount="estimate" />
        <moneyExhibition
          :title="'可结算收入'"
          :enable-end-time="true"
          :end-time="new Date()"
          :enable-button="true"
          :dialog-object="this"
          :amount="accountIncome"
          :button-click="withdraw"
        />
        <moneyExhibition
          :title="'总收入'"
          :enable-end-time="true"
          :end-time="new Date()"
          :enable-button="false"
          :dialog-object="{dialogVisible:false}"
          :amount="overall" />
        <moneyExhibition
          :title="'可结算金额'"
          :enable-end-time="true"
          :end-time="new Date()"
          :enable-button="false"
          :dialog-object="{dialogVisible:false}"
          :amount="accountMoney" />
      </div>
      <el-dialog
        :visible.sync="dialogVisible"
        title="申请提现"
        width="50%"
      >
        <div>
          <el-form :label-position="labelPosition" :model="dialogForm" label-width="100px">
            <el-form-item label="提现金额">
              <el-input :disabled="true" v-model="accountIncome" style="width: 300px"/>
            </el-form-item>
            <el-form-item label="收款账户" >
              <el-select v-model="dialogForm.bankCardInfo" value-key="bankAccountNo" placeholder="请选择收款账户" style="width: 300px">
                <el-option
                  v-for="item in bankList"
                  :key="item.bankAccountNo"
                  :label="item.bankName+' ****'+item.bankAccountNo.slice(item.bankAccountNo.length-4,item.bankAccountNo.length)"
                  :value= "item"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="资金密码" >
              <el-input v-model="payPwd" style="width: 300px" type="password"/>
            </el-form-item>
            <el-form-item label="谷歌验证码">
              <el-input v-model="googleCode" style="width: 300px"/><span style="color: #42b983;margin-left: 10px;cursor: pointer"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="agentWithdraw">提交</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
      <div class="filter-container" style="width: 100%;background: #FFFFFF;margin: 20px 0;padding: 20px 20px">
        时间:
        <el-date-picker
          v-model="listQuery.startDate"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          placeholder="订单开始时间"/>
        &nbsp;
        至
        &nbsp;
        <el-date-picker
          v-model="listQuery.endDate"
          type="datetime"
          style="margin-right: 20px"
          format="yyyy-MM-dd HH:mm:ss"
          placeholder="订单结束时间"/>
        <el-button
          v-waves
          class="filter-item pan-btn green-btn"
          type="primary"
          icon="el-icon-search"
          @click="orderSelectByAgentId">{{ $t('merchantList.search') }}
        </el-button>
      </div>
      <div class="login-in-info">
        <div class="index-line">
          <span>查询结果</span>
        </div>
        <div style="display: flex;justify-content: space-between;margin: auto 1%;">
          <p>订单总数</p>
          <p>订单总金额</p>
          <p>分红总额</p>
        </div>
        <div class="index-line"/>
        <div style="display: flex;justify-content: space-between;margin: auto 1%;">
          <p style="position: relative;left: 1.5%;color: red">{{ orderTotal }}</p>
          <p style="color: red;">{{ totalMoney }}</p>
          <p style="position: relative;right: 1.5%;color: red">{{ bonusMoney }}</p>
        </div>
      </div>
      <div style="width: 100%;background: #FFFFFF;margin: 20px 0;padding: 20px 20px">
        <div class="index-line">
          提现申请历史
        </div>
        <div>
          <el-table
            v-loading="listLoading"
            :key="tableKey"
            :data="list"
            fit
            highlight-current-row
            style="width: 100%;">
            <el-table-column :label="$t('extractCash.orderID')" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.orderNo }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('extractCash.extractMoney')" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.orderAmount }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('extractCash.extractDate')" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.createDate | parseTime('{y}-{m}-{d}') }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('extractCash.account')" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.bankAccountNo }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('extractCash.status')" align="center">
              <template slot-scope="scope">
                <el-tag :type="scope.row.orderState | orderStatusTagTypeFilter">
                  {{ scope.row.orderState | orderStatusFilter }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column :label="$t('extractCash.operation')" align="center">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('extractCash.examine') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-dialog :visible.sync="dialogFormVisible" title="查看">
          <el-form
            ref="dataForm"
            :model="temp"
            label-position="right"
            label-width="99px"
            style="width: 400px; margin-left:50px;">
            <el-form-item :label="$t('order.No')">
              <el-input v-model="temp.orderNo" :readonly="true" style="width: 250px;"/>
            </el-form-item>
            <el-form-item :label="$t('order.withdrawDeposit')">
              <el-input v-model="temp.orderAmount" :readonly="true" style="width: 250px;"/>
            </el-form-item>
            <el-form-item :label="$t('order.status')">
              <el-tag :type="statusMap[temp.orderState]">{{ temp.orderState | orderStatusFilter }}</el-tag>
            </el-form-item>
            <el-form-item :label="$t('order.withdrawDate')">
              <el-input v-model="temp.createDate" :readonly="true" style="width: 250px;"/>
            </el-form-item>
            <el-form-item :label="$t('order.ZFBAccount')">
              <el-input v-model="temp.bankAccountNo" :readonly="true" style="width: 250px;"/>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import moneyExhibition from '../../common/moneyExhibition'
import loginRecord from '../../common/loginRecord'
import { limitInfo, orderSelect, withdrawHistory } from '@/api/agent/extractCash'
import { agentWithdraw, agentBankCards } from '@/api/agent/agentHome'
const orderStatusOptions = [
  { orderState: 1, display_name: '出款中' },
  { orderState: 2, display_name: '成功' },
  { orderState: 3, display_name: '失败' }
]
const statusMap = {
  1: '',
  2: 'success',
  3: 'danger'
}
// calendarTypeKeyValue
// arr to obj ,such as { CN : "China", US : "USA" }
const orderStatusKeyValue = orderStatusOptions.reduce((acc, cur) => {
  acc[cur.orderState] = cur.display_name
  return acc
}, {})
export default {
  name: 'ExtractCash',
  components: { moneyExhibition, loginRecord },
  filters: {
    orderStatusTagTypeFilter(orderState) {
      return statusMap[orderState]
    },
    orderStatusFilter(type) {
      return orderStatusKeyValue[type]
    }
  },
  data() {
    return {
      orderTotal: undefined,
      totalMoney: undefined,
      bonusMoney: undefined,
      listLoading: false,
      dialogVisible: false,
      labelPosition: 'right',
      estimateAmount: '',
      bankList: [],
      payPwd: '',
      googleCode: '',
      dialogForm: {
        bankCardInfo: undefined
      },
      estimate: undefined,
      accountIncome: undefined,
      overall: undefined,
      accountMoney: undefined,
      tableKey: 0,
      list: [],
      total: 0,
      dialogFormVisible: false,
      orderStatusOptions,
      statusOptions: orderStatusOptions,
      statusMap,
      temp: {
        orderNo: undefined,
        orderAmount: undefined,
        orderState: undefined,
        createDate: undefined,
        bankAccountNo: undefined
      },
      listQuery: {
        pageNo: 1,
        pageSize: 20,
        orderState: undefined,
        payType: undefined,
        orderNo: undefined,
        ZFBOrderNo: undefined,
        startDate: undefined,
        endDate: undefined,
        sort: '+id'
      }
    }
  },
  created() {
    this.getLimitInfo()
    this.agentBankCards()
    this.getWithdrawHistory()
    // this.orderSelectByAgentId()
  },
  methods: {
    getLimitInfo() {
      limitInfo().then(response => {
        const data = response.data
        this.estimate = data.estimateAmount / 100
        this.accountIncome = data.usableAmount / 100
        this.overall = data.incomeAmount / 100
        this.accountMoney = data.usableAmount / 100
      })
    },
    orderSelectByAgentId() {
      orderSelect({
        startDate: this.listQuery.startDate,
        endDate: this.listQuery.endDate
      }).then(response => {
        const data = response.data
        this.orderTotal = data.orderQuantity
        this.totalMoney = data.amountFlow
        this.bonusMoney = data.perFormance
      })
    },
    getWithdrawHistory() {
      this.listLoading = true
      withdrawHistory(this.listQuery).then(response => {
        const data = response.data
        this.total = data.total
        this.list = data.list
        this.listLoading = false
      })
    },
    agentWithdraw() {
      agentWithdraw({
        payPassword: this.payPwd,
        googleCode: this.googleCode,
        bankAccountNo: this.dialogForm.bankCardInfo.bankAccountNo
      }).then(response => {
        if (response.data.code === 200) {
          this.dialogVisible = false
        }
        return
      })
    },
    agentBankCards() {
      agentBankCards().then(response => {
        this.bankList = response.data
        // console.log(this.bankList)
      })
    },
    withdraw() {
      this.dialogVisible = true
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.dialogFormVisible = true
    }
  }
}
</script>

<style scoped>
  .login-in-info {
    width: 100%;
    margin-top: 20px;
    background: #FFFFFF;
    padding-bottom: 30px;
  }
  .index-line span {
    margin-left: 1%;
  }

</style>
