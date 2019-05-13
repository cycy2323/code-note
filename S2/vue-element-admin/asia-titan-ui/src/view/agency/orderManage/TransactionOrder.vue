<template>
  <div class="app-container">
    <el-form :inline="true" class="filter-container inquire-style" >
      <el-form-item label="平台订单号">
        <el-input
          :placeholder="$t('merchantList.platformOrder')"
          v-model="listQuery.orderNo"
          clearable
          style="width: 200px;margin-right: 20px"
          class="filter-item"
          @keyup.enter.native="handleFilter"/>
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
      <br>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="qishiDate"
          :default-time="['00:00:00', '23:59:59']"
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
        />
      </el-form-item>
    </el-form>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      :default-sort = "{prop: 'createDate', order: 'descending'}"
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column :label="$t('merchantList.platformOrder')" align="center" >  <!--平台订单号-->
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.orderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('merchantList.merchantOrder')" align="center"> <!--商户订单号-->
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.merOrderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('merchantList.merchantID')" align="center">  <!--平台商户ID-->
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.merId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('merchantList.orderSource')" align="center"> <!--订单来源-->
        <template slot-scope="scope">
          <el-tag :type="scope.row.orderSource === 1 ? 'success' : 'danger' ">
            {{ scope.row.orderSource === 1 ? '接口' : '后台' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('merchantList.bank')" align="center">
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.bankName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('merchantList.orderMoney')" align="center">  <!--订单金额-->
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.orderAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('merchantList.status')" align="center">  <!--订单状态-->
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
          <el-tag :type="temp.orderState | orderStatusTagTypeFilter ">
            {{ temp.orderState | orderStatusFilter }}
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
import { transactionList } from '@/api/agency/orderManage'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { Message } from 'element-ui'
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
  { auditState: 0, display_name: '待处理' },
  { auditState: 1, display_name: '支付成功' },
  { auditState: 2, display_name: '支付失败' }
]

const orderFromOptions = [
  { orderFrom: 1, display_name: '接口' },
  { orderFrom: 2, display_name: '后台' }
]

const statusMap = {
  0: '',
  1: 'success',
  2: 'danger'
}

// calendarTypeKeyValue
// arr to obj ,such as { CN : "China", US : "USA" }
const orderStatusKeyValue = orderStatusOptions.reduce((acc, cur) => {
  acc[cur.auditState] = cur.display_name
  return acc
}, {})

export default {
  name: 'TransactionOrder',
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
      qishiDate: [new Date(startTime), new Date(endTime)],
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        orderState: undefined, //
        orderSource: undefined, //
        merOrderNo: undefined, //
        orderNo: undefined, //
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
      titleName: '交易订单查询', // excel文件名
      tHeader: ['平台商户号', '商户订单号', '商户ID', '订单来源:1=api,2=web', '银行', '订单金额', '状态', '手续费', '创建时间'], // 表头名字——写法注意：如审核状态：'审核状态:   1:待审核，2.审核中,3.审核通过，4.审核不通过'
      filterVal: ['orderNo', 'merOrderNo', 'merId', 'orderSource', 'bankName', 'orderAmount', 'orderState', 'merCommission', 'createDate'], // 表头名字对应接口参数
      timeArray: ['createDate'] // 要转时间格式的数据 如：["创建时间","修改时间"]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      transactionList(this.listQuery).then(data => {
        this.list = data.list
        this.total = data.total

        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    dateChange() {
      if (this.qishiDate) {
        this.listQuery.startDate = parseTime(this.qishiDate[0], '{y}-{m}-{d}')
        this.listQuery.endDate = parseTime(this.qishiDate[1], '{y}-{m}-{d}')
      } else {
        this.listQuery.endDate = ''
        this.listQuery.startDate = ''
      }
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
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
          // 7/7 注意后端命名不统一：商户后台的页码，后端命名有两种——pageNo、pageNo(如果是其他名字，自行修改或添加！！！！！如下两行)
          parmas.pageNo = 1
          transactionList(parmas).then((res) => { resolve(res.list) })
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
                  transactionList(parmas).then((res) => {
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
  .filter-container .filter-item {
    margin-bottom: 0;
  }
</style>

