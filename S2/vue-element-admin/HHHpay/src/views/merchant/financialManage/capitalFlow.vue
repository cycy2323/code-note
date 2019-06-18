<template>
    <div class="app-main-container">
    <el-form :inline="true" :model="listQuery" style="width: 96%;margin-right: auto;margin-left: auto">
      <el-form-item label="记录时间">
        <el-date-picker
          size="small"
          v-model="clock"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          @change="dateChange">
          </el-date-picker>
      </el-form-item>
      <el-form-item label="状态">
        <el-select size="small" placeholder="请选择" clearable>
          <!--<el-option :value="1" label="启用">启用</el-option>-->
          <!--<el-option :value="2" label="停用">停用</el-option>-->
        </el-select>
      </el-form-item>
      <el-button size="small" type="primary" @click="refreshList" style="margin-top: 5px">查询</el-button>
      <el-button size="small" type="primary" @click="refreshList" style="margin-top: 5px">下载</el-button>
    </el-form>
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 96%;margin-right: auto;margin-left: auto">
      <el-table-column label="记录时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.operateTime || '' | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
        </template>
      </el-table-column>
      <el-table-column  label="金额类型"  align="center"></el-table-column>
      <el-table-column  label="提交金额"  align="center"></el-table-column>
      <el-table-column  label="收益/支出" align="center"></el-table-column>
      <el-table-column  label="费用" align="center"></el-table-column>
      <el-table-column  label="余额" align="center"></el-table-column>
      <el-table-column  label="备注" align="center"></el-table-column>
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
  name: 'capitalFlow',
  components: { Pagination, parseTime },
  data () {
    return {
      list: [],
      clock: [],
      listQuery: {
        total: 0,
        pageNo: 1,
        pageSize: 10,
        account: '',
        money: ''
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
      if (this.clock) {
        this.listQuery.createDateStart = parseTime(this.clock[0], '{y}-{m}-{d} {h}:{i}:{s}')
        this.listQuery.createDateEnd = parseTime(this.clock[1], '{y}-{m}-{d} {h}:{i}:{s}')
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
