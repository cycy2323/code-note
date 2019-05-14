<template>
  <div class="withdraw-list app-container">
    <el-form
      :inline="true"
      class="filter-container"
      style="width: 100%;background: #FFFFFF;margin-bottom: 20px;padding: 20px 20px">
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
          v-model="listQuery.merOrderNo"
          placeholder="商户订单号"
          clearable
          style="width: 200px;margin-right: 20px"
          class="filter-item"
          @keyup.enter.native="handleFilter"/>
      </el-form-item>
      <el-form-item label="商户ID">
        <el-input
          v-model="listQuery.merId"
          placeholder="商户ID"
          clearable
          style="width: 200px;margin-right: 20px"
          class="filter-item"
          onkeyup="this.value=this.value.replace(/\D/g,'')"/>
      </el-form-item>
      <el-form-item label="通道账号">
        <el-input
          v-model="listQuery.channelAccountNo"
          placeholder="通道账号"
          clearable
          style="width: 200px;margin-right: 20px"
          class="filter-item"
          @keyup.enter.native="handleFilter"/>
      </el-form-item>
      <el-form-item label="通道名称">
        <el-select v-model="listQuery.channelId" clearable style="width: 160px;" filterable>
          <el-option v-for="(item, idx) in listKey" :key="idx" :label="item.channelAccountName+'('+item.name+')'" :value="item.id"/>
        </el-select>
      </el-form-item>
      <!--<el-form-item label="通道名称">-->
      <!--<el-input-->
      <!--v-model="listQuery.channelName"-->
      <!--placeholder="通道名称"-->
      <!--clearable-->
      <!--style="width: 150px;margin-right: 20px"-->
      <!--class="filter-item"-->
      <!--@keyup.enter.native="handleFilter"/>-->
      <!--</el-form-item>-->
      <el-form-item label="代理ID">
        <el-input
          v-model="listQuery.agentId"
          placeholder="代理ID"
          clearable
          style="width: 200px;margin-right: 20px"
          class="filter-item"
          onkeyup="this.value=this.value.replace(/\D/g,'')"/>
      </el-form-item>
      <el-form-item label="银行卡号后6位">
        <el-input
          v-model="listQuery.bankAccountNo"
          minlength="6"
          maxlength="6"
          placeholder="后6位"
          clearable
          style="width: 100px;margin-right: 20px"
          class="filter-item"
          @keyup.enter.native="handleFilter"/>
      </el-form-item>
      <el-form-item label="持卡人姓名">
        <el-input
          v-model="listQuery.bankUserName"
          placeholder="持卡人姓名"
          clearable
          style="width: 150px;margin-right: 20px"
          class="filter-item"
          @keyup.enter.native="handleFilter"/>
      </el-form-item>
      <el-form-item label="支付来源">
        <el-select
          v-model="listQuery.orderSource"
          :placeholder="$t('merchantList.whole')"
          clearable
          style="width: 110px;margin-right: 20px"
          class="filter-item">
          <el-option
            v-for="item in orderStateOpt"
            :key="item.auditState"
            :label="item.display_name"
            :value="item.auditState"/>
        </el-select>
      </el-form-item>
      <el-form-item label="订单状态">
        <el-select
          v-model="listQuery.orderState"
          :placeholder="$t('merchantList.whole')"
          clearable
          style="width: 110px;margin-right: 20px"
          class="filter-item">
          <el-option
            v-for="item in orderStateOptions"
            :key="item.auditState"
            :label="item.display_name"
            :value="item.auditState"/>
        </el-select>
      </el-form-item>
      <el-form-item label="通知状态">
        <el-select
          v-model="listQuery.noticeState"
          :placeholder="$t('merchantList.whole')"
          clearable
          style="width: 160px">
          <el-option :value="0" label="未通知">未通知</el-option>
          <el-option :value="1" label="通知成功">通知成功</el-option>
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
      <el-button v-waves class="filter-item" type="primary" @click="refreshList">{{ $t('table.search') }}</el-button>
      <download-excel-component
        v-handle="exportBtn"
        :get-order-list="getOrderLists"
        :t-header="tHeader"
        :filter-val="filterVal"
        :time-array="timeArray"
        :title-name="titleName"
      />
      <!--<el-button v-waves v-handle="exportBtn" class="filter-item" type="primary" @click="refreshList">{{ $t('table.export') }}</el-button>-->
      <br>
      <!--3/7-->
      <!--<download-excel-component-->
      <!--:get-order-list="getOrderLists"-->
      <!--:t-header="tHeader"-->
      <!--:filter-val="filterVal"-->
      <!--:time-array="timeArray"-->
      <!--:title-name="titleName"-->
      <!--/>-->
      <el-form-item v-handle="orderAmount" label="订单总金额:">
        <span class="header-title">{{ statisticsData.sumOrderAmount }}</span>
      </el-form-item>
      <el-form-item v-handle="platformProfit" label="平台总收益:">
        <span class="header-title">{{ statisticsData.sumPlatformProfit }}</span>
      </el-form-item>
      <el-form-item v-handle="channelComm" label="通道总手续费:">
        <span class="header-title">{{ statisticsData.sumChannelCommission }}</span>
      </el-form-item>
      <el-form-item v-handle="countOrder" label="订单总笔数:">
        <span class="header-title">{{ statisticsData.countOrder }}</span>
      </el-form-item>
    </el-form>
    <div style="margin-bottom: 20px">
      <el-button v-handle="synchro" v-waves class="filter-item" type="primary" @click="getDaySynchronism()">批量同步</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      ref="multipleTable"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @selection-change="getSelectionChange">
      <el-table-column type="selection" width="55"/>
      <el-table-column label="代理昵称 / 商户ID" prop="merId" align="center" max-width="120" min-width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.agentName }} / {{ scope.row.merId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="平台订单号" prop="orderNo" align="center" max-width="160"/>
      <el-table-column label="商户订单号" prop="merOrderNo" align="center" max-width="160"/>
      <el-table-column label="通道信息" prop="channelAccountNo" align="center" max-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.channelAccountNo }} / {{ scope.row.channelAccountName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="金额" prop="orderAmount" align="center" max-width="80"/>
      <!-- <el-table-column label="实际到账金额" prop="channelRealAmount" align="center"/> -->
      <el-table-column label="手续费" prop="merCommission" align="center" max-width="80"/>
      <el-table-column label="银行" prop="bankName" align="center" max-width="80"/>
      <el-table-column label="银行卡号" prop="bankAccountNo" align="center" min-width="160"/>
      <el-table-column label="持卡人姓名" prop="bankUserName" align="center" max-width="80"/>
      <el-table-column label="创建时间" prop="createDate" align="center" min-width="160px">
        <template slot-scope="scope">
          <span>{{ (scope.row.createDate || '') | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="完成时间" prop="receiveNotifyDate" align="center" min-width="160px">
        <template slot-scope="scope">
          <span>{{ (scope.row.receiveNotifyDate || '') | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="platformProfitList" label="收益" prop="platformProfit" align="center" max-width="160"/>
      <el-table-column label="请求IP" prop="reqIp" align="center" max-width="200"/>
      <el-table-column label="订单来源" prop="orderSource" align="center">
        <template slot-scope="scope">
          {{ scope.row.orderSource===2?'web':'api' }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="orderState" align="center" min-width="110px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.orderState === 2? 'success' : 'danger'" style="width: 80px">
            {{ scope.row.orderState | getOrderState }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="通知状态" prop="notifyState" align="center" min-width="100px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.notifyState === 1? 'success' : 'danger'" style="width: 80px">
            {{ scope.row.notifyState === 0 ? '未通知' : '通知成功' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" class-name="small-padding" min-width="130">
        <template slot-scope="scope">
          <el-button v-handle="synchro" size="mini" @click="getDaySynchronism([scope.row.id])">同步</el-button>
          <!-- <el-button v-handle="view" size="mini" type="primary" @click="showDialog(scope.row)">查看</el-button> -->
          <el-button v-handle="viewStatus" size="mini" type="success" @click="showCustomDialog(scope.row, 0, true)">
            查看
          </el-button>
          <el-button
            v-handle="refund"
            v-if="scope.row.orderState === 3"
            type="danger"
            plain
            size="mini"
            @click="showCustomDialog(scope.row, 5)">退款
          </el-button>
          <el-button
            v-handle="examine"
            v-if="scope.row.orderState === 5"
            type="success"
            size="mini"
            @click="showCustomDialog(scope.row, 6)">审核
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNo"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"/>
    <!-- 此处迁移到customDialog组件里面去了，暂时保留 -->
    <el-dialog :visible.sync="dialogPvVisible" :close-on-click-modal="false" title="订单详情" width="600px" class="detail">
      <el-form label-position="right" label-width="140px">
        <el-form-item label="代理昵称 / 商户ID:">
          <span>{{ detailData.agentName }} / {{ detailData.merId }}</span>
        </el-form-item>
        <el-form-item label="平台订单号">
          <span>{{ detailData.orderNo }}</span>
        </el-form-item>
        <el-form-item label="商户订单号">
          <span>{{ detailData.merOrderNo }}</span>
        </el-form-item>
        <el-form-item label="通道信息">
          <span>{{ detailData.channelAccountNo }} / {{ detailData.channelAccountName }}</span>
        </el-form-item>
        <el-form-item label="金额">
          <span>{{ detailData.orderAmount }}</span>
        </el-form-item>
        <el-form-item label="手续费">
          <span>{{ detailData.merCommission }}</span>
        </el-form-item>
        <el-form-item label="银行">
          <span>{{ detailData.bankName }}</span>
        </el-form-item>
        <el-form-item label="银行卡号">
          <span>{{ detailData.bankAccountNo }}</span>
        </el-form-item>
        <el-form-item label="持卡人姓名">
          <span>{{ detailData.bankUserName }}</span>
        </el-form-item>
        <el-form-item label="创建时间">
          <span>{{ (detailData.createDate || '') | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </el-form-item>
        <el-form-item label="完成时间">
          <span>{{ (detailData.receiveNotifyDate || '') | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </el-form-item>
        <el-form-item label="业务">
          <span>{{ detailData.orderSource===2?'web':'api' }}</span>
        </el-form-item>
        <el-form-item label="状态:">
          <el-tag :type="detailData.orderState === 2? 'success' : 'danger'">
            {{ detailData.orderState | getOrderState }}
          </el-tag>
        </el-form-item>
        <el-form-item label="通知状态:">
          <el-tag :type="detailData.notifyState === 1? 'success' : 'danger'">
            {{ detailData.notifyState === 0 ? '未通知' : '通知成功' }}
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

import { fetchList, getDayStatistics, getCompleteBankAccount, getDaySynchronism, fetchChannelList } from '@/api/manage/orderManage/withdrawList'
import { bankList } from '@/api/manage/orderManage/withdrawListReject'
import { Message } from 'element-ui'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import customDialog from './customDialog'
import DownloadExcelComponent from '@/components/DownloadExcel/index.vue' // 1/7 引入

// 获取格林时间
var date1 = new Date(new Date(new Date().toLocaleDateString()).getTime())
var date2 = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)

// 格式化时间  2018-06-06 00:00:00
// 如果只是简单的格式化只变成2018-6-6 0:0:0，需要运用三目运算判断并在适当的地方加上0，完成所需要的格式。
var startTime = date1.getFullYear() + '-' + ((date1.getMonth() + 1) < 10 ? '0' + (date1.getMonth() + 1) : (date1.getMonth() + 1)) + '-' + (date1.getDate() < 10 ? '0' + date1.getDate() : date1.getDate()) + ' ' + (date1.getHours() < 10 ? '0' + date1.getHours() : date1.getHours()) + ':' + (date1.getMinutes() < 10 ? '0' + date1.getMinutes() : date1.getMinutes()) + ':' + (date1.getSeconds() < 10 ? '0' + date1.getSeconds() : date1.getSeconds())

// 格式化时间  2018-06-06 23:59:59
var endTime = date2.getFullYear() + '-' + (date2.getMonth() + 1) + '-' + date2.getDate() + ' ' + date2.getHours() + ':' + date2.getMinutes() + ':' + date2.getSeconds()
const orderStateOpt = [
  { auditState: 1, display_name: 'api' },
  { auditState: 2, display_name: 'web' }
]
const orderStateOptions = [
  { auditState: 1, display_name: '处理中' },
  { auditState: 2, display_name: '成功' },
  { auditState: 3, display_name: '失败待退款' },
  { auditState: 4, display_name: '失败已退款' },
  { auditState: 5, display_name: '退款待审核' }
]

export default {
  name: 'WithdrawList',
  components: { Pagination, customDialog, DownloadExcelComponent },
  directives: { waves },
  filters: {
    getOrderState(key) {
      const obj = { '1': '处理中', '2': '成功', '3': '失败待退款', '4': '失败已退款', '5': '退款待审核' }
      return obj[key + '']
    }
  },
  data() {
    return {
      platformProfitList: false,
      exportBtn: 'orderManage:withdrawList:export',
      view: 'orderManage:withdrawList:view',
      viewStatus: 'orderManage:withdrawList:viewStatus',
      refund: 'orderManage:withdrawList:refund',
      examine: 'orderManage:withdrawList:examine',
      orderAmount: 'orderManage:withdrawList:statistics:orderAmount',
      channelComm: 'orderManage:withdrawList:statistics:channelComm',
      platformProfit: 'orderManage:withdrawList:statistics:platformProfit',
      countOrder: 'orderManage:withdrawList:statistics:countOrder',
      synchro: 'orderManage:withdrawList:synchro',
      titleName: '代付订单', // excel文件名
      tHeader: ['代理昵称', '商户ID', '平台订单号', '商户订单号', '通道ID', '通道名称', '金额', '手续费', '银行', '银行卡号', '持卡人姓名', '创建时间', '完成时间', '订单来源', '状态(-1:预下单，0:待支付，1:支付成功，2:失败，3:支付成功已冻结，4:补单)', '通知状态(0:未通知，1:通知成功)'], // 表头名字——写法注意：如审核状态：'审核状态:   1:待审核，2.审核中,3.审核通过，4.审核不通过'
      filterVal: ['agentName', 'merId', 'orderNo', 'merOrderNo', 'channelAccountNo', 'channelAccountName', 'orderAmount', 'merCommission', 'bankName', 'bankAccountNo', 'bankUserName', 'createDate', 'receiveNotifyDate', 'orderSource', 'orderState', 'noticeState'], // 表头名字对应接口参数
      timeArray: ['createDate', 'receiveNotifyDate'], // 要转时间格式的数据 如：["创建时间","修改时间"]
      statisticsData: {},
      tableKey: 0,
      list: [],
      listKey: [],
      total: 0,
      bankCopy: {},
      bankList: {},
      listLoading: true,
      qishiDate: [new Date(startTime), new Date(endTime)],
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        orderNo: '',
        gtEqCreateDate: startTime,
        ltEqCreateDate: endTime
      },
      detailData: {
        bankAccountNo: ''
      },
      selections: [],
      dialogPvVisible: false,
      orderStateOpt,
      orderStateOptions
    }
  },
  created() {
    fetchChannelList({ type: 2 }).then(response => {
      this.listKey = response
    })
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
        this.listLoading = false
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
      if (myCodeList.indexOf('orderManage:withdrawList:list:platformProfit') > -1) {
        this.platformProfitList = true
      }
    },
    dateChange() {
      if (this.qishiDate) {
        this.listQuery.gtEqCreateDate = parseTime(this.qishiDate[0], '{y}-{m}-{d} {h}:{i}:{s}')
        this.listQuery.ltEqCreateDate = parseTime(this.qishiDate[1], '{y}-{m}-{d} {h}:{i}:{s}')
      } else {
        this.listQuery.ltEqCreateDate = ''
        this.listQuery.gtEqCreateDate = ''
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
      // 请求完整银行卡号
      getCompleteBankAccount(row.id).then((res) => {
        this.detailData.bankAccountNo = res.bankAccountNo
      })
      this.dialogPvVisible = true
    },
    dialogResult(value) {
      if (value === 'getList') {
        this.refreshList()
      }
    },
    showCustomDialog(row, value, payType) {
      this.$refs.customDialog.setDialog(row, value, payType)
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
          this.refreshList()
          // this.$refs.multipleTable.clearSelection()
        }).catch(() => {
          this.refreshList()
          // this.$refs.multipleTable.clearSelection()
        })
      })
    },
    getSelectionChange(value) {
      this.selections = value.map(item => item.id)
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
    }
  }
}
</script>

<style lang='scss' scoped>
  .withdraw-list .detail .el-form .el-form-item {
    margin-bottom: 0px;
  }

  .filter-container .el-form-item .header-title {
    font-size: 24px;
    width: 200px;
    display: inline-block;
    color: #409EFF;
    font-weight: bold;
  }

  .withdraw-list td .el-button {
    margin: 2px 0;
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
