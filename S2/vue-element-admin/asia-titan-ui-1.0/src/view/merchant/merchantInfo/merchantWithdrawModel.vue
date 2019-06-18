<template>
  <div class="app-container">
    <div class="filter-container" style="width: 100%;background: #FFFFFF;margin-bottom: 20px;padding: 20px 20px;position: relative;">
      <div class="typeTitel">
        <span>{{ isModule==="上传表格提现"?"手动填表提现":"上传表格提现" }}</span>
        <el-button
          v-waves
          class="filter-item pan-btn green-btn togoModel"
          type="primary"
          @click="changeWithdrawType">
          {{ isModule }}
        </el-button>
      </div>
      <span v-handle="totalAmount" style="margin-right: 100px">账户余额（元）：<span style="color: red">{{ homeInfoData && homeInfoData.totalAmount }}</span></span>
      <br>
      <div v-if="isModuleWithdraw" style="margin: 10px 0">
        <el-button
          v-waves
          :loading="downloadLoading"
          class="filter-item"
          type="primary"
          icon="el-icon-download">
          <!--如后端添加银行名称，前端除了加阿里图标，还要再static的withdrawTableModel.xlsx的下拉菜单中添加银行名称选项-->
          <a href="./static/withdrawTableModel.xlsx" download="withdrawTableModel.xlsx">下载模板</a>
        </el-button>
        <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
      </div>
      <div v-if="isModuleWithdraw" style="color: red;font-size: 12px">
        操作步骤：1、下载模板并按照模板填写信息，必填项不可为空。 2、上传填写好的模板文件。
        3、二次确认提交信息是否有误，如填写有误，将统一不会提交提现。 4、填写支付密码和谷歌验证码。
        5、提交批量提现，等待返回批量提交提现结果。
      </div>
      <!--<el-button-->
      <!--v-waves-->
      <!--class="filter-item pan-btn green-btn togoModel"-->
      <!--type="primary"-->
      <!--@click="changeWithdrawType">-->
      <!--{{ isModule }}-->
      <!--</el-button>-->
    </div>
    <el-table v-if="isModuleWithdraw" :data="list" border highlight-current-row style="width: 100%;margin-top:20px;height:550px;overflow: auto">
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" align="center" />
    </el-table>
    <el-table
      v-loading="listLoading"
      v-else
      :data="listQuery.transferList"
      fit
      height="600px"
      highlight-current-row
      @sort-change="sortChange">
      <el-table-column :label="$t('table.carNumRequired')" align="center">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.cardNum"
            clearable
            oninput="this.value=(this.value>=1)?this.value:'';"
            placeholder="请输入数字"
            size="mini"
            @blur="getCarNum(scope.row)"/>
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
          <!--this.value=this.value.replace(/\./g,'');-->
          <el-input
            v-model="scope.row.amount"
            placeholder="请输入大于1的数值"
            oninput="this.value=(this.value>=1)?this.value:'';"
            size="mini"
            @blur="getAmount(scope.row)"/>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.bankNameRequired')" align="center">
        <template slot-scope="scope">
          <!--clearable style="width: 160px"-->
          <el-select v-model="scope.row.bankName" :placeholder="$t('merchantList.whole')">
            <el-option v-for="(value,index) in bankList" :key="index" :value="value.name" :label="value.name"/>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.tips')" align="center">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.remark"
            size="mini"/>
        </template>
      </el-table-column>
      <el-table-column :label="$t('accountManage.operation')" min-width="100px" align="center">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="rowDelete(scope.$index, listQuery.transferList)">删除</el-button>
          <el-button type="primary" size="mini" @click="addList(scope.$index, listQuery.transferList)">加一行</el-button>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <div v-handle="modelWithdraw" class="footer-submit">
      支付密码：
      <el-input
        v-model="listQuery.payPass"
        :placeholder="$t('table.pwRequired')"
        type="text"
        autocomplete="off"
        onfocus="this.type='password'"
        style="width: 300px;margin-right: 20px"
        class="filter-item"
        @keyup.enter.native="handleFilter"/>
      谷歌验证码：
      <el-input
        v-model="listQuery.googleCode"
        oninput="this.value=this.value.replace(/e|-/g,'');this.value=this.value.replace(/\./g,'');"
        placeholder="请输入数字格式"
        clearable
        style="width: 300px;margin-right: 20px"
        class="filter-item"
        @keyup.enter.native="handleFilter"/>
      <el-button
        v-waves
        :disabled="disabled"
        class="filter-item pan-btn green-btn"
        type="primary"
        size="small"
        icon="el-icon-upload2"
        @click="submitList">{{ $t('table.Submission') }}
      </el-button>
      <el-button
        v-waves
        v-if="!isModuleWithdraw"
        class="filter-item pan-btn-withdraw green-btn"
        type="primary"
        size="small"
        @click="resetList">清空列表
      </el-button>
      <el-button
        v-waves
        v-if="!isModuleWithdraw"
        class="filter-item pan-btn-withdraw"
        type="primary"
        size="small"
        @click="addList">加一行
      </el-button>
    </div>
  </div>
</template>

<script>
import { ModeladdTransfer } from '@/api/merchant/merchantInfo/merchantWithdrawModel'
import { getAllBankList } from '@/api/merchant/merchantInfo/merchantRecharge'
import { addTransfer } from '@/api/merchant/merchantInfo/merchantWithdrawList'
import { getReport } from '@/api/merchant/merchantHome/homeInfo'
import { Message } from 'element-ui'
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

import DragDialog from '@/view/common/dragDialog'
import editorImage from '../../../components/Tinymce/components/editorImage'
import uploadCard from '../../common/uploadCard'

