<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-form-item label="IP">
        <el-input v-model="listQuery.ip" style="width: 160px;" @keyup.enter.native="refreshList" />
      </el-form-item>
      <el-form-item label="创建人ID">
        <el-input v-model="listQuery.createId" style="width: 160px;" @keyup.enter.native="refreshList" />
      </el-form-item>
      <el-form-item label="创建人名称">
        <el-input v-model="listQuery.createName" style="width: 160px;" @keyup.enter.native="refreshList" />
      </el-form-item>
      <el-button v-waves class="filter-item" type="primary" @click="refreshList">{{ $t('table.search') }}</el-button>
    </el-form>
    <el-table v-loading="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="ip" prop="ip" align="center"/>
      <el-table-column label="创建日期" prop="createDate" align="center">
        <template slot-scope="scope">
          <span>{{ (scope.row.createDate || '') | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人ID" prop="createId" align="center"/>
      <el-table-column label="创建人" prop="createName" align="center"/>
      <el-table-column label="操作信息" prop="info" align="center"/>
      <el-table-column label="执行状态" prop="execState" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.execState === 1 ? '执行成功' : '执行失败' }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>

import { fetchList } from '@/api/manage/systemManage/operationLog'
import waves from '@/directive/waves' // Waves directive
// import { Message } from 'element-ui'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { parseTime } from '@/utils'

export default {
  name: 'OperationLog',
  components: { Pagination },
  directives: { waves },
  filters: { parseTime },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        ip: '',
        createId: '',
        createName: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      // if (typeof (this.listQuery.createId) === 'string') {
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
    }
  }
}
</script>
