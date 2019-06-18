<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-form-item label="平台标识">
        <el-select v-model="listQuery.platformType" style="width: 120px;">
          <el-option value="" label="全部"/>
          <el-option :value="1" label="商户"/>
          <el-option :value="2" label="代理"/>
          <el-option :value="3" label="管理平台"/>
        </el-select>
      </el-form-item>
      <!--<el-form-item label="权限状态">-->
      <!--<el-select v-model="listQuery.status" style="width: 120px;">-->
      <!--<el-option value="" label="全部"/>-->
      <!--<el-option :value="1" label="启用"/>-->
      <!--<el-option :value="0" label="禁用"/>-->
      <!--</el-select>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="权限名称">-->
      <!--<el-input v-model="listQuery.name" clearable style="width: 160px;" />-->
      <!--</el-form-item>-->
      <el-button v-waves class="filter-item" type="primary" @click="refreshList">{{ $t('table.search') }}</el-button>
      <el-button v-handle="addParent" v-waves class="filter-item" type="primary" @click="showDialog({})">添加父级</el-button>
    </el-form>
    <el-table v-loading="listLoading" id="custom-table" :key="tableKey" :data="list" row-key="id" border fit highlight-current-row style="width: 100%;">
      <!-- <el-table-column label="平台标识" prop="platformType" align="center">
        <template slot-scope="scope">
          <span>{{ platformType[scope.row.platformType + ''] }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="权限名称" prop="name" align="left" label-class-name="quanxian" class-name="quanxian-td"/>
      <el-table-column label="权限编码" prop="code" align="center"/>
      <el-table-column label="权限状态" prop="status" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
            {{ scope.row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding">
        <template slot-scope="scope">
          <!-- <el-button v-waves class="filter-item" type="primary" @click="showDialog({})">添加顶级</el-button> -->
          <el-button v-handle="addChild" :disabled="scope.row.noChild" size="mini" @click="showDialog({}, scope.row)">添加子级</el-button>
          <el-button v-handle="update" size="mini" @click="showDialog(scope.row)">修改</el-button>
          <el-button v-handle="deleteBtn" size="mini" type="danger" @click="updateDetele(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" /> -->

    <el-dialog :visible.sync="dialogPvVisible" :title="dialogTitle" :close-on-click-modal="false" width="600px">
      <el-form ref="formAdd" :model="formAdd" :rules="rules" label-position="right" label-width="99px">
        <el-form-item label="平台标识" prop="platformType">
          <el-select v-model="formAdd.platformType" :disabled="platTypeSatus" style="width: 220px;">
            <el-option :value="1" label="商户"/>
            <el-option :value="2" label="代理"/>
            <el-option :value="3" label="管理平台"/>
          </el-select>
        </el-form-item>
        <el-form-item label="权限编码" prop="permission">
          <el-input v-model="formAdd.permission" style="width: 220px;"/>
        </el-form-item>
        <el-form-item label="资源编码" prop="code">
          <el-input v-model="formAdd.code" style="width: 220px;"/>
        </el-form-item>
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formAdd.name" style="width: 220px;"/>
        </el-form-item>
        <el-form-item v-if="dialogTitle === '修改权限'" label="权限状态" prop="status">
          <el-select v-model="formAdd.status" style="width: 220px;">
            <el-option :value="1" label="启用"/>
            <el-option :value="0" label="禁用"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="dialogTitle === '修改权限'" label="排序">
          <el-input v-model="formAdd.sortNum" style="width: 220px;"/>
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

import { fetchList, fetchAdd, fetchUpdate, updateDetele } from '@/api/manage/employeeManage/authority'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Authority',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      addParent: 'employeeManage:authority:addParent',
      addChild: 'employeeManage:authority:addChild',
      update: 'employeeManage:authority:update',
      deleteBtn: 'employeeManage:authority:delete',
      tableKey: 0,
      listLoading: true,
      platformType: { '1': '码商', '2': '码商代理', '3': '管理平台' },
      list: [],
      total: 0,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        platformType: 3,
        name: '',
        status: ''
      },
      formAdd: {
        platformType: '',
        name: '',
        code: '',
        sortNum: '',
        permission: '',
        status: ''
      },
      rules: {
        platformType: [
          { required: true, message: '请选择平台标识', trigger: 'blue' }
        ],
        name: [
          { required: true, message: '请输入权限名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入权限编码', trigger: 'blur' }
        ]
      },
      platTypeSatus: false,
      dialogPvVisible: false,
      dialogTitle: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        var parentList = []
        var childList = []
        response.filter(item => {
          if (item.parentId === 0) {
            parentList.push(item)
          } else {
            childList.push(item)
          }
        })
        function filterChild(parents, childs, noChild) {
          for (var i = 0; i < parents.length; i++) {
            for (var j = 0; j < childs.length; j++) {
              if (parents[i].id === childs[j].parentId && !childs[j].filtered) {
                if (!parents[i].children) parents[i].children = []
                if (noChild) childs[j].noChild = true
                parents[i].children.push(childs[j])
                childs[j].filtered = true
                filterChild(parents[i].children, childs, true)
              }
            }
          }
        }
        filterChild(parentList, childList)
        this.list = parentList
        // this.total = response.total
        this.listLoading = false
        this.removeStyle()
      })
    },
    filterChild() {

    },
    showDialog(row, parent) {
      var vm = this
      this.dialogPvVisible = true
      this.$nextTick(function() {
        for (var key in this.formAdd) {
          if (row[key] || row[key] === 0) {
            vm.formAdd[key] = row[key]
          } else {
            vm.formAdd[key] = ''
          }
        }
        if (row.id || row.id === 0) {
          vm.dialogTitle = '修改权限'
          vm.formAdd.id = row.id
          delete vm.formAdd.parentId
          this.platTypeSatus = true
        } else if (parent) {
          vm.dialogTitle = '添加子级'
          vm.formAdd.platformType = parent.platformType
          vm.formAdd.parentId = parent.id
          this.platTypeSatus = true
          delete vm.formAdd.id
        } else {
          vm.dialogTitle = '添加权限'
          this.platTypeSatus = false
          delete vm.formAdd.id
          delete vm.formAdd.parentId
        }
      })
    },
    updateDetele(row) {
      updateDetele({ id: row.id }).then(response => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.refreshList()
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
          if (vm.formAdd.id) {
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
    removeStyle() {
      this.$nextTick(() => {
        var cunstomTable = document.getElementById('custom-table')
        var trs = cunstomTable.querySelectorAll('table tbody tr')
        for (var i = 0; i < trs.length; i++) {
          // trs[i].setAttribute('style', '')
          var elTableExpandIcon = trs[i].querySelector('.el-table__expand-icon')
          if (elTableExpandIcon) {
            elTableExpandIcon.click()
          }
        }
      })
    }
  }
}
</script>

<style>
  #custom-table .el-table__expand-icon>.el-icon{
    margin-left: -9px;
    margin-top: -9px;
    font-size: 18px;
  }
  #custom-table .quanxian-td{
    padding-left: 5%;
  }
  #custom-table thead .quanxian{
    text-align: center;
    padding-left: 0;
  }
</style>
