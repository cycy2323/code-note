<template>
  <div class="app-container">
    <div class="filter-container" style="width: 100%;background: #FFFFFF;margin-bottom: 20px;padding: 20px 20px">
      用户名：
      <el-input
        :placeholder="$t('table.UserName')"
        v-model="listQuery.userName"
        clearable
        style="width: 300px;margin-right: 20px"
        class="filter-item"
        @keyup.enter.native="handleFilter"/>
      状态：
      <el-select
        v-model="listQuery.state"
        :placeholder="$t('merchantList.whole')"
        clearable
        style="width: 110px;margin-right: 20px"
        class="filter-item">
        <el-option
          v-for="item in statusOptions"
          :key="item.display_name"
          :label="item.display_name"
          :value="item.auditState"/>
      </el-select>
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
      :data="list"
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange">
      <el-table-column :label="$t('table.UserName')" align="center">
        <template slot-scope="scope">
          <span class="">{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column :label="$t('table.RealName')" align="center">-->
      <!--<template slot-scope="scope">-->
      <!--<span class="">{{ scope.row.realName }}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column :label="$t('table.Nickname')" align="center">
        <template slot-scope="scope">
          <span class="">{{ scope.row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.state')" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state === 1 ? 'success' : 'danger' ">
            {{ scope.row.state === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.CreationTime')" align="center">
        <template slot-scope="scope">
          <span>{{ (scope.row.createDate || '') | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column :label="$t('table.isSysAndDelete')" align="center">-->
      <!--<template slot-scope="scope">-->
      <!--<el-tag :type="scope.row.isSys == '1' ? 'danger' : 'success' ">-->
      <!--{{ scope.row.isSys === 1 ? '是' : '否' }}-->
      <!--</el-tag>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column :label="$t('merchantList.operation')" align="center" width="500px">
        <template slot-scope="scope">
          <el-button v-handle="imposeLoginOutBtn" type="text" size="mini" @click="forbiddenSubAccount(scope.row)">{{
          $t('table.imposeLoginOut') }}
          </el-button>
          <el-button v-handle="resetGoogleCodeBtn" type="text" size="mini" @click="resetGoolgeSec(scope.row)">{{
          $t('table.resetGoogleCode') }}
          </el-button>
          <el-button v-handle="DeleteSubAccountBtn" type="text" size="mini" @click="deleteSubAccount(scope.row)">{{
          $t('table.DeleteSubAccount') }}
          </el-button>
          <el-button v-handle="modifySubAccountBtn" type="text" size="mini" @click="updateSub(scope.row)">{{
          $t('table.modifySubAccount') }}
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

    <el-dialog
      :close-on-click-modal="false"
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :before-close="handleClose">
      <el-form
        ref="dataForm"
        :model="temp"
        :rules="rules"
        label-position="right"
        label-width="130px"
        style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('table.LoginName')">
          <el-input v-model="temp.userName" :readonly="readonly" style="width: 199px;"/>
        </el-form-item>
        <el-form-item :label="$t('table.Nickname')" prop="nickName">
          <el-input v-model="temp.nickName" style="width: 199px;"/>
        </el-form-item>
        <!--<el-form-item :label="$t('角色ID')">-->
        <!--<el-input v-model="temp.roleId" style="width: 199px;"/>-->
        <!--</el-form-item>-->
        <el-form-item :label="$t('table.role')" prop="roleId">
          <el-select v-model="temp.roleId" placeholder="请选择角色">
            <el-option v-for="v in roleData" :label="v.roleName" :key="v.roleId" :value="v.roleId"/>
          </el-select>
        </el-form-item>
        <el-form-item label="启用">
          <el-switch v-model="temp.state"/>
        </el-form-item>
        <!--<el-form-item :label="$t('table.BindIP')" prop="userBindIp">-->
        <!--<el-input v-model="temp.userBindIp" placeholder="请填写ip" type="textarea" style="width: 400px"/>-->
        <!--<span style="color:red;">多个ip之间请用英文分号(;)隔开！</span>-->
        <!--</el-form-item>-->
        <el-form-item :label="$t('table.LoginPassword')" prop="password">
          <el-input v-model="temp.password" placeholder="请填写登录密码" style="width: 199px;"/>
        </el-form-item>
        <el-form-item :label="$t('table.ConfirmLoginPassword')" prop="confirmPassword">
          <el-input v-model="temp.confirmPassword" placeholder="请确认登录密码" style="width: 199px;"/>
        </el-form-item>
        <el-form-item :label="$t('table.PaymentPassword')" prop="userPayPass">
          <el-input v-model="temp.userPayPass" placeholder="请填写员工支付密码" style="width: 199px;"/>
        </el-form-item>
        <el-form-item :label="$t('table.ConfirmPaymentPassword')" prop="confirmUserPayPass">
          <el-input v-model="temp.confirmUserPayPass" placeholder="请确认员工支付密码" style="width: 199px;"/>
        </el-form-item>
        <el-form-item :label="$t('table.googleCode')" prop="googleCode">
          <el-input
            v-model.number="temp.googleCode"
            oninput="this.value=this.value.replace(/e|-/g,'');this.value=this.value.replace(/\./g,'');"
            type="number"
            placeholder="请输入谷歌验证码"
            style="width: 199px;"/>
        </el-form-item>
        <el-form-item class="el-radio1">
          <el-button type="primary" @click="updateComfirm('dataForm')">立即修改</el-button>
          <el-button @click="resetForm('dataForm')">重置</el-button>
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
import { freezeAccount } from '@/api/agent/merchantManage'
import {
  getSubList,
  ForbiddenSub,
  resetGoolge,
  deleteSub,
  updateSubAccount,
  getRoles
} from '@/api/merchant/merchantSubAccoun/subAccounList'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { Message } from 'element-ui'
import DragDialog from '@/view/common/dragDialog'
import Vue from 'vue'
import DownloadExcelComponent from '@/components/DownloadExcel/index.vue' // 1/7 引入

const orderStatusOptions = [
  { auditState: 1, display_name: '启用' },
  { auditState: 2, display_name: '禁用' }
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
  name: 'SubAccounList',
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
      ModelId: undefined, // 传到model子账户id
      tableKey: 0,
      list: [],
      total: 0,
      roleData: [],
      listLoading: false,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        workStatus: undefined,
        userName: undefined, //
        orderFrom: undefined,
        auditStat: undefined,
        state: undefined, //
        orderStatus: undefined,
        payType: undefined,
        orderNo: undefined,
        ZFBOrderNo: undefined,
        startTime: undefined, //
        endTime: new Date(), //
        sort: '+id'
      },
      readonly: true,
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
        id: undefined,
        userName: undefined,
        nickName: undefined,
        roleId: undefined,
        userBindIp: undefined,
        password: undefined,
        userPayPass: undefined,
        confirmUserPayPass: undefined,
        googleCode: undefined,
        confirmPassword: undefined,
        state: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        subLogout: '禁止登录并强制下线',
        detail: '详情',
        update: '修改',
        find: 'Find'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        nickName: [
          { required: true, message: '昵称不能为空' }
        ],
        roleId: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ],
        userBindIp: [
          { required: true, message: '请填写ip' }
        ],
        password: [
          // { required: true, message: '请填写登录密码' }
        ],
        confirmPassword: [
          // { required: true, message: '请确认登录密码' }
        ],
        userPayPass: [
          // { required: true, message: '请填写员工支付密码' }
        ],
        confirmUserPayPass: [
          // { required: true, message: '请确认员工支付密码' }
        ],
        googleCode: [
          { required: true, message: '请填写谷歌验证码' },
          { type: 'number', message: '谷歌验证码必须为数字值' }
        ]
      },
      downloadLoading: false,

      //  4/7 定义数据 4个   (注意表头状态类写法！！！)
      titleName: '子账户列表', // excel文件名
      tHeader: ['用户名', '昵称', '状态：1.启用 2.禁用 ', '创建时间'], // 表头名字——写法注意：如审核状态：'审核状态:   1:待审核，2.审核中,3.审核通过，4.审核不通过'
      filterVal: ['userName', 'nickName', 'state', 'createDate'], // 表头名字对应接口参数
      timeArray: ['createDate'], // 要转时间格式的数据 如：["创建时间","修改时间"]

      downloadExcel: 'subAccounManage:subAccounList:downloadExcel',
      imposeLoginOutBtn: 'subAccounManage:subAccounList:imposeLoginOutBtn',
      resetGoogleCodeBtn: 'subAccounManage:subAccounList:resetGoogleCodeBtn',
      DeleteSubAccountBtn: 'subAccounManage:subAccounList:DeleteSubAccountBtn',
      modifySubAccountBtn: 'subAccounManage:subAccounList:modifySubAccountBtn'
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getSubList(this.listQuery).then(response => {
        this.list = response.list
        this.total = response.total

        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
      getRoles().then(response => {
        this.roleData = response
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
    updateSub(row) { // 表单赋值
      this.dialogStatus = 'update'
      if (row) {
        this.temp.id = (row.id && row.id.toString())
        this.temp.userName = row.userName
        this.temp.nickName = row.nickName
        // this.temp.roleId = this.roleData && this.roleData.roleId.toString()
        this.temp.userBindIp = undefined
        this.temp.password = undefined
        this.temp.userPayPass = undefined
        this.temp.googleCode = undefined
        this.temp.confirmUserPayPass = undefined
        this.temp.confirmPassword = undefined
        this.temp.roleId = undefined
        if (row.state === 1) {
          this.temp.state = true
        } else {
          this.temp.state = false
        }
      }
      this.dialogFormVisible = true
      this.$nextTick()
    },
    // 修改子账户
    updateComfirm(dataForm) {
      this.$refs[dataForm].validate((valid) => {
        if (valid) {
          this.listLoading = true
          // 参数整理
          const params = Object.assign({}, this.temp)
          params.password = params.password ? Vue.prototype.$md5(params.password) : ''
          params.confirmPassword = params.confirmPassword ? Vue.prototype.$md5(params.confirmPassword) : ''
          params.userPayPass = params.userPayPass ? Vue.prototype.$md5(params.userPayPass) : ''
          params.confirmUserPayPass = params.confirmUserPayPass ? Vue.prototype.$md5(params.confirmUserPayPass) : ''
          params.state = (this.temp.state ? '1' : '2')
          updateSubAccount(params).then(() => {
            this.$message({
              type: 'success',
              message: '重置成功!'
            })
            this.handleFilter()
            this.resetForm('dataForm')
            this.listLoading = false
          }).catch(() => {
            this.listLoading = false
          })
          this.dialogFormVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    forbiddenSubAccount(row) {
      this.ModelId = row.id
      this.$confirm('禁止该子账号登录并强制下线, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        ForbiddenSub({ id: this.ModelId.toString() }).then(response => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.handleFilter()

          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    resetGoolgeSec(row) {
      this.ModelId = row.id
      this.$confirm('重置子账户谷歌验证码, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        resetGoolge({ id: this.ModelId.toString() }).then(response => {
          this.$message({
            type: 'success',
            message: '重置成功!'
          })
          this.handleFilter()

          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    deleteSubAccount(row) {
      this.ModelId = row.id
      this.$confirm('删除该子账户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        deleteSub({ id: this.ModelId.toString() }).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.handleFilter()

          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
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
          getSubList(parmas).then((res) => {
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
                  getSubList(parmas).then((res) => {
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
    },
    handleClose(done) {
      this.resetForm('dataForm')
      done()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>

</style>

