<template>
  <div class="app-container">
    <div class="filter-container" style="width: 100%;background: #FFFFFF;margin-bottom: 20px;padding: 20px 20px">
      转账单号:
      <el-input
        :placeholder="$t('merchantList.platformOrder')"
        v-model="listQuery.transNo"
        clearable
        style="width: 300px;margin-right: 20px"
        class="filter-item"
        @keyup.enter.native="handleFilter"/>
      类型：
      <el-select
        v-model="listQuery.type"
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
      转账状态：
      <el-select
        v-model="listQuery.state"
        :placeholder="$t('merchantList.whole')"
        clearable
        style="width: 110px;margin-right: 20px"
        class="filter-item">
        <el-option
          v-for="item in orderSourceOptions"
          :key="item.orderFrom"
          :label="item.display_name"
          :value="item.orderFrom"/>
      </el-select>
      <br>
      创建时间:
      <el-date-picker
        v-model="listQuery.createDateStart"
        type="datetime"
        format="yyyy-MM-dd HH:mm:ss"
        placeholder="创建时间"/>
      至
      <el-date-picker
        v-model="listQuery.createDateEnd"
        type="datetime"
        style="margin-right: 20px"
        format="yyyy-MM-dd HH:mm:ss"
        placeholder="创建时间"/>
      <el-button
        v-waves
        class="filter-item pan-btn green-btn"
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
      />
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange">
      <el-table-column :label="$t('table.PlatformOrderNum')" align="center">
        <template slot-scope="scope">
          <span class="">{{ scope.row.transNo }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('merchantList.merchantID')" align="center">
        <template slot-scope="scope">
          <span class="">{{ scope.row.merId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.MerchantName')" align="center">
        <template slot-scope="scope">
          <span class="">{{ scope.row.merName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.TransferID')" align="center">
        <template slot-scope="scope">
          <span class="">{{ scope.row.acceptMerId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.TransferName')" align="center">
        <template slot-scope="scope">
          <span class="">{{ scope.row.acceptMerName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.TransferAmount')" align="center">
        <template slot-scope="scope">
          <span class="">{{ scope.row.transAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.TransferStatus')" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.transState === 2 ? 'success' : 'danger' " style="width: 76px;">
            {{ scope.row.transState==0?"待处理":scope.row.transState==1?"处理中":scope.row.transState==2?"处理成功":"失败" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.TransferDescription')" align="center">
        <template slot-scope="scope">
          <span class="">{{ scope.row.transDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.TransferTime')" align="center">
        <template slot-scope="scope">
          <span>{{ (scope.row.transDate || '') | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.OrderTime')" align="center">
        <template slot-scope="scope">
          <span>{{ (scope.row.createDate || '') | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.type')" align="center">
        <template slot-scope="scope">
          <span class="">{{ scope.row.type==0?"入账":"出账" }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column :label="$t('merchantList.operation')" align="center">-->
      <!--<template slot-scope="scope">-->
      <!--<el-button type="success" size="mini" @click="detailClick(scope.row)">{{ $t('merchantList.details') }}</el-button>-->
      <!--&lt;!&ndash;<el-button type="success" size="mini" @click="handleUpdate(scope.row)">{{ $t('merchantList.amend') }}</el-button>&ndash;&gt;-->
      <!--</template>-->
      <!--</el-table-column>-->
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
        <el-form-item :label="$t('table.MerchantID')">
          <el-input v-model="temp.orderNo" :readonly="true" style="width: 199px;" disabled="true"/>
        </el-form-item>
        <el-form-item :label="$t('table.MerchantName')">
          <el-input v-model="temp.orderAmount" :readonly="true" style="width: 199px;" disabled="true"/>
        </el-form-item>
        <el-form-item :label="$t('table.MerchantOrderNum')">
          <el-input v-model="temp.merOrderNo" :readonly="true" style="width: 199px;" disabled="true"/>
        </el-form-item>
        <el-form-item :label="$t('table.OrderAmount')">
          <el-input v-model="temp.amount" :readonly="true" style="width: 199px;" disabled="true"/>
        </el-form-item>
        <el-form-item :label="$t('table.BusinessType')">
          <el-select
            v-model="temp.businessType"
            style="width: 110px;margin-right: 20px"
            class="filter-item">
            <el-option
              v-for="item in orderFromOptions"
              :key="item.orderFrom"
              :label="item.display_name"
              :value="item.orderFrom"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.BankName')">
          <el-input v-model="temp.bankName" :readonly="true" style="width: 199px;" disabled="true"/>
        </el-form-item>
        <el-form-item :label="$t('table.BankAccount')">
          <el-input v-model="temp.bankAccountNo" :readonly="true" style="width: 199px;" disabled="true"/>
        </el-form-item>
        <el-form-item :label="$t('table.CardholderName')">
          <el-input v-model="temp.bankUserName" :readonly="true" style="width: 199px;" disabled="true"/>
        </el-form-item>
        <el-form-item :label="$t('table.OrderSubmissionTime')">
          <el-date-picker
            v-model="temp.submitDate"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            placeholder="订单提交时间"/>
        </el-form-item>
        <el-form-item :label="$t('table.CreationTime')">
          <el-date-picker
            v-model="temp.createDate"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            placeholder="创建时间"/>
        </el-form-item>
        <el-form-item :label="$t('table.ModificationTime')">
          <el-date-picker
            v-model="temp.updateDate"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            placeholder="修改时间"/>
        </el-form-item>
        <el-form-item :label="$t('table.Founder')">
          <el-input v-model="temp.updateDate" :readonly="true" style="width: 199px;" disabled="true"/>
        </el-form-item>
        <el-form-item :label="$t('table.Modifier')">
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
import { getOrderList } from '@/api/merchant/merchantTransfer/merchantTransferCheck'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { Message } from 'element-ui'
import DragDialog from '@/view/common/dragDialog'
import DownloadExcelComponent from '@/components/DownloadExcel/index.vue' // 1/7 引入

const orderStatusOptions = [
  { auditState: 0, display_name: '转入' },
  { auditState: 1, display_name: '转出' }
]

const handStatusOptions = [
  { workStatus: 0, display_name: '商户转出' },
  { workStatus: 1, display_name: '商户转入' },
  { workStatus: 2, display_name: '网银' }
]

const orderFromOptions = [
  { orderFrom: 1, display_name: '支付' },
  { orderFrom: 2, display_name: '代付' }
]

const orderSourceOptions = [
  { orderFrom: 0, display_name: '待处理' },
  { orderFrom: 1, display_name: '处理中' },
  { orderFrom: 2, display_name: '处理成功' },
  { orderFrom: 3, display_name: '处理失败' }
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
  name: 'MerchantTransferCheck',
  components: { DragDialog, Pagination, DownloadExcelComponent },
  directives: { waves },
  filters: {
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
      total: 0,
      listLoading: false,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        transNo: undefined, //
        merOrderNo: undefined,
        workStatus: undefined,
        orderFrom: undefined,
        auditStat: undefined,
        state: undefined, //
        orderStatus: undefined,
        payType: undefined,
        orderNo: undefined,
        ZFBOrderNo: undefined,
        createDateStart: undefined, //
        createDateEnd: undefined, //
        type: undefined //
      },
      statusOptions: orderStatusOptions,
      orderFromOptions,
      orderSourceOptions,
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

      //  4/7 定义数据 4个   (注意表头状态类写法！！！)
      titleName: '商户转账查询', // excel文件名
      tHeader: ['平台单号', '平台商户ID', '商户名称', '转出方商户ID', '转出方商户名称', '转账金额', '转账状态： 0=待处理，1=处理中，2=处理成功，3=处理失败', '转账描述', '转账时间', '下单时间', '类型：0=入账,1=出账'], // 表头名字——写法注意：如审核状态：'审核状态:   1:待审核，2.审核中,3.审核通过，4.审核不通过'
      filterVal: ['transNo', 'merId', 'merName', 'acceptMerId', 'acceptMerName', 'transAmount', 'transState', 'transDesc', 'transDate', 'createDate', 'type'], // 表头名字对应接口参数
      timeArray: ['transDate', 'createDate'], // 要转时间格式的数据 如：["创建时间","修改时间"]
      downloadExcel: 'transferManage:merchantTransferCheck:downloadExcel'
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      const params = Object.assign({}, this.listQuery)

      getOrderList(params).then(response => {
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
    // createData() {
    //   this.$refs['dataForm'].validate((valid) => {
    //     if (valid) {
    //       this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
    //       // this.temp.author = 'vue-element-admin'
    //       createOrder(this.temp).then(() => {
    //         this.list.unshift(this.temp)
    //         this.dialogFormVisible = false
    //         this.$notify({
    //           title: '成功',
    //           message: '创建成功',
    //           type: 'success',
    //           duration: 2000
    //         })
    //       })
    //     }
    //   })
    // },
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
          getOrderList(parmas).then((res) => { resolve(res.list) })
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
                  getOrderList(parmas).then((res) => {
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
    handleDownload() {
      this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
          const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'table-list'
          })
          this.downloadLoading = false
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
