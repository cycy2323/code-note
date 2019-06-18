<template>
  <div class="withdraw-list app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="商户号">
          <el-input v-model="listQuery.merId" clearable style="width: 250px;" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item>

        <el-form-item label="银行名称">
          <el-select
            v-model="bankCopy"
            :placeholder="$t('merchantList.whole')"
            value-key="code"
            clearable
            style="width: 250px;margin-right: 20px"
            class="filter-item">
            <el-option
              v-for="item in bankList"
              :key="item.code"
              :label="item.name"
              :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="银行卡后六位">
          <el-input v-model="listQuery.bankAccountNo" clearable style="width: 250px;" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="持卡人姓名">
          <el-input v-model="listQuery.bankUserName" clearable style="width: 250px;" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <br>
        <el-form-item label="代付类型">
          <el-select v-model="listQuery.orderSource" :placeholder="$t('merchantList.whole')" clearable style="width: 160px">
            <!--<el-option value="" label="全部"/>-->
            <el-option :value="1" label="api"/>
            <el-option :value="2" label="web"/>
          </el-select>
        </el-form-item>
        <el-form-item label="银行卡状态">
          <el-select v-model="listQuery.state" :placeholder="$t('merchantList.whole')" clearable style="width: 160px">
            <!--<el-option value="" label="全部"/>-->
            <el-option :value="1" label="正常"/>
            <el-option :value="2" label="黑名单"/>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="时间">-->
        <!--<el-date-picker-->
        <!--v-model="qishiDate"-->
        <!--type="daterange"-->
        <!--range-separator="至"-->
        <!--start-placeholder="开始时间"-->
        <!--end-placeholder="结束时间"-->
        <!--@change="dateChange"/>-->
        <!--</el-form-item>-->
        <el-form-item>
          <el-button
            v-waves
            type="primary"
            icon="el-icon-search"
            @click="handleFilter">{{ $t('merchantList.search') }}
          </el-button>
        </el-form-item>
        <!--<el-form-item>-->
        <!--<download-excel-component-->
        <!--v-handle="exportBtn"-->
        <!--:get-order-list="getOrderLists"-->
        <!--:t-header="tHeader"-->
        <!--:filter-val="filterVal"-->
        <!--:time-array="timeArray"-->
        <!--:title-name="titleName"-->
        <!--:download-statu="downloadStatu"-->
        <!--/>-->
        <!--</el-form-item>-->
      </el-form>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="商户号" prop="merId" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.merId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" prop="id" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createDate || '' | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="银行名称" prop="id" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bankName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="银行卡号" prop="id" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bankAccountNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="卡主姓名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bankUserName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="代付类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orderSource=='1'?'接口':'Web' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="银行卡状态" class-name="status-col">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state | orderStatusTagTypeFilter">
            {{ scope.row.state | orderStatusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('merchantList.operation')" align="center">
        <template slot-scope="scope">
          <el-button v-handle="blacklist" :type="scope.row.state=='1'?'primary':'success'" size="mini" @click="handlePaid(scope.row)">{{ scope.row.state=='2'?'启用':'拉黑' }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :visible.sync="dialogPvVisible" :close-on-click-modal="false" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, updateState } from '@/api/manage/orderManage/paidBanksRecord'
import { bankList } from '@/api/manage/orderManage/withdrawListReject'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
// import { exportExcel } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import DownloadExcelComponent from '@/components/DownloadExcel/index.vue' // 1/7 引入

const calendarTypeOptions = [
  { key: 'CN', display_name: '未支付' },
  { key: 'US', display_name: '已支付' },
  { key: 'JP', display_name: '已关闭' },
  { key: 'EU', display_name: '已取消' }
]

const orderStatusOptions = [
  { auditState: 1, display_name: '正常' },
  { auditState: 2, display_name: '黑名单' }
]
const statusMap = {
  0: 'warning',
  1: 'success',
  2: 'danger',
  3: 'danger'
}
// arr to obj ,such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

const orderStatusKeyValue = orderStatusOptions.reduce((acc, cur) => {
  acc[cur.auditState] = cur.display_name
  return acc
}, {})

export default {
  name: 'TransferRecord',
  components: { Pagination, DownloadExcelComponent },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    },
    orderStatusFilter(type) {
      return orderStatusKeyValue[type]
    },
    orderStatusTagTypeFilter(auditState) {
      return statusMap[auditState]
    }
  },
  data() {
    return {
      exportBtn: 'orderManage:transferRecord:export',
      blacklist: 'orderManage:paidBanksRecord:blacklist',
      tableKey: 0,
      list: null,
      total: 0,
      qishiDate: '',
      bankCopy: {},
      bankList: {},
      listLoading: false,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        transNo: undefined,
        createDateStart: '',
        createDateEnd: '',
        importance: undefined
      },
      importanceOptions: ['充值', '提现', '代付'],
      calendarTypeOptions,
      showReviewer: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
      // titleName: '商户互转记录', // excel文件名
      // downloadStatu: 0,
      // tHeader: ['转账订单号', '转出商户ID', '转入商户ID', '转出金额', '创建时间', '完成时间', '状态(0:待处理，1:处理中，2:处理成功，3:处理失败)'], // 表头名字——写法注意：如审核状态：'审核状态:   1:待审核，2.审核中,3.审核通过，4.审核不通过'
      // filterVal: ['transNo', 'acceptMerId', 'merId', 'transAmount', 'createDate', 'transDate', 'transState'],
      // timeArray: ['createDate', 'transDate'] // 要转时间格式的数据 如：["创建时间","修改时间"]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      await bankList().then(data => {
        this.bankList = data
      })
      if (this.bankCopy === null) {
        this.bankCopy = ''
      }
      this.listQuery.bankCode = this.bankCopy.code
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
        this.listQuery.createDateStart = parseTime(this.qishiDate[0], '{y}-{m}-{d}')
        this.listQuery.createDateEnd = parseTime(this.qishiDate[1], '{y}-{m}-{d}')
      } else {
        this.listQuery.createDateStart = ''
        this.listQuery.createDateEnd = ''
      }
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handlePaid(row) {
      const param = { id: [row.id], state: row.state === 1 ? 2 : 1 }
      updateState(param).then((res) => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.getList()
      })
    }
    // getOrderLists() {
    //   return exportExcel(this.total, this.listQuery, fetchList, this)// （总条数，查询条件，接口方法）
    // },
  }
}
</script>

