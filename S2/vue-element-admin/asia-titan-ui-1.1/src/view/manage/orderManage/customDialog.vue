<template>
  <div class="custom-dialog">
    <el-dialog :visible="dialogStatus" :title="dialogTitle[dialogType]" :close-on-click-modal="false" width="1000px" @close="dialogStatus = false">
      <!-- 查看订单状态 -->
      <el-form v-if="dialogType === 0" :inline="true" label-position="right" label-width="140px" class="demo-form-inline">
        <el-form-item label="代理昵称 / 商户ID:">
          <span>{{ detailData.agentName }} / {{ detailData.merId }}</span>
        </el-form-item>
        <el-form-item label="平台订单号:">
          <span>{{ detailData.orderNo }}</span>
        </el-form-item>
        <el-form-item label="商户订单号:">
          <span>{{ detailData.merOrderNo }}</span>
        </el-form-item>
        <el-form-item label="通道信息:">
          <span>{{ detailData.channelAccountNo }} / {{ detailData.channelAccountName }}</span>
        </el-form-item>
        <el-form-item label="金额:">
          <span>{{ detailData.orderAmount }}</span>
        </el-form-item>
        <el-form-item label="手续费:">
          <span>{{ detailData.merCommission }}</span>
        </el-form-item>
        <el-form-item label="银行:">
          <span>{{ detailData.bankName }}</span>
        </el-form-item>
        <el-form-item v-if="payType" label="银行卡号:">
          <span>{{ detailData.bankAccountNo }}</span>
        </el-form-item>
        <el-form-item v-if="payType" label="持卡人姓名:">
          <span>{{ detailData.bankUserName }}</span>
        </el-form-item>
        <el-form-item label="创建时间:">
          <span>{{ (detailData.createDate || '') | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </el-form-item>
        <el-form-item label="完成时间:">
          <span>{{ (detailData.receiveNotifyDate || '') | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </el-form-item>
        <el-form-item label="业务:">
          <span>{{ detailData.orderSource===2?'web':'api' }}</span>
        </el-form-item>
        <el-form-item label="状态:">
          <el-tag v-if="payType" :type="detailData.orderState === 2 ? 'success' : 'danger'">
            {{ detailData.orderState | getOrderState }}
          </el-tag>
          <el-tag v-else :type="detailData.orderState === 1 ? 'success' : 'danger'">
            {{ detailData.orderState | getpayOrderState }}
          </el-tag>
        </el-form-item>
        <el-form-item label="通知状态:">
          <el-tag v-if="payType" :type="detailData.notifyState === 1? 'success' : 'danger'">
            {{ detailData.notifyState === 0 ? '未通知' : '通知成功' }}
          </el-tag>
          <el-tag v-else :type="detailData.noticeState === 0 ? 'danger' : 'success'">
            {{ detailData.noticeState === 0 ? '未通知' : '通知成功' }}
          </el-tag>
        </el-form-item>
        <el-form-item v-if="!payType" label="备注:">
          <span>{{ detailData.orderRemarks }}</span>
        </el-form-item>
        <!-- 上游信息列表 -->
        <el-table :data="statusList" :key="dialogType">
          <el-table-column property="createDate" label="创建日期" align="center" min-width="100px">
            <template slot-scope="scope">
              <span v-if="scope.row.currentTime">{{ scope.row.currentTime }}</span>
              <span v-else>{{ scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>
          <el-table-column property="message" label="上游消息" align="center"/>
          <el-table-column property="code" label="上游编码" align="center"/>
          <el-table-column property="resData" label="上游数据" align="center" width="210px">
            <template slot-scope="scope">
              <el-input v-model="scope.row.resData" disabled type="textarea" style="width: 200px;" />
            </template>
          </el-table-column>
          <el-table-column property="opertorType" label="操作类型" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.opertorType | getOpertorType }}</span>
            </template>
          </el-table-column>
          <el-table-column property="parsedState" label="上游状态" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.parsedState === 'SUCCEEDED' ? 'success' : 'danger'">
                {{ scope.row.parsedState | getStatus }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="statusData.total>0"
          :total="statusData.total"
          :page.sync="statusData.pageNo"
          :limit.sync="statusData.pageSize"
          @pagination="getResultRecord"/>
      </el-form>

      <!-- 补单 -->
      <el-form v-if="dialogType === 1" label-position="right" label-width="120px">
        <el-form-item label="平台订单号:">
          <span>{{ orderNo }}</span>
        </el-form-item>
        <el-form-item label="补单备注:">
          <el-input v-model="budang.remarks" type="textarea" style="width: 220px;" />
        </el-form-item>
      </el-form>

      <!-- 审核订单 -->
      <el-form v-if="dialogType === 2" label-position="right" label-width="120px">
        <el-form-item label="平台订单号:">
          <span>{{ orderNo }}</span>
        </el-form-item>
        <el-form-item label="审核状态:">
          <el-select v-model="examine.auditResult" clearable style="width: 160px">
            <el-option value="1" label="通过"/>
            <el-option value="2" label="驳回"/>
          </el-select>
        </el-form-item>
        <el-form-item label="审核备注:">
          <el-input v-model="examine.remarks" type="textarea" style="width: 220px;" />
        </el-form-item>
        <el-table :data="examineList" :key="dialogType">
          <el-table-column property="createDate" label="创建日期" align="center" min-width="120px">
            <template slot-scope="scope">
              <span>{{ scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>
          <el-table-column property="auditUser" label="审核人" align="center"/>
          <el-table-column property="auditResult" label="审核结果" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.auditResult === 1 ? '通过' : '驳回' }}</span>
            </template>
          </el-table-column>
          <el-table-column property="auditLevel" label="审核登记" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.auditLevel === 1 ? '一审' : '二审' }}</span>
            </template>
          </el-table-column>
          <el-table-column property="auditType" label="类型" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.auditType === 1 ? '代付审核' : '补单审核' }}</span>
            </template>
          </el-table-column>
          <el-table-column property="auditRemarks" label="备注" align="center"/>
        </el-table>
      </el-form>

      <!-- 冻结订单 -->
      <el-form v-if="dialogType === 3" label-position="right" label-width="120px">
        <el-form-item label="平台订单号:">
          <span>{{ orderNo }}</span>
        </el-form-item>
        <el-form-item label="倍数:">
          <el-input value="1倍" disabled style="width: 220px;" />
        </el-form-item>
        <el-form-item label="冻结备注:">
          <el-input v-model="frozen.frezeeRemarks" type="textarea" style="width: 220px;" />
        </el-form-item>
        <el-table :data="frozenList" :key="dialogType">
          <el-table-column property="createDate" label="创建日期" align="center" min-width="120px">
            <template slot-scope="scope">
              <span>{{ scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>
          <el-table-column property="businessNo" label="业务订单号" align="center" min-width="100px"/>
          <el-table-column property="amount" label="操作金额" align="center"/>
          <el-table-column property="multiple" label="倍数" align="center"/>
          <el-table-column property="opRemarks" label="备注" align="center"/>
          <el-table-column property="frezeeType" label="类型" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.frezeeType === 1 ? '冻结' : '解冻' }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-form>

      <!-- 解冻订单 -->
      <el-form v-if="dialogType === 4" label-position="right" label-width="120px">
        <el-form-item label="平台订单号:">
          <span>{{ orderNo }}</span>
        </el-form-item>
        <el-form-item label="倍数:">
          <el-input value="1倍" disabled style="width: 220px;" />
        </el-form-item>
        <el-form-item label="解冻备注:">
          <el-input v-model="thaw.unfrezeeRemarks" type="textarea" style="width: 220px;" />
        </el-form-item>
        <el-table :data="frozenList" :key="dialogType">
          <el-table-column property="createDate" label="创建日期" align="center" min-width="120px">
            <template slot-scope="scope">
              <span>{{ scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>
          <el-table-column property="businessNo" label="业务订单号" align="center" min-width="100px"/>
          <el-table-column property="amount" label="操作金额" align="center"/>
          <el-table-column property="multiple" label="倍数" align="center"/>
          <el-table-column property="opRemarks" label="备注" align="center"/>
          <el-table-column property="frezeeType" label="类型" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.frezeeType === 1 ? '冻结' : '解冻' }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-form>

      <!-- 代付退款 -->
      <el-form v-if="dialogType === 5" label-position="right" label-width="120px">
        <el-form-item label="平台订单号:">
          <span>{{ orderNo }}</span>
        </el-form-item>
        <el-form-item label="退款备注:">
          <el-input v-model="refund.auditRemarks" type="textarea" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="通道信息:">
          <span>{{ detailData.channelAccountNo }} / {{ detailData.channelAccountName }}</span>
        </el-form-item>
        <el-form-item label="银行卡号:">
          <span>{{ detailData.bankAccountNo }}</span>
        </el-form-item>
        <el-form-item label="持卡人姓名:">
          <span>{{ detailData.bankUserName }}</span>
        </el-form-item>
        <el-form-item label="创建时间:">
          <span>{{ (detailData.createDate || '') | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </el-form-item>
        <el-form-item label="完成时间:">
          <span>{{ (detailData.receiveNotifyDate || '') | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </el-form-item>
        <el-form-item label="状态:">
          <el-tag :type="detailData.orderState === 2 ? 'success' : 'danger'">
            {{ detailData.orderState | getOrderState }}
          </el-tag>
        </el-form-item>
        <el-form-item label="上游消息:" class="up-news">
          <span>{{ obj.message }}</span>
        </el-form-item>
      </el-form>

      <!-- 代付审核退款 -->
      <el-form v-if="dialogType === 6" :inline="true" label-position="right" label-width="140px" class="demo-form-inline">
        <el-form-item label="平台订单号:">
          <span>{{ orderNo }}</span>
        </el-form-item>
        <el-form-item label="审核状态:">
          <el-select v-model="repayExamine.auditResult" clearable style="width: 160px">
            <el-option value="1" label="通过"/>
            <el-option value="2" label="驳回"/>
          </el-select>
        </el-form-item>
        <el-form-item label="审核备注:">
          <el-input v-model="repayExamine.auditRemarks" type="textarea" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="通道信息:">
          <span>{{ detailData.channelAccountNo }} / {{ detailData.channelAccountName }}</span>
        </el-form-item>
        <el-form-item label="银行卡号:">
          <span>{{ detailData.bankAccountNo }}</span>
        </el-form-item>
        <el-form-item label="持卡人姓名:">
          <span>{{ detailData.bankUserName }}</span>
        </el-form-item>
        <el-form-item label="创建时间:">
          <span>{{ (detailData.createDate || '') | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </el-form-item>
        <el-form-item label="完成时间:">
          <span>{{ (detailData.receiveNotifyDate || '') | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </el-form-item>
        <el-form-item label="状态:">
          <el-tag :type="detailData.orderState === 2 ? 'success' : 'danger'">
            {{ detailData.orderState | getOrderState }}
          </el-tag>
        </el-form-item>
        <el-form-item label="上游消息:" class="up-news">
          <span>{{ obj.message }}</span>
        </el-form-item>
        <el-table :data="examineList" :key="dialogType">
          <el-table-column property="createDate" label="创建日期" align="center" min-width="120px">
            <template slot-scope="scope">
              <span>{{ scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>
          <el-table-column property="auditUser" label="审核人" align="center"/>
          <el-table-column property="auditResult" label="审核结果" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.auditResult === 1 ? '通过' : '驳回' }}</span>
            </template>
          </el-table-column>
          <el-table-column property="auditLevel" label="审核登记" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.auditLevel === 1 ? '一审' : '二审' }}</span>
            </template>
          </el-table-column>
          <el-table-column property="auditType" label="类型" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.auditType === 1 ? '代付审核' : '退款审核' }}</span>
            </template>
          </el-table-column>
          <el-table-column property="auditRemarks" label="备注" align="center"/>
        </el-table>
      </el-form>

      <!-- 查看审核记录 -->
      <el-form v-if="dialogType === 7" label-position="right" label-width="120px">
        <el-table :data="examineList" :key="dialogType">
          <el-table-column property="createDate" label="创建日期" align="center" min-width="120px">
            <template slot-scope="scope">
              <span>{{ scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>
          <el-table-column property="auditUser" label="审核人" align="center"/>
          <el-table-column property="auditResult" label="审核结果" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.auditResult === 1 ? '通过' : '驳回' }}</span>
            </template>
          </el-table-column>
          <el-table-column property="auditLevel" label="审核登记" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.auditLevel === 1 ? '一审' : '二审' }}</span>
            </template>
          </el-table-column>
          <el-table-column property="auditType" label="类型" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.auditType === 1 ? '代付审核' : '退款审核' }}</span>
            </template>
          </el-table-column>
          <el-table-column property="auditRemarks" label="备注" align="center"/>
        </el-table>
      </el-form>
      <!-- 操作按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogStatus = false">取 消</el-button>
        <el-button v-if="dialogType !== 0" @click="allConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { getOrderStatus, getBudang, getExamine, getFrozen, getThaw, getFrozenList, getExamineList, getResultRecord } from '@/api/manage/orderManage/payOrder'
import { getRefund, getRepayExamine, getRepayStatus, getCompleteBankAccount } from '@/api/manage/orderManage/withdrawList'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  filters: {
    getStatus(key) {
      var obj = { SUCCEEDED: '成功', PROCESSING: '处理中', FAILED: '失败', NOT_FOUND: '不存在', INVALID_SIGNATURE: '签名错误', ERROR: '异常' }
      return obj[key]
    },
    getpayOrderState(key) {
      const obj = { '-1': '预下单', '0': '待支付', '1': '支付成功', '2': '支付失败', '3': '支付成功(已冻结)', '4': '补单中' }
      return obj[key + '']
    },
    getOrderState(key) {
      const obj = { '1': '处理中', '2': '成功', '3': '失败待退款', '4': '失败已退款', '5': '退款待审核' }
      return obj[key + '']
    },
    getOpertorType(key) {
      const obj = { '1': '查询', '2': '回调', '3': '同步', '4': '返回' }
      return obj[key + '']
    },
    parseTime
  },
  data() {
    return {
      dialogTitle: ['查看订单状态', '补单申请', '审核订单', '冻结订单', '解冻订单', '退款申请', '审核订单', '审核记录'],
      dialogFunc: ['', 'budangSure', 'examineSure', 'frozenSure', 'thawSure', 'refundSure', 'repayExamineSure'],
      dialogStatus: false,
      dialogType: '',
      payType: '',
      orderId: '',
      orderNo: '',
      detailData: {
        bankAccountNo: ''
      },
      obj: {
        code: '',
        data: '',
        message: '',
        status: ''
      },
      budang: {
        remarks: ''
      },
      examine: {
        remarks: '',
        auditResult: ''
      },
      frozen: {
        multiple: '1',
        frezeeRemarks: ''
      },
      thaw: {
        multiple: '1',
        unfrezeeRemarks: ''
      },
      refund: {
        auditRemarks: ''
      },
      repayExamine: {
        auditRemarks: '',
        auditResult: ''
      },
      frozenList: [],
      examineList: [],
      statusList: [],
      statusData: {
        total: 0,
        pageNo: 1,
        pageSize: 10,
        businessNo: ''
      }
    }
  },
  methods: {
    setDialog(obj, value, payType) {
      this.dialogType = value
      this.payType = payType
      this.orderNo = obj.orderNo
      this.orderId = obj.id
      if (value === 0 || value === 5 || value === 6) {
        this.getStatusDate(obj, payType)
      }
      if (value === 3 || value === 4) {
        getFrozenList({ orderNo: obj.orderNo }).then(response => {
          this.frozenList = response.list
        })
      }
      if (value === 2 || value === 6 || value === 7) {
        getExamineList({ orderNo: obj.orderNo }).then(response => {
          this.examineList = response.list
        })
      }
      this.dialogStatus = true
    },
    async getStatusDate(obj, payType) {
      this.detailData = Object.assign({}, obj)
      if (payType) { // 此处为代付
        // 请求完整银行卡号
        getCompleteBankAccount(obj.id).then((res) => {
          this.detailData.bankAccountNo = res.bankAccountNo
        })
        await getRepayStatus({ orderId: obj.id }).then(response => {
          for (var key in this.obj) {
            this.obj[key] = response[key]
          }
        })
      } else {
        await getOrderStatus({ orderId: obj.id }).then(response => {
          for (var key in this.obj) {
            this.obj[key] = response[key]
          }
        })
      }
      if (this.dialogType === 0) {
        this.statusData.businessNo = obj.orderNo
        this.getResultRecord()
      }
    },
    getResultRecord() {
      getResultRecord(this.statusData).then(response => {
        if (this.statusData.pageNo === 1) {
          response.list.unshift({ currentTime: '当前', message: this.obj.message, parsedState: this.obj.status, resData: this.obj.data, code: this.obj.code, opertorType: '1' })
        }
        this.statusData.total = response.total
        this.statusList = response.list
      })
    },
    operationSuccess(tipTxt, type) {
      this.$emit('dialogResult', type)
      this.$message.success(tipTxt)
      this.dialogStatus = false
    },
    allConfirm() {
      // 封装调用
      this[this.dialogFunc[this.dialogType]]()
    },
    budangSure() {
      if (!this.budang.remarks) {
        this.$message.error('请填写备注')
        return
      }
      this.budang.orderId = this.orderId
      getBudang(this.budang).then(response => {
        this.operationSuccess('申请成功', 'getList')
      })
    },
    examineSure() {
      if (!this.examine.remarks || !this.examine.auditResult) {
        this.$message.error('请选择审核状态并填写备注')
        return
      }
      this.examine.orderId = this.orderId
      getExamine(this.examine).then(response => {
        this.operationSuccess('审核成功', 'getList')
      })
    },
    frozenSure() {
      if (!this.frozen.frezeeRemarks) {
        this.$message.error('请填写备注')
        return
      }
      this.frozen.orderId = this.orderId
      getFrozen(this.frozen).then(response => {
        this.operationSuccess('冻结成功', 'getList')
      })
    },
    thawSure() {
      if (!this.thaw.unfrezeeRemarks) {
        this.$message.error('请填写备注')
        return
      }
      this.thaw.orderId = this.orderId
      getThaw(this.thaw).then(response => {
        this.operationSuccess('解冻成功', 'getList')
      })
    },
    // 代付逻辑
    refundSure() {
      if (!this.refund.auditRemarks) {
        this.$message.error('请填写备注')
        return
      }
      this.refund.orderId = this.orderId
      getRefund(this.refund).then(response => {
        this.operationSuccess('退款申请成功', 'getList')
      })
    },
    repayExamineSure() {
      if (!this.repayExamine.auditRemarks || !this.repayExamine.auditResult) {
        this.$message.error('请选择审核状态并填写备注')
        return
      }
      this.repayExamine.orderId = this.orderId
      getRepayExamine(this.repayExamine).then(response => {
        this.operationSuccess('审核成功', 'getList')
      })
    }
  }
}
</script>

<style>
  .custom-dialog .el-form--inline .el-form-item{
    width: 49.5%;
    margin-right: 0;
  }
  .custom-dialog .up-news .el-form-item__content{
    max-width: 66%;
  }
</style>
