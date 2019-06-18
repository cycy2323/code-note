<template>
  <div class="withdraw-list app-container">
    <el-form :inline="true" :model="listQuery" class="filter-container" style="width: 100%;background: #FFFFFF;margin-bottom: 20px;padding: 20px 20px">
      <el-form-item label="平台订单号">
        <el-input v-model="listQuery.orderNo" clearable style="width: 160px;" />
      </el-form-item>
      <el-form-item label="商户订单号">
        <el-input v-model="listQuery.merOrderNo" clearable style="width: 160px;" />
      </el-form-item>
      <el-form-item label="商户ID">
        <el-input v-model.number="listQuery.merId" clearable style="width: 160px;" onkeyup="this.value=this.value.replace(/\D/g,'')"/>
      </el-form-item>
      <el-form-item label="代理ID">
        <el-input v-model="listQuery.agentId" clearable style="width: 160px;" onkeyup="this.value=this.value.replace(/\D/g,'')"/>
      </el-form-item>
      <el-form-item label="通道账号名">
        <el-input v-model="listQuery.channelAccountName" clearable style="width: 160px;" />
      </el-form-item>
      <el-form-item label=" 通道账号">
        <el-input v-model="listQuery.channelAccountNo" clearable style="width: 160px;" />
      </el-form-item>
      <el-form-item label="通知状态">
        <el-select v-model="listQuery.noticeState" clearable style="width: 160px">
          <el-option value="" label="全部">全部</el-option>
          <el-option :value="0" label="未通知">未通知</el-option>
          <el-option :value="1" label="通知成功">通知成功</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="订单状态">
        <el-select v-model="listQuery.orderState" :placeholder="$t('merchantList.whole')" clearable style="width: 160px">
          <el-option value="" label="全部">全部</el-option>
          <el-option :value="-1" label="预下单">预下单</el-option>
          <el-option :value="0" label="待支付">待支付</el-option>
          <el-option :value="1" label="支付成功">支付成功</el-option>
          <el-option :value="2" label="失败">失败</el-option>
          <el-option :value="3" label="支付成功（已冻结）">支付成功（已冻结）</el-option>
          <el-option :value="4" label="补单">补单</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="金额范围">
        <el-input
          v-model="listQuery.gtEqOrderAmount"
          clearable
          type="number"
          oninput="this.value=this.value.replace(/e|-/g,'');"
          style="width: 150px;margin-right: 20px"
          placeholder="大于等于"/>
        至
        <el-input
          v-model="listQuery.ltEqOrderAmount"
          clearable
          type="number"
          oninput="this.value=this.value.replace(/e|-/g,'');"
          style="width: 150px;margin-right: 20px;margin-left: 20px"
          placeholder="小于等于"/>
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
      <el-form-item label="支付来源">
        <el-select v-model="listQuery.orderSource" clearable style="width: 160px">
          <el-option value="" label="全部"/>
          <el-option :value="1" label="api"/>
          <el-option :value="2" label="web"/>
        </el-select>
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
        <!--<el-input v-model="temp.bankCode" style="width: 250px;"/>-->
      </el-form-item>
      <el-button v-waves class="filter-item" type="primary" @click="refreshList">{{ $t('table.search') }}</el-button>
      <download-excel-component
        v-handle="exportBtn"
        :get-order-list="getOrderLists"
        :t-header="tHeader"
        :filter-val="filterVal"
        :time-array="timeArray"
        :title-name="titleName"
      />
      <!--<el-button v-waves v-handle="exportBtn" class="filter-item" type="primary" @click="getOrderLists">{{ $t('table.export') }}</el-button>-->
      <br>
      <el-form-item v-handle="orderAmount" label="订单总金额:">
        <span class="header-title">{{ statisticsData.sumOrderAmount }}</span>
      </el-form-item>
      <el-form-item v-handle="platformProfit" label="平台总收益:">
        <span class="header-title">{{ statisticsData.sumPlatformProfit }}</span>
      </el-form-item>
      <el-form-item v-handle="agentProfit" label="代理总收益:">
        <span class="header-title">{{ statisticsData.sumAgentProfit }}</span>
      </el-form-item>
      <el-form-item v-handle="channelCommission" label="通道总手续费:">
        <span class="header-title">{{ statisticsData.sumChannelCommission }}</span>
      </el-form-item>
      <el-form-item v-handle="countOrder" label="订单总笔数:">
        <span class="header-title">{{ statisticsData.countOrder }}</span>
      </el-form-item>
    </el-form>
    <div style="margin-bottom: 20px">
      <el-button v-handle="synchro" v-waves class="filter-item" type="primary" @click="getDaySynchronism()">批量同步</el-button>
    </div>
    <el-table v-loading="listLoading" ref="multipleTable" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%;" @selection-change="getSelectionChange">
      <el-table-column type="selection" width="55"/>
      <el-table-column label="代理昵称 / 商户ID" prop="merId" align="center" max-width="120" min-width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.agentName }} / {{ scope.row.merId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="平台订单号" prop="orderNo" align="center" max-width="160"/>
      <el-table-column label="商户订单号" prop="merOrderNo" align="center" max-width="160"/>
      <el-table-column label="通道信息" prop="channelAccountNo" align="center" min-width="90" max-width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.channelAccountNo }} / {{ scope.row.channelAccountName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商户支付金额" prop="orderAmount" align="center" max-width="110"/>
      <el-table-column label="代理佣金" prop="agentCommission" align="center" max-width="80"/>
      <el-table-column label="通道手续费" prop="channelCommission" align="center" max-width="80"/>
      <el-table-column label="银行" prop="bankName" align="center" max-width="100"/>
      <el-table-column v-if="platformProfitList" label="收益" prop="platformProfit" align="center" max-width="160"/>
      <el-table-column label="请求IP" prop="reqIp" align="center" max-width="200"/>
      <el-table-column label="支付来源" align="center">
        <template slot-scope="scope">
          <span class="">{{ scope.row.orderSource==1?"api":"web" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createDate" align="center" width="95">
        <template slot-scope="scope">
          <span>{{ (scope.row.createDate || '') | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="完成时间" prop="receiveNotifyDate" align="center" min-width="100">
        <template slot-scope="scope">
          <span>{{ (scope.row.receiveNotifyDate || '') | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="orderState" align="center" min-width="100px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.orderState | orderStatusTagTypeFilter">
            {{ scope.row.orderState | orderStatusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="通知状态" prop="notifyState" align="center" min-width="100px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.noticeState === 1 ? 'success' : 'danger'">
            {{ scope.row.noticeState === 1 ? '通知成功' : '未通知' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" class-name="small-padding" min-width="150" max-width="160">
        <template slot-scope="scope">
          <el-button v-handle="synchro" size="mini" @click="getDaySynchronism([scope.row.id])">同步</el-button>
          <el-button v-handle="view" type="primary" size="mini" @click="showCustomDialog(scope.row, 0)">查看</el-button>
          <el-button v-handle="sheet" v-if="scope.row.orderState === 0" type="warning" size="mini" @click="showCustomDialog(scope.row, 1)">补单</el-button>
          <el-button v-handle="examine" v-if="scope.row.orderState === 4" type="primary" size="mini" @click="showCustomDialog(scope.row, 2)">审核</el-button>
          <el-button v-handle="freeze" v-if="scope.row.orderState === 1" type="danger" size="mini" @click="showCustomDialog(scope.row, 3)">冻结</el-button>
          <el-button v-handle="thaw" v-if="scope.row.orderState === 3" type="success" size="mini" @click="showCustomDialog(scope.row, 4)">解冻</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <!-- 下面详情暂时没有用到 -->
    <el-dialog :visible.sync="dialogPvVisible" :close-on-click-modal="false" title="订单详情" width="600px" class="detail">
      <el-form label-position="right" label-width="120px">
        <el-form-item label="商户手续费:">
          <span>{{ detailData.merCommission }}</span>
        </el-form-item>
        <el-form-item label="平台利润:">
          <span>{{ detailData.platformProfit }}</span>
        </el-form-item>
        <el-form-item label="通道账号名:">
          <span>{{ detailData.channelAccountNo }}</span>
        </el-form-item>
        <el-form-item label="银行:">
          <span>{{ detailData.bankName }}</span>
        </el-form-item>
        <el-form-item label="状态:">
          <el-tag :type="detailData.orderState | orderStatusTagTypeFilter">
            {{ detailData.orderState | orderStatusFilter }}
          </el-tag>
        </el-form-item>
        <el-form-item label="通知状态:">
          <el-tag :type="detailData.noticeState === 0 ? 'danger' : 'success'">
            {{ detailData.noticeState === 0 ? '未通知' : '通知成功' }}
          </el-tag>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogPvVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 各种状态修改查看模板 -->
    <custom-dialog ref="customDialog" @dialogResult="dialogResult"/>

  </div>
</template>

<script>

import { fetchList, getDayStatistics, getDaySynchronism } from '@/api/manage/orderManage/payOrder'
import { bankList } from '@/api/manage/orderManage/withdrawListReject'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import { Message } from 'element-ui'
import customDialog from './customDialog'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
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
  { auditState: -1, display_name: '预下单' },
  { auditState: 0, display_name: '待支付' },
  { auditState: 1, display_name: '支付成功' },
  { auditState: 2, display_name: '支付失败' },
  { auditState: 3, display_name: '支付成功(已冻结)' },
  { auditState: 4, display_name: '补单中' }
]

const calendarTypeOptions = [
  { key: 'CN', display_name: '未支付' },
  { key: 'US', display_name: '已支付' },
  { key: 'JP', display_name: '已关闭' },
  { key: 'EU', display_name: '已取消' }
]

const statusMap = {
  0: 'info',
  1: 'success',
  2: 'danger',
  3: 'danger',
  4: 'warning'
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
  name: 'PayOrder',
  components: { Pagination, customDialog, DownloadExcelComponent },
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
    orderStatusTagTypeFilter(auditState) {
      return statusMap[auditState]
    },
    orderStatusFilter(type) {
      return orderStatusKeyValue[type]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      platformProfitList: false,
      exportBtn: 'orderManage:withdrawList:export',
      view: 'orderManage:payOrder:view',
      sheet: 'orderManage:payOrder:sheet',
      examine: 'orderManage:payOrder:examine',
      freeze: 'orderManage:payOrder:freeze',
      thaw: 'orderManage:payOrder:thaw',
      statistics: 'orderManage:payOrder:view:statistics',
      orderAmount: 'orderManage:payOrder:statistics:orderAmount',
      agentProfit: 'orderManage:payOrder:statistics:agentProfit',
      channelCommission: 'orderManage:payOrder:statistics:channelCommission',
      platformProfit: 'orderManage:payOrder:statistics:platformProfit',
      countOrder: 'orderManage:payOrder:statistics:countOrder',
      synchro: 'orderManage:payOrder:synchro',
      titleName: '支付订单', // excel文件名
      tHeader: ['代理昵称', '商户ID', '平台订单号', '商户订单号', '通道ID', '通道名称', '商户支付金额', '代理佣金', '通道手续费', '银行', '支付来源(1:api,2:web)', '创建时间', '完成时间', '状态(-1:预下单，0:待支付，1:支付成功，2:失败，3:支付成功已冻结，4:补单)', '通知状态(0:未通知，1:通知成功)'], // 表头名字——写法注意：如审核状态：'审核状态:   1:待审核，2.审核中,3.审核通过，4.审核不通过'
      filterVal: ['agentName', 'merId', 'orderNo', 'merOrderNo', 'channelAccountNo', 'channelAccountName', 'orderAmount', 'agentCommission', 'channelCommission', 'bankName', 'orderSource', 'createDate', 'receiveNotifyDate', 'orderState', 'noticeState'], // 表头名字对应接口参数
      timeArray: ['createDate', 'receiveNotifyDate'], // 要转时间格式的数据 如：["创建时间","修改时间"]
      statisticsData: {},
      tableKey: 0,
      list: null,
      total: 0,
      bankCopy: {},
      bankList: {},
      listLoading: true,
      qishiDate: [new Date(startTime), new Date(endTime)],
      statusOptions: orderStatusOptions,
      detailData: {},
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        orderSource: '',
        importance: undefined,
        title: undefined,
        type: undefined,
        createDateStart: startTime,
        createDateEnd: endTime
      },
      importanceOptions: ['充值', '提现', '代付'],
      calendarTypeOptions,
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      selections: [],
      dialogPvVisible: false,
      pvData: [],
      downloadLoading: false
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
      // if (typeof (this.listQuery.merId) === 'string' || typeof (this.listQuery.agentId) === 'string') {
      //   this.listLoading = false
      //   return
      // }
      fetchList(this.listQuery).then(response => {
        this.list = response.list
        this.total = response.total
      }).catch(() => {
        this.listLoading = false
      })
      var getCodeList = localStorage.getItem('codeList')
      var myCodeList = getCodeList ? JSON.parse(getCodeList) : []
      if (myCodeList.indexOf('orderManage:payOrder:view:statistics') > -1) {
        getDayStatistics(this.listQuery).then(response => {
          this.statisticsData = response
        })
      }
      if (myCodeList.indexOf('orderManage:payOrder:list:platformProfit') > -1) {
        this.platformProfitList = true
      }
      this.listLoading = false
    },
    dateChange() {
      if (this.qishiDate) {
        this.listQuery.createDateStart = parseTime(this.qishiDate[0], '{y}-{m}-{d} {h}:{i}:{s}')
        this.listQuery.createDateEnd = parseTime(this.qishiDate[1], '{y}-{m}-{d} {h}:{i}:{s}')
      } else {
        this.listQuery.createDateEnd = ''
        this.listQuery.createDateStart = ''
      }
    },
    refreshList() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    showDialog(row) {
      for (var key in row) {
        this.detailData[key] = row[key]
      }
      this.dialogPvVisible = true
    },
    dialogResult(value) {
      if (value === 'getList') {
        this.refreshList()
      }
    },
    showCustomDialog(row, type) {
      this.$refs.customDialog.setDialog(row, type)
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
          fetchList(parmas).then((res) => {
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
                  fetchList(parmas).then((res) => {
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
    getDaySynchronism(id) {
      if (!id) {
        if (!this.selections.length) {
          this.$message.error('请选择一条订单')
          return
        }
        id = this.selections
      }
      getDaySynchronism({ orderIds: id }).then(response => {
        var str = '<table class="el-table"><thead><tr><td>订单号</td><td>订单状态</td></tr></thead><tbody>'
        for (var key in response) {
          str += '<tr><td>' + key + '</td><td>' + response[key] + '</td></tr>'
        }
        str += '</tbody></table>'
        this.$confirm(str, '', {
          dangerouslyUseHTMLString: true,
          showCancelButton: false,
          customClass: 'my-custom-confirm'
        }).then(() => {
          // this.$refs.multipleTable.clearSelection()
          this.refreshList()
        }).catch(() => {
          this.refreshList()
          // this.$refs.multipleTable.clearSelection()
        })
      })
    },
    getSelectionChange(value) {
      this.selections = value.map(item => item.id)
    }
  }
}
</script>
<style scoped>
  .withdraw-list .detail .el-form .el-form-item{
    margin-bottom: 0px;
  }
  .filter-container .el-form-item .header-title {
    font-size: 24px;
    width: 200px;
    display: inline-block;
    color: #409EFF;
    font-weight: bold;
  }
  .withdraw-list .el-table__row .el-button{
    margin-top: 5px;
  }
</style>

<style>
  .my-custom-confirm{
    width: 600px;
  }
  .my-custom-confirm .el-table::before{
    height: 0;
  }
</style>
