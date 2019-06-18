<template>
  <div class="withdraw-list app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="转账订单号">
          <el-input v-model="listQuery.transNo" :placeholder="$t('table.transferOrderId')" clearable style="width: 250px;" class="filter-item" @keyup.enter.native="handleFilter" />

        </el-form-item>
        <el-form-item label="转出商户ID">
          <el-input v-model="listQuery.acceptMerId" :placeholder="$t('table.TransferOutId')" clearable style="width: 240px;" class="filter-item" onkeyup="this.value=this.value.replace(/\D/g,'')" @keyup.enter.native="handleFilter" />

        </el-form-item>
        <el-form-item label="转入商户ID">
          <el-input v-model="listQuery.merId" :placeholder="$t('table.TransferId')" clearable style="width: 230px;" class="filter-item" onkeyup="this.value=this.value.replace(/\D/g,'')" @keyup.enter.native="handleFilter" />

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
            v-handle="exportBtn"
            :get-order-list="getOrderLists"
            :t-header="tHeader"
            :filter-val="filterVal"
            :time-array="timeArray"
            :title-name="titleName"
          />
        </el-form-item>
        <!--<el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>-->
        <!--<el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>-->
      </el-form>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column :label="$t('table.transferOrderId')" prop="id" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.transNo }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.TransferOutId')" prop="id" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.acceptMerId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.TransferId')" prop="id" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.merId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.transAmount')" prop="id" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.transAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.createDate')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createDate || '' | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.perfectionDate')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.transDate || '' | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.status')" class-name="status-col">
        <template slot-scope="scope">
          <el-tag :type="scope.row.transState | orderStatusTagTypeFilter">{{ scope.row.transState | orderStatusFilter }}</el-tag>
        </template>
      </el-table-column>
      <!--<el-table-column :label="$t('table.actions')" align="center" class-name="small-padding fixed-width">-->
      <!--<template slot-scope="scope">-->
      <!--<el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.examine') }}</el-button>-->
      <!--</template>-->
      <!--</el-table-column>-->
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('table.type')" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.date')" prop="timestamp">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item :label="$t('table.title')" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item :label="$t('table.status')">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.importance')">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item>
        <el-form-item :label="$t('table.remark')">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" :close-on-click-modal="false" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList } from '@/api/manage/merchantManage/transferRecord'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import { Message } from 'element-ui'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import DownloadExcelComponent from '@/components/DownloadExcel/index.vue' // 1/7 引入

const calendarTypeOptions = [
  { key: 'CN', display_name: '未支付' },
  { key: 'US', display_name: '已支付' },
  { key: 'JP', display_name: '已关闭' },
  { key: 'EU', display_name: '已取消' }
]

const orderStatusOptions = [
  { auditState: 0, display_name: '待处理' },
  { auditState: 1, display_name: '处理中' },
  { auditState: 2, display_name: '处理成功' },
  { auditState: 3, display_name: '处理失败' }
]
const statusMap = {
  0: 'warning',
  1: '',
  2: 'success',
  3: 'danger'
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
  name: 'TransferRecord',
  components: { Pagination, DownloadExcelComponent },
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
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    },
    orderStatusFilter(type) {
      return orderStatusKeyValue[type]
    },
    orderStatusTagTypeFilter(auditState) {
      return statusMap[auditState]
    }
  },
  data() {
    return {
      exportBtn: 'orderManage:transferRecord:export',
      tableKey: 0,
      list: null,
      total: 0,
      qishiDate: '',
      listLoading: false,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        transNo: undefined,
        acceptMerId: undefined,
        merId: undefined,
        createDateStart: '',
        createDateEnd: '',
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: ['充值', '提现', '代付'],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      titleName: '商户互转记录', // excel文件名
      tHeader: ['转账订单号', '转出商户ID', '转入商户ID', '转出金额', '创建时间', '完成时间', '状态(0:待处理，1:处理中，2:处理成功，3:处理失败)'], // 表头名字——写法注意：如审核状态：'审核状态:   1:待审核，2.审核中,3.审核通过，4.审核不通过'
      filterVal: ['transNo', 'acceptMerId', 'merId', 'transAmount', 'createDate', 'transDate', 'transState'],
      timeArray: ['createDate', 'transDate'] // 要转时间格式的数据 如：["创建时间","修改时间"]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      // if (typeof (this.listQuery.merId) === 'string' || typeof (this.listQuery.acceptMerId) === 'string') {
      //   this.listLoading = false
      //   return
      // }
      fetchList(this.listQuery).then(data => {
        this.list = data.list
        this.total = data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    dateChange() {
      if (this.qishiDate) {
        this.listQuery.createDateStart = parseTime(this.qishiDate[0], '{y}-{m}-{d}')
        this.listQuery.createDateEnd = parseTime(this.qishiDate[1], '{y}-{m}-{d}')
      } else {
        this.listQuery.createDateStart = ''
        this.listQuery.createDateEnd = ''
      }
    },
    handleFilter() {
      this.listQuery.page = 1
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
          fetchList(parmas).then((res) => { resolve(res.list) })
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
