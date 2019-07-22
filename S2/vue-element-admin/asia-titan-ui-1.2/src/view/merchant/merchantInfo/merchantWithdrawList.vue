<template>
  <div class="app-container">
    <div class="filter-container" style="width: 100%;background: #FFFFFF;margin-bottom: 20px;padding: 20px 20px">
      <div style="margin: 10px 0;">
        账户余额（元）:
        <span class="account-balance">{{ homeInfoData && homeInfoData.totalAmount||"- -" }}</span>
      </div>
      <br>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="listQuery.transferList"
      fit
      height="600px"
      highlight-current-row>
      <el-table-column :label="$t('table.carNumRequired')" align="center">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.cardNum"
            size="mini"/>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.userNameRequired')" align="center">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.realName"
            size="mini"/>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.withdrawalAmountRequired')" align="center">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.amount"
            type="number"
            oninput="this.value=this.value.replace(/e|-/g,'');this.value=this.value.replace(/\./g,'');"
            placeholder="请输入正整数"
            size="mini"/>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.bankNameRequired')" align="center">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.bankName"
            size="mini"/>
        </template>
      </el-table-column>
      <el-table-column :label="$t('accountManage.operation')" min-width="100px" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="rowDelete(scope.$index, listQuery.transferList)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.tips')" align="center">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.remark"
            size="mini"/>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <div class="footer-submit">
      支付密码：
      <el-input
        v-model="listQuery.payPass"
        clearable
        type="password"
        style="width: 300px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"/>
      谷歌验证码：
      <el-input
        v-model="listQuery.googleCode"
        clearable
        style="width: 300px;"
        type="number"
        oninput="this.value=this.value.replace(/e|-/g,'');this.value=this.value.replace(/\./g,'');"
        placeholder="请输入数字格式"
        class="filter-item"
        @keyup.enter.native="handleFilter"/>
      <el-button
        v-waves
        :disabled="disabled"
        style="margin-left: 30px"
        class="filter-item pan-btn-withdraw green-btn"
        type="primary"
        @click="submitList">提交
      </el-button>

      <el-button
        v-waves
        class="filter-item pan-btn-withdraw green-btn"
        type="primary"
        @click="resetList">重置
      </el-button>
      <el-button
        v-waves
        class="filter-item pan-btn-withdraw green-btn"
        type="primary"
        @click="addList">添加更多
      </el-button>
    </div>
  </div>
</template>

<script>
import { addTransfer } from '@/api/merchant/merchantInfo/merchantWithdrawList'
import { homeInfo } from '@/api/merchant/merchantHome/homeInfo'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

import { Message } from 'element-ui'

import DragDialog from '@/view/common/dragDialog'
import editorImage from '../../../components/Tinymce/components/editorImage'
import uploadCard from '../../common/uploadCard'

export default {
  name: 'TransferRecord',
  components: { DragDialog, Pagination, uploadCard, editorImage },
  directives: { waves },
  data() {
    return {
      homeInfoData: null,
      dialogVisible: false,
      dialogForm: {
        account: ''
      },
      tableKey: 0,
      listHeader: ['银行卡号码', '持卡人姓名', '提现金额', '银行名称', '操作', '说明'],
      listLoading: false,
      listQuery: {
        payPass: null, //
        googleCode: undefined, //
        transferList: [
          {
            cardNum: '',
            realName: '',
            amount: '',
            bankName: '',
            remark: ''
          }
        ] //
      },
      dialogFormVisible: false,
      addAgentDialogFormVisible: false,
      dialogStatus: '',
      disabled: false
    }
  },
  created() {
    homeInfo().then(res => {
      this.homeInfoData = res
    })
    this.resetList()
  },
  methods: {
    // 重置列表
    resetList() {
      this.listQuery.transferList = [
        {
          cardNum: '',
          realName: '',
          amount: '',
          bankName: '',
          remark: ''
        }
      ]
      this.listQuery.payPass = ''
      this.listQuery.googleCode = ''
    },
    // 添加列表行
    addList() {
      this.listQuery.transferList.push({
        cardNum: '',
        realName: '',
        amount: '',
        bankName: '',
        remark: ''
      })
    },
    rowDelete(index, row) {
      row.splice(index, 1)
    },
    handleFilter() {
    },
    // 提交
    submitList() {
      this.disabled = true
      // 参数调整(加密）
      const pramps = Object.assign({}, this.listQuery)
      pramps.payPass = (pramps.payPass && this.$md5(pramps.payPass))
      addTransfer(pramps).then(response => {
        Message.success('操作成功')
        this.listLoading = false
        this.resetList()
        this.disabled = false
      }).catch(err => {
        Message.error(err)
        this.disabled = false
        this.listLoading = false
      })
    }
  }
}
</script>

<style scoped>
.account-balance{
  color: red;
}
  .footer-submit{
    text-align: center;
  }
</style>
