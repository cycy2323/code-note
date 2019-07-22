<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-form-item label="用户名称">
        <el-input v-model="listQuery.userName" clearable style="width: 200px;" @keyup.enter.native="refreshList" />
      </el-form-item>
      <el-button v-waves class="filter-item" type="primary" @click="refreshList">{{ $t('table.search') }}</el-button>
      <el-button v-handle="add" v-waves class="filter-item" type="primary" @click="showDialog({})">添加</el-button>
    </el-form>

    <el-table v-loading="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="用户名称" prop="userName" align="center"/>
      <el-table-column label="邮箱" prop="email" align="center"/>
      <el-table-column label="手机号" prop="phone" align="center"/>
      <el-table-column label="角色名称" prop="roleNames" align="center"/>
      <el-table-column label="状态" prop="state" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state === 1 ? 'success' : 'danger'">
            {{ scope.row.state === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding">
        <template slot-scope="scope">
          <el-button v-handle="update" size="mini" style="margin-bottom: 5px" @click="showDialog(scope.row)">修改</el-button>
          <el-button v-handle="logout" type="danger" size="mini" @click="handleLogout(scope.row)">强制登出</el-button>
          <el-button v-handle="resetGoogleSecret" size="mini" @click="handleResetGoogleSecret(scope.row)">重置谷歌验证码</el-button>
          <el-button v-handle="updatePayPasswordRose" size="mini" @click="handleUpdatePayPassword(scope.row)">修改支付密码</el-button>
          <el-button v-handle="loginPasswordRose" size="mini" style="margin-top: 5px" @click="handleLoginPassword(scope.row)">修改登录密码</el-button>
          <el-button v-handle="unlockAccount" v-if="scope.row.lockFlag===2" type="danger" size="mini" @click="unLock(scope.row)">{{ $t('merchantList.unlock') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <!--修改-->
    <el-dialog :visible.sync="dialogPvVisible" :title="dialogTitle" :close-on-click-modal="false" width="600px">
      <el-form ref="formAdd" :model="formAdd" :rules="rules" label-position="right" label-width="99px">
        <el-form-item label="账号" prop="userName">
          <el-input :disabled="isDisable" v-model="formAdd.userName" style="width: 220px;"/>
        </el-form-item>
        <el-form-item label="名称" prop="nickName">
          <el-input v-model="formAdd.nickName" style="width: 220px;"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formAdd.email" style="width: 220px;"/>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formAdd.phone" style="width: 220px;"/>
        </el-form-item>
        <el-form-item v-if="dialogTitle === '修改员工'" label="绑定Ip地址">
          <el-input v-model="formAdd.userBindIp" type="textarea" style="width: 220px;"/>
          <br>
          <span style="color: red">多个ip之间以英文‘;’分隔</span>
        </el-form-item>
        <el-form-item v-if="dialogTitle === '修改员工'" label="状态" prop="state">
          <el-select v-model="formAdd.state" style="width: 220px;">
            <el-option :value="1" label="启用"/>
            <el-option :value="2" label="禁用"/>
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="roleList">
          <el-select v-model="formAdd.roleList" style="width: 220px;">
            <el-option v-for="item in roleList" :key="item.id" :value="item.id" :label="item.name"/>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogPvVisible = false">取 消</el-button>
        <el-button type="primary" @click="createConfirm('formAdd')">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>

    <!--登出等一系列按钮-->
    <el-dialog :visible.sync="dialogVisible" :title="dialogUpdateTitle" :close-on-click-modal="false" width="600px">
      <el-form ref="formAdd" :model="formAdd" :rules="rules" label-position="right" label-width="99px">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="formAdd.userId" disabled style="width: 220px;"/>
        </el-form-item>
        <el-form-item v-if="dailogStatus==='loginPassword'|| dailogStatus==='updatePayPassword'" :label="dailogStatus==='updatePayPassword'?'支付密码':'登录密码'" prop="password">
          <el-input v-model="formAdd.password" type="password" style="width: 220px;"/>
        </el-form-item>
        <el-form-item v-if="dailogStatus==='loginPassword'|| dailogStatus==='updatePayPassword'" :label="dailogStatus==='updatePayPassword'?'确认支付密码':'确认登录密码'" prop="password">
          <el-input v-model="formAdd.confirmPassword" type="password" style="width: 220px;"/>
        </el-form-item>
        <el-form-item label="谷歌验证码" prop="googleCode">
          <el-input v-model="formAdd.googleCode" style="width: 220px;"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('formAdd')">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, empUnLock, fetchAdd, fetchUpdate, fetchQueryRole, logout, resetGoogleSecret, updatePayPassword, loginPassword } from '@/api/manage/employeeManage/employeeAccount'
import waves from '@/directive/waves' // Waves directive
// import { Message } from 'element-ui'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'EmployeeAccount',
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
    return {
      add: 'employeeManage:employeeAccount:add',
      update: 'employeeManage:employeeAccount:update',
      logout: 'employeeManage:employeeAccount:logout',
      resetGoogleSecret: 'employeeManage:employeeAccount:resetGoogleSecret',
      updatePayPasswordRose: 'employeeManage:employeeAccount:updatePayPassword',
      loginPasswordRose: 'employeeManage:employeeAccount:updatePassword',
      unlockAccount: 'employeeManage:employeeAccount:unlock',
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      dialogVisible: false,
      qishiDate: '',
      isDisable: false,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        userName: ''
      },
      roleList: [],
      stateList: [
        { label: '全部', value: '' },
        { label: '启用', value: '1' },
        { label: '禁用', value: '2' }
      ],
      unLockParams: {
        userId: null,
        remark: null
      },
      formAdd: {
        userName: '',
        nickName: '',
        email: '',
        phone: '',
        roleList: '',
        state: '',
        userBindIp: '',
        userId: '',
        password: '',
        confirmPassword: '',
        payPassword: '',
        googleCode: ''
      },
      rules: {
        userName: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { pattern: /^[a-zA-Z][A-Za-z0-9_]{3,9}$/, message: '必须以字母开头4-10位，英文加数字', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { pattern: /^[A-Za-z0-9_\u4e00-\u9fa5]{2,6}$/, message: '名称为2-6位中英文加数字', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: ['blur', 'change'] }
        ],
        state: [
          { required: true, message: '请选择状态', trigger: 'blur' }
        ],
        roleList: [
          { required: true, message: '请选择角色', trigger: 'blue' }
        ]
      },
      dialogPvVisible: false,
      dialogTitle: '',
      dialogUpdateTitle: '',
      // 弹出框状态
      dailogStatus: null
    }
  },
  created() {
    this.getList()
    // this.fetchQueryRole()
  },
  methods: {
    getList() {
      this.listLoading = true
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
      this.$nextTick(function() {
        for (var key in this.formAdd) {
          vm.formAdd[key] = row[key] || ''
        }
        if (row.id) {
          this.dialogTitle = '修改员工'
          this.formAdd.userId = row.id
          this.isDisable = true
        } else {
          this.dialogTitle = '添加员工'
          delete this.formAdd.userId
          this.isDisable = false
        }
        if (this.$refs.formAdd) this.$refs.formAdd.clearValidate()
      })
      fetchQueryRole({ userId: row.id }).then(data => {
        this.roleList = data
        this.dialogPvVisible = true
        var roleSelected = data.filter(item => item.selected === 1)
        if (roleSelected.length) {
          this.formAdd.roleList = roleSelected[0].id
        }
        // this.roleList.forEach((item) => {
        //   if (item.selected === 1) {
        //     // const selecte = {}
        //     this.formAdd.roleList = item.name
        //   }
        // })
      })
    },
    unLock(row) {
      this.unLockParams.userId = row.id
      empUnLock(this.unLockParams).then(() => {
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
      var obj = JSON.parse(JSON.stringify(this.formAdd))
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
          obj.roleList = [obj.roleList]
          if (obj.userId) {
            titleM = '修改成功'
            fetchUpdate(obj).then(responseDo)
          } else {
            fetchAdd(obj).then(responseDo)
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
    handleLogout(row) {
      // 设置弹框作用：logout=登出，resetGooleCode\updatePayPassword\loginPassword
      this.dailogStatus = 'logout'
      this.formAdd.userId = row.id
      this.dialogVisible = true
    },
    handleResetGoogleSecret(row) {
      this.dailogStatus = 'resetGooleCode'
      this.formAdd.userId = row.id
      this.dialogVisible = true
    },
    handleUpdatePayPassword(row) {
      this.dailogStatus = 'updatePayPassword'
      this.formAdd.password = null
      this.formAdd.confirmPassword = null
      this.formAdd.userId = row.id
      this.dialogVisible = true
    },
    handleLoginPassword(row) {
      this.dailogStatus = 'loginPassword'
      this.formAdd.password = null
      this.formAdd.confirmPassword = null
      this.formAdd.userId = row.id
      this.dialogVisible = true
    },
    submitForm() {
      switch (this.dailogStatus) {
        case 'logout': {
          logout(this.formAdd).then((res) => {
            this.$message({
              message: '操作成功',
              type: 'success'
            }, this.initDialogVisible())
          })
          break
        }
        case 'resetGooleCode': {
          resetGoogleSecret(this.formAdd).then((res) => {
            this.$message({
              message: '操作成功',
              type: 'success'
            }, this.initDialogVisible())
          })
          break
        }
        case 'updatePayPassword': {
          if (this.formAdd.password === this.formAdd.confirmPassword) {
            const params = Object.assign({}, this.formAdd)
            params.payPassword = this.$md5(params.password)
            params.password = null
            updatePayPassword(params).then((res) => {
              this.$message({
                message: '操作成功',
                type: 'success'
              }, this.initDialogVisible())
            })
          } else {
            this.$message({
              message: '两处密码不一致',
              type: 'error'
            })
          }
          break
        }
        case 'loginPassword': {
          if (this.formAdd.password === this.formAdd.confirmPassword) {
            const params = Object.assign({}, this.formAdd)
            params.password = this.$md5(params.password)
            loginPassword(params).then((res) => {
              this.$message({
                message: '操作成功',
                type: 'success'
              }, this.initDialogVisible())
            })
          } else {
            this.$message({
              message: '两处密码不一致',
              type: 'error'
            })
          }
          break
        }
      }
    },
    initDialogVisible() {
      this.dailogStatus = null
      this.dialogVisible = false
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
