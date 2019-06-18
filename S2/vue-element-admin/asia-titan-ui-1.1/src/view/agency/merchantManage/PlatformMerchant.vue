<template>
  <div class="app-container">
    <el-form :inline="true" class="filter-container inquire-style">
      <el-form-item class="fontStyleRule" label="平台商户ID" prop="merId">
        <el-input
          :placeholder="$t('merchantList.merchantID')"
          v-model.number="listQuery.merId"
          clearable
          style="width: 200px;margin-right: 20px"
          class="filter-item"
          @keyup.enter.native="handleFilter"/>
      </el-form-item>
      <el-form-item label="平台商户名称">
        <el-input
          :placeholder="$t('merchantList.merchantName')"
          v-model="listQuery.nickName"
          clearable
          style="width: 200px;margin-right: 20px"
          class="filter-item"
          @keyup.enter.native="handleFilter"/>
      </el-form-item>
      <el-form-item label="商户状态">
        <el-select
          v-model="listQuery.state"
          :placeholder="$t('merchantList.whole')"
          clearable
          style="width: 150px;margin-right: 20px"
          class="filter-item">
          <el-option
            v-for="item in statusOptions"
            :key="item.auditState"
            :label="item.display_name"
            :value="item.auditState"/>
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="qishiDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          @change="dateChange"/>
      </el-form-item>
      <el-form-item label="可用金额" class="orderAmount">
        <el-col :span="10">
          <el-input v-model.number="listQuery.minAmount" clearable placeholder="输入最小金额" style="width: 100%;"/>
        </el-col>
        <el-col :span="2" class="line">-</el-col>
        <el-col :span="10">
          <el-input v-model.number="listQuery.maxAmount" clearable placeholder="输入最大金额" style="width: 100%;"/>
        </el-col>
      </el-form-item>
      <el-button
        v-waves
        type="primary"
        icon="el-icon-search"
        @click="handleFilter">{{ $t('merchantList.search') }}
      </el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        type="success"
        @click="newCreated"
      >{{ $t('table.add') }}
      </el-button>
    </el-form>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      :default-sort = "{prop: 'createDate', order: 'descending'}"
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column :label="$t('merchantList.merchantID')" align="center" >
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('merchantList.merchantName')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('merchantList.merchantStatus')" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state | orderStatusTagTypeFilter ">
            {{ scope.row.state | orderStatusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="可用金额" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.totalAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="冻结金额" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.freezeAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('merchantList.createTime')" align="center" prop="createDate" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.createDate || '' | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('merchantList.operation')" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleDetails(scope.row)">{{ $t('merchantList.details') }}</el-button>
          <el-button v-if="scope.row.state === 0" type="success" size="mini" @click="handleAmend(scope.row)">{{ $t('merchantList.amend') }}</el-button>
          <!--<el-button type="danger" size="mini" @click="handleDelete(scope.row)">{{ $t('merchantList.delete') }}</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNo"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"/>

    <!--添加商户弹框-->
    <el-dialog :visible.sync="dialogFormVisibleNew" :close-on-click-modal="false" title="添加商户">
      <el-form
        ref="addDataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="99px"
        style="width: 400px; margin-left:50px;display: flex">
        <div style="margin-right: 100px">
          <el-form-item :label="$t('merchantList.source')" prop="nickName">
            <el-input v-model="temp.nickName" style="width: 199px;"/>
          </el-form-item>
          <el-form-item :label="$t('merchantList.cellPhone')" prop="phone">
            <el-input v-model="temp.phone" style="width: 199px;"/>
          </el-form-item>
          <el-form-item :label="$t('merchantList.email')" prop="email">
            <el-input v-model="temp.email" style="width: 199px;"/>
          </el-form-item>
          <el-form-item :label="$t('merchantList.contactAddress')" prop="address">
            <el-input v-model="temp.address" style="width: 199px;"/>
          </el-form-item>
        </div>
        <div>
          <el-form-item :label="$t('merchantList.identificationNum')" label-width="120px" prop="legalIdNumber">
            <el-input v-model="temp.legalIdNumber" style="width: 199px;"/>
          </el-form-item>
          <el-form-item :label="$t('merchantList.businessPermits')" label-width="120px" prop="businessLicense">
            <el-input v-model="temp.businessLicense" style="width: 199px;"/>
          </el-form-item>
          <el-form-item :label="$t('merchantList.accountPermits')" label-width="120px" prop="openLicense">
            <el-input v-model="temp.openLicense" style="width: 199px;"/>
          </el-form-item>
          <el-form-item :label="$t('merchantList.testAccount')" label-width="120px" prop="extendDesc">
            <el-input v-model="temp.extendDesc" type="textarea" style="width: 199px;"/>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="btnLoading" type="primary" @click="addMerchants">{{ $t('order.confirm') }}</el-button>
        <el-button @click="dialogFormVisibleNew = false">{{ $t('order.cancel') }}</el-button>
      </div>
    </el-dialog>

    <!--查看详情框-->
    <el-dialog :visible.sync="dialogFormVisible" :close-on-click-modal="false" :title="textMap[dialogStatus]">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="99px"
        style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('merchantList.merchantID')">
          <el-input v-model="temp.id" style="width: 250px;" disabled/>
        </el-form-item>
        <el-form-item :label="$t('merchantList.merchantName')">
          <el-input v-model="temp.nickName" style="width: 250px;" disabled/>
        </el-form-item>
        <el-form-item :label="$t('merchantList.merchantStatus')">
          <el-tag :type="temp.state | orderStatusTagTypeFilter ">
            {{ temp.state | orderStatusFilter }}
          </el-tag>
        </el-form-item>
        <el-form-item :label="$t('merchantList.belongAgent')">
          <el-input v-model="temp.agentId" style="width: 250px;" disabled/>
        </el-form-item>
        <el-form-item :label="$t('merchantList.cellPhone')">
          <el-input v-model="temp.phone" style="width: 250px;" disabled/>
        </el-form-item>
        <el-form-item :label="$t('merchantList.email')">
          <el-input v-model="temp.email" style="width: 250px;" disabled/>
        </el-form-item>
        <el-form-item :label="$t('merchantList.testAccount')">
          <el-input v-model="temp.extendDesc" type="textarea" style="width: 250px;" disabled/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('order.confirm') }}</el-button>
      </div>
    </el-dialog>

    <!--// 修改功能-->
    <el-dialog :visible.sync="dialogFormVisibleUpdate" :title="textMap[dialogStatus]">
      <el-form
        ref="updateDataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="99px"
        style="width: 400px; margin-left:50px;display: flex">
        <div>
          <el-form-item :label="$t('merchantList.merchantName')" label-width="120px" prop="nickName">
            <el-input v-model="temp.nickName" disabled style="width: 250px;"/>
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
          <el-form-item :label="$t('merchantList.testAccount')" label-width="120px" prop="extendDesc">
            <el-input v-model="temp.extendDesc" type="textarea" style="width: 250px;"/>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateMerchants">{{ $t('order.confirm') }}</el-button>
        <el-button @click="dialogFormVisibleUpdate = false">{{ $t('order.cancel') }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
// import { createOrder, fetchList, fetchPv, updateOrder } from '@/api/common/order'
import { fetchList, addMerchant, updateMerchant } from '@/api/agency/merchantManage'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { Message } from 'element-ui'
import DragDialog from '@/view/common/dragDialog'

const orderStatusOptions = [
  { auditState: 0, display_name: '待审核' },
  { auditState: 1, display_name: '启用中' },
  { auditState: 2, display_name: '已停用' },
  { auditState: 3, display_name: '审核驳回' }
]

const statusMap = {
  0: '',
  1: 'success',
  2: 'danger',
  3: 'warning'
}

// calendarTypeKeyValue
// arr to obj ,such as { CN : "China", US : "USA" }
const orderStatusKeyValue = orderStatusOptions.reduce((acc, cur) => {
  acc[cur.auditState] = cur.display_name
  return acc
}, {})

export default {
  name: 'PlatformMerchant',
  components: { DragDialog, Pagination },
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
        // console.log(reg.test(value))
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    return {
      rules: {
        nickName: [
          { required: true, message: '请输入商户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        phone: [
          { validator: checkPhone, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ],
        extendDesc: [
          { required: true, message: '请输入下游平台测试账号', trigger: 'blur' }
        ],
        legalIdNumber: [
          { required: true, message: '请输入身份证号码', trigger: 'blur' },
          { pattern: /\d{17}[\d|x]|\d{15}/, message: '身份证号码不正确', trigger: 'blur' }
        ],
        businessLicense: [
          { required: true, message: '请输入营业许可证号码', trigger: 'blur' },
          { pattern: /[1-9]\d*/, message: '开户许可证号码为数字值', trigger: 'blur' },
          { max: 18, message: '营业许可证号码规格不正确', trigger: 'blur' }
        ],
        openLicense: [
          { required: true, message: '请输入开户许可证号码', trigger: 'blur' },
          { pattern: /[1-9]\d*/, message: '开户许可证号码为数字值', trigger: 'blur' },
          { max: 18, message: '开户许可证号码规格不正确', trigger: 'blur' }
        ],
        openUserName: [
          { required: true, message: '请输入开户人姓名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        bankNo: [
          { required: true, message: '请输入银行卡号', trigger: 'blur' },
          { pattern: /[1-9]\d*/, message: '银行卡号为数字值', trigger: 'blur' },
          { max: 16, message: '银行卡号不正确', trigger: 'blur' }
        ]
      },
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: false,
      qishiDate: '',
      bankCopy: {},
      bankList: [],
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        minAmount: undefined,
        maxAmount: undefined,
        merId: undefined,
        agentId: undefined,
        nickName: undefined,
        state: undefined,
        startDate: '',
        endDate: ''
      },
      statusOptions: orderStatusOptions,
      orderStatusOptions,
      statusMap,
      temp: {
        id: undefined,
        extendDesc: undefined,
        legalIdNumber: undefined,
        bankNo: undefined,
        businessLicense: undefined,
        openUserName: undefined,
        openLicense: undefined,
        nickName: undefined,
        agentId: undefined,
        email: undefined,
        phone: undefined,
        bankCode: undefined,
        code: undefined,
        auditState: undefined,
        state: undefined,
        usableAmount: undefined,
        ratio: undefined,
        source: undefined,
        cellPhone: undefined,
        testAccount: undefined,
        businessPermits: undefined,
        identificationNum: undefined,
        accountPermits: undefined,
        accountName: undefined,
        bankNum: undefined,
        contactAddress: undefined,
        chooseBank: undefined
      },
      dialogFormVisible: false,
      dialogFormVisibleNew: false,
      dialogFormVisibleUpdate: false,
      dialogStatus: '',
      textMap: {
        details: '查看',
        amend: '修改',
        find: 'Find'
      },
      btnLoading: false,
      dialogPvVisible: false,
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 平台商户查询-------
    getList() {
      this.listLoading = true
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
        this.listQuery.startDate = parseTime(this.qishiDate[0], '{y}-{m}-{d} {h}:{i}:{s}')
        this.listQuery.endDate = parseTime(this.qishiDate[1], '{y}-{m}-{d} {h}:{i}:{s}')
      } else {
        this.listQuery.endDate = ''
        this.listQuery.startDate = ''
      }
    },
    // 添加商户
    addMerchants() {
      this.$refs['addDataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          addMerchant({
            nickName: this.temp.nickName,
            phone: this.temp.phone,
            email: this.temp.email,
            address: this.temp.address,
            extendDesc: this.temp.extendDesc,
            legalIdNumber: this.temp.legalIdNumber,
            businessLicense: this.temp.businessLicense,
            openLicense: this.temp.openLicense,
            bankCode: this.bankCopy.code,
            bankName: this.bankCopy.name,
            openUserName: this.temp.openUserName,
            bankNo: this.temp.bankNo
          }).then(response => {
            if (response === 1) {
              this.$message({
                message: '添加商户成功',
                type: 'success'
              })
              this.dialogFormVisibleNew = false
              setTimeout(() => {
                this.btnLoading = false
              }, 500)
            }
            this.getList()
          }).catch(err => {
            Message.error(err)
            this.btnLoading = false
            this.listLoading = false
          })
        } else return false
      })
    },
    // 修改商户信息
    updateMerchants() {
      this.$refs['updateDataForm'].validate((valid) => {
        if (valid) {
          updateMerchant({
            merId: this.temp.id,
            nickName: this.temp.nickName,
            phone: this.temp.phone,
            email: this.temp.email,
            address: this.temp.address,
            extendDesc: this.temp.extendDesc,
            legalIdNumber: this.temp.legalIdNumber,
            businessLicense: this.temp.businessLicense,
            openLicense: this.temp.openLicense,
            bankCode: this.bankCopy.code,
            bankName: this.bankCopy.name,
            openUserName: this.temp.openUserName,
            bankNo: this.temp.bankNo
          }).then(() => {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.dialogFormVisibleUpdate = false

            this.getList()
          }).catch(err => {
            Message.error(err)
            this.listLoading = false
          })
        } else return false
      })
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    newCreated() {
      for (const key in this.temp) {
        this.temp[key] = ''
      }
      // 1.弹框模式
      this.dialogFormVisibleNew = true
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    handleDetails(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'details'
      this.dialogFormVisible = true
    },
    handleAmend(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'amend'
      this.dialogFormVisibleUpdate = true
    }
  }
}
</script>

<style scoped>
  .inquire-style .el-form-item {
    margin-bottom: 0;
  }
  .filter-container .orderAmount .el-col-2 {
    width: 10px;
    margin: auto 10px;
  }
</style>

