<template>
  <div class="merchant-container">
    <el-container class="merchant-container-1">
      <el-header>
        商户特定金额
      </el-header>
      <el-main>
        <el-form v-loading="listLoading" label-position="right" label-width="99px" style="justify-content: center;display: flex">
          <div>
            <el-form-item label="新增组" size="mini">
              <el-input v-model="newGroupName" clearable placeholder="组名" style="width: 23%"/>
              <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" @click="addAmountGroup(newGroupName)">添加</el-button>
            </el-form-item>
            <el-form-item v-for="(item,qkIndex) in qkAmountList" :key="qkIndex" :label="item.groupName" size="mini">
              <el-tag v-for="(it,index) in item.amount" :key="it+'-'+index" closable style="margin-left: 10px;" @close="qkAmountTagClose(it,index,item,qkIndex)">{{ it }}</el-tag>
              <el-input
                v-if="item.inputVisible"
                :ref="'saveTagInput_'+qkIndex"
                v-model="item.inputValue"
                class="input-new-tag"
                size="small"
                @keyup.enter.native="handleInputConfirm(item,qkIndex)"
                @blur="handleInputConfirm(item,qkIndex)"
              />
              <el-button v-else class="button-new-tag" size="small" @click="showInput(item,qkIndex)">+ 新增</el-button>
              <el-button type="danger" icon="el-icon-delete" circle @click="removeAmountGroup(item,qkIndex)"/>
            </el-form-item>
          </div>
        </el-form>
      </el-main>
    </el-container>
    <el-container class="merchant-container-2">
      <el-header>
        支付方式
      </el-header>
      <el-table
        :data="tableData"
        :header-cell-style="tableHeaderColor"
        :row-class-name="tableRowClassName"
        :row-key="rowIndex"
        highlight-current-row
        border
        size="mini"
        max-height="343"
        align="center"
        style="width: 98%;position: relative;left: 1%;">
        <el-table-column
          align="center"
          label="序号">
          <template slot-scope="scope">
            <span>{{ scope.row.priority }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="支付类型">
          <template slot-scope="scope">
            <span>{{ payTypeMap[scope.row.payType] }}</span>
            <svg-icon v-if="scope.row.payType" :icon-class="scope.row.payType | payTypeIcon" class-name="payTypeIconSize" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="平台">
          <template slot-scope="scope">
            <el-tag :type="scope.row.channelCode | channelCodeTagTypeFilter" :hit="true">{{ scope.row.channelName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="PC端">
          <template slot-scope="scope">
            <span>{{ scope.row.terminalType | terminalTypeFilter('PC') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="PC限额(单笔)">
          <template slot-scope="scope">
            <span>{{ scope.row | payLimitFilter('PC') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="WAP端">
          <template slot-scope="scope">
            <span>{{ scope.row.terminalType | terminalTypeFilter('WAP') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="WAP限额(单笔)">
          <template slot-scope="scope">
            <span>{{ scope.row | payLimitFilter('WAP') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="配置"
          width="200">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="openMerchantDetail(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="suffix-content">
        <span>请输入谷歌验证码</span>
        <el-input type="text" size="mini" aria-placeholder="请输入谷歌验证码" style="width: 50%"/>
        <br><br>
        <el-button type="primary" size="mini" class="btn-update">确认修改</el-button>
        <el-button type="info" size="mini" class="btn-cancel">取消</el-button>
      </div>
      <!-- $t is vue-i18n global function to translate lang (lang in @/lang)  -->
      <div class="show-d">{{ $t('table.dragTips1') }} : &nbsp; {{ oldList }}</div>
      <div class="show-d">{{ $t('table.dragTips2') }} : {{ newList }}</div>
    </el-container>

    <el-dialog v-loading="listLoading" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" center>
      <el-form
        ref="dataForm"
        :inline="true"
        :rules="rules"
        :model="myMerchantDetail"
        label-position="right"
        label-width="150px">
        <el-form-item :label="$t('myMerchant.priority')">
          <el-input v-model="myMerchantDetail.priority" :placeholder="$t('myMerchant.priority')" clearable style="width: 199px;"/>
        </el-form-item>
        <el-form-item :label="$t('myMerchant.payType')">
          <el-input v-model="myMerchantDetail.payType" :placeholder="$t('myMerchant.payType')" clearable style="width: 199px;"/>
        </el-form-item>
        <el-form-item :label="$t('myMerchant.channelCode')">
          <el-input v-model="myMerchantDetail.channelCode" :placeholder="$t('myMerchant.channelCode')" clearable style="width: 199px;"/>
        </el-form-item>
        <el-form-item :label="$t('myMerchant.terminalType')">
          <el-input v-model="myMerchantDetail.terminalType" :placeholder="$t('myMerchant.terminalType')" clearable style="width: 199px;"/>
        </el-form-item>
        <el-form-item :label="$t('myMerchant.limitAmountPC')">
          <el-input v-model="myMerchantDetail.limitAmountPC" :placeholder="$t('myMerchant.limitAmountPC')" clearable style="width: 199px;"/>
        </el-form-item>
        <el-form-item :label="$t('myMerchant.limitAmountWAP')">
          <el-input v-model="myMerchantDetail.limitAmountWAP" :placeholder="$t('myMerchant.limitAmountWAP')" clearable style="width: 199px;"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('myMerchant.cancel') }}</el-button>
        <el-button type="primary" @click="modifyConfig">{{ $t('myMerchant.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
import { Message, MessageBox } from 'element-ui'
import { qkAmountList } from '@/api/merchant/myCashier'
import { addQkAmount, deleteQkAmount, updateQkAmount, payMethodAllConfig, modifyConfig } from '@/api/merchant/myMerchant'
// import { qkAmountList } from '@/api/merchant/myMerchant'
const payTypeMap = {
  'BANK': '网银',
  'ZFB': '支付宝'
}

const channelCodeMap = {
  'jiutong': 'info',
  'jiayi': 'warning',
  'mashanfu': 'danger'
}

export default {
  filters: {
    channelCodeTagTypeFilter(channelCode) {
      return channelCodeMap[channelCode]
    },
    payTypeIcon(payType) {
      let icon = null
      switch (payType) {
        case 'ZFB': {
          icon = 'zfb'
          break
        }
        case 'BANK': {
          icon = 'wangyin'
          break
        }
        case 'QQ': {
          icon = 'QQPay'
          break
        }
        case 'QQ_H5': {
          icon = 'QQPay'
          break
        }
        case 'ZFB_H5': {
          icon = 'zfb'
          break
        }
        case 'ZFB_WAP': {
          icon = 'zfb'
          break
        }
      }
      return icon
    },
    payLimitFilter(row, terminalType) {
      let minAmount = 0
      let maxAmount = 0
      if (terminalType === 'PC') {
        if (row.pcMinAmount || row.pcMinAmount === 0) {
          minAmount = row.pcMinAmount
        } else {
          minAmount = row.minRegAmount
        }
        if (row.pcMaxAmount || row.pcMaxAmount === 0) {
          maxAmount = row.pcMaxAmount
        } else {
          maxAmount = row.maxRegAmount
        }
      } else if (terminalType === 'WAP') {
        if (row.wapMinAmount) {
          minAmount = row.wapMinAmount
        } else {
          minAmount = row.minRegAmount
        }
        if (row.wapMaxAmount) {
          maxAmount = row.wapMaxAmount
        } else {
          maxAmount = row.maxRegAmount
        }
      }
      return minAmount + '-' + maxAmount + ' 元'
    },
    terminalTypeFilter(terminalType, value) {
      if (!terminalType) return
      return terminalType.indexOf(value) !== -1 ? '已启用' : undefined
    }
  },
  data() {
    return {
      myMerchantDetail: {},
      rules: {
        // type: [{ required: true, message: 'type is required', trigger: 'change' }],
        // timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        // title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      dialogStatus: '',
      textMap: {
        update: '查看或编辑',
        create: '新增',
        find: 'Find'
      },
      dialogFormVisible: false,
      payTypeMap,
      newGroupName: null,
      qkAmountList: [],
      listLoading: false,
      tableDataLoading: false,
      tableData: [],
      sortable: null,
      oldList: [],
      newList: [],
      index: 0
    }
  },
  created() {
    this.payAmountList()
    this.payMethodConfigList()
  },
  methods: {
    rowIndex(row) {
      // console.log(JSON.stringify(row))
      return row.id
    },
    modifyConfig() {
      this.listLoading = true
      modifyConfig(this.myMerchantDetail).then(response => {
        this.listLoading = false
        Message.success(response.message)
      }).catch(err => {
        Message.error(err)
        this.listLoading = false
      })
    },
    openMerchantDetail(row) {
      this.dialogFormVisible = true
      this.myMerchantDetail = row
      // this.listLoading = true
    },
    setSort() {
      const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function(dataTransfer) {
          dataTransfer.setData('Text', '')
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
        },
        onEnd: evt => {
          const targetRow = this.tableData.splice(evt.oldIndex, 1)[0]
          // alert(JSON.stringify(targetRow))
          // console.log(this.tableData)
          this.tableData.splice(evt.newIndex, 0, targetRow)
          // console.log(this.tableData)

          // for show the changes, you can delete in you code
          const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
          this.newList.splice(evt.newIndex, 0, tempIndex)
        }
      })
    },
    removeAmountGroup(item, qkIndex) {
      MessageBox.confirm('确认删除组 ' + item.groupName, '商户特定金额组', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        deleteQkAmount(item.id).then(response => {
          this.qkAmountList.splice(qkIndex, 1)
          this.listLoading = false
          Message.success(response.message)
        }).catch(err => {
          this.listLoading = false
          Message.error(err)
        })
      })
    },
    addAmountGroup(groupName) {
      if (!groupName) return Message.error('请输入组名')
      this.listLoading = true
      addQkAmount({ groupName, quickAmount: null }).then(response => {
        const id = response.data
        this.qkAmountList.push({ id, groupName, amount: [], inputVisible: false, inputValue: '' })
        // alert(JSON.stringify(this.qkAmountList))
        this.listLoading = false
      }).catch(err => {
        Message.error(err)
        this.listLoading = false
      })
    },
    showInput(item, index) {
      item.inputVisible = true
      this.$nextTick(_ => {
        const saveTag = 'saveTagInput_' + index
        this.$refs[saveTag][0].$refs.input.focus()
      })
    },
    handleInputConfirm(item, index) {
      const inputValue = Number(item.inputValue)
      if (inputValue && !Number.isNaN(inputValue) && Number.isInteger(inputValue) && inputValue > 0) {
        this.listLoading = true
        const quickAmount = Object.assign([], item.amount)
        quickAmount.push(inputValue)
        // alert(JSON.stringify(quickAmount))
        updateQkAmount({ id: item.id, quickAmount: quickAmount.toString() }).then(response => {
          this.listLoading = false
          this.qkAmountList[index].amount.push(inputValue)
          Message.success(response.message)
        }).catch(err => {
          this.listLoading = false
          Message.error(err)
        })
      } else {
        // '' 通过Number()转为 0
        if (inputValue !== 0) Message.error('请输入正整数')
      }
      item.inputVisible = false
      item.inputValue = ''
    },
    qkAmountTagClose(tag, index, item, qkIndex) {
      const amount = this.qkAmountList[qkIndex].amount.filter((it, idx) => idx !== index)
      this.listLoading = true
      const quickAmount = Object.assign([], amount)
      updateQkAmount({ id: item.id, quickAmount: quickAmount.toString() }).then(response => {
        this.listLoading = false
        this.qkAmountList[qkIndex].amount.splice(index, 1)
        Message.success(response.message)
      }).catch(err => {
        this.listLoading = false
        Message.error(err)
      })
    },
    payAmountList() {
      this.listLoading = true
      qkAmountList().then(response => {
        this.qkAmountList.length = 0
        response.data.forEach(item => {
          if (item.quickAmount) {
            item.amount = item.quickAmount.split(',')
          } else {
            item.amount = []
          }
          item.inputVisible = false
          item.inputValue = ''
          this.qkAmountList.push(item)
        })
        this.listLoading = false
      }).catch(err => {
        Message.error(err)
        this.listLoading = false
      })
    },
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background-color: #F7F6Fd;'
      }
    },
    tableRowClassName({ row, rowIndex }) {
    },
    payMethodConfigList() {
      this.tableDataLoading = true
      payMethodAllConfig().then(response => {
        // this.tableData.length = 0
        this.tableData = response.data
        // Array.prototype.push.apply(this.tableData, response.data)
        // console.log(this.tableData)
        this.tableDataLoading = false
        this.oldList = this.tableData.map(v => v.priority)
        this.newList = this.oldList.slice()
        this.$nextTick(() => {
          this.setSort()
        })
      }).catch(err => {
        Message.error(err)
        this.listLoading = false
      })
    }
  }

}

</script>
<style>
  .sortable-ghost{
    opacity: .8;
    color: #fff!important;
    background: #42b983!important;
  }
</style>
<style scoped>
@import '../../style/myMerchant.css';
 .payTypeIconSize {
  width: 30px;
  height: 30px;
  position: relative;
  top: 7px;
 }
</style>
