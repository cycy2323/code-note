<template>
  <div class="app-main-container">
    <el-form :inline="true" :model="listQuery" style="width: 96%;margin-right: auto;margin-left: auto;">
      <el-form-item label="充值订单号">
        <el-input v-model="listQuery.account" size="small" placeholder="全部" clearable>
          <!--<el-option :value="1" label="启用">启用</el-option>-->
          <!--<el-option :value="2" label="停用">停用</el-option>-->
        </el-input>
      </el-form-item>
      <el-form-item label="充值银行卡">
        <el-select size="small" placeholder="全部" clearable>
          <!--<el-option :value="1" label="启用">启用</el-option>-->
          <!--<el-option :value="2" label="停用">停用</el-option>-->
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select size="small" placeholder="全部" clearable>
          <!--<el-option :value="1" label="启用">启用</el-option>-->
          <!--<el-option :value="2" label="停用">停用</el-option>-->
        </el-select>
      </el-form-item>
      <el-form-item label="IP">
        <el-input size="small"></el-input>
      </el-form-item>
      <el-form-item label="订单时间">
        <el-date-picker
          v-model="operateDate"
          type="datetimerange"
          size="small"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          @change="dateChange"/>
      </el-form-item>
      <el-button type="primary" size="small" @click="refreshList" style="margin-top: 5px">查询</el-button>
      <el-button type="primary" size="small" @click="refreshList">重置</el-button>
      <el-button type="primary" size="small" @click="refreshList">下载</el-button>
      <br>
      <el-form-item label="总提交金额:" class="statistics-wrapper">
        <span class="header-title">999.0000000000</span>
      </el-form-item>
      <el-form-item label="商户收益:" class="statistics-wrapper">
        <span class="header-title">999.0000000000</span>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 96%;margin-right: auto;margin-left: auto">
      <el-table-column label="商户订单号" align="center"></el-table-column>
      <el-table-column label="订单金额" align="center"></el-table-column>
      <el-table-column label="实际金额" align="center"></el-table-column>
      <el-table-column label="用户金额" align="center"></el-table-column>
      <el-table-column label="提交时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.operateTime || '' | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="完成时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.operateTime || '' | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="orderState" label="订单状态" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.orderState | orderStatusTagTypeFilter">
            {{ scope.row.orderState | orderStatusFilter }}
          </el-tag>
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
export default {
  name: 'orderSearch',
  components: { Pagination, parseTime },
  data () {
    return {
      list: [],
      operateDate: [],
      listQuery: {
        total: 0,
        pageNo: 1,
        pageSize: 10,
        account: ''
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
      if (this.operateDate) {
        this.listQuery.createDateStart = parseTime(this.operateDate[0], '{y}-{m}-{d} {h}:{i}:{s}')
        this.listQuery.createDateEnd = parseTime(this.operateDate[1], '{y}-{m}-{d} {h}:{i}:{s}')
      } else {
        this.listQuery.createDateEnd = ''
        this.listQuery.createDateStart = ''
      }
    }
  }
}
</script>

<style>
  .app-main-container .el-form .statistics-wrapper .el-form-item__label {
    font-size: 16px;
    color: #02A5BD;
    letter-spacing: 1px;
    /*line-height: 22px;*/
  }
  .app-main-container .el-form .statistics-wrapper span {
    font-size: 16px;
    color: #02A5BD;
    letter-spacing: 1px;
    /*line-height: 19px;*/
  }
  .el-table td, .el-table th {
    padding: 5px 0;
  }
</style>
