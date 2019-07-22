<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-form-item label="代理名称">
        <el-input v-model="listQuery.nickName" clearable style="width: 160px;" @keyup.enter.native="refreshList" />
      </el-form-item>
      <el-form-item label="代理ID">
        <el-input v-model.number="listQuery.id" clearable style="width: 160px;" @keyup.enter.native="refreshList"/>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="listQuery.state" style="width: 160px">
          <el-option v-for="item in stateList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="起始日期">
        <el-date-picker v-model="qishiDate" :picker-options="pickerOptions" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="dateChange"/>
      </el-form-item>
      <el-button v-waves class="filter-item" type="primary" @click="refreshList">{{ $t('table.search') }}</el-button>
      <el-button v-handle="add" v-waves class="filter-item" type="primary" @click="showDialog({})">添加</el-button>
    </el-form>
    <el-table v-loading="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="创建日期" prop="createDate" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="代理ID" prop="id" align="center"/>
      <el-table-column label="代理名称" prop="nickName" align="center"/>
      <el-table-column label="邮箱" prop="email" align="center"/>
      <el-table-column label="手机号" prop="phone" align="center"/>
      <el-table-column label="分润" prop="ratio" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ratio }} % </span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state === 1 ? 'success' : 'danger'">
            {{ scope.row.state === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding" min-width="190px">
        <template slot-scope="scope">
          <el-button v-handle="update" size="mini" @click="showDialog(scope.row)">修改</el-button>
          <el-button v-handle="resetPassword" size="mini" @click="resetPWD(scope.row)">密码重置</el-button>
          <el-button size="mini" @click="resetGoogle(scope.row)">重置谷歌秘钥</el-button>
          <el-button v-handle="unLockAccounts" v-if="scope.row.lockFlag===2" type="danger" size="mini" @click="unLock(scope.row)">{{ $t('merchantList.unlock') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :visible.sync="dialogPvVisible" :title="dialogTitle" :close-on-click-modal="false" width="600px">
      <el-form ref="formAdd" :model="formAdd" :rules="rules" label-position="right" label-width="99px">
        <el-form-item label="名称" prop="nickName">
          <el-input v-model="formAdd.nickName" style="width: 220px;"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formAdd.email" style="width: 220px;"/>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formAdd.phone" style="width: 220px;"/>
        </el-form-item>
        <el-form-item label="分润" prop="ratio">
          <el-input v-model="formAdd.ratio" style="width: 220px;">
            <template slot="append">&nbsp;&nbsp;%&nbsp;&nbsp;</template>
          </el-input>
        </el-form-item>
        <el-form-item v-if="dialogTitle === '修改代理'" label="状态">
          <el-select v-model="formAdd.state" style="width: 220px;">
            <el-option :value="1" label="启用"/>
            <el-option :value="2" label="禁用"/>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input :rows="2" v-model="formAdd.remarks" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogPvVisible = false">取 消</el-button>
        <el-button type="primary" @click="createConfirm('formAdd')">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { fetchList, fetchAdd, fetchUpdate, resetPwd, agentUnLock } from '@/api/manage/agentManage/agentList'
import waves from '@/directive/waves' // Waves directive
// import { Message } from 'element-ui'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { parseTime, pickerOptions } from '@/utils'

export default {
  name: 'AgentList',
  components: { Pagination },
  directives: { waves },
  data() {
    var checkPhone = (rule, value, callback) => {
      if (value) {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      } else {
        callback()
      }
    }
    var checkRatio = (rule, value, callback) => {
      if (value) {
        var reg = /^(?:[0-9]\d*|0)(?:\.\d{1,2})?$/
        if (reg.test(value)) {
          if (value.substr(0, 1) === '0' && value.substr(1, 1) !== '.' && value.length > 2) {
            return callback(new Error('格式错误, 请输入正确的格式'))
          } else {
            callback()
          }
        } else {
          return callback(new Error('只能输入数字，最多两位小数'))
        }
      } else {
        callback()
      }
    }
    return {
      add: 'manageAgentManage:agentList:add',
      update: 'manageAgentManage:agentList:update',
      resetPassword: 'manageAgentManage:agentList:resetPassword',
      unLockAccounts: 'manageAgentManage:agentList:unlock',
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      qishiDate: '',
      resetPwd: 1,
      resetGoogleSecret: 1,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        nickName: '',
        id: '',
        state: '',
        startDate: '',
        endDate: ''
      },
      unLockParams: {
        agentId: null,
        remark: null
      },
      stateList: [
        { label: '全部', value: '' },
        { label: '启用', value: '1' },
        { label: '禁用', value: '2' }
      ],
      formAdd: {
        nickName: '',
        email: '',
        phone: '',
        state: '',
        remarks: '',
        ratio: ''
      },
      rules: {
        nickName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        ratio: [
          { required: true, message: '请输入分润比例', trigger: 'blur' },
          { validator: checkRatio, trigger: ['blur', 'change'] }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: ['blur', 'change'] }
        ]
      },
      dialogPvVisible: false,
      dialogTitle: '',
      pickerOptions: {
        shortcuts: pickerOptions
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      // if (typeof (this.listQuery.id) === 'string') {
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
    showDialog(row) {
      var vm = this
      this.dialogPvVisible = true
      this.$nextTick(function() {
        for (var key in this.formAdd) {
          vm.formAdd[key] = row[key] || ''
        }
        if (row.id) {
          this.dialogTitle = '修改代理'
          this.formAdd.agentId = row.id
        } else {
          this.dialogTitle = '添加代理'
          delete this.formAdd.agentId
        }
        if (this.$refs.formAdd) this.$refs.formAdd.clearValidate()
      })
    },
    resetPWD(row) {
      this.$confirm('确定重置密码吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const agentId = row.id
        resetPwd({ resetPwd: this.resetPwd, agentId: agentId }).then(() => {
          this.$message({
            type: 'success',
            message: '重置成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消重置'
        })
      })
    },
    resetGoogle(row) {
      this.$confirm('确定重置谷歌秘钥吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const agentId = row.id
        resetPwd({ resetGoogleSecret: this.resetGoogleSecret, agentId: agentId }).then(() => {
          this.$message({
            type: 'success',
            message: '重置成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消重置'
        })
      })
    },
    unLock(row) {
      this.unLockParams.agentId = row.id
      agentUnLock(this.unLockParams).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        row.lockFlag = 1
      })
    },
    createConfirm(formName) {
      var vm = this
      var titleM = '创建成功'
      var responseDo = function() {
        vm.$message({
          message: titleM,
          type: 'success'
        })
        vm.refreshList()
        vm.dialogPvVisible = false
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (vm.formAdd.state) {
            titleM = '修改成功'
            fetchUpdate(vm.formAdd).then(responseDo)
          } else {
            fetchAdd(vm.formAdd).then(responseDo)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    refreshList() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    dateChange() {
      if (this.qishiDate) {
        this.listQuery.startDate = parseTime(this.qishiDate[0], '{y}-{m}-{d}')
        this.listQuery.endDate = parseTime(this.qishiDate[1], '{y}-{m}-{d}')
      } else {
        this.listQuery.endDate = ''
        this.listQuery.startDate = ''
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.el-checkbox+.el-checkbox{
  margin-left: 0;
}
.el-dialog__wrapper .from-bank .check-all.el-checkbox{
  width: 80px;
}
.el-dialog__wrapper .from-bank .quota-txt{
  display: inline-block;
  width: 100px;
  text-align: center;
}
</style>