export default {
  name: 'MerchantWithdrawModel',
  components: { DragDialog, Pagination, uploadCard, editorImage, UploadExcelComponent },
  directives: { waves },
  data() {
    return {
      homeInfoData: null,
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
      disabled: false,
      bankList: [],
      // ///////
      isModuleWithdraw: false,
      isModule: '上传表格提现',
      tableHeader: [],
      list: null,
      excelList: [{ 'cardNum': '413513', 'realName': '张三', 'amount': '20', 'bankName': '中国农业银行', 'remark': '' }],
      total: 0,
      ModellistQuery: {
        transferList: [] //
      },
      downloadLoading: false,
      // disabled: false
      modelWithdraw: 'merchantInfo:merchantWithdrawModel:modelWithdraw',
      totalAmount: 'merchantInfo:merchantWithdrawModel:totalAmount'
    }
  },
  created() {
    getAllBankList().then(response => {
      this.bankList = response
    })
    // 查看请求权限
    var getCodeList = localStorage.getItem('codeList')
    var myCodeList = getCodeList ? JSON.parse(getCodeList) : []
    if (myCodeList.indexOf('merchantInfo:merchantWithdrawModel:totalAmount') > -1) {
      getReport().then(res => {
        this.homeInfoData = res
      })
    }
    this.resetList()
  },
  methods: {
    changeWithdrawType() {
      if (this.isModule === '上传表格提现') {
        this.isModule = '手动填表提现'
        this.resetList()
        this.isModuleWithdraw = true
      } else {
        this.isModule = '上传表格提现'
        this.ModelresetList()
        this.isModuleWithdraw = false
      }
    },
    getAmount(row) {
      if (Number(row.amount) < 1 || row.amount < 1) {
        row.amount = ''
      } else {
        row.amount = parseFloat(row.amount).toFixed(2)
      }
    },
    getCarNum(row) {
      if (Number(row.cardNum) < 1 || row.cardNum < 1) {
        row.cardNum = ''
      }
    },
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
    addList(index, rows) {
      if (rows) {
        rows.splice(index, 0, {
          cardNum: '',
          realName: '',
          amount: '',
          bankName: '',
          remark: ''
        })
      } else {
        this.listQuery.transferList.push({
          cardNum: '',
          realName: '',
          amount: '',
          bankName: '',
          remark: ''
        })
      }
    },
    rowDelete(index, row) {
      row.splice(index, 1)
    },
    handleFilter() {
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    // 提交
    submitList() {
      this.disabled = true
      if (!this.listQuery.payPass) {
        Message.error('请输入支付密码')
        this.disabled = false
        return
      }
      if (!this.listQuery.googleCode) {
        Message.error('请输入谷歌验证码')
        this.disabled = false
        return
      }
      if (this.isModuleWithdraw) {
        // 验证
        if (this.ModellistQuery.transferList.length === 0 || !this.ModellistQuery.transferList) {
          Message.error('没有要提现的数据')
          this.disabled = false
          return
        }
        const pramps = Object.assign({}, this.ModellistQuery)
        pramps.payPass = (this.listQuery.payPass && this.$md5(this.listQuery.payPass))
        pramps.googleCode = this.listQuery.googleCode
        ModeladdTransfer(pramps).then(() => {
          Message.success('操作成功')
          this.listLoading = false
          this.ModelresetList()
          this.disabled = false
        }).catch(() => {
          this.listLoading = false
          this.disabled = false
        })
      } else { // TODO待循环验证
        if (this.listQuery.transferList.length === 0) {
          Message.error('没有要提现的数据')
          this.disabled = false
          return
        }
        const listData = this.listQuery.transferList
        if (listData.length === 1) {
          if (!listData[0].cardNum) {
            Message.error('银行卡号不能为空')
            this.disabled = false
            return
          }
          if (!listData[0].realName) {
            Message.error('持卡人姓名不能为空')
            this.disabled = false
            return
          }
          if (!listData[0].amount) {
            Message.error('金额不能为空')
            this.disabled = false
            return
          }
          if (!listData[0].bankName) {
            Message.error('银行名称不能为空')
            this.disabled = false
            return
          }
        }
        // 参数调整(加密）
        const pramps = Object.assign({}, this.listQuery)
        pramps.payPass = (pramps.payPass && this.$md5(pramps.payPass))
        addTransfer(pramps).then(response => {
          Message.success('操作成功')
          this.listLoading = false
          this.resetList()
          this.disabled = false
        }).catch(() => {
          this.disabled = false
          this.listLoading = false
        })
      }
    },

    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    handleSuccess({ results, header }) {
      console.log('results', results)
      console.log('header', header)
      // 参数对应：对象数组key替换方法 (
      const arr = results.map((item) => {
        return {
          cardNum: item['银行卡号码（必填）'],
          realName: item['持卡人姓名（必填）'],
          amount: item['提现金额（必须为大于1且最多保留两位小数的数值）'].replace(' ', ''), // 去掉多余空格
          bankName: item['银行名称（必填）必须与下拉菜单中的银行名称完全一致'],
          remark: item['说明']
        }
      })
      this.list = results
      this.ModellistQuery.transferList = arr
      this.tableHeader = header
    },
    // 重置列表
    ModelresetList() {
      this.ModellistQuery.transferList = []
      this.list = []
      this.ModellistQuery.payPass = ''
      this.ModellistQuery.googleCode = ''
      this.listQuery.payPass = null//
      this.listQuery.googleCode = undefined //
    }
  }
}
</script>

<style scoped>
  .footer-submit{
    text-align: center;
  }
  .togoModel{
    font-size:20px;
  }
  .typeTitel{
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-size:24px;
    color: #42B983;
  }
</style>
