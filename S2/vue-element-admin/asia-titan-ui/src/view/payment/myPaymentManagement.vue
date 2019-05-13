<template>
  <div class="warp-container">
    <el-container>
      <el-header>
        <span>我的支付系统管理</span>
      </el-header>
      <el-main>
        <el-table
          v-loading="tableData.listLoading"
          :key="tableData.tableKey"
          :data="tableData.list"
          :header-cell-style="tableHeaderColor"
          :row-class-name="tableRowClassName"
          border
          align="center"
          fit
          highlight-current-row
          style="width: 100%;">
          <el-table-column
            align="center"
            label="支付系统">
            <template slot-scope="scope">
              <span>{{ scope.row.channelName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="排序值">
            <template slot-scope="scope">
              <span>{{ scope.row.weights }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="在该平台的商户号">
            <template slot-scope="scope">
              <span>{{ scope.row.merAccount }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="支付方式">
            <template slot-scope="scope">
              <span>{{ scope.row.payType | payTypeFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="入款次数/已累计金额/最大值"
            width="400">
            <template slot-scope="scope">
              <span>{{ scope.row.inCount ? scope.row.inCount:0 }} / {{ scope.row.inAmount ? scope.row.inAmount:0 }} / {{ scope.row.maxUseAmount ? scope.row.maxUseAmount:0 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="最后操作时间">
            <template slot-scope="scope">
              <span v-if="scope.row.lastOpteratorDate">{{ scope.row.lastOpteratorDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="状态">
            <template slot-scope="scope">
              <el-tag :type="scope.row.state==1 ? 'success':'danger'">
                {{ scope.row.state==1 ? '正常':'已停用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="200">
            <template slot-scope="scope">
              <el-button :type="scope.row.state==1 ? 'danger':'success'" size="mini" @click="myChannelStateUpdate(scope.row)">
                {{ scope.row.state==1 ? '暂停':'启用' }}
              </el-button>
              <el-button type="primary" size="mini" @click="getMyChannelDetail(scope.row)">
                设置
              </el-button>
            </template>
          </el-table-column>

        </el-table>
        <pagination
          v-show="tableData.total>0"
          :total="tableData.total"
          :page.sync="tableData.listQuery.pageNo"
          :limit.sync="tableData.listQuery.pageSize"
          @pagination="getUsePays"/>
      </el-main>
    </el-container>
    <el-container class="el-container-2">
      <el-header>
        所有可供接入的支付系统
      </el-header>
      <el-main class="el-main-2">
        <el-button type="success" style="float: right;position: relative;right: 20px;display: block">查看我的接入进度</el-button>
        <el-table
          v-loading="tableData2.listLoading"
          :key="tableData2.tableKey"
          :data="tableData2.list"
          :header-cell-style="tableHeaderColor"
          :row-class-name="tableRowClassName"
          border
          fit
          highlight-current-row
          size="mini"
          style="width: 98%;position: relative;left: 1%;top: 20px;">
          <el-table-column label="是否已接入" align="center" width="200">
            <template slot-scope="scope">
              <!--<span>{{ scope.row.orAccess }}</span>-->
              <el-checkbox :value="scope.row.orAccess | orAccessCheckBoxFilter" disabled/>
            </template>
          </el-table-column>
          <el-table-column
            label="支付系统列表"
            align="center"
            width="200"
          >
            <template slot-scope="scope">
              <!--<span>{{ scope.row.name }}</span>-->
              <el-tag :type="scope.row.code | channelCodeTagTypeFilter" :hit="true">
                {{ scope.row.name }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="费率"
            align="center"
            width="200"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.rate*100 }}%</span>
            </template>
          </el-table-column>
          <el-table-column
            label="支持的支付方式"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.payType | payTypeFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="operation"
            label="操作"
            align="center"
          >
            <template slot-scope="scope">
              <el-button :disabled="scope.row.orAccess === 2" type="primary" size="mini" @click="openOneAccessChannelDialog(scope.row)">一键接入</el-button>
              <el-button type="primary" size="mini" @click="getChannelDetail(scope.row)">了解商户</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="tableData2.total>0"
          :total="tableData2.total"
          :page.sync="tableData2.listQuery.pageNo"
          :limit.sync="tableData2.listQuery.pageSize"
          @pagination="getChannelsList"/>
      </el-main>
    </el-container>

    <el-dialog v-loading="tableData.listLoading" v-if="tableData.dialogFormVisible" :title="tableData.textMap[tableData.dialogStatus]" :visible.sync="tableData.dialogFormVisible">
      <el-form
        ref="dataForm"
        :inline="true"
        :rules="tableData.rules"
        :model="tableData.mychannelDetail"
        label-position="right"
        label-width="150px">
        <!--<el-form-item :label="$t('myPayManage.merId')">
          <el-input v-model="tableData.mychannelDetail.merId" :disabled="true" :placeholder="$t('myPayManage.merId')" clearable style="width: 199px;"/>
        </el-form-item>
        <el-form-item :label="$t('myPayManage.merNo')">
          <el-input v-model="tableData.mychannelDetail.merNo" :disabled="true" :placeholder="$t('myPayManage.merId')" clearable style="width: 199px;"/>
        </el-form-item>
        <el-form-item :label="$t('myPayManage.channelCode')">
          <el-input v-model="tableData.channelCodeNameMap[tableData.mychannelDetail.channelCode]" :disabled="true" :placeholder="$t('myPayManage.channelCode')" clearable style="width: 199px;"/>
        </el-form-item>-->
        <el-form-item :label="$t('myPayManage.merAccount')">
          <el-input v-model="tableData.mychannelDetail.merAccount" :placeholder="$t('myPayManage.merAccount')" clearable style="width: 199px;"/>
        </el-form-item>
        <el-form-item :label="$t('myPayManage.merName')">
          <el-input v-model="tableData.mychannelDetail.merName" :placeholder="$t('myPayManage.merName')" clearable style="width: 199px;"/>
        </el-form-item>
        <el-form-item :label="$t('myPayManage.weights')">
          <el-input v-model="tableData.mychannelDetail.weights" :placeholder="$t('myPayManage.weights')" clearable style="width: 199px;"/>
        </el-form-item>
        <el-form-item :label="$t('myPayManage.maxUseAmount')">
          <el-input v-model="tableData.mychannelDetail.maxUseAmount" :placeholder="$t('myPayManage.maxUseAmount')" clearable style="width: 199px;"/>
        </el-form-item>
        <el-form-item :label="$t('myPayManage.minRegAmount')">
          <el-input v-model="tableData.mychannelDetail.minRegAmount" :placeholder="$t('myPayManage.minRegAmount')" clearable style="width: 199px;"/>
        </el-form-item>
        <el-form-item :label="$t('myPayManage.maxRegAmount')">
          <el-input v-model="tableData.mychannelDetail.maxRegAmount" :placeholder="$t('myPayManage.maxRegAmount')" clearable style="width: 199px;"/>
        </el-form-item>
        <el-form-item :label="$t('myPayManage.signType')">
          <el-select v-model="tableData.mychannelDetail.signType" :placeholder="$t('myPayManage.signType')" class="filter-item">
            <el-option
              v-for="item in tableData.signTypeOptions"
              :disabled="true"
              :key="item.signType"
              :label="item.display_name"
              :value="item.signType"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('myPayManage.payType')">
          <el-checkbox v-for="item in tableData.payTypeOptions" :key="item.payType" v-model="item.checked">
            {{ item.display_name }}
          </el-checkbox>
        </el-form-item>
        <el-form-item :label="$t('myPayManage.useRate')">
          <el-input v-model="tableData.mychannelDetail.useRate" :placeholder="$t('myPayManage.useRate')" clearable style="width: 199px;"/>
        </el-form-item>
        <el-form-item :label="$t('myPayManage.terminalType')">
          <el-checkbox v-for="item in tableData.terminalTypeOptions" :key="item.terminalType" v-model="item.checked">
            {{ item.display_name }}
          </el-checkbox>
        </el-form-item>
        <el-form-item :label="$t('myPayManage.publicKey')">
          <el-input
            v-model="tableData.mychannelDetail.publicKey"
            :placeholder="$t('myPayManage.publicKey')"
            :rows="2"
            type="textarea"
            clearable
            style="width: 269px;"/>
        </el-form-item>
        <el-form-item :label="$t('myPayManage.privateKey')">
          <el-input
            v-model="tableData.mychannelDetail.privateKey"
            :placeholder="$t('myPayManage.privateKey')"
            :rows="2"
            type="textarea"
            clearable
            style="width: 269px;"/>
        </el-form-item>
        <el-form-item :label="$t('myPayManage.signKey')">
          <el-input
            v-model="tableData.mychannelDetail.signKey"
            :placeholder="$t('myPayManage.signKey')"
            :rows="2"
            type="textarea"
            clearable
            style="width: 269px;"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="tableData.dialogFormVisible = false">{{ $t('myPayManage.cancel') }}</el-button>
        <el-button type="primary" @click="channelBind()">{{ $t('myPayManage.confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="tableData2.channelDetailDialogVisible" title="了解商户" width="60%">
      <el-form
        v-if="tableData2.channelDetail"
        :model="tableData2.channelDetail"
        label-position="right"
        align="center">

        <el-form-item v-if="tableData2.channelDetail.contactType === '1'">
          <iframe :src="tableData2.channelDetail.contactText" scrolling="auto" frameborder="0" height="100%" width="100%"/>
        </el-form-item>
        <el-form-item v-if="tableData2.channelDetail.contactType !== '1'">
          {{ tableData2.channelDetail.contactText }}
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="tableData2.oneAccessChannelDialogVisible" title="一键接入">
      <el-form
        v-if="tableData2.oneAccessChannelInfo"
        :model="tableData2.oneAccessChannelInfo"
        label-position="right">
        <el-form-item :label="$t('myPayManage.merAccount')">
          <el-input v-model="tableData2.oneAccessChannelInfo.merAccount" :placeholder="$t('myPayManage.merAccount')" clearable style="width: 199px;"/>
        </el-form-item>
        <el-form-item :label="$t('myPayManage.publicKey')">
          <el-input
            v-model="tableData2.oneAccessChannelInfo.publicKey"
            :placeholder="$t('myPayManage.publicKey')"
            :rows="3"
            type="textarea"
            clearable
            style="width: 269px;"/>
        </el-form-item>
        <el-form-item :label="$t('myPayManage.privateKey')">
          <el-input
            v-model="tableData2.oneAccessChannelInfo.privateKey"
            :placeholder="$t('myPayManage.privateKey')"
            :rows="3"
            type="textarea"
            clearable
            style="width: 269px;"/>
        </el-form-item>
        <el-form-item :label="$t('myPayManage.signKey')">
          <el-input
            v-model="tableData2.oneAccessChannelInfo.signKey"
            :placeholder="$t('myPayManage.signKey')"
            :rows="3"
            type="textarea"
            clearable
            style="width: 269px;"/>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="tableData2.oneAccessChannelDialogVisible = false">{{ $t('myPayManage.cancel') }}</el-button>
        <el-button type="primary" @click="oneAccessChannel()">{{ $t('myPayManage.confirm') }}
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getUsePays, getChannels, updateStatus, getConfigDetail, channelBind, getChannelDetail, oneAccessChannel } from '@/api/merchant/payManage'
import { Message } from 'element-ui'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

const payTypeOptions = [
  { payType: 'BANK', display_name: '网银', checked: Boolean },
  { payType: 'ZFB', display_name: '支付宝', checked: Boolean }
]
const terminalTypeOptions = [
  { terminalType: 'PC', display_name: 'PC浏览器', checked: Boolean },
  { terminalType: 'WAP', display_name: '手机WAP页', checked: Boolean },
  { terminalType: 'IOS', display_name: '苹果', checked: Boolean },
  { terminalType: 'ANDROID', display_name: '安卓', checked: Boolean }
]

const payTypeMap = {
  'BANK': '网银',
  'ZFB': '支付宝',
  'QQ': 'QQ支付',
  'QQ_H5': 'QQ支付H5',
  'ZFB_H5': '支付宝H5',
  'ZFB_WAP': '支付宝WAP',
  'ALIPAY': '阿里支付'
}

const channelCodeMap = {
  'jiutong': 'info',
  'jiayi': 'warning',
  'mashanfu': 'danger'
}

const channelCodeNameMap = {
  'jiayi': '嘉亿',
  'jiutong': '久通',
  'mashanfu': '码闪付'
}

const signTypeOptions = [
  { signType: 1, display_name: '对称加密' },
  { signType: 2, display_name: '非对称加密' }
]

// const orderStatusKeyValue = orderStatusOptions.reduce((acc, cur) => {
//   acc[cur.orderStatus] = cur.display_name
//   return acc
// }, {})

export default {
  components: { Pagination },
  filters: {
    channelCodeTagTypeFilter(channelCode) {
      return channelCodeMap[channelCode]
    },
    orAccessCheckBoxFilter(orAccess) {
      if (orAccess === 2) return true
      else return false
    },
    payTypeFilter(payType) {
      const payTypes = payType.split(',')
      const displayName = []
      payTypes.forEach(payType => {
        displayName.push(payTypeMap[payType])
      })
      return displayName.toString().replace(/,/gi, ' / ')
    }
  },
  data() {
    return {
      tableData: {
        channelCodeNameMap,
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: false,
        listQuery: {
          pageNo: 1,
          pageSize: 20,
          payType: undefined,
          merId: undefined
        },
        payTypeOptions,
        terminalTypeOptions,
        signTypeOptions,
        sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
        evaluationStatusOptions: ['published', 'draft', 'deleted'],
        showReviewer: false,
        mychannelDetail: {
          publicKey: undefined,
          privateKey: undefined,
          signKey: undefined
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '查看或编辑',
          create: '新增',
          find: 'Find'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {
          // type: [{ required: true, message: 'type is required', trigger: 'change' }],
          // timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
          // title: [{ required: true, message: 'title is required', trigger: 'blur' }]
        },
        downloadLoading: false
      },
      tableData2: {
        oneAccessChannelInfo: {
          publicKey: undefined,
          privateKey: undefined,
          signKey: undefined
        },
        oneAccessChannelDialogVisible: false,
        channelDetail: undefined,
        channelDetailDialogVisible: false,
        tableKey: 1,
        list: null,
        total: 0,
        listLoading: false,
        listQuery: {
          pageNo: 1,
          pageSize: 20,
          payType: undefined,
          merId: undefined
        },
        // statusOptions: orderStatusOptions,
        // orderStatusOptions,
        // payTypeOptions,
        // handStatusOptions,
        sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
        evaluationStatusOptions: ['published', 'draft', 'deleted'],
        showReviewer: false,
        temp: {
          id: undefined,
          orderNo: undefined,
          createDate: undefined,
          orderStatus: undefined,
          payType: undefined,
          money: undefined,
          handStatus: undefined,
          account: undefined
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '查看或编辑',
          create: '新增',
          find: 'Find'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {
          // type: [{ required: true, message: 'type is required', trigger: 'change' }],
          // timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
          // title: [{ required: true, message: 'title is required', trigger: 'blur' }]
        },
        downloadLoading: false
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getUsePays()
      this.getChannelsList()
    },
    openOneAccessChannelDialog(row) {
      this.tableData2.oneAccessChannelDialogVisible = true
      this.tableData2.oneAccessChannelInfo.channelId = row.id
    },
    oneAccessChannel() {
      this.tableData2.listLoading = true
      oneAccessChannel(this.tableData2.oneAccessChannelInfo).then(response => {
        this.tableData2.listLoading = false
        this.tableData2.oneAccessChannelDialogVisible = false
        Message.success(response.message)
      }).catch(err => {
        Message.error(err)
        this.tableData2.listLoading = false
      })
    },
    getChannelDetail(row) {
      this.tableData2.listLoading = true
      getChannelDetail(row.id).then(response => {
        this.tableData2.channelDetail = response.data

        this.tableData2.listLoading = false
        this.tableData2.channelDetailDialogVisible = true
      }).catch(err => {
        Message.error(err)
        this.tableData2.listLoading = false
      })
    },
    channelBind() {
      this.tableData.listLoading = true
      this.tableData.mychannelDetail.payType = []
      this.tableData.mychannelDetail.terminalType = []
      this.tableData.payTypeOptions.forEach(payTypeOption => {
        if (payTypeOption.checked) this.tableData.mychannelDetail.payType.push(payTypeOption.payType)
      })
      this.tableData.terminalTypeOptions.forEach(terminalType => {
        if (terminalType.checked) this.tableData.mychannelDetail.terminalType.push(terminalType.terminalType)
      })
      this.tableData.mychannelDetail.payType = this.tableData.mychannelDetail.payType.toString()
      this.tableData.mychannelDetail.terminalType = this.tableData.mychannelDetail.terminalType.toString()
      channelBind(this.tableData.mychannelDetail).then(response => {
        this.tableData.listLoading = false
        Message.success('修改成功')
      }).catch(err => {
        Message.error(err)
        this.tableData.listLoading = false
      })
    },
    getMyChannelDetail(row) {
      this.tableData.listLoading = true
      this.tableData.dialogStatus = 'update'
      getConfigDetail(row.id).then(response => {
        this.tableData.listLoading = false
        this.tableData.mychannelDetail.publicKey = undefined
        this.tableData.mychannelDetail.privateKey = undefined
        this.tableData.mychannelDetail.signKey = undefined
        Object.assign(this.tableData.mychannelDetail, response.data)
        // 支付类型checkbox匹配
        this.tableData.payTypeOptions.forEach(payTypeOption => {
          if (!this.tableData.mychannelDetail.payType) return
          const payTypes = this.tableData.mychannelDetail.payType.split(',')
          if (payTypes.indexOf(payTypeOption.payType) !== -1) {
            payTypeOption.checked = true
          } else {
            payTypeOption.checked = false
          }
        })
        // 终端类型checkbox匹配
        this.tableData.terminalTypeOptions.forEach(terminalTypeOption => {
          if (!this.tableData.mychannelDetail.terminalType) return
          const payTypes = this.tableData.mychannelDetail.terminalType.split(',')
          if (payTypes.indexOf(terminalTypeOption.terminalType) !== -1) {
            terminalTypeOption.checked = true
          } else {
            terminalTypeOption.checked = false
          }
        })
        this.tableData.dialogFormVisible = true
      }).catch(err => {
        Message.error(err)
        this.tableData.listLoading = false
      })
    },
    // 1 正常 2 停用
    myChannelStateUpdate(row) {
      this.tableData.listLoading = true
      updateStatus(row.channelId, { state: row.state === 1 ? 2 : 1 }).then(response => {
        this.tableData.listLoading = false
        row.state === 1 ? row.state = 2 : row.state = 1
      }).catch(err => {
        Message.error(err)
        this.tableData.listLoading = false
      })
    },
    // 修改table 表头的背景色
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background-color: #F7F6Fd;'
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
    },
    getUsePays() {
      this.tableData.listLoading = true
      getUsePays(this.tableData.listQuery).then(response => {
        const data = response.data
        this.tableData.list = data.rows
        this.tableData.total = data.totalCount

        this.tableData.listLoading = false
        // Just to simulate the time of the request
        // setTimeout(() => {
        //   this.tableData2.listLoading = false
        // }, 1.5 * 1000)
      }).catch(err => {
        Message.error(err)
        this.tableData.listLoading = false
      })
    },
    getChannelsList() {
      this.tableData2.listLoading = true
      getChannels(this.tableData2.listQuery).then(response => {
        if (!response) {
          this.tableData2.listLoading = false
          return
        }
        const data = response.data
        this.tableData2.list = data.rows
        this.tableData2.total = data.totalCount

        this.tableData2.listLoading = false
        // Just to simulate the time of the request
        // setTimeout(() => {
        //   this.tableData2.listLoading = false
        // }, 1.5 * 1000)
      }).catch(err => {
        Message.error(err)
        this.tableData2.listLoading = false
      })
    }
  }
}
</script>

<style scoped>
  @import "../../style/paymentManage.css";

</style>

