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
        <el-date-picker v-model="dateValue" type="datetimerange" popper-class="custom-date" start-placeholder="开始日期" end-placeholder="结束日期" @focus="defaultDo" @change="dateChange"/>
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
    <el-table v-loading="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="总余额" prop="totalBalance" align="center"/>
      <el-table-column label="冻结余额" prop="frozenBalance" align="center"/>
      <el-table-column label="创建时间" prop="createDate" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="通道账户名称" prop="channelAccountName" align="center"/>
      <el-table-column label="通道账户ID" prop="channelAccountId" align="center"/>
      <el-table-column label="可用余额" prop="availableBalance" align="center"/>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>

import { fetchList, channelAccountList, channelList } from '@/api/manage/channelManage/channelAccountSearch'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { parseTime } from '@/utils'
import { Message } from 'element-ui'
import DownloadExcelComponent from '@/components/DownloadExcel/index.vue' // 1/7 引入

export default {
  name: 'ChannelAccountSearch',
  components: { Pagination, DownloadExcelComponent },
  directives: { waves },
  data() {
    return {
      exportBtn: 'manageChannelManage:channelAccountSearch:export',
      tableKey: 0,
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
      tHeader: ['总金额', '冻结余额', '创建时间', '通道账户名称', '通道账户ID', '可用余额'], // 表头名字——写法注意：如审核状态：'审核状态:   1:待审核，2.审核中,3.审核通过，4.审核不通过'
      filterVal: ['totalBalance', 'frozenBalance', 'createDate', 'channelAccountName', 'channelAccountId', 'availableBalance'], // 表头名字对应接口参数
      timeArray: ['createDate'] // 要转时间格式的数据 如：["创建时间","修改时间"]
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
        this.list = response.list
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
    getOrderLists() { // 5/7 分线程获取数据
      return new Promise((resolve, reject) => {
        // console.log('this.total', this.total)  //检测下total是否正确
        // 调整参数  是否分20个线程组装
        if (this.total === 0) {
          Message.error('暂无数据')
          resolve()
        } else if (this.total <= 500) {
          const parmas = Object.assign({}, this.listQuery)
          parmas.pageSize = this.total
          parmas.pageNo = 1
          fetchList(parmas).then((res) => { resolve(res.list) })
        } else {
          if (this.total > 100000) {
            Message.success('最多只能导出100000条信息，正在为你导出...')
            this.total = 100000
          }
          // 分20个线程请求
          const allListData = []// 顺序数组
          const PromiseArr = []
          for (let i = 0; i < 20; i++) {
            const parmas = Object.assign({}, this.listQuery)
            parmas.pageSize = Math.ceil(this.total / 20)
            PromiseArr.push(
              (() => {
                return new Promise((open) => {
                  parmas.pageNo = i + 1
                  let unitData = []// 每页数组
                  fetchList(parmas).then((res) => {
                    unitData = res.list.map((v) => v)
                    allListData[i] = unitData
                    open()
                  })
                })
              })()
            )
          }
          Promise.all(PromiseArr).then(() => {
            // console.log('[].concat.apply([], allListData)', [].concat.apply([], allListData))
            resolve([].concat.apply([], allListData))
          })
        }
      })
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
</style>
