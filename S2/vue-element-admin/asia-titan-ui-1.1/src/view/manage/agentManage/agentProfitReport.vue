<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-form-item label="代理ID">
        <el-input v-model.number="listQuery.agentId" clearable style="width: 200px;" @keyup.enter.native="refreshList"/>
      </el-form-item>
      <el-form-item label="提现订单号">
        <el-input v-model="listQuery.withdrawNumber" clearable style="width: 200px;" @keyup.enter.native="refreshList" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="listQuery.state" :placeholder="$t('merchantList.whole')" clearable class="filter-item" style="width: 160px">
          <el-option
            v-for="item in stateOption"
            :key="item.state"
            :label="item.display_name"
            :value="item.state" />
        </el-select>
      </el-form-item>
      <el-button v-waves class="filter-item" type="primary" @click="refreshList">{{ $t('table.search') }}</el-button>
    </el-form>

    <el-table v-loading="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="代理ID" prop="agentId" align="center"/>
      <el-table-column label="代理昵称" prop="nickName" align="center"/>
      <el-table-column label="提现订单号" prop="withdrawNumber" align="center"/>
      <el-table-column label="提现金额" prop="withdrawAmount" align="center"/>
      <el-table-column label="状态" prop="state" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state | stateTagFilter">
            {{ scope.row.state | stateFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="申请日期" prop="createDate" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createDate | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核日期" prop="auditDate" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.auditDate || '' | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核人" prop="auditUser" align="center"/>
      <el-table-column label="审核意见" prop="auditRemarks" align="center"/>
      <el-table-column label="操作" align="center" class-name="small-padding">
        <template slot-scope="scope">
          <el-button v-handle="examine" v-if="scope.row.state < 3" size="mini" @click="showDialog(scope.row)">审核</el-button>
          <el-button v-else disabled size="mini">已审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :visible.sync="dialogPvVisible" :close-on-click-modal="false" title="提现审核" width="600px">
      <el-form ref="formExamine" :model="formExamine" label-position="right" label-width="99px">
        <el-form-item label="审核" prop="orderState">
          <el-select v-model="formExamine.orderState" style="width: 160px">
            <el-option :value="1" label="通过" />
            <el-option :value="2" label="驳回" />
          </el-select>
        </el-form-item>
        <el-form-item label="审核意见" prop="auditRemarks">
          <el-input v-model="formExamine.auditRemarks" style="width: 220px;"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogPvVisible = false">取 消</el-button>
        <el-button type="primary" @click="createConfirm('formExamine')">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { fetchList, fetchUpdate } from '@/api/manage/agentManage/agentProfitReport'
import waves from '@/directive/waves' // Waves directive
// import { Message } from 'element-ui'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { parseTime } from '@/utils'

const stateOption = [
  { state: 1, display_name: '待审核' },
  { state: 3, display_name: '审核通过' },
  { state: 4, display_name: '审核驳回' }
]
const stateMap = {
  1: '',
  3: 'success',
  4: 'danger'
}

const statusKeyValue = stateOption.reduce((acc, cur) => {
  acc[cur.state] = cur.display_name
  return acc
}, {})
export default {
  name: 'AgentProfitReport',
  components: { Pagination },
  directives: { waves },
  filters: {
    stateFilter(type) {
      return statusKeyValue[type]
    },
    stateTagFilter(state) {
      return stateMap[state]
    },
    parseTime
  },
  data() {
    return {
      examine: 'manageAgentManage:agentProfitReport:examine',
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        withdrawNumber: '',
        agentId: '',
        state: ''
      },
      // stateList: states,
      stateOption,
      formExamine: {
        id: '',
        auditRemarks: '',
        state: '',
        orderState: 1,
        withdrawNumber: ''
      },
      dialogPvVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      // if (typeof (this.listQuery.agentId) === 'string') {
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
    showDialog(row) {
      this.formExamine.id = row.id
      this.formExamine.state = row.state
      this.formExamine.auditRemarks = row.auditRemarks
      this.formExamine.withdrawNumber = row.withdrawNumber
      this.dialogPvVisible = true
    },
    createConfirm(formName) {
      var vm = this
      if (vm.formExamine.orderState === 2 && !this.formExamine.auditRemarks) {
        vm.$message({
          message: '请填写备注',
          type: 'warning'
        })
        return
      }
      fetchUpdate(vm.formExamine).then(response => {
        vm.$message({
          message: '操作成功',
          type: 'success'
        })
        vm.refreshList()
        vm.dialogPvVisible = false
      })
    },
    refreshList() {
      this.listQuery.pageNo = 1
      this.getList()
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
