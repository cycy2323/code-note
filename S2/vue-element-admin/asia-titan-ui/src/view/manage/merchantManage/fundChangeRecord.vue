<template>
  <div class="withdraw-list app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-form-item label="商户ID">
        <el-input v-model="listQuery.merId" clearable style="width: 170px;" onkeyup="this.value=this.value.replace(/\D/g,'')"/>
      </el-form-item>
      <el-form-item label="外部订单号">
        <el-input v-model="listQuery.businessNo" clearable style="width: 170px;" />
      </el-form-item>
      <el-form-item label="入账类型">
        <el-select v-model="listQuery.profitLoss" style="width: 100px">
          <el-option value="" label="全部">全部</el-option>
          <el-option :value="0" label="入账">入账</el-option>
          <el-option :value="1" label="出帐">出帐</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="流水状态">
        <el-select v-model="listQuery.tradeType" style="width: 100px">
          <el-option value="" label="全部">全部</el-option>
          <!--<el-option :value="1" label="充值">充值</el-option>-->
          <el-option :value="2" label="支付">支付</el-option>
          <el-option :value="3" label="转入">转入</el-option>
          <el-option :value="4" label="转出">转出</el-option>
          <el-option :value="5" label="代付">代付</el-option>
          <el-option :value="6" label="失败退款">失败退款</el-option>
          <el-option :value="7" label="人工扣款">人工扣款</el-option>
          <el-option :value="8" label="人工加款">人工加款</el-option>
          <el-option :value="9" label="代付手续费">代付手续费</el-option>
          <el-option :value="10" label="支付手续费">支付手续费</el-option>
          <el-option :value="12" label="代理提现,商户转入">代理提现,商户转入</el-option>
          <el-option :value="13" label="代付手续费退还">代付手续费退还</el-option>
          <el-option :value="14" label="支付手续费退还">支付手续费退还</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="完成时间">
        <el-date-picker
          v-model="qishiDate"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          @change="dateChange"/>
      </el-form-item>
      <el-button v-waves class="filter-item" type="primary" @click="refreshList">{{ $t('table.search') }}</el-button>
    </el-form>
    <el-table v-loading="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="商户ID" prop="merId" align="center"/>
      <el-table-column label="外部订单号" prop="businessNo" align="center"/>
      <el-table-column label="流水号" prop="tradeNo" align="center"/>
      <el-table-column label="流水金额" prop="tradeAmount" align="center"/>
      <el-table-column label="流水状态" prop="tradeType" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tradeType | getTradeType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="变动前金额" prop="frontAmount" align="center"/>
      <el-table-column label="变动后金额" prop="aftAmount" align="center"/>
      <el-table-column label="入账类型" prop="profitLoss" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.profitLoss === 0 ? 'success' : ''">
            {{ scope.row.profitLoss === 0 ? '入账' : '出帐' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="完成时间" prop="updateDate" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updateDate || '' | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>

import { fetchList } from '@/api/manage/merchantManage/fundChangeRecord'
import waves from '@/directive/waves' // Waves directive
// import { Message } from 'element-ui'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

// 获取格林时间
var date1 = new Date(new Date(new Date().toLocaleDateString()).getTime())
var date2 = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)

// 格式化时间  2018-06-06 00:00:00
// 如果只是简单的格式化只变成2018-6-6 0:0:0，需要运用三目运算判断并在适当的地方加上0，完成所需要的格式。
var startTime = date1.getFullYear() + '-' + ((date1.getMonth() + 1) < 10 ? '0' + (date1.getMonth() + 1) : (date1.getMonth() + 1)) + '-' + (date1.getDate() < 10 ? '0' + date1.getDate() : date1.getDate()) + ' ' + (date1.getHours() < 10 ? '0' + date1.getHours() : date1.getHours()) + ':' + (date1.getMinutes() < 10 ? '0' + date1.getMinutes() : date1.getMinutes()) + ':' + (date1.getSeconds() < 10 ? '0' + date1.getSeconds() : date1.getSeconds())

// 格式化时间  2018-06-06 23:59:59
var endTime = date2.getFullYear() + '-' + (date2.getMonth() + 1) + '-' + date2.getDate() + ' ' + date2.getHours() + ':' + date2.getMinutes() + ':' + date2.getSeconds()
export default {
  name: 'FundChangeRecord',
  components: { Pagination },
  directives: { waves },
  filters: {
    getTradeType(key) {
      const obj = { '2': '支付', '3': '转入', '4': '转出', '5': '代付', '6': '失败退款', '7': '人工扣款', '8': '人工加款', '9': '代付手续费', '10': '支付手续费', '12': '代理提现,商户转入', '13': '代付手续费退还', '14': '支付手续费退还' }
      return obj[key + '']
    }
  },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      qishiDate: [new Date(startTime), new Date(endTime)],
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        merId: '',
        startTime: startTime,
        endTime: endTime,
        businessNo: '',
        profitLoss: '',
        tradeType: ''
      },
      detailData: {},
      dialogPvVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      // if (typeof (this.listQuery.merId) === 'string' || typeof (this.listQuery.agentId) === 'string') {
      //   this.listLoading = false
      //   return
      // }
      fetchList(this.listQuery).then(response => {
        this.list = response.list
        this.total = response.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    dateChange() {
      if (this.qishiDate) {
        this.listQuery.startTime = parseTime(this.qishiDate[0], '{y}-{m}-{d}')
        this.listQuery.endTime = parseTime(this.qishiDate[1], '{y}-{m}-{d}')
      } else {
        this.listQuery.startTime = ''
        this.listQuery.endTime = ''
      }
    },
    refreshList() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    showDialog(row) {
      for (var key in row) {
        this.detailData[key] = row[key]
      }
      this.dialogPvVisible = true
    }
  }
}
</script>

