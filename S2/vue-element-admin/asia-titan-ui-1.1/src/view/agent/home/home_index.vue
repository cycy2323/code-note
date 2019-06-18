<!--suppress ALL -->
<template>
  <div>
    <el-container>
      <el-header style="height: auto">
        首页
      </el-header>
      <el-main style="display: flex">
        <moneyExhibition :title="'预估收入'" :enable-end-time="true" :end-time="new Date()" :enable-button="false" :dialog-object="this" :amount="estimateAmount"/>
        <moneyExhibition :title="'可结算收入'" :enable-end-time="true" :end-time="new Date()" :enable-button="true" :dialog-object="this" :amount="ableUseAmount" :button-click="withdraw"/>
        <el-dialog
          :visible.sync="dialogVisible"
          title="申请提现"
          width="50%"
        >
          <div>
            <el-form :label-position="labelPosition" :model="dialogForm" label-width="100px">
              <el-form-item label="提现金额">
                <el-input :disabled="true" v-model="ableUseAmount" style="width: 300px"/>
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
      </el-main>
      <el-footer>
        <homeTodaysPaper
          :title="'今日概况'"
          :update-time="new Date()"
          :target-action="withdraw"
          :children="[{'title':'今日业绩收入','content':perFormance},{'title':'订单数','content':orderQuantity},{'title':'今日总流水','content':amountFlow}]"/>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import moneyExhibition from '../../common/moneyExhibition'
import homeTodaysPaper from '../../common/homeTodaysPaper'
import { homeIncome, todayOverview, agentBankCards, agentWithdraw } from '@/api/agent/agentHome'
export default {
  name: 'Index',
  components: { moneyExhibition, homeTodaysPaper },
  data() {
    return {
      dialogVisible: false,
      labelPosition: 'right',
      estimateAmount: '',
      ableUseAmount: '',
      amountFlow: '',
      orderQuantity: '',
      perFormance: '',
      bankList: [],
      payPwd: '',
      googleCode: '',
      dialogForm: {
        bankCardInfo: undefined
      }
    }
  },
  created() {
    this.homeIncome()
    this.todayOverview()
    this.agentBankCards()
  },
  methods: {
    agentWithdraw() {
      agentWithdraw({
        payPassword: this.payPwd,
        googleCode: this.googleCode,
        bankAccountNo: this.dialogForm.bankCardInfo.bankAccountNo
      }).then(response => {
        if (response.code === 200) {
          this.dialogVisible = false
        }
        return
      })
    },
    homeIncome() {
      homeIncome().then(response => {
        this.estimateAmount = response.data.estimateAmount / 100
        this.ableUseAmount = response.data.usableAmount / 100
      })
    },
    todayOverview() {
      todayOverview().then(response => {
        this.amountFlow = response.data.amountFlow / 100
        this.orderQuantity = response.data.orderQuantity
        this.perFormance = response.data.perFormance / 100
      })
    },
    agentBankCards() {
      agentBankCards().then(response => {
        this.bankList = response.data
      })
    },
    withdraw() {
      this.dialogVisible = true
    }
  }
}
</script>

<style scoped>

</style>
