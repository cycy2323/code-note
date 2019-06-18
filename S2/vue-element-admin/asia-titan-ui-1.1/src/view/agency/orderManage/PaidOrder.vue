<template>
  <div class="app-container">
    <el-form :inline="true" class="filter-container inquire-style">
      <el-form-item label="平台订单号">
        <el-input
          :placeholder="$t('merchantList.platformOrder')"
          v-model="listQuery.orderNo"
          clearable
          style="width: 200px;margin-right: 20px"
          class="filter-item"
          @keyup.enter.native="handleFilter"/>
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="listQuery.orderState"
          :placeholder="$t('merchantList.whole')"
          clearable
          style="width: 110px;margin-right: 20px"
          class="filter-item">
          <el-option
            v-for="item in statusOptions"
            :key="item.auditState"
            :label="item.display_name"
            :value="item.auditState"/>
        </el-select>
      </el-form-item>
      <el-form-item label="订单来源">
        <el-select
          v-model="listQuery.orderSource"
          :placeholder="$t('merchantList.whole')"
          clearable
          style="width: 110px;margin-right: 20px"
          class="filter-item">
          <el-option
            v-for="item in orderFromOptions"
            :key="item.orderFrom"
            :label="item.display_name"
            :value="item.orderFrom"/>
        </el-select>
      </el-form-item>
      <el-form-item label="商户订单号">
        <el-input
          :placeholder="$t('merchantList.merchantOrder')"
          v-model="listQuery.merOrderNo"
          clearable
          style="width: 200px;margin-right: 20px"
          class="filter-item"
          @keyup.enter.native="handleFilter"/>
      </el-form-item>
      <el-form-item label="银行卡号">
        <el-input
          :placeholder="$t('merchantList.bankNum')"
          v-model="listQuery.bankAccountNo"
          clearable
          style="width: 220px;margin-right: 20px"
          class="filter-item"
          @keyup.enter.native="handleFilter"/>
      </el-form-item>
      <el-form-item label="卡主姓名">
        <el-input
          :placeholder="$t('merchantList.bankHost')"
          v-model="listQuery.bankUserName"
          clearable
          style="width: 220px;margin-right: 20px"
          class="filter-item"
          @keyup.enter.native="handleFilter"/>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="qishiDate"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          @change="dateChange"/>
      </el-form-item>
      <el-form-item>
        <el-button
          v-waves
          type="primary"
          icon="el-icon-search"
          @click="handleFilter">{{ $t('merchantList.search') }}
        </el-button>
      </el-form-item>
      <el-form-item>
        <download-excel-component
          :get-order-list="getOrderLists"
          :t-header="tHeader"
          :filter-val="filterVal"
          :time-array="timeArray"
          :title-name="titleName"
          :download-statu="downloadStatu"
        />
      </el-form-item>
      <br>
      <el-form-item label="提交总金额:">
        <span class="header-title">{{ statisticsData.submitTotalAmount }}</span>
      </el-form-item>
      <el-form-item label="成功总笔数:">
        <span class="header-title">{{ statisticsData.succeededTotalCount }}</span>
      </el-form-item>
      <el-form-item label="处理中总笔数:">
        <span class="header-title">{{ statisticsData.inhandCount }}</span>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      :row-class-name="tableRowClassName"
      :default-sort = "{prop: 'createDate', order: 'descending'}"
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column :label="$t('merchantList.platformOrder')" align="center" >
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.orderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('merchantList.merchantOrder')" align="center">
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.merOrderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('merchantList.merchantID')" align="center">
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.merId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('merchantList.orderSource')" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.orderSource === 1 ? 'success' : 'danger' ">
            {{ scope.row.orderSource === 1 ? '接口' : '后台' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('merchantList.bankNum')" align="center">
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.bankAccountNo }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('merchantList.bank')" align="center">
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.bankName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('merchantList.bankHost')" align="center">  <!--卡主姓名-->
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.bankUserName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('merchantList.orderMoney')" align="center">
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.orderAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('merchantList.status')" align="center">      <!--状态-->
        <template slot-scope="scope">
          <el-tag :type="scope.row.orderState | orderStatusTagTypeFilter ">
            {{ scope.row.orderState | orderStatusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('merchantList.poundage')" align="center">
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.merCommission }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('merchantList.createTime')" align="center" prop="createDate" sortable>
        <template slot-scope="scope">
          <!--<span>{{ scope.row.createDate }}</span>-->
          <span>{{ scope.row.createDate || '' | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNo"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"/>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="right"
        label-width="99px"
        style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('merchantList.merchantName')">
          <el-input v-model="temp.merchantName" :readonly="true" style="width: 199px;" disabled="true"/>
        </el-form-item>
        <el-form-item :label="$t('merchantList.cellPhone')">
          <el-input v-model="temp.cellPhone" :readonly="true" style="width: 199px;" disabled="true"/>
        </el-form-item>
        <el-form-item :label="$t('merchantList.assessStatus')">
          <el-tag :type="temp.auditState | orderStatusTagTypeFilter ">
            {{ temp.auditState | orderStatusFilter }}
          </el-tag>
        </el-form-item>
        <el-form-item :label="$t('merchantList.accountStatus')">
          <el-tag :type="temp.state === 1 ? 'success' : 'danger' ">
            {{ temp.state === 1 ? '正常' : '冻结' }}
          </el-tag>
        </el-form-item>
        <el-form-item :label="$t('merchantList.surplusMoney')">
          <el-input v-model="temp.surplusMoney" :readonly="true" style="width: 199px;" disabled="true"/>
        </el-form-item>
        <el-form-item :label="$t('merchantList.ABonus')">
          <el-input v-model="temp.ABonus" :readonly="true" style="width: 199px;" disabled="true"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('order.confirm') }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
// import { createOrder, fetchList, fetchPv, updateOrder } from '@/api/common/order'
import { paidList, remitStatis } from '@/api/agency/orderManage'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { exportExcel } from '@/utils'
import DragDialog from '@/view/common/dragDialog'
import DownloadExcelComponent from '@/components/DownloadExcel/index.vue' // 1/7 引入

// 获取格林时间
var date1 = new Date(new Date(new Date().toLocaleDateString()).getTime())
var date2 = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)

// 格式化时间  2018-06-06 00:00:00
// 如果只是简单的格式化只变成2018-6-6 0:0:0，需要运用三目运算判断并在适当的地方加上0，完成所需要的格式。
var startTime = date1.getFullYear() + '-' + ((date1.getMonth() + 1) < 10 ? '0' + (date1.getMonth() + 1) : (date1.getMonth() + 1)) + '-' + (date1.getDate() < 10 ? '0' + date1.getDate() : date1.getDate()) + ' ' + (date1.getHours() < 10 ? '0' + date1.getHours() : date1.getHours()) + ':' + (date1.getMinutes() < 10 ? '0' + date1.getMinutes() : date1.getMinutes()) + ':' + (date1.getSeconds() < 10 ? '0' + date1.getSeconds() : date1.getSeconds())

// 格式化时间  2018-06-06 23:59:59
var endTime = date2.getFullYear() + '-' + (date2.getMonth() + 1) + '-' + date2.getDate() + ' ' + date2.getHours() + ':' + date2.getMinutes() + ':' + date2.getSeconds()
const orderStatusOptions = [
  { auditState: 1, display_name: '待处理' },
  { auditState: 2, display_name: '支付成功' },
  { auditState: 3, display_name: '失败待退款' },
  { auditState: 4, display_name: '失败已退款' },
  { auditState: 5, display_name: '退款待审核' }
]

const orderFromOptions = [
  { orderFrom: 1, display_name: '接口' },
  { orderFrom: 2, display_name: '后台' }
]

const statusMap = {
  1: '',
  2: 'success',
  3: 'danger',
  4: 'danger',
  5: 'warning'
}
// calendarTypeKeyValue
// arr to obj ,such as { CN : "China", US : "USA" }
const orderStatusKeyValue = orderStatusOptions.reduce((acc, cur) => {
  acc[cur.auditState] = cur.display_name
  return acc
}, {})
export default {
  name: 'PaidOrder',
  components: { DragDialog, Pagination, DownloadExcelComponent },
  directives: { waves },
  filters: {
    orderStatusTagTypeFilter(auditState) {
      return statusMap[auditState]
    },
    orderStatusFilter(type) {
      return orderStatusKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: false,
      statisticsData: {},
      qishiDate: [new Date(startTime), new Date(endTime)],
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        orderState: undefined,
        orderSource: undefined,
        bankAccountNo: undefined,
        bankUserName: undefined,
        merOrderNo: undefined,
        auditStat: undefined,
        state: undefined,
        orderStatus: undefined,
        payType: undefined,
        orderNo: undefined,
        startDate: startTime,
        endDate: endTime
      },
      statusOptions: orderStatusOptions,
      orderFromOptions,
      orderStatusOptions,
      statusMap,
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
      downloadLoading: false,
      titleName: '代付订单查询', // excel文件名
      downloadStatu: 0,
      tHeader: ['平台商户号', '商户订单号', '商户ID', '订单来源', '银行卡号', '银行', '卡主姓名', '订单金额', '状态', '手续费', '创建时间'], // 表头名字——写法注意：如审核状态：'审核状态:   1:待审核，2.审核中,3.审核通过，4.审核不通过'
      filterVal: ['orderNo', 'merOrderNo', 'merId', 'orderSource', 'bankAccountNo', 'bankName', 'bankUserName', 'orderAmount', 'orderState', 'merCommission', 'createDate'],
      timeArray: ['createDate'] // 要转时间格式的数据 如：["创建时间","修改时间"]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
    },
    getList() {
      this.listLoading = true
      paidList(this.listQuery).then(data => {
        this.list = data.list
        this.total = data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
      remitStatis(this.listQuery).then(response => {
        this.statisticsData = response
      })
    },
    dateChange() {
      if (this.qishiDate) {
        this.listQuery.startDate = parseTime(this.qishiDate[0], '{y}-{m}-{d} {h}:{i}:{s}')
        this.listQuery.endDate = parseTime(this.qishiDate[1], '{y}-{m}-{d} {h}:{i}:{s}')
      } else {
        this.listQuery.endDate = ''
        this.listQuery.startDate = ''
      }
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    getOrderLists() {
      return exportExcel(this.total, this.listQuery, paidList, this)// （总条数，查询条件，接口方法）
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>

<style scoped>
  .filter-container .el-form-item .header-title {
    font-size: 24px;
    width: 200px;
    display: inline-block;
    color: #409EFF;
    font-weight: bold;
  }
</style>

