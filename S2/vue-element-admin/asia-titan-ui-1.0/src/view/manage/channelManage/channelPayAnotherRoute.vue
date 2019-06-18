<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-form-item label="账号ID">
        <el-input v-model="listQuery.channelAccountId" clearable placeholder="请输入账号ID" style="width: 240px;" onkeyup="this.value=this.value.replace(/\D/g,'')"/>
      </el-form-item>
      <el-form-item label="通道平台">
        <el-select v-model="listQuery.channelPlatformId" style="width: 120px;">
          <el-option v-for="(item, idx) in listKey" :key="idx" :label="item.name" :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="listQuery.status" style="width: 120px;">
          <el-option value="" label="全部" />
          <el-option :value="1" label="启用" />
          <el-option :value="2" label="关闭" />
          <el-option :value="3" label="冻结" />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="使用类型">
        <el-select v-model="listQuery.usageType" style="width: 120px;">
          <el-option :value="0" label="全部" />
          <el-option :value="1" label="API" />
          <el-option :value="2" label="后台" />
        </el-select>
      </el-form-item> -->
      <el-button v-waves class="filter-item" type="primary" @click="refreshList">{{ $t('table.search') }}</el-button>
      <!-- <el-form-item>
        <el-button v-waves class="filter-item" type="primary" @click="badchTrade">批量关闭交易</el-button>
      </el-form-item> -->
    </el-form>
    <el-table v-loading="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%;" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" align="center"/> -->
      <el-table-column label="通道账户名" prop="channelAccountName" align="center"/>
      <el-table-column label="通道名称" prop="name" align="center"/>
      <el-table-column label="通道类型" prop="type" align="center">
        <template slot-scope="scope"><span>{{ scope.row.type === 1 ? 'B2C支付' : 'B2C代付' }}</span></template>
      </el-table-column>
      <el-table-column label="使用类型" prop="usageType" align="center">
        <template slot-scope="scope"><span>{{ scope.row.usageType | getUserType }}</span></template>
      </el-table-column>
      <el-table-column label="状态" prop="status" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | getStatus(true)">
            {{ scope.row.status | getStatus }}
          </el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column label="今日交易额" prop="status" align="center">
        <template slot-scope="scope"><span>{{ scope.row.todayTurnover }}</span></template>
      </el-table-column>
      <el-table-column label="每日限额" prop="status" align="center">
        <template slot-scope="scope"><span>{{ scope.row.dailyQuota }}</span></template>
      </el-table-column> -->

      <el-table-column label="可用余额" prop="status" align="center">
        <template slot-scope="scope"><span>{{ scope.row.availableBalance | getAvailableBalance }}</span></template>
      </el-table-column>
      <el-table-column label="手续费" prop="poundage" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.poundage }}</span>
          <span>{{ scope.row.poundageUnit === 1 ? '/ %' : '元' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权重" prop="weight" align="center"/>
      <el-table-column label="操作" align="center" class-name="small-padding" min-width="200px">
        <template slot-scope="scope">
          <div v-if="scope.row.status !== 3">
            <el-button v-handle="updateW" size="mini" @click="handleModifyStatus(scope.row,'修改权重')">修改权重</el-button>
            <el-button v-handle="updateS" size="mini" @click="handleModifyStatus(scope.row,'修改交易状态')">修改状态</el-button>
            <el-button v-handle="setBank" size="mini" @click="handleModifyStatus(scope.row,'设置银行')">设置银行</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :visible.sync="dialogPvVisible" :title="dialogTitle" :close-on-click-modal="false" width="700px">
      <el-form v-if="dialogTitle === '修改交易状态'" ref="formStatus" :model="formStatus" label-position="right" label-width="99px">
        <el-form-item label="交易状态">
          <el-select v-model="formStatus.status">
            <el-option :value="1" label="启用"/>
            <el-option :value="2" label="关闭"/>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form v-else-if="dialogTitle === '修改权重'" ref="formWeight" :model="formWeight" label-position="right" label-width="99px">
        <el-form-item label="权重">
          <el-input-number v-model="formWeight.weight" :min="0" :controls="false"/>
        </el-form-item>
      </el-form>
      <el-form v-else ref="formBank" :model="formBank" label-position="right" label-width="10px" class="from-bank">
        <el-form-item>
          <el-input-number v-model="minRange" :controls="false" controls-position="right" size="mini" style="width: 146px;"/>
          <span>--</span>
          <el-input-number v-model="maxRange" :controls="false" controls-position="right" size="mini" style="width: 146px;"/>
          <el-button size="mini" type="primary" @click="rangeChange">批量修改限额</el-button>
          <el-button size="mini" type="success" @click="handleCheckAllChange(1)">全部启用</el-button>
          <el-button size="mini" type="danger" @click="handleCheckAllChange(2)">全部关闭</el-button>
        </el-form-item>
        <el-form-item>
          <el-checkbox-group v-model="checkedCities">
            <el-checkbox v-for="(item, idx) in formBank.banks" :label="item.bankCode" :key="item.bankCode" @change="citiesChange(item.bankCode, idx)">
              <span>{{ item.bankName }}</span>
              <span class="quota-txt">单笔限额</span>
              <el-input-number v-model="item.minAmount" :controls="false" controls-position="right" size="mini" style="width: 160px;"/>
              <span>--</span>
              <el-input-number v-model="item.maxAmount" :controls="false" controls-position="right" size="mini" style="width: 160px;"/>
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogPvVisible = false">取 消</el-button>
        <el-button :loading="btnLoading" type="primary" @click="createConfirm(dialogTitle)">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { fetchList, fetchUpdate, fetchDetail, fetchUpdateBanks, fetchKey, setWeight } from '@/api/manage/channelManage/channelPayAnotherRoute'
import waves from '@/directive/waves' // Waves directive
// import { Message } from 'element-ui'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ChannelPayAnotherRoute',
  components: { Pagination },
  directives: { waves },
  filters: {
    getAvailableBalance(value) {
      if ((value < 0 || !value) && value !== 0) {
        return '-'
      }
      return value
    },
    getUserType(key) {
      var arr = ['全部', 'API', '后台']
      return arr[key]
    },
    getStatus(key, type) {
      var arr = ['启用', '关闭', '冻结']
      var types = ['success', 'danger', 'warning']
      if (type) {
        return types[key - 1]
      } else {
        return arr[key - 1]
      }
    }
  },
  data() {
    return {
      updateW: 'manageChannelManage:channelPayAnotherRoute:updateW',
      updateS: 'manageChannelManage:channelPayAnotherRoute:updateS',
      setBank: 'manageChannelManage:channelPayAnotherRoute:setBank',
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        type: 2,
        // usageType: '',
        status: '',
        channelAccountId: '',
        channelPlatformId: ''
      },
      formStatus: {
        status: '',
        id: ''
      },
      formBank: {
        id: '',
        banks: []
      },
      formWeight: {
        id: '',
        weight: ''
      },
      listKey: [],
      minRange: '',
      maxRange: '',
      checkedCities: [],
      checkAll: false,
      isIndeterminate: false,
      dialogPvVisible: false,
      btnLoading: false,
      dialogTitle: ''
    }
  },
  created() {
    fetchKey().then(response => {
      response.unshift({ id: '', name: '全部' })
      this.listKey = response
    })
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      // if (typeof (this.listQuery.channelAccountId) === 'string' || typeof (this.listQuery.agentId) === 'string') {
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
    createConfirm(title) {
      var vm = this
      this.btnLoading = true
      function resultTip() {
        vm.$message({
          message: title + '成功',
          type: 'success'
        })
        vm.refreshList()
        vm.dialogPvVisible = false
        vm.btnLoading = false
      }
      if (title === '修改交易状态') {
        fetchUpdate(vm.formStatus).then(response => {
          resultTip('修改交易状态')
        })
      } else if (title === '设置银行') {
        fetchUpdateBanks(vm.formBank).then(response => {
          resultTip('修改银行卡')
        })
      } else {
        var num = /^[0-9]*[1-9][0-9]*$/
        var weight = vm.formWeight.weight
        if (weight !== 0 && !num.test(weight + '')) {
          vm.$message.error('请输入整数')
          vm.btnLoading = false
          return
        }
        setWeight(vm.formWeight).then(response => {
          resultTip('修改权重')
        })
      }
    },
    handleModifyStatus(row, title) {
      var vm = this
      this.dialogTitle = title
      if (title === '设置银行') {
        vm.listLoading = true
        fetchDetail({ id: row.id }).then(response => {
          vm.checkedCities = []
          vm.$set(vm.formBank, 'banks', response.banks)
          vm.formBank.id = row.id
          vm.dialogPvVisible = true
          vm.listLoading = false
          for (var i = 0; i < response.banks.length; i++) {
            if (response.banks[i].status === 1) {
              vm.checkedCities.push(response.banks[i].bankCode)
            }
          }
        })
      } else if (title === '修改交易状态') {
        this.formStatus.id = row.id
        this.formStatus.status = row.status
        this.dialogPvVisible = true
      } else {
        this.formWeight.id = row.id
        this.formWeight.weight = row.weight
        this.dialogPvVisible = true
      }
    },
    rangeChange() {
      for (var i = 0; i < this.formBank.banks.length; i++) {
        this.$set(this.formBank.banks[i], 'minAmount', Number(this.minRange))
        this.$set(this.formBank.banks[i], 'maxAmount', Number(this.maxRange))
      }
    },
    handleSelectionChange(val) {
      console.log(val)
    },
    badchTrade() {

    },
    refreshList() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    handleCheckAllChange(value) {
      var arr = []
      for (var i = 0; i < this.formBank.banks.length; i++) {
        this.$set(this.formBank.banks[i], 'status', value)
        if (value === 1) {
          arr.push(this.formBank.banks[i].bankCode)
        }
      }
      this.checkedCities = arr
    },
    citiesChange(value, idx) {
      var filterVal = this.checkedCities.filter(item => item === value)
      var val = filterVal.length ? 1 : 2
      this.$set(this.formBank.banks[idx], 'status', val)
    }
  }
}
</script>

<style lang='scss' scoped>
.el-checkbox+.el-checkbox{
  margin-left: 0;
}
.el-dialog__wrapper .from-bank .el-checkbox__label span:first-child{
  width: 138px;
  display: inline-block;
}
.el-dialog__wrapper .from-bank .quota-txt{
  display: inline-block;
  width: 100px;
  text-align: center;
}
</style>

<style>
.el-dialog__wrapper .from-bank .el-checkbox.is-checked .el-checkbox__label{
  color: #333;
}
</style>

