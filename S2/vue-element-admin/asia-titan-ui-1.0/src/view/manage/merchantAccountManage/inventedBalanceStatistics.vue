<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline filter-container">
      <el-form-item label="代理ID">
        <el-input v-model="listQuery.agentId" clearable style="width: 240px;" onkeyup="this.value=this.value.replace(/\D/g,'')"/>
      </el-form-item>
      <el-form-item label="商户ID">
        <el-input v-model="listQuery.merchantId" clearable style="width: 240px;" onkeyup="this.value=this.value.replace(/\D/g,'')"/>
      </el-form-item>
      <el-button v-waves class="filter-item" type="primary" @click="refreshList">{{ $t('table.search') }}</el-button>
      <br>
      <el-form-item label="大额差额总数:">
        <span class="header-title">{{ totalAccount }} <em style="font-size: 14px;color: red">( 差额大于10万 )</em></span>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      :row-class-name="tableRowClassName"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="代理名称" prop="agentName" align="center"/>
      <el-table-column label="商户ID" prop="merchantId" align="center"/>
      <el-table-column label="商户名称" prop="merchantName" align="center"/>
      <el-table-column label="账户余额" prop="balanceAmount" align="center"/>
      <el-table-column label="支付金额" prop="payAmount" align="center"/>
      <el-table-column label="支付手续费" prop="payCommission" align="center"/>
      <el-table-column label="支付代理收益" prop="payAgentProfit" align="center"/>
      <el-table-column label="支付上游成本" prop="payChannelCost" align="center"/>
      <el-table-column label="支付平台收益" prop="payPlatformProfit" align="center"/>
      <el-table-column label="代付金额" prop="remitAmount" align="center"/>
      <el-table-column label="代付处理中金额" prop="remitInProcessAmount" align="center"/>
      <el-table-column label="代付手续费" prop="remitCommission" align="center"/>
      <el-table-column label="代付上游成本" prop="remitChannelCost" align="center"/>
      <el-table-column label="代付平台收益" prop="remitPlatformProfit" align="center"/>
      <el-table-column label="商户互转-转入" prop="innerTransferIn" align="center"/>
      <el-table-column label="商户互转-转出" prop="innerTransferOut" align="center"/>
      <el-table-column label="冻结余额" prop="freezeAmount" align="center"/>
      <el-table-column label="差额" prop="differenceAmount" align="center"/>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>

import { fetchVirtuaList, warningCount } from '@/api/manage/merchantManage/plainBalanceStatistics'
import waves from '@/directive/waves' // Waves directive
// import { Message } from 'element-ui'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'InventedBalanceStatistics',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      totalAccount: '',
      list: [],
      total: 0,
      listLoading: true,
      qishiDate: '',
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        agentId: '',
        merchantId: ''
      },
      clearTime: undefined
    }
  },
  created() {
    this.getList()
    this.getWarningCount()
    this.clearTime = setInterval(() => {
      this.getWarningCount()
    }, 10000)
  },
  activated() {
    this.clearTime = setInterval(() => {
      this.getWarningCount()
    }, 10000)
  },
  deactivated() {
    clearInterval(this.clearTime)
  },
  methods: {
    getList() {
      this.listLoading = true
      // if (typeof (this.listQuery.merchantId) === 'string' || typeof (this.listQuery.agentId) === 'string') {
      //   this.listLoading = false
      //   return
      // }
      fetchVirtuaList(this.listQuery).then(response => {
        this.list = response.list
        this.total = response.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    getWarningCount() {
      warningCount({ type: 2 }).then(data => {
        if (data > 0) {
          this.totalAccount = data
          this.getList()
        } else {
          this.totalAccount = data
        }
      })
    },
    refreshList() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.differenceAmount >= 100000) {
        return 'danger-row'
      }
      return ''
    }
  }
}
</script>
<style>
  .el-table .danger-row {
    background: rgb(247, 139, 139);
  }
  .filter-container .el-form-item .header-title {
    font-size: 24px;
    width: 200px;
    display: inline-block;
    color: #409EFF;
    font-weight: bold;
  }
</style>
