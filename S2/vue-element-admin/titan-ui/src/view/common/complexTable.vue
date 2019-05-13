<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        :placeholder="$t('order.No')"
        v-model="listQuery.orderNo"
        clearable
        style="width: 300px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"/>
      <el-select
        v-model="listQuery.orderStatus"
        :placeholder="$t('order.status')"
        clearable
        style="width: 110px"
        class="filter-item">
        <el-option
          v-for="item in statusOptions"
          :key="item.orderStatus"
          :label="item.display_name"
          :value="item.orderStatus"/>
      </el-select>
      <el-select
        v-model="listQuery.payType"
        :placeholder="$t('order.payType')"
        clearable
        class="filter-item"
        style="width: 130px">
        <el-option v-for="item in payTypeOptions" :key="item.payType" :label="item.display_name" :value="item.payType"/>
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key"/>
      </el-select>
      <el-button
        v-waves
        class="filter-item pan-btn green-btn"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter">{{ $t('order.search') }}
      </el-button>
      <!--<el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('order.add') }}</el-button>-->
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload">{{ $t('order.export') }}
      </el-button>
      <!--<el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">{{ $t('order.reviewer') }}</el-checkbox>-->
      <br>
      <el-date-picker
        v-model="listQuery.startDate"
        type="datetime"
        format="yyyy-MM-dd HH:mm:ss"
        placeholder="订单开始时间"/>
      <el-date-picker
        v-model="listQuery.endDate"
        type="datetime"
        format="yyyy-MM-dd HH:mm:ss"
        placeholder="订单结束时间"/>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange">
      <el-table-column :label="$t('order.id')" prop="id" sortable="custom" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('order.No')" width="199px" align="center">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.orderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('order.createDate')" min-width="160px">
        <template slot-scope="scope">
          <span v-if="scope.row.createDate">{{ scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
        <!--<template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.title }}</span>
          <el-tag>{{ scope.row.type | typeFilter }}</el-tag>
        </template>-->
      </el-table-column>
      <el-table-column :label="$t('order.money')" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.money }}</span>
        </template>
      </el-table-column>
      <!-- 管理后台启用字段 -->
      <!--<el-table-column :label="$t('order.realMoney')" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.realMoney }}</span>
        </template>
      </el-table-column>-->
      <el-table-column :label="$t('order.status')" width="99px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.orderStatus | orderStatusTagTypeFilter">{{ scope.row.orderStatus | orderStatusFilter
          }}
          </el-tag>
        </template>
        <!--<template slot-scope="scope">
          <svg-icon v-for="n in +scope.row.status" :key="n" icon-class="star" class="meta-item__icon"/>
        </template>-->
      </el-table-column>
      <el-table-column :label="$t('order.payType')" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.payType | payTypeFilter }}</span>
        </template>
        <!-- <el-table-column v-if="showReviewer" :label="$t('order.payType')" width="110px" align="center">
        <template slot-scope="scope">
          <span style="color:red;">{{ scope.row.payType }}</span>
        </template>-->
      </el-table-column>
      <el-table-column :label="$t('order.bankCode')" width="110px" align="center">
        <template slot-scope="scope">
          <span style="color:red;">{{ scope.row.bankCode }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('order.account')" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('order.channelOrderNo')" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.channelOrderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('order.channelCode')" width="110px" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.channelCode | channelCodeTagTypeFilter" :hit="true">{{ scope.row.channelCode |
          channelCodeFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('order.handStatus')" width="110px" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.handStatus | handStatusTagTypeFilter">{{ scope.row.handStatus | handStatusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('order.callbackDate')" width="160px" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.callbackDate">{{ scope.row.callbackDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('order.terminalType')" width="110px" align="center">
        <template slot-scope="scope">
          <span style="color:red;">{{ scope.row.terminalType }}</span>
        </template>
      </el-table-column>
      <!-- 无效字段 使用createDate -->
      <!--<el-table-column :label="$t('order.rechargeDate')" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.rechargeDate }}</span>
        </template>
      </el-table-column>-->
      <!-- 管理后台启用字段 -->
      <!--<el-table-column :label="$t('order.merNo')" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.merNo }}</span>
        </template>
      </el-table-column>-->
      <el-table-column :label="$t('order.orderIp')" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orderIp }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('order.operator')" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.operator }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('order.operatorRemarks')" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.operatorRemarks }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column :label="$t('table.readings')" align="center" width="95">
        <template slot-scope="scope">
          <span v-if="scope.row.pageviews" class="link-type" @click="handleFetchPv(scope.row.pageviews)">{{ scope.row.pageviews }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.status')" class-name="status-col" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
          <el-button v-if="scope.row.status!='published'" size="mini" type="success" @click="handleModifyStatus(scope.row,'published')">{{ $t('table.publish') }}
          </el-button>
          <el-button v-if="scope.row.status!='draft'" size="mini" @click="handleModifyStatus(scope.row,'draft')">{{ $t('table.draft') }}
          </el-button>
          <el-button v-if="scope.row.status!='deleted'" size="mini" type="danger" @click="handleModifyStatus(scope.row,'deleted')">{{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>-->
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNo"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"/>

    <!--<drag-dialog :visible.sync="dialogFormVisible" />-->

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="99px"
        style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('order.account')">
          <el-input v-model="temp.account" placeholder="用户付款账号" style="width: 199px;"/>
        </el-form-item>
        <el-form-item :label="$t('order.status')" prop="type">
          <el-select v-model="temp.orderStatus" class="filter-item" placeholder="选择订单状态">
            <el-option
              v-for="item in orderStatusOptions"
              :key="item.orderStatus"
              :label="item.display_name"
              :value="item.orderStatus"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('order.handStatus')" prop="type">
          <el-select v-model="temp.handStatus" class="filter-item" placeholder="选择加款状态">
            <el-option
              v-for="item in handStatusOptions"
              :key="item.handStatus"
              :label="item.display_name"
              :value="item.handStatus"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('order.createDate')" prop="timestamp">
          <el-date-picker v-model="temp.createDate" :disabled="true" type="datetime" placeholder="下单时间"/>
        </el-form-item>
        <el-form-item :label="$t('order.payType')" prop="title">
          <el-select v-model="temp.payType" class="filter-item" placeholder="选择支付类型">
            <el-option
              v-for="item in payTypeOptions"
              :disabled="true"
              :key="item.payType"
              :label="item.display_name"
              :value="item.payType"/>
          </el-select>
          <!--<el-input v-model="temp.payType" :disabled="true" placeholder="支付类型"/>-->
        </el-form-item>
        <el-form-item :label="$t('order.money')">
          <!-- <el-select v-model="temp.money" class="filter-item" placeholder="金额">
            <el-option v-for="item in evaluationStatusOptions" :key="item" :label="item" :value="item"/>
          </el-select>-->
          <el-input v-model="temp.money" :disabled="true" placeholder="订单金额(元)" style="width: 199px;"/>
        </el-form-item>
        <!--<el-form-item :label="$t('table.importance')">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;"/>
        </el-form-item>
        <el-form-item :label="$t('table.remark')">
          <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="temp.remark" type="textarea" placeholder="Please input"/>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('order.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('order.confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"/>
        <el-table-column prop="pv" label="Pv"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ $t('order.confirm') }}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { createOrder, fetchList, fetchPv, updateOrder } from '@/api/common/order'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { Message } from 'element-ui'
import { DragDialog } from '@/view/common/dragDialog'
// import DragDialogDemo from '../../views/components-demo/dragDialog'

const orderStatusOptions = [
  { orderStatus: 0, display_name: '未支付' },
  { orderStatus: 1, display_name: '支付成功' },
  { orderStatus: 2, display_name: '支付中' },
  { orderStatus: 3, display_name: '支付失败' }
]

const handStatusOptions = [
  { handStatus: 0, display_name: '未加款' },
  { handStatus: 1, display_name: '已加款' }
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
  0: '',
  1: 'success',
  2: 'info',
  3: 'danger'
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
  acc[cur.orderStatus] = cur.display_name
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
  name: 'ComplexTable',
  components: { DragDialog, Pagination },
  directives: { waves },
  filters: {
    orderStatusTagTypeFilter(orderStatus) {
      return statusMap[orderStatus]
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
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        pageNo: 1,
        pageSize: 20,
        orderStatus: undefined,
        payType: undefined,
        orderNo: undefined,
        startDate: undefined,
        endDate: undefined,
        sort: '+id'
      },
      statusOptions: orderStatusOptions,
      orderStatusOptions,
      payTypeOptions,
      handStatusOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      evaluationStatusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        orderNo: undefined,
        createDate: undefined,
        orderStatus: undefined,
        payType: undefined,
        money: undefined,
        handStatus: undefined,
        account: undefined
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
        // type: [{ required: true, message: 'type is required', trigger: 'change' }],
        // timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        // title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        const data = response.data
        this.list = data.rows
        this.total = data.totalCount

        this.listLoading = false
        // Just to simulate the time of the request
        // setTimeout(() => {
        //   this.listLoading = false
        // }, 1.5 * 1000)
      }).catch(err => {
        Message.error(err)
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
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
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          // this.temp.author = 'vue-element-admin'
          createOrder(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      // this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      // alert(this.temp.orderStatus)
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // const tempData = Object.assign({ id: undefined, orderNo: undefined, orderStatus: undefined }, this.temp)
          // tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          // tempData.operatorDate = new Date().getTime()
          // tempData.operatorDate = +new Date()
          // alert(JSON.stringify(tempData))
          updateOrder({
            id: this.temp.id,
            orderNo: this.temp.orderNo,
            orderStatus: this.temp.orderStatus,
            handStatus: this.temp.handStatus,
            account: this.temp.account
          }).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
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
