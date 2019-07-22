<template>
  <div class="app-container">
    <div class="filter-container" style="width: 100%;background: #FFFFFF;margin-bottom: 20px;padding: 20px 20px 0 20px">
      <el-form :inline="true" style="width: 100%;">
        <el-form-item label="批次编号：">
          <el-input
            v-model="listQuery.batchNum"
            placeholder="批次编号"
            clearable
            style="width: 300px;margin-right: 20px"
            class="filter-item"
            @keyup.enter.native="handleFilter"/>
        </el-form-item>
        <el-form-item label="审核状态：">
          <el-select
            v-model="listQuery.status"
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
          <!--<span style="color: red">请在15分钟内完成审核</span>-->
        </el-form-item>
        <br>
        <el-form-item label="银行卡号：">
          <el-input
            v-model="listQuery.cardNum"
            placeholder="银行卡号"
            clearable
            style="width: 300px;margin-right: 20px"
            class="filter-item"
            @keyup.enter.native="handleFilter"/>
        </el-form-item>
        <el-form-item label="真实姓名：">
          <el-input
            v-model="listQuery.realName"
            placeholder="真实姓名"
            clearable
            style="width: 300px;margin-right: 20px"
            class="filter-item"
            @keyup.enter.native="handleFilter"/>
        </el-form-item>
        <el-button
          v-waves
          class="filter-item"
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
          :download-statu="downloadStatu"
        />
      </el-form>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column :label="$t('table.BatchNo')" align="center">
        <template slot-scope="scope">
          <span class="">{{ scope.row.batchNum }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.Amount')" align="center">
        <template slot-scope="scope">
          <span class="">{{ scope.row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.cardNumber')" align="center">
        <template slot-scope="scope">
          <span class="">{{ scope.row.cardNum }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.BankName')" align="center">
        <template slot-scope="scope">
          <span class="">{{ scope.row.bankName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.RealName')" align="center">
        <template slot-scope="scope">
          <span class="">{{ scope.row.realName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.Founder')" align="center">
        <template slot-scope="scope">
          <span class="">{{ scope.row.createId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.AuditStatus')" align="center" min-width="100px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 3 ? 'success' : 'danger' " style="width: 89px">
            {{ scope.row.status === 1 ? '待审核':scope.row.status === 2 ? '审核中':scope.row.status === 3 ?'审核通过':'审核不通过' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="代付订单号" align="center">
        <template slot-scope="scope">
          <span class="">{{ scope.row.orderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="说明" align="center">
        <template slot-scope="scope">
          <span class="">{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.ModificationTime')" align="center" width="150px">
        <template slot-scope="scope">
          <span>{{ (scope.row.updateDate || '') | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.Modifier')" align="center">
        <template slot-scope="scope">
          <span class="">{{ scope.row.updateId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('merchantList.operation')" align="center" width="300px">
        <template slot-scope="scope">
          <el-button v-handle="AuditRecords" type="success" size="mini" @click="handleUpdate(scope.row.reviewList)">{{
          $t('table.AuditRecord') }}
          </el-button>
          <el-button
            v-handle="AuditBtn"
            :disabled="(scope.row.status === 4 ||scope.row.status === 3) ? true:false"
            style="width: 75px"
            type="success"
            size="mini"
            @click="doAudit(scope.row)">{{ (scope.row.status ===
            4|| scope.row.status === 3)? $t('table.Audited'):$t('table.Audit') }}
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

    <el-dialog :close-on-click-modal="false" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <template>
        <el-table
          :data="temp"
          fit
          highlight-current-row
          style="width: 100%;">
          <el-table-column label="创建人" align="center">
            <template slot-scope="scope">
              <span class="">{{ scope.row.createId }}</span>
            </template>
          </el-table-column>
          <el-table-column label="审核备注" align="center">
            <template slot-scope="scope">
              <span class="">{{ scope.row.reviewRemark }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center">
            <template slot-scope="scope">
              <span>{{ (scope.row.createDate || '') | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="审核结果" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.reviewStatus === 1 ? 'success' : 'danger'" style="width: 89px">
                {{ scope.row.reviewStatus=='1'?'审核通过':'审核不通过' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('order.confirm') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible2"
      :before-close="handleClose">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="150px" class="demo-ruleForm">
        <!--<el-form-item label="记录ID" prop="id">-->
        <!--<el-input v-model="ruleForm.id" style="width: 200px"/>-->
        <!--</el-form-item>-->
        <el-form-item label="审核状态" prop="reviewStatus">
          <el-select v-model="ruleForm.reviewStatus" placeholder="请选择">
            <el-option v-for="(v,index) in statusData" :key="index" :label="v.statuName" :value="v.statuId"/>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="支付密码" prop="payPass">-->
        <!--<el-input v-model="ruleForm.payPass" type="password" style="width: 200px"/>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="谷歌验证码" prop="googleCode">-->
        <!--<el-input v-model="ruleForm.googleCode" style="width: 200px"/>-->
        <!--</el-form-item>-->
        <el-form-item label="审核备注">
          <el-input v-model="ruleForm.reviewRemark" style="width: 200px"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
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
import { getOrderList, orderAudit } from '@/api/merchant/merchantOrderCheck/PaidOrderAudit'
import waves from '@/directive/waves' // Waves directive
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { Message } from 'element-ui'
import DragDialog from '@/view/common/dragDialog'
import DownloadExcelComponent from '@/components/DownloadExcel/index.vue' // 1/7 引入
import { exportExcel } from '@/utils'

const orderStatusOptions = [
  { auditState: 1, display_name: '待审核' },
  { auditState: 2, display_name: '审核中' },
  { auditState: 3, display_name: '审核通过' },
  { auditState: 4, display_name: '审核不通过' }
]

const handStatusOptions = [
  { workStatus: 0, display_name: '商户转出' },
  { workStatus: 1, display_name: '商户转入' },
  { workStatus: 2, display_name: '网银' }
]

const orderFromOptions = [
  { orderFrom: 0, display_name: '接口' },
  { orderFrom: 1, display_name: '后台' }
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
  name: 'PaidOrderAudit',
  components: { DragDialog, Pagination, DownloadExcelComponent }, // 2/7 声明组件
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
      //  4/7 定义数据 4个   (注意表头状态类写法！！！)
      titleName: '代付审核查询列表', // excel文件名
      downloadStatu: 0,
      tHeader: ['批次号', '金额', '银行卡号', '银行名称', '真实姓名', '创建人', '审核状态:1.待审核，2.审核中,3.审核通过，4.审核不通过', '代付订单号', '备注', '修改时间', '修改人'], // 表头名字——写法注意：如审核状态：'审核状态:   1:待审核，2.审核中,3.审核通过，4.审核不通过'
      filterVal: ['batchNum', 'amount', 'cardNum', 'bankName', 'realName', 'createId', 'status', 'orderNo', 'remark', 'updateDate', 'updateId'], // 表头名字对应接口参数
      timeArray: ['updateDate'], // 要转时间格式的数据 如：["创建时间","修改时间"]

      tableKey: 0,
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        batchNum: undefined,
        cardNum: undefined,
        realName: undefined,
        status: undefined,
        reviewList: []
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
      temp: [{
        createId: undefined,
        reviewRemark: undefined,
        createDate: undefined,
        reviewStatus: undefined
      }],
      temp2: [],
      dialogFormVisible: false,
      dialogFormVisible2: false,
      dialogStatus: '',
      textMap: {
        update: '审核记录',
        audit: '审核',
        find: 'Find'
      },
      dialogPvVisible: false,
      pvData: [],
      ruleForm: {
        transferId: '',
        reviewStatus: '',
        reviewRemark: ''
      },
      statusData: [
        { statuName: '审核通过', statuId: '1' },
        { statuName: '审核拒绝', statuId: '2' }
      ],
      rules: {
        reviewStatus: [{ required: true, message: '请选择审核状态', trigger: 'change' }]
      },
      downloadLoading: false,
      downloadExcel: 'merchantOrderCheck:PaidOrderAudit:downloadExcel',
      AuditRecords: 'merchantOrderCheck:PaidOrderAudit:AuditRecords',
      AuditBtn: 'merchantOrderCheck:PaidOrderAudit:AuditBtn'
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getOrderList(this.listQuery).then(response => {
        this.list = response.list
        this.total = response.total // 6/7 保证total已保存

        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleFilter() {
      // this.listQuery.pageNo = 1
      this.getList()
    },
    // handleModifyStatus(row, status) {
    //   this.$message({
    //     message: '操作成功',
    //     type: 'success'
    //   })
    //   row.status = status
    // },
    // sortChange(data) {
    //   const { prop, order } = data
    //   if (prop === 'id') {
    //     this.sortByID(order)
    //   }
    // },
    // sortByID(order) {
    //   if (order === 'ascending') {
    //     this.listQuery.sort = '+id'
    //   } else {
    //     this.listQuery.sort = '-id'
    //   }
    //   this.handleFilter()
    // },
    handleUpdate(row) {
      this.temp = row
      // console.log('this.temp', this.temp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    // 审核
    doAudit(row) {
      this.ruleForm.transferId = row.id

      this.dialogStatus = 'audit'
      this.dialogFormVisible2 = true
    },
    resetForm(formName) {
      this.ruleForm.transferId = ''
      this.ruleForm.reviewStatus = ''
      this.ruleForm.reviewRemark = ''
      this.$refs[formName].resetFields()
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 加密参数
          const prams = Object.assign({}, this.ruleForm)
          // prams.payPass = this.$md5(prams.payPass)
          prams.transferId = prams.transferId.toString()

          this.listLoading = true
          // 提交接口
          orderAudit(prams).then(response => {
            Message({
              message: '操作成功',
              type: 'success',
              duration: 5 * 1000
            })
            this.resetForm('ruleForm')
            this.dialogFormVisible2 = false
            this.handleFilter()
            this.listLoading = false
          }).catch(() => {
            this.listLoading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // handleDownload() {
    //   this.downloadLoading = true
    //     import('@/vendor/Export2Excel').then(excel => {
    //       const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
    //       const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
    //       const data = this.formatJson(filterVal, this.list)
    //       excel.export_json_to_excel({
    //         header: tHeader,
    //         data,
    //         filename: 'table-list'
    //       })
    //       this.downloadLoading = false
    //     })
    // },
    // formatJson(filterVal, jsonData) {
    //   return jsonData.map(v => filterVal.map(j => {
    //     if (j === 'timestamp') {
    //       return parseTime(v[j])
    //     } else {
    //       return v[j]
    //     }
    //   }))
    // },
    getOrderLists() {
      return exportExcel(this.total, this.listQuery, getOrderList, this)// （总条数，查询条件，接口方法）
    },
    handleClose(done) {
      this.resetForm('ruleForm')
      done()
    }
  }
}
</script>

<style scoped>
  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>

