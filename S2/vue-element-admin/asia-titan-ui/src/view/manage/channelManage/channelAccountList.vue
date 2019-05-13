<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-form-item label="账号">
        <el-input v-model="listQuery.accountNo" clearable placeholder="请输入账号" style="width: 240px;" onkeyup="this.value=this.value.replace(/\D/g,'')"/>
      </el-form-item>
      <el-form-item label="通道平台名称">
        <el-select v-model="listQuery.channelPlatformId" style="width: 160px;">
          <el-option v-for="(item, idx) in listKey" :key="idx" :label="item.name" :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="listQuery.status" style="width: 120px;">
          <el-option value="" label="全部" />
          <el-option :value="1" label="启用" />
          <el-option :value="2" label="禁用" />
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
      <el-button v-handle="add" v-waves class="filter-item" type="primary" @click="$router.push({ name: 'NewAccount', params: { id: 'new' }})">新建通道账号</el-button>
      <!-- <el-form-item>
        <el-button v-waves class="filter-item" type="primary" @click="badchTrade">批量关闭交易</el-button>
      </el-form-item> -->
    </el-form>
    <el-table v-loading="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="通道账户名称" prop="name" align="center">
        <template slot-scope="scope"><span>{{ scope.row.name }}</span></template>
      </el-table-column>
      <el-table-column label="通道账户号" prop="accountNo" align="center">
        <template slot-scope="scope"><span>{{ scope.row.accountNo }}</span></template>
      </el-table-column>
      <el-table-column label="每日限额" prop="dailyQuota" align="center">
        <template slot-scope="scope"><span>{{ scope.row.dailyQuota }}</span></template>
      </el-table-column>
      <el-table-column label="状态" prop="status" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | getStatus(true)">
            {{ scope.row.status | getStatus }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-handle="view" size="mini" plain @click="$router.push({ name: 'AccountDetail', params: { id: scope.row.id }})">
            查看
          </el-button>
          <el-button v-handle="update" size="mini" plain @click="$router.push({ name: 'NewAccount', params: { id: scope.row.id }})">
            修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :visible.sync="dialogPvVisible" :close-on-click-modal="false" title="新建通道" width="600px" class="detail">
      <el-form ref="dataForm" :model="formData" label-position="right" label-width="99px">
        <el-form-item label="通道ID">
          <span>系统自动配置</span>
        </el-form-item>
        <el-form-item label="映射">
          <el-select v-model="formData.key">
            <el-option v-for="(item, idx) in listKey" :key="idx" :label="item.name" :value="item.key"/>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="createConfirm('dataForm')">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { fetchList } from '@/api/manage/channelManage/channelAccountList'
import { fetchKey } from '@/api/manage/channelManage/channelTradeRoute'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ChannelAccountList',
  components: { Pagination },
  directives: { waves },
  filters: {
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
      add: 'manageChannelManage:channelAccountList:add',
      view: 'manageChannelManage:channelAccountList:view',
      update: 'manageChannelManage:channelAccountList:update',
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      dialogPvVisible: false,
      listQuery: {
        pageNo: 1,
        pageSize: 10
      },
      formData: {
        key: ''
      },
      listKey: []
    }
  },
  created() {
    this.getList()
    fetchKey().then(response => {
      response.unshift({ id: '', name: '全部' })
      this.listKey = response
    })
  },
  methods: {
    refreshList() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.list
        this.total = response.total
        this.listLoading = false
      })
    },
    handleModifyStatus(row, value) {
      // const vm = this
      // fetchUpdate({ id: row.id, status: value }).then(response => {
      //   row.status = value
      //   vm.$message({
      //     message: '操作成功',
      //     type: 'success'
      //   })
      // })
    },
    createConfirm(formName) {
      // var vm = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // fetchAdd(vm.formData).then(response => {
          //   vm.$message({
          //     message: '创建成功',
          //     type: 'success'
          //   })
          //   vm.dialogPvVisible = false
          // })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
