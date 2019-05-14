<template>
  <div class="withdraw-list app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-form-item label="平台商户ID">
        <el-input v-model="listQuery.id" clearable placeholder="平台商户ID" style="width: 250px;" />
      </el-form-item>
      <el-form-item label="平台商户名称">
        <el-input v-model="listQuery.nickName" clearable placeholder="平台商户名称" style="width: 250px;" />
      </el-form-item>
      <el-form-item label="代理ID">
        <el-input v-model="listQuery.agentId" clearable placeholder="代理ID" style="width: 250px;" onkeyup="this.value=this.value.replace(/\D/g,'')"/>
      </el-form-item>
      <el-button v-waves class="filter-item" type="primary" @click="refreshList">{{ $t('table.search') }}</el-button>
    </el-form>
    <el-table v-loading="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="平台商户ID" prop="id" align="center"/>
      <el-table-column label="平台商户名称" prop="nickName" align="center"/>
      <el-table-column label="代理ID" prop="agentId" align="center"/>
      <el-table-column label="代理名称" prop="agentNickName" align="center"/>
      <el-table-column label="状态" prop="state" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state | orderStatusTagTypeFilter ">
            {{ scope.row.state | orderStatusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="商户类型" prop="merType" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.merType === 1 ? '普通商户' : '虚拟商户' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createDate" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createDate || '' | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('merchantList.operation')" align="center" width="250px">
        <template slot-scope="scope">
          <el-button v-handle="update" type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('merchantList.amend') }}</el-button>
          <el-button
            v-handle="examine"
            :disabled="scope.row.state !== 0"
            :type="scope.row.state !== 0 ? 'warning' : 'success'"
            size="mini"
            @click="handleApproval(scope.row)">
            {{ $t('table.approval') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <!--修改-->
    <el-dialog :visible.sync="dialogFormVisibleUpdate" :close-on-click-modal="false" title="修改">
      <el-form
        ref="dataForm"
        :model="temp"
        :rules="rules"
        label-position="right"
        label-width="99px"
        style="width: 400px; margin-left:50px;display: flex">
        <div>
          <el-form-item :label="$t('merchantList.merchantName')" label-width="120px">
            <el-input v-model="temp.nickName" style="width: 250px;" disabled/>
          </el-form-item>
          <el-form-item :label="$t('merchantList.merchantStatus')" label-width="120px">
            <el-tag :type="temp.state | orderStatusTagTypeFilter ">
              {{ temp.state | orderStatusFilter }}
            </el-tag>
          </el-form-item>
          <el-form-item :label="$t('merchantList.cellPhone')" label-width="120px" prop="phone">
            <el-input v-model="temp.phone" style="width: 250px;"/>
          </el-form-item>
          <el-form-item :label="$t('merchantList.email')" label-width="120px" prop="email">
            <el-input v-model="temp.email" style="width: 250px;"/>
          </el-form-item>
          <el-form-item :label="$t('merchantList.contactAddress')" label-width="120px" prop="address">
            <el-input v-model="temp.address" style="width: 250px;"/>
          </el-form-item>
        </div>
        <div>
          <el-form-item :label="$t('merchantList.identificationNum')" label-width="120px" prop="legalIdNumber">
            <el-input v-model="temp.legalIdNumber" style="width: 250px;"/>
          </el-form-item>
          <el-form-item :label="$t('merchantList.businessPermits')" label-width="120px" prop="businessLicense">
            <el-input v-model="temp.businessLicense" style="width: 250px;"/>
          </el-form-item>
          <el-form-item :label="$t('merchantList.accountPermits')" label-width="120px" prop="openLicense">
            <el-input v-model="temp.openLicense" style="width: 250px;"/>
          </el-form-item>
          <!--<el-form-item :label="$t('merchantList.chooseBank')" label-width="120px">-->
          <!--<el-select-->
          <!--v-model="bankCopy"-->
          <!--:placeholder="$t('merchantList.whole')"-->
          <!--value-key="code"-->
          <!--style="width: 250px;margin-right: 20px"-->
          <!--class="filter-item">-->
          <!--<el-option-->
          <!--v-for="item in bankList"-->
          <!--:key="item.code"-->
          <!--:label="item.name"-->
          <!--:value="item"/>-->
          <!--</el-select>-->
          <!--</el-form-item>-->
          <!--<el-form-item :label="$t('merchantList.accountName')" label-width="120px" prop="openUserName">-->
          <!--<el-input v-model="temp.openUserName" style="width: 250px;"/>-->
          <!--</el-form-item>-->
          <el-form-item :label="$t('merchantList.testAccount')" label-width="120px" prop="extendDesc">
            <el-input v-model="temp.extendDesc" type="textarea" style="width: 250px;"/>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleUpdate = false">{{ $t('order.cancel') }}</el-button>
        <el-button type="primary" @click="updateMerchants">{{ $t('order.confirm') }}</el-button>
      </div>
    </el-dialog>
    <!--审批-->
    <el-dialog :visible.sync="dialogFormVisibleApproval" :close-on-click-modal="false" title="审批" width="40%">
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="right"
        label-width="99px"
        style="width: 400px; margin-left:50px;">
        <el-form-item label="商户ID">
          <el-input v-model="temp.id" style="width: 250px;" disabled/>
        </el-form-item>
        <el-form-item label="代理ID">
          <el-input v-model="temp.agentId" style="width: 250px;" disabled/>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="state" clearable style="width: 250px">
            <el-option :value="1" label="审核通过">审核通过</el-option>
            <el-option :value="3" label="审核不通过">审核不通过</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核备注">
          <el-input v-model="temp.remarks" style="width: 250px;"/>
        </el-form-item>
        <el-form-item label="商户组名称">
          <el-select
            v-model="merGroupList"
            :placeholder="$t('merchantList.whole')"
            value-key="id"
            style="width: 250px;margin-right: 20px"
            class="filter-item">
            <el-option
              v-for="item in groupList"
              :key="item.id"
              :label="item.groupName"
              :value="item"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleApproval = false">{{ $t('order.cancel') }}</el-button>
        <el-button type="primary" @click="merchantApproval">{{ $t('order.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { fetchList, updateMerchant, approvalMerchant, merchantGroup } from '@/api/manage/merchantManage/addMerchantApproval'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
// import { Message } from 'element-ui'
import DragDialog from '@/view/common/dragDialog'
// import { parseTime } from '@/utils'
const orderStatusOptions = [
  { auditState: 0, display_name: '待审核' },
  { auditState: 1, display_name: '启用' },
  { auditState: 2, display_name: '停用' },
  { auditState: 3, display_name: '审核驳回' }
]

const statusMap = {
  0: '',
  1: 'success',
  2: 'danger',
  3: 'danger'
}

// calendarTypeKeyValue
// arr to obj ,such as { CN : "China", US : "USA" }
const orderStatusKeyValue = orderStatusOptions.reduce((acc, cur) => {
  acc[cur.auditState] = cur.display_name
  return acc
}, {})

export default {
  name: 'AddMerchantApproval',
  components: { Pagination, DragDialog },
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
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else {
        const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    return {
      update: 'manageMerchantAccount:addMerchantApproval:update',
      examine: 'manageMerchantAccount:addMerchantApproval:examine',
      rules: {
        phone: [
          { validator: checkPhone, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不能为空' },
          { type: 'email', message: '邮箱格式不正确' }
        ],
        address: [
          { required: true, message: '联系地址不能为空' }
        ],
        legalIdNumber: [
          { required: true, message: '身份证号码不能为空' }
        ],
        businessLicense: [
          { required: true, message: '营业许可证号码不能为空' }
        ],
        openLicense: [
          { required: true, message: '开户许可证号码不能为空' }
        ],
        openUserName: [
          { required: true, message: '开户人姓名不能为空' }
        ],
        bankNo: [
          { required: true, message: '银行卡号不能为空' }
        ],
        extendDesc: [
          { required: true, message: '下游平台网址测试账号不能为空' }
        ]
      },
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      qishiDate: '',
      checkList: [],
      secretList: [],
      bankList: [],
      groupList: [],
      merGroupList: {},
      state: '',
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        id: '',
        state: 0,
        nickName: '',
        agentId: ''
      },
      detailData: {},
      dialogFormVisibleUpdate: false,
      dialogFormVisibleApproval: undefined,
      statusOptions: orderStatusOptions,
      reset: {
        id: undefined,
        googleVerificationCode: undefined,
        type: undefined,
        keyType: undefined
      },
      temp: {
        id: undefined,
        merType: undefined,
        remarks: undefined,
        address: undefined, //
        bankName: undefined, //
        extendDesc: undefined, //
        legalIdNumber: undefined, //
        bankNo: undefined, //
        businessLicense: undefined, //
        openUserName: undefined, //
        openLicense: undefined, //
        nickName: undefined, //
        agentId: undefined,
        email: undefined, //
        phone: undefined, //
        bankCode: undefined, //
        code: undefined,
        auditState: undefined,
        merGroupName: undefined,
        merGroupId: undefined,
        state: undefined //
      },
      bankCopy: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      // if (typeof (this.listQuery.id) === 'string' || typeof (this.listQuery.agentId) === 'string') {
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
    },
    // 修改
    updateMerchants() {
      // debugger/this.temp
      updateMerchant({
        nickName: this.temp.nickName,
        phone: this.temp.phone,
        email: this.temp.email,
        address: this.temp.address,
        extendDesc: this.temp.extendDesc,
        legalIdNumber: this.temp.legalIdNumber,
        businessLicense: this.temp.businessLicense,
        openLicense: this.temp.openLicense,
        bankCode: this.bankCopy.code, //
        bankName: this.bankCopy.name, //
        openUserName: this.temp.openUserName,
        bankNo: this.temp.bankNo,
        merId: this.temp.id
      }).then(() => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.dialogFormVisibleUpdate = false

        this.getList()
      })
    },
    // 审批
    merchantApproval() {
      approvalMerchant({
        id: this.temp.id,
        state: this.state,
        auditRemarks: this.temp.remarks,
        merGroupId: this.merGroupList.id || '',
        merGroupName: this.merGroupList.groupName || ''
      }).then(() => {
        this.$message({
          message: '审批成功',
          type: 'success'
        })
        this.dialogFormVisibleApproval = false
        this.getList()
      })
    },
    refreshList() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogFormVisibleUpdate = true
      // bankList().then(data => {
      //   var a = data.filter(item => item.code === row.bankCode)
      //   this.bankCopy = a[0]
      //   this.bankList = data
      //   this.dialogFormVisibleUpdate = true
      // })
    },
    handleApproval(row) {
      // this.temp = Object.assign({}, row)
      this.temp.id = row.id
      this.temp.agentId = row.agentId
      this.merGroupList = {}
      merchantGroup().then(data => {
        var merGroup = data.filter(item => item.id === row.merGroupId)
        this.merGroupList = merGroup[0]
        this.groupList = data
        this.dialogFormVisibleApproval = true
      })
    }
  }
}
</script>

