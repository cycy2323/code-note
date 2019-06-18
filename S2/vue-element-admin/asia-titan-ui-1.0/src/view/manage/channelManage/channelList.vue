<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-handle="add" v-waves class="filter-item" type="primary" @click="dialogPvVisible = true">新建通道</el-button>
    </div>
    <el-table v-loading="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="通道ID" prop="id" align="center">
        <template slot-scope="scope"><span>{{ scope.row.id }}</span></template>
      </el-table-column>
      <el-table-column label="映射" prop="name" align="center">
        <template slot-scope="scope"><span>{{ scope.row.name }}</span></template>
      </el-table-column>
      <el-table-column class-name="merge-column" label="通道名称" prop="channelStatuses" align="center">
        <template slot-scope="scope">
          <div v-for="item in scope.row.channelStatuses" :key="item.channelKey" class="merge-list">
            <span>{{ item.channelName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column class-name="merge-column" label="状态" prop="channelStatuses" align="center">
        <template slot-scope="scope">
          <div v-for="item in scope.row.channelStatuses" :key="item.channelKey" class="merge-list">
            <el-tag :type="item.status === 1 ? 'success' : 'danger'">
              {{ item.status === 1 ? '启用' : '关闭' }}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column class-name="merge-column" label="操作" align="center">
        <template slot-scope="scope">
          <div v-for="item in scope.row.channelStatuses" :key="item.channelKey" class="merge-list">
            <el-button v-handle="update" plain size="mini" @click="showStatus(scope.row, item)">修改状态</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" /> -->

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

    <el-dialog :visible.sync="dialogStVisible" :close-on-click-modal="false" title="修改状态" width="600px" class="detail">
      <el-form :model="statusForm" label-position="right" label-width="99px">
        <el-form-item label="状态">
          <el-select v-model="statusForm.status">
            <el-option :value="1" label="启用"/>
            <el-option :value="2" label="关闭"/>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="代付状态">
          <el-select v-model="statusForm.remitStatus">
            <el-option :value="1" label="启用"/>
            <el-option :value="2" label="关闭"/>
          </el-select>
        </el-form-item> -->
        <el-form-item label="谷歌验证码">
          <el-input v-model="statusForm.googleCode" style="width: 200px;"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" plain @click="dialogStVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleModifyStatus()">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { fetchList, fetchUpdate, fetchAdd, fetchKey } from '@/api/manage/channelManage/channelList'
import waves from '@/directive/waves' // Waves directive
// import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ChannelList',
  // components: { Pagination },
  directives: { waves },
  data() {
    return {
      add: 'manageChannelManage:channelList:add',
      update: 'manageChannelManage:channelList:update',
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      dialogPvVisible: false,
      dialogStVisible: false,
      listQuery: {
        pageNo: 1,
        pageSize: 10
      },
      formData: {
        key: ''
      },
      statusForm: {
        id: '',
        status: '',
        channelKey: '',
        // payStatus: '',
        // remitStatus: '',
        googleCode: ''
      },
      listKey: []
    }
  },
  created() {
    var vm = this
    this.getList()
    fetchKey().then(response => {
      vm.listKey = response
      vm.formData.key = vm.listKey[0].key
    })
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.list
        this.listLoading = false
      })
    },
    handleModifyStatus(row, value) {
      const vm = this
      if (!this.statusForm.googleCode) {
        this.$message.error('请输入谷歌验证码')
        return
      }
      fetchUpdate(this.statusForm).then(response => {
        vm.getList()
        vm.$message({
          message: '修改成功',
          type: 'success'
        })
        vm.dialogStVisible = false
      })
    },
    showStatus(row, channel) {
      this.statusForm.id = row.id
      this.statusForm.status = channel.status
      this.statusForm.channelKey = channel.channelKey
      this.dialogStVisible = true
    },
    createConfirm(formName) {
      var vm = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          fetchAdd(vm.formData).then(response => {
            vm.$message({
              message: '创建成功',
              type: 'success'
            })
            vm.getList()
            vm.dialogPvVisible = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style>
  .el-table__body-wrapper .merge-column{
    padding: 0;
  }
  .el-table__body-wrapper .merge-column .cell{
    padding: 0;
  }
  .el-table__body-wrapper .merge-column .merge-list{
    line-height: 45px;
  }
  .el-table__body-wrapper .merge-column .merge-list+.merge-list{
    border-top: 1px solid #EBEEF5;
  }
</style>
