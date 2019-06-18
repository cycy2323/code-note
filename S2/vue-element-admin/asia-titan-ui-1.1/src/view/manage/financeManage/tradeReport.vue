<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-form-item label="日期">
        <!-- <el-input v-model="listQuery.ip" style="width: 160px;" /> -->
        <el-date-picker v-model="countDate" type="date" placeholder="选择日期"/>
      </el-form-item>
      <el-button v-waves class="filter-item" type="primary" @click="refreshList">{{ $t('table.search') }}</el-button>
    </el-form>
    <el-table v-loading="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="汇总日期" prop="countDate" align="center"/>
      <el-table-column label="交易总额" prop="transferAmount" align="center"/>
      <el-table-column label="交易手续费" prop="transferFee" align="center"/>
      <el-table-column label="交易笔数" prop="transferCount" align="center"/>
      <el-table-column label="代付总金额" prop="payAmount" align="center"/>
      <el-table-column label="代付手续费" prop="payFee" align="center"/>
      <el-table-column label="代付笔数" prop="payCount" align="center"/>
      <el-table-column label="冻结金额" prop="frozenAmount" align="center"/>
      <el-table-column label="冻结笔数" prop="frozenCount" align="center"/>
      <el-table-column label="解冻金额" prop="thawAmount" align="center"/>
      <el-table-column label="解冻笔数" prop="thawCount" align="center"/>
      <el-table-column label="系统未出金额" prop="sysAmount" align="center"/>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>

import { fetchList } from '@/api/manage/financeManage/tradeReport'
import waves from '@/directive/waves' // Waves directive
// import { Message } from 'element-ui'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { parseTime } from '@/utils'

export default {
  name: 'TradeReport',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      qishiDate: '',
      countDate: '',
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        countDate: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.list
        this.total = response.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    refreshList() {
      this.listQuery.pageNo = 1
      if (this.countDate) {
        this.listQuery.countDate = parseTime(this.countDate, '{y}-{m}-{d}')
      } else {
        this.listQuery.countDate = ''
      }
      this.getList()
    }
  }
}
</script>
