<template>
  <div class="balance-phont-shop app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-form-item label="收款账号">
        <el-input v-model.number="listQuery.inBankAccountNo" clearable style="width: 200px;" @keyup.enter.native="refreshList"/>
      </el-form-item>
      <el-form-item label="对方账号">
        <el-input v-model.number="listQuery.otherAccountNo" clearable style="width: 200px;" @keyup.enter.native="refreshList"/>
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
      <el-table-column label="银行账单表的ID" prop="id" align="center"/>
      <el-table-column label="账号余额" prop="accountBalance" align="center"/>
      <el-table-column label="银行账单状态" prop="billState" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.billState === 0 ? '未关联' : '关联成功' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收入金额" prop="inAmount" align="center"/>
      <el-table-column label="收款账号" prop="inBankAccountNo" align="center"/>
      <el-table-column label="收款银行" prop="inBankName" align="center"/>
      <el-table-column label="平台订单号" prop="orderNo" align="center"/>
      <el-table-column label="对方户名" prop="otherAccountName" align="center"/>
      <el-table-column label="对方账号" prop="otherAccountNo" align="center"/>
      <el-table-column label="对方省市" prop="otherProvince" align="center"/>
      <el-table-column label="支出金额" prop="outAmount" align="center"/>
      <el-table-column label="交易银行名" prop="tradeBank" align="center"/>
      <el-table-column label="交易时间" prop="tradeDate" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tradeDate || '' | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="tradeRemarks" align="center"/>
      <el-table-column label="操作" align="center" class-name="small-padding">
        <template slot-scope="scope">
          <el-button v-handle="relation" v-waves v-if="scope.row.billState === 0" type="primary" size="small" @click="showDialog(scope.row)">补单</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <!--添加商户充值弹框-->
    <el-dialog :visible.sync="dialogDetault" :close-on-click-modal="false" title="补单" width="500px">
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="right"
        label-width="99px"
        style="width: 400px; margin-left:50px;">
        <el-form-item label="银行账单ID">
          <el-input v-model="temp.id" style="width: 199px;" disabled/>
        </el-form-item>
        <el-form-item label="交易订单号">
          <el-input v-model="temp.orderNo" style="width: 199px;"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="relationSure">{{ $t('table.confirm') }}</el-button>
        <el-button @click="dialogDetault = false">{{ $t('table.cancel') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { fetchList, fetchRelation } from '@/api/manage/financeManage/bankStatement'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { parseTime, pickerOptions } from '@/utils'
var time = new Date()
export default {
  name: 'BankStatement',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      relation: 'financeManage:bankStatement:relation',
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      dialogDetault: false,
      qishiDate: [parseTime(time, '{y}-{m}-{d}') + ' 00:00:00', parseTime(time, '{y}-{m}-{d}') + ' 23:59:59'],
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        startTradeDate: parseTime(parseTime(time, '{y}-{m}-{d}') + ' 00:00:00'),
        endTradeDate: parseTime(parseTime(time, '{y}-{m}-{d}') + ' 23:59:59'),
        otherAccountNo: '',
        inBankAccountNo: ''
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
        this.listQuery.startTradeDate = parseTime(this.qishiDate[0], '{y}-{m}-{d} {h}:{i}:{s}')
        this.listQuery.endTradeDate = parseTime(this.qishiDate[1], '{y}-{m}-{d} {h}:{i}:{s}')
      } else {
        this.listQuery.endTradeDate = null
        this.listQuery.startTradeDate = null
      }
    },
    showDialog(row) {
      this.temp.id = row.id
      this.dialogDetault = true
    },
    relationSure() {
      if (!this.temp.orderNo) {
        this.$message.error('请填写订单号！~')
        return
      }
      fetchRelation(this.temp).then(response => {
        this.$message.success('补单成功')
        this.dialogDetault = false
        this.getList()
      })
    }
  }
}
</script>

<style scope>
  .balance-phont-shop .el-date-editor .el-range-separator{
    width: auto;
  }
</style>
