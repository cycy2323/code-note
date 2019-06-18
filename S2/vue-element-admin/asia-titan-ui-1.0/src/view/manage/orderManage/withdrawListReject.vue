<template>
  <div class="withdraw-list app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-form-item label="商户ID">
        <el-input v-model="listQuery.merId" clearable style="width: 220px;" onkeyup="this.value=this.value.replace(/\D/g,'')"/>
      </el-form-item>
      <el-form-item label="商户订单号">
        <el-input v-model="listQuery.merOrderNo" clearable style="width: 220px;" />
      </el-form-item>
      <el-form-item label="响应编码">
        <el-input v-model="listQuery.resCode" clearable style="width: 160px;" />
      </el-form-item>
      <el-form-item label="银行名称">
        <el-select
          v-model="bankCopy"
          :placeholder="$t('merchantList.whole')"
          value-key="code"
          clearable
          style="width: 200px;margin-right: 20px"
          class="filter-item">
          <el-option
            v-for="item in bankList"
            :key="item.code"
            :label="item.name"
            :value="item"/>
        </el-select>
        <!--<el-input v-model="temp.bankCode" style="width: 250px;"/>-->
      </el-form-item>
      <el-form-item label="持卡人姓名">
        <el-input v-model="listQuery.bankUserName" clearable style="width: 160px;" />
      </el-form-item>
      <el-form-item label="银行卡号后六位">
        <el-input v-model="listQuery.bankAftSix" clearable style="width: 160px;" />
      </el-form-item>
      <el-form-item label="订单来源">
        <el-select v-model="listQuery.sourceType" :placeholder="$t('merchantList.whole')" clearable style="width: 160px">
          <el-option :value="1" label="api"/>
          <el-option :value="2" label="web"/>
        </el-select>
      </el-form-item>
      <el-form-item label="提交时间">
        <el-date-picker
          v-model="qishiDate"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          @change="dateChange"/>
      </el-form-item>
      <el-button v-waves class="filter-item" type="primary" @click="refreshList">{{ $t('table.search') }}</el-button>
    </el-form>
    <el-table v-loading="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="商户ID" prop="merId" align="center"/>
      <el-table-column label="商户名称" prop="merName" align="center"/>
      <el-table-column label="商户订单号" prop="merOrderNo" align="center"/>
      <el-table-column label="订单金额" prop="amount" align="center"/>
      <el-table-column label="创建时间" prop="createDate" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createDate || '' | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" prop="submitDate" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.submitDate || '' | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="银行" prop="bankName" align="center"/>
      <el-table-column label="银行卡号" prop="bankAccountNo" align="center"/>
      <el-table-column label="持卡人姓名" prop="bankUserName" align="center"/>
      <el-table-column label="请求来源" prop="sourceType" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.sourceType === 1 ? '' : 'success'">
            {{ scope.row.sourceType === 1 ? 'api' : 'web' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="业务类型" prop="businessType" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.businessType === 1 ? '支付' : '代付' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="响应编码" prop="resCode" align="center"/>
      <el-table-column label="响应文本" prop="resMessage" align="center"/>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :visible.sync="dialogPvVisible" :close-on-click-modal="false" title="订单详情" width="600px" class="detail">
      <el-form label-position="right" label-width="120px">
        <el-form-item label="平台订单号:">
          <span>{{ detailData.orderNo }}</span>
        </el-form-item>
        <el-form-item label="商户订单号:">
          <span>{{ detailData.merOrderNo }}</span>
        </el-form-item>
        <el-form-item label="商户ID:">
          <span>{{ detailData.merId }}</span>
        </el-form-item>
        <el-form-item label="金额:">
          <span>{{ detailData.orderAmount }}</span>
        </el-form-item>
        <el-form-item label="实际到账金额:">
          <span>{{ detailData.channelRealAmount }}</span>
        </el-form-item>
        <el-form-item label="手续费:">
          <span>{{ detailData.channelCommission }}</span>
        </el-form-item>
        <el-form-item label="通道账号名:">
          <span>{{ detailData.channelName }}</span>
        </el-form-item>
        <!-- <el-form-item label="通道商户号:">
          <span>{{ }}</span>
        </el-form-item> -->
        <el-form-item label="银行:">
          <span>{{ detailData.bankName }}</span>
        </el-form-item>
        <el-form-item label="银行卡号:">
          <span>{{ detailData.bank_AccountNo }}</span>
        </el-form-item>
        <el-form-item label="持卡人姓名:">
          <span>{{ detailData.bankUserName }}</span>
        </el-form-item>
        <!-- <el-form-item label="业务:">
          <span>{{ detailData. }}</span>
        </el-form-item> -->
        <el-form-item label="创建时间:">
          <span>{{ detailData.createDate }}</span>
        </el-form-item>
        <!-- <el-form-item label="完成时间:">
          <span>{{ detailData. }}</span>
        </el-form-item> -->
        <el-form-item label="状态:">
          <span>{{ detailData.orderState | getOrderState }}</span>
        </el-form-item>
        <el-form-item label="通知状态:">
          <span>{{ detailData.notifyState === 0 ? '未通知' : '通知成功' }}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogPvVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { fetchList, bankList } from '@/api/manage/orderManage/withdrawListReject'
import waves from '@/directive/waves' // Waves directive
// import { Message } from 'element-ui'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
// 获取格林时间
var date1 = new Date(new Date(new Date().toLocaleDateString()).getTime())
var date2 = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)

// 格式化时间  2018-06-06 00:00:00
// 如果只是简单的格式化只变成2018-6-6 0:0:0，需要运用三目运算判断并在适当的地方加上0，完成所需要的格式。
var startTime = date1.getFullYear() + '-' + ((date1.getMonth() + 1) < 10 ? '0' + (date1.getMonth() + 1) : (date1.getMonth() + 1)) + '-' + (date1.getDate() < 10 ? '0' + date1.getDate() : date1.getDate()) + ' ' + (date1.getHours() < 10 ? '0' + date1.getHours() : date1.getHours()) + ':' + (date1.getMinutes() < 10 ? '0' + date1.getMinutes() : date1.getMinutes()) + ':' + (date1.getSeconds() < 10 ? '0' + date1.getSeconds() : date1.getSeconds())

// 格式化时间  2018-06-06 23:59:59
var endTime = date2.getFullYear() + '-' + (date2.getMonth() + 1) + '-' + date2.getDate() + ' ' + date2.getHours() + ':' + date2.getMinutes() + ':' + date2.getSeconds()

export default {
  name: 'WithdrawListReject',
  components: { Pagination },
  directives: { waves },
  filters: {
    getOrderState(key) {
      const obj = { '1': '处理中', '2': '成功', '3': '失败待退款', '4': '失败已退款', '5': '退款待审核' }
      return obj[key + '']
    }
  },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      bankCopy: {},
      bankList: {},
      listLoading: true,
      qishiDate: [new Date(startTime), new Date(endTime)],
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        bankCode: '',
        merName: '',
        merOrderNo: '',
        resCode: '',
        bankUserName: '',
        bankAftSix: '',
        sourceType: '',
        beginSubTime: startTime,
        endSubTime: endTime
      },
      detailData: {},
      dialogPvVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      await bankList().then(data => {
        this.bankList = data
      })
      if (this.bankCopy === null) {
        this.bankCopy = ''
      }
      this.listQuery.bankCode = this.bankCopy.code
      // if (typeof (this.listQuery.merId) === 'string' || typeof (this.listQuery.agentId) === 'string') {
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
    dateChange() {
      if (this.qishiDate) {
        this.listQuery.beginSubTime = parseTime(this.qishiDate[0], '{y}-{m}-{d}')
        this.listQuery.endSubTime = parseTime(this.qishiDate[1], '{y}-{m}-{d}')
      } else {
        this.listQuery.beginSubTime = ''
        this.listQuery.endSubTime = ''
      }
    },
    refreshList() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    showDialog(row) {
      for (var key in row) {
        this.detailData[key] = row[key]
      }
      this.dialogPvVisible = true
    }
  }
}
</script>

<style lang='scss' scoped>
  .withdraw-list .detail .el-form .el-form-item{
    margin-bottom: 0px;
  }
</style>
