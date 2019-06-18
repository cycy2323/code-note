<template>
  <div class="app-container">
    <div class="filter-container" style="width: 100%;background: #FFFFFF;margin-bottom: 20px;padding: 20px 20px 0 20px">
      <el-form :inline="true" style="width: 100%;">
        <el-form-item label="订单号:">
          <el-input
            :placeholder="$t('merchantList.platformOrder')"
            v-model="listQuery.businessNo"
            clearable
            style="width: 300px;margin-right: 20px"
            class="filter-item"
            @keyup.enter.native="handleFilter"/>
        </el-form-item>
        <el-form-item label="流水类型：">
          <el-select
            v-model="listQuery.tradeType"
            :placeholder="$t('merchantList.whole')"
            clearable
            style="width: 110px;margin-right: 20px"
            class="filter-item">
            <el-option
              v-for="item in handStatusOptions"
              :key="item.workStatus"
              :label="item.display_name"
              :value="item.workStatus"/>
          </el-select>
        </el-form-item>
        <br>
        <el-form-item label="开始日期：">
          <el-date-picker
            v-model="listQuery.startTime"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            placeholder="订单开始时间"/>
          &nbsp;
          结束日期：
          &nbsp;
          <el-date-picker
            v-model="listQuery.endTime"
            type="datetime"
            style="margin-right: 20px"
            format="yyyy-MM-dd HH:mm:ss"
            placeholder="订单结束时间"/>
        </el-form-item>
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter">{{ $t('merchantList.search') }}
        </el-button>
        <!--3/7-->
        <download-excel-component
          v-handle="downloadExcel"
          :get-order-list="getOrderLists"
          :t-header="tHeader"
          :filter-val="filterVal"
          :time-array="timeArray"
          :title-name="titleName"
          :download-statu="downloadStatu"
        />
      </el-form>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange">
      <el-table-column :label="$t('table.SerialNumber')" align="center" >
        <template slot-scope="scope">
          <span class="">{{ scope.row.tradeNo }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.externalOrderNum')" align="center" >
        <template slot-scope="scope">
          <span class="">{{ scope.row.businessNo }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.CreationTime')" align="center">
        <template slot-scope="scope">
          <span>{{ (scope.row.createDate || '') | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.ModificationTime')" align="center">
        <template slot-scope="scope">
          <span>{{ (scope.row.updateDate || '') | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.SerialType')" align="center">
        <template slot-scope="scope">
          <span class="">
            {{ scope.row.tradeType==1?"充值"
            :scope.row.tradeType==2?"支付"
            :scope.row.tradeType==3?"转入"
            : scope.row.tradeType==4?"转出"
            : scope.row.tradeType==5?"代付"
            : scope.row.tradeType==6?"失败退款"
            : scope.row.tradeType==7?"人工扣款"
            : scope.row.tradeType==8?"人工加款"
            : scope.row.tradeType==9?"代付手续费"
            : scope.row.tradeType==10?"支付手续费"
            : scope.row.tradeType==12?"代理提现,商户转入"
            : scope.row.tradeType==13?"代付手续费退还"
            :"支付手续费退还" }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.SerialAmount')" align="center">
        <template slot-scope="scope">
          <span class="">{{ scope.row.tradeAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.PreChangeAmount')" align="center">
        <template slot-scope="scope">
          <span class="">{{ scope.row.frontAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.afterChangeAmount')" align="center">
        <template slot-scope="scope">
          <span class="">{{ scope.row.aftAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.remarks')" align="center">
        <template slot-scope="scope">
          <span class="">{{ scope.row.remarks }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNo"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"/>

      <!--<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">-->
      <!--<el-form-->
      <!--ref="dataForm"-->
      <!--:rules="rules"-->
      <!--:model="temp"-->
      <!--label-position="right"-->
      <!--label-width="99px"-->
      <!--style="width: 400px; margin-left:50px;">-->
      <!--<el-form-item :label="$t('merchantList.merchantName')">-->
      <!--<el-input v-model="temp.merchantName" :readonly="true" style="width: 199px;" disabled="true"/>-->
      <!--</el-form-item>-->
      <!--<el-form-item :label="$t('merchantList.cellPhone')">-->
      <!--<el-input v-model="temp.cellPhone" :readonly="true" style="width: 199px;" disabled="true"/>-->
      <!--</el-form-item>-->
      <!--<el-form-item :label="$t('merchantList.assessStatus')">-->
      <!--<el-tag :type="temp.auditState | orderStatusTagTypeFilter ">-->
      <!--{{ temp.auditState | orderStatusFilter }}-->
      <!--</el-tag>-->
      <!--</el-form-item>-->
      <!--<el-form-item :label="$t('merchantList.accountStatus')">-->
      <!--<el-tag :type="temp.state === 1 ? 'success' : 'danger' ">-->
      <!--{{ temp.state === 1 ? '正常' : '冻结' }}-->
      <!--</el-tag>-->
      <!--</el-form-item>-->
      <!--<el-form-item :label="$t('merchantList.surplusMoney')">-->
      <!--<el-input v-model="temp.surplusMoney" :readonly="true" style="width: 199px;" disabled="true"/>-->
      <!--</el-form-item>-->
      <!--<el-form-item :label="$t('merchantList.ABonus')">-->
      <!--<el-input v-model="temp.ABonus" :readonly="true" style="width: 199px;" disabled="true"/>-->
      <!--</el-form-item>-->
      <!--</el-form>-->
      <!--<div slot="footer" class="dialog-footer">-->
      <!--<el-button @click="dialogFormVisible = false">{{ $t('order.confirm') }}</el-button>-->
      <!--</div>-->
      <!--</el-dialog>-->

  </div>
</template>
<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
<script>
// import { createOrder, fetchList, fetchPv, updateOrder } from '@/api/common/order'
import { freezeAccount } from '@/api/agent/merchantManage'
import { getOrderList } from '@/api/merchant/merchantInfo/merchantTransferDetail'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { exportExcel } from '@/utils'
import DragDialog from '@/view/common/dragDialog'
import DownloadExcelComponent from '@/components/DownloadExcel/index.vue' // 1/7 引入

const orderStatusOptions = [
  { auditState: 0, display_name: '预下单' },
  { auditState: 1, display_name: '成功' },
  { auditState: 2, display_name: '失败' },
  { auditState: 3, display_name: '处理中' },
  { auditState: 4, display_name: '异常需人工处理' }
]

const handStatusOptions = [
  { workStatus: 2, display_name: '支付' },
  { workStatus: 3, display_name: '转入' },
  { workStatus: 4, display_name: '转出' },
  { workStatus: 5, display_name: '代付' },
  { workStatus: 6, display_name: '失败退款' },
  { workStatus: 7, display_name: '人工扣款' },
  { workStatus: 8, display_name: '人工加款' },
  { workStatus: 9, display_name: '代付手续费' },
  { workStatus: 10, display_name: '支付手续费' },
  { workStatus: 12, display_name: '代理提现,商户转入' },
  { workStatus: 13, display_name: '代付手续费退还' },
  { workStatus: 14, display_name: '支付手续费退还' }
]

const orderFromOptions = [
  { orderFrom: 0, display_name: '接口' },
  { orderFrom: 1, display_name: '后台' }
]

// const channelCodeOptions = [
//   { channelCode: 'jiayi', display_name: '嘉亿' },
//   { channelCode: 'jiutong', display_name: '久通' },
//   { channelCode: 'mashanfu', display_name: '码闪付' }
// ]

const payTypeOptions = [
  { payType: 'BANK', display_name: '网银' },
  { payType: 'ZFB', display_name: '支付宝' }
]

const statusMap = {
  0: 'danger',
  1: 'success',
  2: 'danger'
}

export default {
  name: 'MerchantTransferDetail',
  components: { DragDialog, Pagination, DownloadExcelComponent },
  directives: { waves },
  filters: {
  },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        businessNo: undefined, //
        tradeType: undefined, //
        workStatus: undefined,
        orderFrom: undefined,
        auditStat: undefined,
        state: undefined,
        orderStatus: undefined,
        payType: undefined,
        orderNo: undefined,
        ZFBOrderNo: undefined,
        startTime: undefined, //
        endTime: undefined, //
        sort: '+id'
      },
      statusOptions: orderStatusOptions,
      orderFromOptions,
      orderStatusOptions,
      payTypeOptions,
      statusMap,
      handStatusOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      evaluationStatusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        merchantName: undefined,
        merCode: undefined,
        cellPhone: undefined,
        auditState: undefined,
        state: undefined,
        surplusMoney: undefined,
        ABonus: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '查看或编辑',
        create: '新增',
        find: 'Find'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
      },
      downloadLoading: false,

      //  4/7 定义数据 4个
      titleName: '商户资金变动列表', // excel文件名
      downloadStatu: 0,
      tHeader: ['流水号', '订单号', '创建时间', '修改时间', '流水类型:1=充值，2=支付，3=转入，4=转出，5=代付，6=失败退款，7=人工扣款，8=人工加款,9=代付手续费，10=支付手续费，12=代理提现,商户转入，13="代付手续费退还",14="支付手续费退还"', '流水金额', '变动前金额', '变动后金额', '备注'], // 表头名字
      filterVal: ['tradeNo', 'businessNo', 'createDate', 'updateDate', 'tradeType', 'tradeAmount', 'frontAmount', 'aftAmount', 'remarks'], // 表头名字对应接口参数
      timeArray: ['createDate', 'updateDate'],
      downloadExcel: 'merchantInfo:merchantTransferDetail:downloadExcel'
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getOrderList(this.listQuery).then(response => {
        this.list = response.list
        this.total = response.total

        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    handleFreeze(row) {
      freezeAccount({ merCode: row.merCode, state: row.state === 1 ? 0 : 1 }).then(() => {
        row.state === 1 ? row.state = 0 : row.state = 1
      })
    },
    handleDelete(row) {
      freezeAccount({ merCode: row.merCode, deleteFlag: '0' }).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      })
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    detailClick(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'detail'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    getOrderLists() {
      return exportExcel(this.total, this.listQuery, getOrderList, this)// （总条数，查询条件，接口方法）
    }
  }
}
</script>

<style scoped>

</style>

