<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-form-item label="商户ID">
        <el-input v-model="listQuery.id" clearable style="width: 250px;" @keyup.enter.native="refreshList" />
      </el-form-item>
      <el-form-item label="商户名称">
        <el-input v-model="listQuery.nickName" clearable style="width: 250px;" @keyup.enter.native="refreshList" />
      </el-form-item>
      <el-form-item label="状态">
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
      <el-button v-waves class="filter-item" type="primary" @click="refreshList">{{ $t('table.search') }}</el-button>
      <!--<el-button v-handle="jiajiankuan" v-waves class="filter-item" type="success" @click="rechargeDialog">加减款</el-button>-->
      <el-button v-waves class="filter-item" style="float:right" type="success" @click="$router.push({ path: '/financeManage/virtualAccount' })">查看历史记录</el-button>
    </el-form>

    <el-table v-loading="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="虚拟商户ID" prop="id" align="center"/>
      <el-table-column label="虚拟商户名称" prop="nickName" align="center"/>
      <el-table-column label="可用金额" prop="totalAmount" align="center"/>
      <el-table-column label="提现金额" prop="withdrawAmount" align="center"/>
      <el-table-column label="状态" prop="state" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state | orderStatusTagTypeFilter ">
            {{ scope.row.state | orderStatusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createDate" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding">
        <template slot-scope="scope">
          <!--<el-button-->
          <!--v-handle="review"-->
          <!--:disabled="scope.row.status === 3 || scope.row.status === 4"-->
          <!--:type="scope.row.status === 3 || scope.row.status === 4 ? 'info' : 'success' "-->
          <!--size="mini"-->
          <!--@click="verifyDialog(scope.row)">-->
          <!--审核-->
          <!--</el-button>-->
          <el-button v-handle="jiajiankuan" v-waves class="filter-item" type="success" @click="rechargeDialog(scope.row)">加减款</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <!--添加商户充值弹框-->
    <el-dialog :visible.sync="dialogFormVisibleRecharge" :close-on-click-modal="false" title="充值" width="500px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="99px"
        style="width: 400px; margin-left:50px;">
        <el-form-item label="商户账号">
          <el-input v-model="temp.userName" style="width: 199px;" disabled/>
        </el-form-item>
        <el-form-item label="商户名称">
          <el-input v-model="temp.nickName" style="width: 199px;" disabled/>
        </el-form-item>
        <el-form-item label="充值金额" prop="transferAmount">
          <el-input v-model="temp.transferAmount" :controls="false" placeholder="请输入充值金额" style="width: 199px;" @blur="getValueAmount"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="temp.remark" type="textarea" style="width: 199px;"/>
        </el-form-item>
        <el-form-item label="谷歌验证码">
          <el-input v-model="temp.googleCode" placeholder="请输入谷歌验证码" style="width: 199px;"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="rechargeAccount">{{ $t('table.confirm') }}</el-button>
        <el-button @click="dialogFormVisibleRecharge = false">{{ $t('table.cancel') }}</el-button>
      </div>
    </el-dialog>

    <!--审核弹框-->
    <!--<el-dialog :visible.sync="dialogFormVisibleVerify" :close-on-click-modal="false" title="审核" width="500px">-->
    <!--<el-form-->
    <!--ref="dataFormVerify"-->
    <!--:rules="rules"-->
    <!--:model="temp"-->
    <!--label-position="right"-->
    <!--label-width="99px"-->
    <!--style="width: 400px; margin-left:50px;">-->
    <!--<el-form-item label="商户账号" prop="userName">-->
    <!--<el-input v-model="temp.userName" style="width: 199px;" disabled/>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="审核状态" prop="reviewStatus">-->
    <!--<el-select-->
    <!--v-model="temp.reviewStatus"-->
    <!--:placeholder="$t('merchantList.whole')"-->
    <!--clearable-->
    <!--style="width: 199px;margin-right: 20px"-->
    <!--class="filter-item">-->
    <!--<el-option-->
    <!--v-for="item in checkStatusOptions"-->
    <!--:key="item.state"-->
    <!--:label="item.display_name"-->
    <!--:value="item.state"/>-->
    <!--</el-select>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="审核备注" prop="reviewRemark">-->
    <!--<el-input v-model="temp.reviewRemark" type="textarea" style="width: 199px;"/>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="支付密码" prop="payPass">-->
    <!--<el-input v-model="temp.payPass" type="password" clearable placeholder="请输入支付密码" style="width: 199px;"/>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="谷歌验证码" prop="googleCode">-->
    <!--<el-input v-model="temp.googleCode" clearable placeholder="请输入谷歌验证码" style="width: 199px;"/>-->
    <!--</el-form-item>-->
    <!--</el-form>-->
    <!--<div slot="footer" class="dialog-footer">-->
    <!--<el-button type="primary" @click="verifyAccount">{{ $t('table.confirm') }}</el-button>-->
    <!--<el-button @click="dialogFormVisibleVerify = false">{{ $t('table.cancel') }}</el-button>-->
    <!--</div>-->
    <!--</el-dialog>-->
  </div>
</template>

<script>

import { fetchList, accountRecharge, getOss } from '@/api/manage/financeManage/virtualAccountList'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { parseTime } from '@/utils'
import { Message } from 'element-ui'
const orderStatusOptions = [
  // { auditState: 0, display_name: '待审核' },
  // { auditState: 2, display_name: '审核中' },
  { auditState: 1, display_name: '正常' },
  { auditState: 2, display_name: '禁用' }
  // { auditState: 3, display_name: '审核驳回' }
]

const checkStatusOptions = [
  { state: 1, display_name: '通过' },
  { state: 2, display_name: '不通过' }
]
const statusMap = {
  1: 'warning',
  2: '',
  3: 'success',
  4: 'danger'
}

const orderStatusKeyValue = orderStatusOptions.reduce((acc, cur) => {
  acc[cur.auditState] = cur.display_name
  return acc
}, {})

const checkStatusKeyValue = checkStatusOptions.reduce((acc, cur) => {
  acc[cur.state] = cur.display_name
  return acc
}, {})
export default {
  name: 'VirtualAccountList',
  components: { Pagination },
  directives: { waves },
  filters: {
    orderStatusTagTypeFilter(auditState) {
      return statusMap[auditState]
    },
    orderStatusFilter(type) {
      return orderStatusKeyValue[type]
    },
    checkStatusFilter(type) {
      return checkStatusKeyValue[type]
    },
    parseTime
  },
  data() {
    return {
      jiajiankuan: 'financeManage:virtualAccountList:jiajiankuan',
      tableKey: 0,
      list: [],
      reviewList: [],
      total: 0,
      listLoading: true,
      qishiDate: '',
      status: undefined,
      statusOptions: orderStatusOptions,
      checkStatusOptions: checkStatusOptions,
      dialogFormVisibleRecharge: false,
      dialogFormVisibleVerify: false,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        merType: '',
        userName: '',
        status: ''
      },
      stateList: [
        { label: '全部', value: '' },
        { label: '启用', value: '1' },
        { label: '禁用', value: '2' }
      ],
      temp: {
        userName: undefined,
        nickName: undefined,
        transferAmount: undefined,
        remark: undefined,
        googleCode: undefined,
        reviewRemark: undefined,
        reviewStatus: undefined,
        transferId: undefined
        // transferVoucher: ''
      },
      rules: {
        transferAmount: [
          { required: true, message: '金额不能为空', trigger: 'blur' }
        ],
        payPass: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        googleCode: [
          { required: true, message: '谷歌验证码不能为空', trigger: 'blur' }
        ]
      },
      dialogPvVisible: false,
      dialogTitle: '',
      uploadData: {},
      action: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取充值列表
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.list
        this.total = response.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    // 添加商户充值记录
    rechargeAccount() {
      accountRecharge(this.temp).then(() => {
        this.$message({
          message: '新增成功',
          type: 'success'
        })
        this.dialogFormVisibleRecharge = false
        this.getList()
      }).catch(err => {
        Message.error(err)
        this.dialogFormVisibleRecharge = false
      })
    },

    // 审核功能
    // verifyAccount() {
    //   // 待审核一审
    //   if (this.status === 1) {
    //     this.temp.payPass = this.$md5(this.temp.payPass)
    //     accountVerify(this.temp).then(() => {
    //       this.$message({
    //         message: '审核成功',
    //         type: 'success'
    //       })
    //       this.dialogFormVisibleVerify = false
    //       this.getList()
    //     }).catch(err => {
    //       Message.error(err)
    //       this.dialogFormVisibleVerify = false
    //     })
    //   } else if (this.status === 2) { // 审核中二审
    //     this.temp.payPass = this.$md5(this.temp.payPass)
    //     accountVerify(this.temp).then(() => {
    //       this.$message({
    //         message: '审核成功',
    //         type: 'success'
    //       })
    //       this.dialogFormVisibleVerify = false
    //       this.getList()
    //     }).catch(err => {
    //       Message.error(err)
    //       this.dialogFormVisibleVerify = false
    //     })
    //   } else {
    //     this.dialogFormVisibleVerify = false
    //   }
    // },

    // 充值弹框
    rechargeDialog(row) {
      for (var key in this.temp) {
        this.temp[key] = ''
      }
      this.temp.userName = row.id
      this.temp.nickName = row.nickName
      this.dialogFormVisibleRecharge = true
      // this.getOss()
    },
    // 审核弹框
    // verifyDialog(row) {
    //   for (var key in this.temp) {
    //     this.temp[key] = ''
    //   }
    //   this.temp.userName = row.userName
    //   this.dialogFormVisibleVerify = true
    //   this.status = row.status
    //   this.temp.transferId = row.id
    // },
    getValueAmount() {
      if (Math.round(this.temp.transferAmount)) {
        this.$set(this.temp, 'transferAmount', Math.round(this.temp.transferAmount))
      } else {
        this.$set(this.temp, 'transferAmount', '')
      }
    },
    refreshList() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    getOss() {
      if (this.$refs.upload) {
        this.$refs.upload.clearFiles()
      }
      this.temp.transferVoucher = ''
      getOss().then(response => {
        this.uploadData = {
          key: response.fileDir + '/',
          policy: response.policy,
          OSSAccessKeyId: response.accessKeyId,
          success_action_status: '200',
          signature: response.signature
        }
        this.action = response.host
      })
    },
    onSuccess(file) {
      console.log(file, this.uploadData, '123132132')
      this.temp.transferVoucher = this.uploadData.key
      this.$message({
        message: '上传成功',
        type: 'success'
      })
    },
    onRemove() {
      this.temp.transferVoucher = ''
    },
    onChange(file) {
      this.$set(this.uploadData, 'key', this.uploadData.key + file.name)
    },
    submitUpload() {
      this.$refs.upload.submit()
    }
  }
}
</script>

<style lang='scss' scoped>
  .el-checkbox+.el-checkbox{
    margin-left: 0;
  }
  .el-dialog__wrapper .from-bank .check-all.el-checkbox{
    width: 80px;
  }
  .el-dialog__wrapper .from-bank .quota-txt{
    display: inline-block;
    width: 100px;
    text-align: center;
  }
</style>
