<template>
  <div class="app-container">
    <div class="filter-container" style="width: 100%;background: #FFFFFF;padding: 20px 20px 0 20px">
      <el-form :inline="true" style="width: 100%;">
        <el-form-item label="平台订单号:">
          <el-input
            :placeholder="$t('merchantList.platformOrder')"
            v-model="listQuery.orderNo"
            clearable
            style="width: 300px;margin-right: 20px"
            class="filter-item"
            @keyup.enter.native="handleFilter"/>
        </el-form-item>
        <el-form-item label="状态:">
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
        <el-form-item label="订单来源:">
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
        <br>
        <el-form-item label="商户订单号:">
          <el-input
            :placeholder="$t('merchantList.merchantOrder')"
            v-model="listQuery.merOrderNo"
            clearable
            style="width: 300px;margin-right: 20px"
            class="filter-item"
            @keyup.enter.native="handleFilter"/>
        </el-form-item>
        <el-form-item label="创建时间:">
          <el-date-picker
            v-model="listQuery.startTime"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            placeholder="创建时间"/>
          &nbsp;
          至
          &nbsp;
          <el-date-picker
            v-model="listQuery.endTime"
            type="datetime"
            style="margin-right: 20px"
            format="yyyy-MM-dd HH:mm:ss"
            placeholder="创建时间"/>
        </el-form-item>
        <el-button
          v-waves
          class="filter-item pan-btn green-btn"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter">{{ $t('merchantList.search') }}
        </el-button>
        <!--3/7-->
        <download-excel-component
          v-handle="downEx"
          :get-order-list="getOrderLists"
          :t-header="tHeader"
          :filter-val="filterVal"
          :time-array="timeArray"
          :title-name="titleName"
        />
      </el-form>
    </div>

    <div style="font-size:14px; padding-bottom: 10px;">
      <span v-handle="count">订单总数:<span class="order-statistics">&nbsp;{{ listSituation.orderCount===0 ? 0:listSituation.orderCount ? listSituation.orderCount:'_ _' }}&nbsp;</span>笔，</span>
      <span v-handle="amount">支付总额:<span class="order-statistics">&nbsp;{{ listSituation.amount ===0 ? 0:listSituation.amount ? listSituation.amount:'_ _' }}&nbsp;</span>元 ，</span>
      <span v-handle="fee">手续费总计:<span class="order-statistics">&nbsp;{{ listSituation.commission ===0 ? 0:listSituation.commission ? listSituation.commission:'_ _' }}&nbsp;</span>元，</span>
      <span v-handle="gain">支付收益:<span class="order-statistics">&nbsp;{{ listSituation.realAmount ===0 ? 0:listSituation.realAmount ? listSituation.realAmount:'_ _' }}&nbsp;</span>元</span>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      highlight-current-row
      fit
      style="width: 100%;">
      <el-table-column :label="$t('merchantList.platformOrder')" align="center">
        <template slot-scope="scope">
          <span class="">{{ scope.row.orderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('merchantList.merchantOrder')" align="center">
        <template slot-scope="scope">
          <span class="">{{ scope.row.merOrderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('merchantList.merchantID')" align="center">
        <template slot-scope="scope">
          <span class="">{{ scope.row.merId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('merchantList.orderSource')" align="center">
        <template slot-scope="scope">
          <span class="">{{ scope.row.orderSource==1?'api':'web' }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.bank')" align="center">
        <template slot-scope="scope">
          <span class="">{{ scope.row.bankName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单金额" align="center">
        <template slot-scope="scope">
          <span class="">{{ scope.row.orderAmount }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column :label="$t('merchantList.goodsName')" align="center">-->
      <!--<template slot-scope="scope">-->
      <!--<span class="">{{ scope.row.goodsName }}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column :label="$t('table.orderState')" align="center" min-width="130px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.orderState === 1 ? 'success' : 'danger' " style="width: 130px;">
            {{ scope.row.orderState === -1 ? '预下单':scope.row.orderState === 0 ? '待支付' : scope.row.orderState === 1 ?
            '支付成功': scope.row.orderState === 2 ? '失败': scope.row.orderState === 3 ? '支付成功（已冻结）' :'补单' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('merchantList.poundage')" align="center">
        <template slot-scope="scope">
          <span class="">{{ scope.row.merCommission }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('merchantList.createTime')" align="center">
        <template slot-scope="scope">
          <span>{{ (scope.row.createDate || '') | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('merchantList.receiveNotifyDate')" align="center">
        <template slot-scope="scope">
          <span>{{ (scope.row.receiveNotifyDate || '') | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
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
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="99px"
        style="width: 400px; margin-left:50px;">
        <!--<el-form-item :label="$t('merchantList.merchantName')">-->
        <!--<el-input v-model="temp.merchantName" :readonly="true" style="width: 199px;"/>-->
        <!--</el-form-item>-->
        <el-form-item :label="$t('table.PlatOrderNum')">
          <el-input v-model="temp.orderNo" :readonly="true" style="width: 199px;" disabled="true"/>
        </el-form-item>
        <el-form-item :label="$t('table.OrderAmount')">
          <el-input v-model="temp.orderAmount" :readonly="true" style="width: 199px;" disabled="true"/>
        </el-form-item>
        <el-form-item :label="$t('table.AmountOfPhone')">
          <el-input v-model="temp.realAmount" :readonly="true" style="width: 199px;" disabled="true"/>
        </el-form-item>
        <el-form-item :label="$t('table.AgentID')">
          <el-input v-model="temp.agentId" :readonly="true" style="width: 199px;" disabled="true"/>
        </el-form-item>
        <el-form-item :label="$t('table.AgentName')">
          <el-input v-model="temp.agentName" :readonly="true" style="width: 199px;" disabled="true"/>
        </el-form-item>
        <el-form-item :label="$t('table.createdTimes')">
          <el-input v-model="temp.createDate" :readonly="true" style="width: 199px;" disabled="true"/>
        </el-form-item>
        <el-form-item :label="$t('table.Founder')">
          <el-input v-model="temp.createId" :readonly="true" style="width: 199px;" disabled="true"/>
        </el-form-item>
        <el-form-item :label="$t('table.remarks')">
          <el-input v-model="temp.remarks" :readonly="true" style="width: 199px;" disabled="true"/>
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
import { freezeAccount } from '@/api/agent/merchantManage'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { Message } from 'element-ui'
import DragDialog from '@/view/common/dragDialog'

import {
  merchantTransactionOrderList,
  listSituation
} from '@/api/merchant/merchantOrderCheck/merchantTransactionOrder'
import DownloadExcelComponent from '@/components/DownloadExcel/index.vue' // 1/7 引入
import { parseTime } from '@/utils'

const orderStatusOptions = [
  { auditState: -1, display_name: '预下单' },
  { auditState: 0, display_name: '待支付' },
  { auditState: 1, display_name: '支付成功' },
  { auditState: 2, display_name: '失败' },
  { auditState: 3, display_name: '支付成功（已冻结）' },
  { auditState: 4, display_name: '补单' }
]

const handStatusOptions = [
  { workStatus: 0, display_name: '商户转出' },
  { workStatus: 1, display_name: '商户转入' },
  { workStatus: 2, display_name: '网银' }
]

const orderFromOptions = [
  { orderFrom: 1, display_name: 'api' },
  { orderFrom: 2, display_name: 'web' }
]

const channelCodeOptions = [
  { channelCode: 'jiayi', display_name: '嘉亿' },
  { channelCode: 'jiutong', display_name: '久通' },
  { channelCode: 'mashanfu', display_name: '码闪付' }
]

const payTypeOptions = [
  { payType: 'BANK', display_name: '网银' },
  { payType: 'ZFB', display_name: '支付宝' }
]

const statusMap = {
  0: 'danger',
  1: 'success',
  2: 'danger'
}

const handStatusMap = {
  0: 'info',
  1: 'warning'
}

const channelCodeMap = {
  'jiutong': 'info',
  'jiayi': 'warning',
  'mashanfu': 'danger'
}

// calendarTypeKeyValue
// arr to obj ,such as { CN : "China", US : "USA" }
const orderStatusKeyValue = orderStatusOptions.reduce((acc, cur) => {
  acc[cur.auditState] = cur.display_name
  return acc
}, {})

const handStatusKeyValue = handStatusOptions.reduce((acc, cur) => {
  acc[cur.handStatus] = cur.display_name
  return acc
}, {})

const channelCodeKeyValue = channelCodeOptions.reduce((acc, cur) => {
  acc[cur.channelCode] = cur.display_name
  return acc
}, {})

const payTypeKeyValue = payTypeOptions.reduce((acc, cur) => {
  acc[cur.payType] = cur.display_name
  return acc
}, {})
export default {
  name: 'MerchantTransactionOrder',
  components: { DragDialog, Pagination, DownloadExcelComponent },
  directives: { waves },
  filters: {
    parseTime,
    orderStatusTagTypeFilter(auditState) {
      return statusMap[auditState]
    },
    handStatusTagTypeFilter(orderStatus) {
      return handStatusMap[orderStatus]
    },
    channelCodeTagTypeFilter(channelCode) {
      return channelCodeMap[channelCode]
    },
    orderStatusFilter(type) {
      return orderStatusKeyValue[type]
    },
    handStatusFilter(type) {
      return handStatusKeyValue[type]
    },
    channelCodeFilter(type) {
      return channelCodeKeyValue[type]
    },
    payTypeFilter(type) {
      return payTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: [],
      listSituation: [],
      total: 0,
      listLoading: false,
      listQuery: {
        pageNo: 1, //
        pageSize: 10, //
        workStatus: undefined, // 业务
        orderSource: undefined, // 订单来源
        orderState: undefined, // 状态
        merOrderNo: undefined, // 商户订单号
        state: undefined,
        orderStatus: undefined,
        payType: undefined,
        orderNo: undefined, // 平台订单号
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
        // update: '查看或编辑',
        detail: '详情',
        create: '新增',
        find: 'Find'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        // type: [{ required: true, message: 'type is required', trigger: 'change' }],
        // timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        // title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false,

      //  4/7 定义数据 4个 (注意表头状态类写法！！！)
      titleName: '交易订单查询列表', // excel文件名
      tHeader: ['平台订单号', '商户订单号', '平台商户ID', '订单来源：1=api,2=web', '银行', '订单金额', '订单状态：-1=预下单 ，0，待支付，1：支付成功, 2:失败，3=支付成功（已冻结），4，补单', '手续费（元）', '创建时间', '完成时间'], // 表头名字
      filterVal: ['orderNo', 'merOrderNo', 'merId', 'orderSource', 'bankName', 'orderAmount', 'orderState', 'merCommission', 'createDate', 'receiveNotifyDate'], // 表头名字对应接口参数
      timeArray: ['createDate', 'receiveNotifyDate'], // 要转时间格式的数据 如：["创建时间","修改时间"],
      downEx: 'merchantOrderCheck:merchantTransactionOrder:downEx',
      count: 'merchantOrderCheck:merchant:situation:count',
      amount: 'merchantOrderCheck:merchant:situation:amount',
      fee: 'merchantOrderCheck:merchant:situation:fee',
      gain: 'merchantOrderCheck:merchant:situation:gain'
    }
  },
  created() {
    this.getSituation()
    this.getList()
  },
  methods: {
    // tableRowClassName({ row, rowIndex }) {
    //   if (rowIndex === 1) {
    //     return 'warning-row'
    //   } else if (rowIndex === 3) {
    //     return 'success-row'
    //   }
    //   return ''
    // },
    // 接口：交易笔数,交易金额,交易手续费
    getSituation() {
      var getCodeList = localStorage.getItem('codeList')
      var myCodeList = getCodeList ? JSON.parse(getCodeList) : []
      var situation = myCodeList.filter(item => item.indexOf('merchantOrderCheck:merchant:situation') > -1)
      if (situation.length) {
        listSituation().then(response => {
          this.listSituation = response
        })
      }
    },
    getList() {
      this.listLoading = true
      merchantTransactionOrderList(this.listQuery).then(response => {
        // console.log('response',response)
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
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    detailClick(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'detail'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    getOrderLists() { // 5/7 分线程获取数据
      return new Promise((resolve, reject) => {
        // console.log('this.total', this.total)  //检测下total是否正确
        // 调整参数  是否分20个线程组装
        if (this.total === 0) {
          Message.error('暂无数据')
          resolve()
        } else if (this.total <= 500) {
          const parmas = Object.assign({}, this.listQuery)
          parmas.pageSize = this.total
          // 7/7 注意后端命名是否为pageNo
          parmas.pageNo = 1
          merchantTransactionOrderList(parmas).then((res) => {
            resolve(res.list)
          })
        } else {
          if (this.total > 100000) {
            Message.success('最多只能导出100000条信息，正在为你导出...')
            this.total = 100000
          }
          // 分20个线程请求
          const allListData = []// 顺序数组
          const PromiseArr = []
          for (let i = 0; i < 20; i++) {
            const parmas = Object.assign({}, this.listQuery)
            parmas.pageSize = Math.ceil(this.total / 20)
            PromiseArr.push(
              (() => {
                return new Promise((open) => {
                  parmas.pageNo = i + 1
                  let unitData = []// 每页数组
                  merchantTransactionOrderList(parmas).then((res) => {
                    unitData = res.list.map((v) => v)
                    allListData[i] = unitData
                    open()
                  })
                })
              })()
            )
          }
          Promise.all(PromiseArr).then(() => {
            // console.log('[].concat.apply([], allListData)', [].concat.apply([], allListData))
            resolve([].concat.apply([], allListData))
          })
        }
      })
    }
  }
}
</script>

<style scoped>
  .order-statistics {
    font-size: 24px;
    color: #409EFF;
    font-weight: 700;
  }
</style>

