<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-form-item label="通道账户ID">
        <el-select v-model="listQuery.channelAccountIds" multiple filterable default-first-option collapse-tags clearable reserve-keyword placeholder="请选择商户ID" @focus="focusSelet('accountListData', 'channelAccountIds')">
          <el-option v-for="item in accountListData" :key="item.id" :label="item.name" :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="通道平台ID">
        <el-select v-model="listQuery.channelPlatformIds" multiple filterable default-first-option collapse-tags clearable reserve-keyword placeholder="请选择商户ID" @focus="focusSelet('channelListData', 'channelPlatformIds')">
          <el-option v-for="item in channelListData" :key="item.id" :label="item.name" :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="选择日期">
        <el-date-picker v-model="dateValue" :picker-options="pickerOptions" type="datetimerange" popper-class="custom-date" start-placeholder="开始日期" end-placeholder="结束日期" @focus="defaultDo" @change="dateChange"/>
      </el-form-item>
      <el-form-item>
        <el-button
          v-waves
          :disabled="disabledSearch"
          type="primary"
          class="filter-item"
          icon="el-icon-search"
          @click="refreshList">{{ $t('table.search') }}
        </el-button>
      </el-form-item>
      <el-form-item>
        <download-excel-component
          v-handle="exportBtn"
          :get-order-list="getOrderLists"
          :t-header="tHeader"
          :filter-val="filterVal"
          :time-array="timeArray"
          :title-name="titleName"
          :download-statu="downloadStatu"
        />
      </el-form-item>
      <!--<el-button v-waves class="filter-item" type="primary" @click="refreshList">{{ $t('table.search') }}</el-button>-->
      <br>
      <el-form-item label="总余额:">
        <span class="header-title">{{ summary.totalBalance }}</span>
      </el-form-item>
      <el-form-item label="冻结余额:">
        <span class="header-title">{{ summary.frozenBalance }}</span>
      </el-form-item>
      <el-form-item label="可用余额:">
        <span class="header-title">{{ summary.availableBalance }}</span>
      </el-form-item>
    </el-form>
    <div style="margin-bottom: 20px">
      <el-button v-waves class="filter-item" type="primary" @click="removeStyle(1)">全部展开</el-button>
      <el-button v-waves class="filter-item" type="primary" @click="removeStyle(2)">全部收起</el-button>
    </div>
    <el-table v-loading="listLoading" id="channel-custom-table" :key="tableKey" :data="list" row-key="id" border fit highlight-current-row style="width: 100%;" @row-click="rowClick">
      <el-table-column label="账户名称" prop="channelAccountName" label-class-name="mingcheng" class-name="mingcheng-td"/>
      <el-table-column label="时间" prop="createDate" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.createDate">{{ scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          <span v-else>当前</span>
        </template>
      </el-table-column>
      <el-table-column label="总余额" prop="totalBalance" align="center">
        <template slot-scope="scope">
          <div>
            {{ scope.row.totalBalance | getAvailableBalance }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="可用余额" prop="availableBalance" align="center">
        <template slot-scope="scope">
          <div>
            {{ scope.row.availableBalance | getAvailableBalance }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="冻结余额" prop="frozenBalance" align="center">
        <template slot-scope="scope">
          <div>
            {{ scope.row.frozenBalance | getAvailableBalance }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="明细" prop="detail" align="center" class-name="merge-column">
        <template slot-scope="scope">
          <div v-for="(value, key) in scope.row.detail" :key="key" class="merge-list">
            {{ key }} : {{ value }}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>

import { fetchList, channelAccountList, channelList } from '@/api/manage/channelManage/channelAccountSearch'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { parseTime, pickerOptions } from '@/utils'
import { exportExcel } from '@/utils'
import DownloadExcelComponent from '@/components/DownloadExcel/index.vue' // 1/7 引入

export default {
  name: 'ChannelAccountSearch',
  filters: {
    getAvailableBalance(value) {
      if ((value < 0 || !value) && value !== 0) {
        return '-'
      }
      return value
    },
    parseTime
  },
  components: { Pagination, DownloadExcelComponent },
  directives: { waves },
  data() {
    return {
      exportBtn: 'manageChannelManage:channelAccountSearch:export',
      tableKey: -1,
      list: [],
      total: 0,
      listLoading: true,
      disabledSearch: false,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        startDate: '',
        endDate: '',
        channelAccountIds: '',
        channelPlatformIds: ''
      },
      summary: {
        availableBalance: 0,
        frozenBalance: 0,
        totalBalance: 0
      },
      dateValue: '',
      channelListData: [],
      accountListData: [],
      titleName: '通道账号余额查询', // excel文件名
      downloadStatu: 0,
      tHeader: ['总金额', '冻结余额', '创建时间', '通道账户名称', '通道账户ID', '可用余额'], // 表头名字——写法注意：如审核状态：'审核状态:   1:待审核，2.审核中,3.审核通过，4.审核不通过'
      filterVal: ['totalBalance', 'frozenBalance', 'createDate', 'channelAccountName', 'channelAccountId', 'availableBalance'], // 表头名字对应接口参数
      timeArray: ['createDate'], // 要转时间格式的数据 如：["创建时间","修改时间"]
      pickerOptions: {
        shortcuts: pickerOptions
      }
    }
  },
  created() {
    this.getList()
    this.getChannelAccount()
    this.getChannelList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.disabledSearch = true
      fetchList(this.listQuery).then(response => {
        for (var key in this.summary) {
          this.$set(this.summary, key, response.summary[key])
        }
        var result = []
        var id = 1
        response.list.forEach(element => {
          var name = element.channelAccountName
          var rowObj = Object.assign({ channelAccountName: name, id: id }, element.balances[0])
          if (element.balances.length > 1) {
            element.balances.shift()
            rowObj.children = []
            element.balances.forEach(item => {
              id += 1
              item.id = id
              rowObj.children.push(item)
            })
          }
          id += 1
          result.push(rowObj)
        })
        this.tableKey += 1
        this.$set(this, 'list', result)
        this.total = response.total
        this.listLoading = false
      })
      // 产品需求--限制1秒钟请求一次
      setTimeout(() => {
        this.disabledSearch = false
      }, 1000)
    },
    getChannelList() {
      channelList().then(response => {
        this.channelListData = response
      })
    },
    getChannelAccount() {
      channelAccountList().then(response => {
        this.accountListData = response
      })
    },
    refreshList() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    dateChange(value) {
      if (value) {
        this.listQuery.startDate = parseTime(value[0], '{y}-{m}-{d} {h}:{i}:{s}')
        this.listQuery.endDate = parseTime(value[1], '{y}-{m}-{d} {h}:{i}:{s}')
      } else {
        this.listQuery.startDate = ''
        this.listQuery.endDate = ''
      }
    },
    getOrderLists() {
      return exportExcel(this.total, this.listQuery, fetchList, this)// （总条数，查询条件，接口方法）
    },
    focusSelet(list, key) {
      var vm = this
      vm.$nextTick(() => {
        const elSelect = document.querySelectorAll('.el-select-dropdown')
        for (var i = 0; i < elSelect.length; i++) {
          var parent = elSelect[i].parentNode
          var elSelectWrap = elSelect[i].querySelector('.el-select-dropdown__wrap.el-scrollbar__wrap')
          var allSelect = elSelectWrap.querySelector('.go-select-all')
          if (!allSelect && parent.tagName === 'BODY') {
            var evdiv = document.createElement('div')
            evdiv.className = 'go-select-all'
            evdiv.innerHTML = '<span id="select-all">全选</span><span id="selection-all">反选</span>'
            elSelectWrap.querySelector('.el-scrollbar__view.el-select-dropdown__list').style.paddingTop = '0px'
            elSelectWrap.insertBefore(evdiv, elSelectWrap.childNodes[0])
            evdiv.querySelector('#select-all').addEventListener('click', function() {
              var selectData = vm[list].map((item) => {
                return item.id
              })
              vm.$set(vm.listQuery, key, selectData)
            })
            evdiv.querySelector('#selection-all').addEventListener('click', function() {
              vm.$set(vm.listQuery, key, [])
            })
          }
        }
      }, 1000)
    },
    defaultDo() {
      var date = new Date()
      var start = new Date(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':00:00')
      var end = new Date(start.getTime() + (24 * 60 * 60 * 1000))
      if (!this.dateValue) {
        this.$set(this, 'dateValue', [start, end])
        this.dateChange(this.dateValue)
      }
    },
    removeStyle(type) {
      this.$nextTick(() => {
        var cunstomTable = document.getElementById('channel-custom-table')
        var trs = cunstomTable.querySelectorAll('table tbody tr')
        for (var i = 0; i < trs.length; i++) {
          // trs[i].setAttribute('style', '')
          var elTableExpandIcon = trs[i].querySelector('.el-table__expand-icon')
          var clsN = ''
          if (elTableExpandIcon) {
            clsN = elTableExpandIcon.className
            if (type === 1 && clsN.indexOf('el-table__expand-icon--expanded') <= -1) {
              elTableExpandIcon.click()
            }
            if (type === 2 && clsN.indexOf('el-table__expand-icon--expanded') > -1) {
              elTableExpandIcon.click()
            }
          }
        }
      })
    },
    rowClick(row, column, event) {
      var tr = event.currentTarget
      var elTableExpandIcon = tr.querySelector('.el-table__expand-icon')
      if (elTableExpandIcon) {
        elTableExpandIcon.click()
      }
    }
  }
}
</script>

<style lang='scss' scoped>
  .demo-form-inline .el-form-item .header-title {
    font-size: 24px;
    width: 200px;
    display: inline-block;
    color: #409EFF;
    font-weight: bold;
  }
</style>
<style>
  .el-select-dropdown__wrap .go-select-all{
    font-size: 14px;
    position: relative;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #535455;
    height: 34px;
    line-height: 34px;
    border-bottom: 1px solid #ebe8e8;
  }
  .el-select-dropdown__wrap .go-select-all span{
    display: inline-block;
    text-align: center;
    width: 50%;
    cursor: pointer;
  }
  .el-select-dropdown__wrap .go-select-all span:hover{
    color: #409EFF;
  }
  .el-select-dropdown__wrap .go-select-all span:last-child{
    border-left: 1px solid #ebe8e8;
  }
  .custom-date .el-picker-panel__body
  .el-time-panel__content
  .el-time-spinner
  .el-time-spinner__wrapper+.el-time-spinner__wrapper ul li+li{
    display: none
  }
  .el-table__body-wrapper .merge-column{
    padding: 0;
  }
  .el-table__body-wrapper .merge-column .cell{
    padding: 0;
  }
  .el-table__body-wrapper .merge-column .merge-list{
    line-height: 30px;
  }
  .el-table__body-wrapper .merge-column .merge-list+.merge-list{
    border-top: 1px solid #EBEEF5;
  }
  #channel-custom-table .el-table__expand-icon>.el-icon{
    margin-left: -9px;
    margin-top: -9px;
    font-size: 18px;
    color: #409EFF;
    font-weight: bold;
  }
  #channel-custom-table .mingcheng-td{
    padding-left: 5%;
  }
  #channel-custom-table thead .mingcheng{
    text-align: center;
    padding-left: 0;
  }
</style>
