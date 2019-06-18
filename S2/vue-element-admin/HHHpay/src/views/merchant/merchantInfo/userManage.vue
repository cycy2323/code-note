<template>
  <div class="app-main-container">
    <el-form :inline="true" :model="listQuery" style="width: 96%;margin-right: auto;margin-left: auto">
      <el-form-item label="账号">
        <el-input size="small"></el-input>
      </el-form-item>
      <el-form-item label="开户银行">
        <el-input size="small"></el-input>
      </el-form-item>
      <el-form-item label="银行卡号">
        <el-input size="small"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-input size="small"></el-input>
      </el-form-item>
      <el-form-item label="订单时间">
        <el-date-picker
          v-model="orderDate"
          type="datetimerange"
          size="small"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          @change="dateChange"/>
      </el-form-item>
      <el-button size="small" type="primary" @click="refreshList" style="margin-top: 5px">查询</el-button>
      <el-button size="small" type="primary" @click="addUser">新增</el-button>
    </el-form>
    <el-table v-loading="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 96%;margin-right: auto;margin-left: auto">
      <el-table-column prop="account" label="账号" align="center"></el-table-column>
      <el-table-column prop="userName" label="用户名" align="center"></el-table-column>
      <el-table-column prop="ID" label="商户ID" align="center"></el-table-column>
      <el-table-column prop="orderState" label="状态" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.orderState | orderStatusTagTypeFilter">
            {{ scope.row.orderState | orderStatusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" align="center"></el-table-column>
      <el-table-column label="上次登录时间" align="center"></el-table-column>
      <el-table-column label="上次登录IP" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary">编辑</el-button>
          <el-button size="mini" type="success">设置权限</el-button>
        </template>
      </el-table-column>
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
const orderStatusOptions = [
  { state: 0, display_name: '待支付' },
  { state: 1, display_name: '支付成功' },
  { state: 2, display_name: '支付失败' }
]
const statusMap = {
  0: 'info',
  1: 'success',
  2: 'danger',
  3: 'danger',
  4: 'warning'
}
const orderStatusKeyValue = orderStatusOptions.reduce((acc, cur) => {
  acc[cur.state] = cur.display_name
  return acc
}, {})
export default {
  name: 'userManage',
  components: { Pagination, parseTime },
  filters: {
    orderStatusTagTypeFilter (state) {
      return statusMap[state]
    },
    orderStatusFilter (type) {
      return orderStatusKeyValue[type]
    }
  },
  data () {
    return {
      list: [],
      orderDate: [],
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
    addUser () {},
    dateChange () {
      if (this.orderDate) {
        this.listQuery.createDateStart = parseTime(this.orderDate[0], '{y}-{m}-{d} {h}:{i}:{s}')
        this.listQuery.createDateEnd = parseTime(this.orderDate[1], '{y}-{m}-{d} {h}:{i}:{s}')
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
