<template>
  <div class="app-container">
    <el-form :inline="true" class="filter-container inquire-style">
      <el-form-item label="商户ID">
        <el-input
          :placeholder="$t('merchantList.merId')"
          v-model="listQuery.merId"
          clearable
          style="width: 300px;margin-right: 20px"
          class="filter-item"
          onkeyup="this.value=this.value.replace(/\D/g,'')"
          @keyup.enter.native="handleFilter"/>
      </el-form-item>
      <el-form-item label="时间">
        <el-date-picker
          v-model="qishiDate"
          type="daterange"
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
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column :label="$t('merchantList.merId')" align="center" >
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.merId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('merchantList.merName')" align="center" >
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.merName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('merchantList.orderMoney')" align="center">
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.totalOrderAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('merchantList.totalOrder')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.totalOrder }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('merchantList.agentEarnings')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.totalAgentCommission }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNo"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"/>

  </div>
</template>

<script>
// import { createOrder, fetchList, fetchPv, updateOrder } from '@/api/common/order'
import { transactionList } from '@/api/agency/orderStatisticsManage'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { Message } from 'element-ui'
import DragDialog from '@/view/common/dragDialog'
import DownloadExcelComponent from '@/components/DownloadExcel/index.vue' // 1/7 引入

export default {
  name: 'TransactionStatistics',
  components: { DragDialog, Pagination, DownloadExcelComponent },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: false,
      qishiDate: '',
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        merId: undefined,
        orderState: '1',
        orderSource: undefined,
        startDate: '',
        endDate: ''
      },
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
      titleName: '交易订单统计', // excel文件名
      tHeader: ['商户ID', '商户名称', '订单金额', '交易总数', '代理收益'], // 表头名字——写法注意：如审核状态：'审核状态:   1:待审核，2.审核中,3.审核通过，4.审核不通过'
      filterVal: ['merId', 'merName', 'totalOrderAmount', 'totalOrder', 'totalAgentCommission'],
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
        this.listQuery.endDate = parseTime(new Date(), '{y}-{m}-{d}')
        this.listQuery.startDate = parseTime(new Date(), '{y}-{m}-{d}')
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
  .inquire-style .el-form-item {
    margin-bottom: 0;
  }
</style>

