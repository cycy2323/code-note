<template>
  <div class="app-container">
    <el-form :inline="true" class="filter-container inquire-style">
      <el-form-item label="商户ID">
        <el-input
          :placeholder="$t('merchantList.merId')"
          v-model.number="listQuery.merId"
          clearable
          style="width: 300px;margin-right: 20px"
          class="filter-item"
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
          :download-statu="downloadStatu"
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
import { paidList } from '@/api/agency/orderStatisticsManage'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { exportExcel } from '@/utils'
import DragDialog from '@/view/common/dragDialog'
import DownloadExcelComponent from '@/components/DownloadExcel/index.vue' // 1/7 引入

export default {
  name: 'PaidStatistics',
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
        bankAccountNo: undefined,
        bankUserName: undefined,
        startDate: '',
        endDate: '',
        sort: '+id'
      },
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
      titleName: '代付订单统计', // excel文件名
      downloadStatu: 0,
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
      paidList(this.listQuery).then(data => {
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
  .inquire-style .el-form-item {
    margin-bottom: 0;
  }
</style>

