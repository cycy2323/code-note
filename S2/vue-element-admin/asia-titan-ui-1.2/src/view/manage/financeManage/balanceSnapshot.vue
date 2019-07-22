<template>
  <div class="balance-phont-shop app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <!-- <el-form-item label="起始日期">
        <el-date-picker v-model="qishiDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="dateChange"/>
      </el-form-item> -->
      <el-form-item label="起始日期">
        <el-date-picker
          v-model="qishiDate"
          :picker-options="pickerOptions"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          @change="dateChange"/>
      </el-form-item>
      <el-button v-waves class="filter-item" type="primary" @click="refreshList">{{ $t('table.search') }}</el-button>
    </el-form>

    <el-table v-loading="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="代付总金额" prop="withdrawAmount" align="center"/>
      <el-table-column label="可用余额" prop="totalAmount" align="center"/>
      <el-table-column label="充值总金额" prop="rechargeAmount" align="center"/>
      <el-table-column label="冻结金额" prop="freezeAmount" align="center"/>
      <el-table-column label="批次号" prop="batchNumber" align="center"/>
      <el-table-column label="创建时间" prop="createDate" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createDate || '' | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding">
        <template slot-scope="scope">
          <el-button v-waves type="primary" size="small" @click="rechargeDialog(scope.row.batchNumber)">明细</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>

import { fetchList } from '@/api/manage/financeManage/balanceSnapshot'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { parseTime, pickerOptions } from '@/utils'
var time = new Date()
export default {
  name: 'BalanceSnapshot',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      statisticsData: {},
      qishiDate: [parseTime(time, '{y}-{m}-{d}') + ' 00:00:00', parseTime(time, '{y}-{m}-{d}') + ' 23:59:59'],
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        startDate: parseTime(parseTime(time, '{y}-{m}-{d}') + ' 00:00:00'),
        endDate: parseTime(parseTime(time, '{y}-{m}-{d}') + ' 23:59:59')
      },
      pickerOptions: {
        shortcuts: pickerOptions
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
      this.getList()
    },
    dateChange() {
      if (this.qishiDate) {
        this.listQuery.startDate = parseTime(this.qishiDate[0], '{y}-{m}-{d} {h}:{i}:{s}')
        this.listQuery.endDate = parseTime(this.qishiDate[1], '{y}-{m}-{d} {h}:{i}:{s}')
      } else {
        this.listQuery.endDate = null
        this.listQuery.startDate = null
      }
    },
    rechargeDialog(id) {
      this.$router.push('/financeManage/balanceObvious/' + id)
    }
  }
}
</script>

<style scope>
  .balance-phont-shop .el-date-editor .el-range-separator{
    width: auto;
  }
</style>
