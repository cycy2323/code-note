<template>
  <div class="app-main-container">
    <el-form :inline="true" :model="listQuery" style="width: 96%;margin-right: auto;margin-left: auto">
      <el-form-item label="账户名">
        <el-input size="small"></el-input>
      </el-form-item>
      <el-form-item label="IP">
        <el-input size="small"></el-input>
      </el-form-item>
      <el-form-item label="登录时间">
        <el-date-picker
          v-model="loginDate"
          type="datetimerange"
          size="small"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          @change="dateChange"/>
      </el-form-item>
      <el-button size="small" type="primary" @click="refreshList" style="margin-top: 5px">查询</el-button>
    </el-form>
    <el-table v-loading="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 96%;margin-right: auto;margin-left: auto">
      <el-table-column prop="userName" label="登录用户" align="center"></el-table-column>
      <el-table-column label="登录角色" align="center"></el-table-column>
      <el-table-column label="登录时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.loginTime || '' | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="登录IP" align="center"></el-table-column>
      <el-table-column label="登录地点" align="center"></el-table-column>
    </el-table>
    <pagination
      v-show="listQuery.total>0"
      :total="listQuery.total"
      :page.sync="listQuery.pageNo"
      :limit.sync="listQuery.pageSize"
      @pagination="gitList"/>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // 引入分页组件
import { parseTime } from '@/components/parseTime' // 引入格式化时间日期组件
export default {
  name: 'loginLog',
  components: { Pagination, parseTime },
  data () {
    return {
      list: [],
      loginDate: [],
      listQuery: {
        total: 0,
        pageNo: 1,
        pageSize: 10
      },
      listLoading: false,
      tableKey: 0
    }
  },
  methods: {
    gitList () {},
    refreshList () {
      this.listQuery.pageNo = 1
    },
    dateChange () {
      if (this.loginDate) {
        this.listQuery.createDateStart = parseTime(this.loginDate[0], '{y}-{m}-{d} {h}:{i}:{s}')
        this.listQuery.createDateEnd = parseTime(this.loginDate[1], '{y}-{m}-{d} {h}:{i}:{s}')
      } else {
        this.listQuery.createDateEnd = ''
        this.listQuery.createDateStart = ''
      }
    }
  }
}
</script>

<style>
  .el-table td, .el-table th {
    padding: 5px 0;
  }
</style>
