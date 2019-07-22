<template>
  <div class="balance-phont-shop app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-form-item label="审核登记">
        <el-select v-model="listQuery.auditLevel" clearable style="width: 160px">
          <el-option value="" label="全部">全部</el-option>
          <el-option :value="1" label="一审">一审</el-option>
          <el-option :value="2" label="二审">二审</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审核结果">
        <el-select v-model="listQuery.auditResult" clearable style="width: 160px">
          <el-option value="" label="全部">全部</el-option>
          <el-option :value="1" label="通过">通过</el-option>
          <el-option :value="2" label="驳回">驳回</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审核人">
        <el-input v-model.number="listQuery.auditUser" clearable style="width: 200px;" @keyup.enter.native="refreshList"/>
      </el-form-item>
      <el-form-item label="订单号">
        <el-input v-model="listQuery.orderNo" clearable style="width: 200px;" @keyup.enter.native="refreshList"/>
      </el-form-item>
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
      <el-table-column label="订单号" prop="orderNo" align="center"/>
      <el-table-column label="审核登记" prop="auditLevel" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.auditLevel === 1 ? '一审' : '二审' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核登记" prop="auditResult" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.auditResult === 1 ? '通过' : '驳回' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核人" prop="auditUser" align="center"/>
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

import { fetchList } from '@/api/manage/orderManage/patchNotes'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { parseTime, pickerOptions } from '@/utils'
var time = new Date()
export default {
  name: 'PatchNotes',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      dialogDetault: false,
      qishiDate: [parseTime(time, '{y}-{m}-{d}') + ' 00:00:00', parseTime(time, '{y}-{m}-{d}') + ' 23:59:59'],
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        auditLevel: '',
        auditResult: '',
        auditUser: '',
        orderNo: '',
        startDate: parseTime(parseTime(time, '{y}-{m}-{d}') + ' 00:00:00'),
        endDate: parseTime(parseTime(time, '{y}-{m}-{d}') + ' 23:59:59')
      },
      temp: {
        id: '',
        orderNo: ''
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
        this.listQuery.startDate = null
        this.listQuery.endDate = null
      }
    },
    showDialog(row) {
      this.temp.id = row.id
      this.dialogDetault = true
    },
    relationSure() {
    }
  }
}
</script>

<style scope>
  .balance-phont-shop .el-date-editor .el-range-separator{
    width: auto;
  }
</style>
