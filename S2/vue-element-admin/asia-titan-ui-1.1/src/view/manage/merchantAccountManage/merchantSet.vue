<template>
  <div class="withdraw-list app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-form-item label="平台商户ID">
        <el-input v-model.number="listQuery.id" clearable placeholder="平台商户ID" style="width: 250px;" @keyup.enter.native="refreshList"/>
      </el-form-item>
      <el-form-item label="平台商户名称">
        <el-input v-model="listQuery.nickName" clearable placeholder="平台商户名称" style="width: 250px;" @keyup.enter.native="refreshList" />
      </el-form-item>
      <el-form-item label="代理ID">
        <!-- <el-input v-model.number="listQuery.agentId" clearable placeholder="代理ID" style="width: 250px;" @keyup.enter.native="refreshList"/> -->
        <el-select v-model="listQuery.agentId" clearable style="width: 160px">
          <el-option v-for="item in agentIds" :label="item.nickName" :value="item.id" :key="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="有接口权限">
        <!-- <el-input v-model.number="listQuery.interfacePermission" clearable placeholder="代理ID" style="width: 250px;" @keyup.enter.native="refreshList"/> -->
        <el-select v-model="listQuery.interfacePermission" clearable style="width: 160px">
          <el-option v-for="item in permissionList" :value="item.value" :label="item.label" :key="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="无接口权限">
        <!-- <el-input v-model.number="listQuery.interfacePermission" clearable placeholder="代理ID" style="width: 250px;" @keyup.enter.native="refreshList"/> -->
        <el-select v-model="listQuery.nonInterfacePermission" clearable style="width: 160px">
          <el-option v-for="item in permissionList" :value="item.value" :label="item.label" :key="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="listQuery.state" clearable style="width: 160px">
          <el-option value="" label="全部">全部</el-option>
          <el-option :value="1" label="启用">启用</el-option>
          <el-option :value="2" label="停用">停用</el-option>
        </el-select>
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
      <el-button v-waves class="filter-item" type="primary" @click="refreshList">{{ $t('table.search') }}</el-button>
      <el-button v-handle="add" v-waves class="filter-item" type="primary" @click="newCreated">{{ $t('table.add') }}</el-button>
      <br>
      <el-form-item v-handle="balAmount" label="商户可用余额:">
        <span class="header-title">{{ statisticsData.sumBalanceAmount }}</span>
      </el-form-item>
      <el-form-item v-handle="freezeAmount" label="商户冻结金额:">
        <span class="header-title">{{ statisticsData.sumFreezeAmount }}</span>
      </el-form-item>
      <el-form-item v-handle="rechargeAmount" label="商户总交易金额:">
        <span class="header-title">{{ statisticsData.sumRechargeAmount }}</span>
      </el-form-item>
      <el-form-item v-handle="withdrawAmount" label="总代付金额:">
        <span class="header-title">{{ statisticsData.sumWithdrawAmount }}</span>
      </el-form-item>
    </el-form>
    <el-table v-loading="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="平台商户ID" prop="id" align="center"/>
      <el-table-column label="平台商户名称" prop="nickName" align="center"/>
      <el-table-column label="代理ID / 代理名称" prop="agentId" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.agentId }} / {{ scope.row.agentNickName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总收益金额" prop="rechargeAmount" align="center" width="100"/>
      <el-table-column label="可用金额" prop="totalAmount" align="center" class-name="sum-money" width="100"/>
      <el-table-column label="提现金额" prop="withdrawAmount" align="center" width="100"/>
      <el-table-column label="冻结金额" prop="freezeAmount" align="center" width="100"/>
      <!--<el-table-column label="代理名称" prop="agentNickName" align="center"/>-->
      <el-table-column label="状态" prop="state" align="center">
        <template slot-scope="scope">
          <!--<span>{{ scope.row.state | getTradeType }}</span>-->
          <el-tag :type="scope.row.state | orderStatusTagTypeFilter ">
            {{ scope.row.state | orderStatusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="接口权限" prop="interfacePermission" align="center">
        <template slot-scope="scope">
          <div v-for="vv in scope.row.interfacePermission.split(',')" :key="vv">{{ vv | permissionListFilter }}</div>
        </template>
      </el-table-column>
      <el-table-column label="商户类型" prop="merType" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.merType === 1 ? '普通商户' : '虚拟商户' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" prop="email" align="center"/>
      <el-table-column label="创建时间" prop="createDate" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('merchantList.operation')" align="center" width="250px">
        <template slot-scope="scope">
          <el-button v-handle="setBtn" type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('merchantList.set') }}</el-button>
          <el-button v-handle="resetBtn" type="success" size="mini" @click="handleReset(scope.row)">{{ $t('merchantList.reset') }}</el-button>
          <el-button v-handle="unlockAccount" v-if="scope.row.lockFlag===2" type="danger" size="mini" @click="unLock(scope.row)">{{ $t('merchantList.unlock') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <!--添加-->
    <el-dialog :visible.sync="dialogFormVisibleAdd" :close-on-click-modal="false" title="添加商户">
      <el-form
        ref="addDataForm"
        :model="addDialogData"
        :rules="rules"
        label-position="right"
        label-width="120px"
        style="width: 400px; margin-left:50px;display: flex">
        <div style="margin-right: 100px">
          <el-form-item :label="$t('merchantList.source')" prop="nickName">
            <el-input v-model="addDialogData.nickName" style="width: 199px;"/>
          </el-form-item>
          <el-form-item label="商户类型" prop="">
            <el-select v-model="addDialogData.merType">
              <el-option :value="1" label="普通商户">普通商户</el-option>
              <el-option :value="2" label="虚拟商户">虚拟商户</el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('merchantList.cellPhone')" prop="phone">
            <el-input v-model="addDialogData.phone" style="width: 199px;"/>
          </el-form-item>
          <el-form-item :label="$t('merchantList.email')" prop="email">
            <el-input v-model="addDialogData.email" style="width: 199px;"/>
          </el-form-item>
          <el-form-item :label="$t('merchantList.contactAddress')" prop="address">
            <el-input v-model="addDialogData.address" style="width: 199px;"/>
          </el-form-item>
        </div>

        <div>
          <el-form-item :label="$t('merchantList.identificationNum')" prop="legalIdNumber">
            <el-input v-model="addDialogData.legalIdNumber" style="width: 199px;"/>
          </el-form-item>
          <el-form-item :label="$t('merchantList.businessPermits')" prop="businessLicense">
            <el-input v-model="addDialogData.businessLicense" style="width: 199px;"/>
          </el-form-item>
          <el-form-item :label="$t('merchantList.accountPermits')" prop="openLicense">
            <el-input v-model="addDialogData.openLicense" style="width: 199px;"/>
          </el-form-item>
          <el-form-item :label="$t('merchantList.testAccount')" prop="extendDesc">
            <el-input v-model="addDialogData.extendDesc" type="textarea" style="width: 199px;"/>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">{{ $t('order.cancel') }}</el-button>
        <el-button type="primary" @click="addMerchants">{{ $t('order.confirm') }}</el-button>
      </div>
    </el-dialog>
    <!--重置-->
    <el-dialog :visible.sync="dialogFormVisibleReset" :close-on-click-modal="false" title="重置" width="40%">
      <el-form
        ref="dataFormReset"
        :rules="rules"
        :model="reset"
        label-position="right"
        label-width="150px"
        style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('merchantList.merchantID')">
          <el-input v-model="reset.id" style="width: 250px;" disabled/>
        </el-form-item>
        <el-form-item label="重置类型">
          <el-select v-model="reset.type" clearable style="width: 250px">
            <el-option :value="0" label="重置密码">重置密码</el-option>
            <el-option :value="1" label="重置支付密码">重置支付密码</el-option>
            <el-option :value="2" label="重置谷歌验证码">重置谷歌验证码</el-option>
            <el-option :value="3" label="重置验签秘钥">重置验签秘钥</el-option>
          </el-select>
        </el-form-item>
        <div v-if="reset.type == '3'">
          <div prop="items">
            <el-form-item label="秘钥类型">
              <el-select v-model="keyType" clearable style="width: 250px">
                <el-option :value="1" label="支付秘钥">支付秘钥</el-option>
                <el-option :value="2" label="代付秘钥">代付秘钥</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择需要重置的秘钥">
              <el-checkbox-group v-model="secretList" style="width: 330px">
                <el-checkbox label="merchant_key">商户公私钥</el-checkbox>
                <el-checkbox label="platform_key">平台公私钥</el-checkbox>
                <el-checkbox label="sign_key">签名秘钥</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
        </div>
        <el-form-item label="谷歌验证码">
          <el-input v-model="reset.googleVerificationCode" placeholder="请输入谷歌验证码" style="width: 250px;"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleReset = false">{{ $t('order.cancel') }}</el-button>
        <el-button type="primary" @click="resetMerchants">{{ $t('order.confirm') }}</el-button>
      </div>
    </el-dialog>

    <!--设置-->
    <el-dialog :visible.sync="dialogFormVisibleUpdate" :close-on-click-modal="false" title="设置" width="900px" top="5vh">
      <el-form
        ref="setDataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="130px"
        style="width: 500px; margin-left:50px;display: flex">
        <div>
          <el-form-item label="商户ID">
            <el-input v-model="temp.id" disabled style="width: 250px;"/>
          </el-form-item>
          <el-form-item label="商户名称" prop="nickName">
            <el-input v-model="temp.nickName" disabled style="width: 250px;"/>
          </el-form-item>
          <el-form-item label="代理名称">
            <el-input v-model="temp.agentNickName" disabled style="width: 250px;"/>
          </el-form-item>
          <el-form-item label="营业许可证号码" prop="businessLicense">
            <el-input v-model="temp.businessLicense" disabled style="width: 250px;"/>
          </el-form-item>
          <el-form-item label="法人身份证号码" prop="legalIdNumber">
            <el-input v-model="temp.legalIdNumber" disabled style="width: 250px;"/>
          </el-form-item>
          <el-form-item label="开户许可证号码" prop="openLicense">
            <el-input v-model="temp.openLicense" disabled style="width: 250px;"/>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="temp.phone" style="width: 250px;"/>
          </el-form-item>
          <el-form-item label="联系地址" prop="address">
            <el-input v-model="temp.address" disabled style="width: 250px;"/>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="temp.email" disabled style="width: 250px;"/>
          </el-form-item>
          <el-form-item label="反查地址">
            <el-input v-model="temp.reverseCheckAddress" style="width: 250px;"/>
          </el-form-item>
          <el-form-item label="代付限制IP">
            <el-input v-model="temp.remitPayBindIp" type="textarea" style="width: 250px;"/>
            <span style="color: red">多个IP之间以英文";"分隔</span>
          </el-form-item>
          <el-form-item label="登录限制IP">
            <el-input v-model="temp.loginBindIp" type="textarea" style="width: 250px;"/>
            <span style="color: red">多个IP之间以英文";"分隔</span>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="状态">
            <el-select
              v-model="temp.state"
              :placeholder="$t('merchantList.whole')"
              clearable
              style="width: 250px;margin-right: 20px"
              class="filter-item">
              <el-option
                v-for="item in statusOptions"
                :key="item.auditState"
                :label="item.display_name"
                :value="item.auditState"/>
            </el-select>
          </el-form-item>
          <el-form-item label="是否支持反查">
            <el-select
              v-model="temp.reverseCheck"
              :placeholder="$t('merchantList.whole')"
              clearable
              style="width: 250px;margin-right: 20px"
              class="filter-item">
              <el-option
                v-for="item in handStatusOptions"
                :key="item.handStatus"
                :label="item.display_name"
                :value="item.handStatus"/>
            </el-select>
          </el-form-item>
          <el-form-item label="是否开启转账功能">
            <el-select
              v-model="temp.transferState"
              :placeholder="$t('merchantList.whole')"
              clearable
              style="width: 250px;margin-right: 20px"
              class="filter-item">
              <el-option
                v-for="item in handStatusOptions"
                :key="item.handStatus"
                :label="item.display_name"
                :value="item.handStatus"/>
            </el-select>
          </el-form-item>
          <el-form-item label="下游平台网址及测试账号" prop="extendDesc">
            <el-input v-model="temp.extendDesc" type="textarea" style="width: 250px;"/>
          </el-form-item>
          <el-form-item label="是否通知商户：" label-width="140px">
            <el-switch
              v-model="temp.notifySwitch"
              :active-value="1"
              :inactive-value="2"
              active-text="通知"
              inactive-text="不通知"
              @change="changeValue"
            />
          </el-form-item>
          <el-form-item label="是否设置转出限制：" label-width="140px">
            <el-switch
              v-model="temp.bankLimitSwitch"
              :active-value="1"
              :inactive-value="2"
              active-text="是"
              inactive-text="否"
              @change="changeValue1"
            />
          </el-form-item>
          <el-form-item label="是否启用商户费率：" label-width="140px">
            <el-switch
              v-model="temp.rateEnable"
              active-text="是"
              inactive-text="否"/>
          </el-form-item>
          <div v-if="temp.rateEnable">
            <el-form-item prop="payRate" label="支付费率">
              <el-input v-model="temp.payRate" style="width: 250px;"><template slot="append">&nbsp;&nbsp;%&nbsp;&nbsp;</template></el-input>
            </el-form-item>
            <el-form-item prop="remitRate" label="代付费率">
              <el-input v-model="temp.remitRate" style="width: 250px;"><template slot="append">每笔</template></el-input>
            </el-form-item>
          </div>
          <el-form-item prop="dailyQuota" label="日限额">
            <el-input v-model="temp.dailyQuota" style="width: 250px;"/>
          </el-form-item>
          <el-form-item label="接口权限">
            <el-checkbox-group v-model="checkList" class="quanxian">
              <el-checkbox label="1">api支付提交</el-checkbox>
              <el-checkbox label="2">api代付提交</el-checkbox>
              <el-checkbox label="3">api支付查询</el-checkbox>
              <el-checkbox label="4">api代付查询</el-checkbox>
              <el-checkbox label="6">web支付</el-checkbox>
              <el-checkbox label="7">web代付</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="temp.remarks" type="textarea" style="width: 250px;"/>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleUpdate = false">{{ $t('order.cancel') }}</el-button>
        <el-button type="primary" @click="updateMerchants">{{ $t('order.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { fetchList, getMerchant, merchantUnLock, updateMerchant, restMerchant, accountStatistics, getAgentList } from '@/api/manage/merchantManage/merchantAccount'
import { addMerchant } from '@/api/manage/merchantManage/addMerchantApproval'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
// import { Message } from 'element-ui'
import DragDialog from '@/view/common/dragDialog'
const orderStatusOptions = [
  { auditState: 1, display_name: '启用' },
  { auditState: 2, display_name: '停用' }
]
const handStatusOptions = [
  { handStatus: false, display_name: '否' },
  { handStatus: true, display_name: '是' }
]
const permissionList = [
  { label: 'api支付提交', value: '1' },
  { label: 'api代付提交', value: '2' },
  { label: 'api支付查询', value: '3' },
  { label: 'api代付查询', value: '4' },
  { label: 'web支付', value: '6' },
  { label: 'web代付', value: '7' }
]
const statusMap = {
  0: '',
  1: 'success',
  2: 'danger',
  3: 'danger'
}
const handStatusMap = {
  0: 'info',
  1: 'warning'
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

export default {
  name: 'MerchantSet',
  components: { Pagination, DragDialog },
  directives: { waves },
  filters: {
    orderStatusTagTypeFilter(auditState) {
      return statusMap[auditState]
    },
    handStatusTagTypeFilter(orderStatus) {
      return handStatusMap[orderStatus]
    },
    handStatusFilter(type) {
      return handStatusKeyValue[type]
    },
    orderStatusFilter(type) {
      return orderStatusKeyValue[type]
    },
    permissionListFilter(value) {
      var curr = permissionList.filter(item => item.value === value)
      var obj = curr[0] || {}
      return obj.label
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
      add: 'manageMerchantAccount:merchantSet:add',
      setBtn: 'manageMerchantAccount:merchantSet:set',
      resetBtn: 'manageMerchantAccount:merchantSet:reset',
      balAmount: 'merchant:merchantSet:statistics:balAmount',
      freezeAmount: 'merchant:merchantSet:statistics:freezeAmount',
      rechargeAmount: 'merchant:merchantSet:statistics:rechargeAmount',
      withdrawAmount: 'merchant:merchantSet:statistics:withdrawAmount',
      unlockAccount: 'manageMerchantAccount:merchantSet:unLock',
      statisticsData: {},
      rules: {
        payRate: [
          { required: true, message: '支付费率不能为空' }
        ],
        remitRate: [
          { required: true, message: '支付费率不能为空' }
        ],
        dailyQuota: [
          { required: true, message: '支付费率不能为空' }
        ],
        nickName: [
          { required: true, message: '请输入商户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        businessLicense: [
          { required: true, message: '请输入营业许可证号码', trigger: 'blur' },
          { pattern: /[1-9]\d*/, message: '营业许可证号码为数字值', trigger: 'blur' }
        ],
        legalIdNumber: [
          { required: true, message: '请输入身份证号码', trigger: 'blur' },
          { pattern: /[1-9]\d*/, message: '身份证号码为18位之内的数值', trigger: 'blur' }
        ],
        openLicense: [
          { required: true, message: '请输入开户许可证号码', trigger: 'blur' },
          { pattern: /[1-9]\d*/, message: '开户许可证号码为数字值', trigger: 'blur' }
        ],
        phone: [
          { validator: checkPhone, trigger: 'blur' }
        ],
        openUserName: [
          { required: true, message: '请输入开户人姓名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        bankNo: [
          { required: true, message: '请输入银行卡号', trigger: 'blur' },
          { pattern: /[1-9]\d*/, message: '银行卡号为数字值', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' },
          { max: 25, message: '长度在25个字符之内', trigger: 'blur' }
        ],
        extendDesc: [
          { required: true, message: '请输入下游平台网址及测试账号', trigger: 'blur' }
        ]
      },
      tableKey: 0,
      isPay: '',
      payOrPaid: '',
      list: [],
      total: 0,
      bankCopy: {},
      listLoading: true,
      qishiDate: '',
      checkList: [],
      secretList: [],
      keyType: '',
      bankList: {},
      agentIds: [],
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        minAmount: undefined,
        maxAmount: undefined,
        id: '',
        state: '',
        nickName: '',
        interfacePermission: '',
        nonInterfacePermission: '',
        agentId: ''
      },
      permissionList: permissionList,
      detailData: {},
      dialogPvVisible: false,
      dialogFormVisiblePay: false,
      dialogFormVisibleUpdate: false,
      dialogFormVisibleReset: false,
      dialogFormVisibleAdd: false,
      statusOptions: orderStatusOptions,
      handStatusOptions,
      reset: {
        id: undefined,
        googleVerificationCode: undefined,
        type: undefined,
        restSecretList: []
      },
      unLockParams: {
        merchantId: null,
        remark: null
      },
      addDialogData: {
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
      temp: {
        notifySwitch: undefined,
        bankLimitSwitch: undefined,
        agentNickName: undefined,
        loginBindIp: undefined,
        rateEnable: false,
        id: undefined, //
        agentName: undefined, //
        extendDesc: undefined, //
        legalIdNumber: undefined, //
        bankNo: undefined, //
        businessLicense: undefined, //
        openUserName: undefined, //
        openLicense: undefined, //
        nickName: undefined, //
        agentId: undefined,
        email: undefined,
        phone: undefined, //
        bankCode: undefined, //
        bankName: undefined, //
        address: undefined, //
        code: undefined,
        auditState: undefined,
        state: undefined, //
        remitPayBindIp: undefined, //
        interfacePermission: undefined,
        reverseCheckAddress: undefined, //
        reverseCheck: undefined, //
        transferState: undefined, //
        payRate: undefined, //
        remitRate: undefined, //
        dailyQuota: undefined, //
        remarks: undefined,
        googleVerificationCode: undefined //
      }
    }
  },
  created() {
    getAgentList().then(response => {
      this.agentIds = response
    })
    this.getList()
    // this.accountStatistics()
    var getCodeList = localStorage.getItem('codeList')
    var myCodeList = getCodeList ? JSON.parse(getCodeList) : []
    if (myCodeList.indexOf('manageMerchantAccount:merchantSet:statistics:all') > -1) {
      this.accountStatistics()
    }
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
    accountStatistics() {
      accountStatistics(this.listQuery).then(data => {
        this.statisticsData = data
      })
    },
    // 添加
    addMerchants() {
      this.$refs['addDataForm'].validate((valid) => {
        if (valid) {
          addMerchant({
            nickName: this.addDialogData.nickName,
            phone: this.addDialogData.phone,
            email: this.addDialogData.email,
            address: this.addDialogData.address,
            extendDesc: this.addDialogData.extendDesc,
            legalIdNumber: this.addDialogData.legalIdNumber,
            businessLicense: this.addDialogData.businessLicense,
            openLicense: this.addDialogData.openLicense,
            bankCode: this.addDialogData.bankCode.code,
            bankName: this.addDialogData.bankCode.name,
            openUserName: this.addDialogData.openUserName,
            bankNo: this.addDialogData.bankNo,
            merType: this.addDialogData.merType
          }).then(() => {
            this.$message({
              message: '添加商户成功',
              type: 'success'
            })
            this.dialogFormVisibleAdd = false
            this.getList()
          })
        } else return false
      })
    },
    newCreated() {
      for (const key in this.temp) {
        this.addDialogData[key] = ''
      }
      this.dialogFormVisibleAdd = true
    },
    updateMerchants() {
      if (this.temp.reverseCheck && !this.temp.reverseCheckAddress) {
        this.$message.error('请填写反查地址')
        return
      }
      this.$refs['setDataForm'].validate((valid) => {
        if (valid) {
          this.temp.interfacePermission = this.checkList.join()
          updateMerchant(this.temp).then(() => {
            this.$message({
              message: '设置修改成功',
              type: 'success'
            })
            this.dialogFormVisibleUpdate = false
            this.getList()
          })
        } else return false
      })
    },
    refreshList() {
      this.listQuery.pageNo = 1
      this.getList()
      this.accountStatistics()
    },
    handleUpdate(row) {
      // this.temp = Object.assign({}, row) // copy obj
      getMerchant(row.id).then(data => {
        if (data.dailyQuota === -1) data.dailyQuota = ''
        this.temp = data
        if (!data.interfacePermission) {
          this.checkList = []
        } else {
          this.checkList = data.interfacePermission.split(',')
        }
        this.dialogFormVisibleUpdate = true
      })
    },
    handleReset(row) {
      this.reset.id = row.id
      this.dialogFormVisibleReset = true
      this.reset.googleVerificationCode = ''
    },
    unLock(row) {
      this.unLockParams.merchantId = row.id
      merchantUnLock(this.unLockParams).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        row.lockFlag = 1
      })
    },
    resetMerchants() {
      var err = ''
      var obj = JSON.parse(JSON.stringify(this.reset))
      if (obj.type === 3) {
        if (!this.keyType) err = '请选择密钥类型'
        if (!this.secretList.length) err = '请选择需要重置的秘钥'
      }
      if (!obj.googleVerificationCode) err = '请输入谷歌验证码'
      if (err) {
        this.$message.error(err)
        return
      }
      if (obj.type === 3) {
        obj.restSecretList = []
        this.secretList.forEach(item => {
          obj.restSecretList.push({ keyType: this.keyType, key: item })
        })
      }
      restMerchant(obj).then(() => {
        this.$message({
          message: '重置成功',
          type: 'success'
        })
        this.dialogFormVisibleReset = false
      })
    },
    handlePay(row) {
      this.payOrPaid = '支付'
      this.dialogFormVisiblePay = true
    },
    handlePaid(row) {
      this.payOrPaid = '代付'
      this.dialogFormVisiblePay = true
    },
    // 支付与代付
    paymentMerchants() {
      return
    },
    changeValue(val) {
      this.temp.notifySwitch = val
    },
    changeValue1(val) {
      this.temp.bankLimitSwitch = val
    }
  }
}
</script>

<style scoped>
  .quanxian .el-checkbox{
    margin-right: 10px;
  }
  .quanxian .el-checkbox+.el-checkbox{
    margin-left: 0;
  }
  .withdraw-list >>> .el-table--enable-row-hover .el-table__body .sum-money{
    /* background: #409EFF; */
    color: #409EFF;
    font-weight: bold;
  }
  .demo-form-inline .el-form-item .header-title {
    font-size: 24px;
    width: 200px;
    display: inline-block;
    color: #409EFF;
    font-weight: bold;
  }
  .demo-form-inline .orderAmount .el-col-2 {
    width: 10px;
    margin: auto 10px;
  }
</style>
