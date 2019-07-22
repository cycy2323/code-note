<template>
  <div class="balance-phont-shop app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-form-item label="商户ID">
        <el-input v-model.number="listQuery.merchantId" clearable style="width: 200px;" @keyup.enter.native="refreshList"/>
      </el-form-item>
      <el-button v-waves class="filter-item" type="primary" @click="refreshList">{{ $t('table.search') }}</el-button>
      <el-button v-waves class="filter-item" type="danger" @click="$router.push('/financeManage/balanceSnapshot')">返回列表</el-button>
    </el-form>

    <el-table v-loading="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="商户ID" prop="merchantId" align="center"/>
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
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>

import { fetchListObvious } from '@/api/manage/financeManage/balanceSnapshot'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { parseTime } from '@/utils'
const times = new Date().getTime()
export default {
  name: 'BalanceObvious',
  components: { Pagination },
  directives: { waves },
  filters: {
    parseTime
  },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      statisticsData: {},
      qishiDate: [times - 86400000, times],
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        batchNumber: this.$route.params.id,
        merchantId: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchListObvious(this.listQuery).then(response => {
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
    rechargeDialog() {
      this.$router.push('/financeManage/balanceObvious')
    }
  }
}
</script>

<style scope>
  .balance-phont-shop .el-date-editor .el-range-separator{
    width: auto;
  }
</style>
