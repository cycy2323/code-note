<template>
  <div class="app-container">
    <el-form :inline="true" class="filter-container inquire-style">
      <el-form-item label="交易时间">
        <el-date-picker
          v-model="qishiDate"
          :picker-options="pickerOptions"
          type="daterange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          @change="dateChange"/>
      </el-form-item>
      <el-button
        v-waves
        class="filter-item pan-btn green-btn"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter">{{ $t('merchantList.search') }}
      </el-button>
    </el-form>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column :label="$t('merchantList.date')" align="center" >
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.createDate || '' | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('merchantList.agentID')" align="center" >
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.agentId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('merchantList.agentName')" align="center" >
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.realName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('merchantList.dealAccount')" align="center" >
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.totalOrderAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('merchantList.agentProfit')" align="center" >
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.totalAgentCommission }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNo"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"/>
  </div>
</template>

<script>
import { fetchList } from '@/api/agency/agentManage'
import waves from '@/directive/waves' // Waves directive
import { parseTime, pickerOptions } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import DragDialog from '@/view/common/dragDialog'

export default {
  name: 'ProfitReport',
  components: { DragDialog, Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: false,
      qishiDate: '',
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        startDate: '',
        endDate: ''
      },
      downloadLoading: false,
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
      fetchList(this.listQuery).then(data => {
        this.list = data.list
        this.total = data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    dateChange() {
      if (this.qishiDate) {
        this.listQuery.startDate = parseTime(this.qishiDate[0], '{y}-{m}-{d}')
        this.listQuery.endDate = parseTime(this.qishiDate[1], '{y}-{m}-{d}')
      } else {
        this.listQuery.endDate = parseTime(new Date(), '{y}-{m}-{d}')
        this.listQuery.startDate = parseTime(new Date(), '{y}-{m}-{d}')
      }
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    }
  }
}
</script>

<style scoped>
  .inquire-style .el-form-item {
    margin-bottom: 0;
  }
  .filter-container .filter-item {
    margin-bottom: 0;
  }
</style>

