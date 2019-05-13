<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-form-item label="代理ID">
        <el-input v-model="listQuery.agentId" clearable style="width: 200px;" onkeyup="this.value=this.value.replace(/\D/g,'')"/>
      </el-form-item>
      <el-form-item label="起始日期">
        <el-date-picker v-model="qishiDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="dateChange"/>
      </el-form-item>
      <el-button v-waves class="filter-item" type="primary" @click="refreshList">{{ $t('table.search') }}</el-button>
    </el-form>

    <el-table v-loading="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="创建日期" prop="createDate" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createDate || '' | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="代理ID" prop="agentId" align="center"/>
      <el-table-column label="代理名称" prop="realName" align="center"/>
      <el-table-column label="代理佣金" prop="totalAgentCommission" align="center"/>
      <el-table-column label="交易成功总金额" prop="totalOrderAmount" align="center"/>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

  </div>
</template>

<script>

import { fetchList } from '@/api/manage/financeManage/profitManage'
import waves from '@/directive/waves' // Waves directive
// import { Message } from 'element-ui'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { parseTime } from '@/utils'

export default {
  name: 'ProfitManage',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      qishiDate: '',
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        startDate: null,
        endDate: null,
        agentId: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      // if (typeof (this.listQuery.agentId) === 'string') {
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
    refreshList() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    dateChange() {
      if (this.qishiDate) {
        this.listQuery.startDate = parseTime(this.qishiDate[0], '{y}-{m}-{d}')
        this.listQuery.endDate = parseTime(this.qishiDate[1], '{y}-{m}-{d}')
      } else {
        this.listQuery.endDate = null
        this.listQuery.startDate = null
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.el-checkbox+.el-checkbox{
  margin-left: 0;
}
.el-dialog__wrapper .from-bank .check-all.el-checkbox{
  width: 80px;
}
.el-dialog__wrapper .from-bank .quota-txt{
  display: inline-block;
  width: 100px;
  text-align: center;
}
</style>
