<template>
  <div class="app-container role-list">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-form-item label="角色名称">
        <el-input v-model="listQuery.name" clearable style="width: 220px;" @keyup.enter.native="refreshList"/>
      </el-form-item>
      <el-button v-waves class="filter-item" type="primary" @click="refreshList">{{ $t('table.search') }}</el-button>
      <el-button v-handle="add" v-waves class="filter-item" type="primary" @click="showDialog({})">添加</el-button>
    </el-form>
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <!--<el-table-column label="角色ID" prop="id" align="center"/>-->
      <el-table-column label="角色名称" prop="name" align="center"/>
      <el-table-column label="创建时间" prop="createDate" align="center">
        <template slot-scope="scope">
          <div>
            {{ (scope.row.createDate || '') | parseTime('{y}-{m}-{d}') }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="code" prop="code" align="center"/>
      <el-table-column label="操作" align="center" class-name="small-padding">
        <template slot-scope="scope">
          <el-button v-handle="update" size="mini" @click="showDialog(scope.row)">修改信息</el-button>
          <el-button v-handle="bindAuth" size="mini" @click="fetchQueryMenus(scope.row)">绑定权限</el-button>
          <el-button v-handle="deleteBtn" size="mini" type="danger" @click="fetchDelete(scope.row)">删除角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNo"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"/>
    <el-dialog :visible.sync="dialogPvVisible" :title="dialogTitle" :close-on-click-modal="false" width="600px">
      <el-form ref="formAdd" :model="formAdd" :rules="rules" label-position="right" label-width="190px">
        <!--<el-form-item label="平台标识" prop="type">-->
        <!--<el-select v-model="formAdd.type" :disabled="platTypeSatus" style="width: 220px;">-->
        <!--<el-option :value="1" label="商户"/>-->
        <!--<el-option :value="2" label="代理"/>-->
        <!--<el-option :value="3" label="管理平台"/>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="formAdd.name" style="width: 220px;"/>
        </el-form-item>
        <el-form-item label="角色编码" prop="code">
          <el-input v-model="formAdd.code" style="width: 220px;"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogPvVisible = false">取 消</el-button>
        <el-button type="primary" @click="createConfirm('formAdd')">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="dialogPrims" :close-on-click-modal="false" title="绑定权限" width="600px">
      <el-form label-position="right" label-width="190px">
        <el-tree
          ref="tree"
          :data="treeData"
          :default-checked-keys="expandedKeys"
          :props="defaultProps"
          show-checkbox
          default-expand-all
          node-key="id"/>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogPrims = false">取 消</el-button>
        <el-button type="primary" @click="createPrim()">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import {
  fetchList,
  fetchAdd,
  fetchUpdate,
  fetchUpdateRole,
  fetchQueryMenus,
  fetchDelete
} from '@/api/manage/employeeManage/rolePermission'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { parseTime } from '@/utils'

export default {
  name: 'RolePermission',
  components: { Pagination },
  directives: { waves },
  filters: {
    parseTime
  },
  data() {
    return {
      add: 'subAccounManage:rolePermission:add',
      update: 'subAccounManage:rolePermission:update',
      bindAuth: 'subAccounManage:rolePermission:bindAuth',
      deleteBtn: 'subAccounManage:rolePermission:deleteBtn',
      tableKey: 0,
      total: 0,
      listLoading: false,
      userType: { '1': '码商', '2': '码商代理', '3': '管理平台' },
      list: [],
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        name: '',
        type: ''
      },
      formAdd: {
        type: '',
        name: '',
        code: ''
      },
      rules: {
        // type: [
        //   { required: true, message: '请选择平台标识', trigger: 'blue' }
        // ],
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入角色编码', trigger: 'blur' },
          { pattern: /^[a-zA-Z]+$/, message: '角色编码只能输入英文', trigger: 'blur' }
        ]
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      treeData: [],
      expandedKeys: [],
      roleId: '',
      dialogPrims: false,
      dialogPvVisible: false,
      dialogTitle: '',
      platTypeSatus: false,
      checkAll: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.list
        this.total = response.total
        this.listLoading = false
      })
    },
    fetchQueryMenus(row) {
      fetchQueryMenus({ roleId: row.id }).then(response => {
        this.roleId = row.id
        var parentList = []
        var childList = []
        var expandedKeys = []
        response.filter(item => {
          if (item.parentId === 0) {
            parentList.push(item)
          } else {
            childList.push(item)
          }
          if (item.selected === 1 && item.parentId !== 0) {
            expandedKeys.push(item.id)
          }
        })

        // 组装树形结构
        function filterChild(parents, childs) {
          for (var i = 0; i < parents.length; i++) {
            for (var j = 0; j < childs.length; j++) {
              if (childs[j].parentId === parents[i].id && !childs[j].filtered) {
                if (!parents[i].children) parents[i].children = []
                parents[i].children.push(childs[j])
                childs[j].filtered = true
                filterChild(parents[i].children, childs)
              }
            }
          }
        }

        // 去除半选状态
        function removeBanjiedian(parents) {
          for (var i = 0; i < parents.length; i++) {
            if (parents[i].children && parents[i].selected) {
              var selectedLen = parents[i].children.filter(item => item.selected === 1).length
              if (selectedLen !== parents[i].children.length) {
                expandedKeys = expandedKeys.filter(item => {
                  return item !== parents[i].id
                })
              }
              removeBanjiedian(parents[i].children)
            }
          }
        }

        filterChild(parentList, childList)
        removeBanjiedian(parentList)
        this.expandedKeys = expandedKeys
        this.treeData = parentList
        this.dialogPrims = true
      })
    },
    showDialog(row) {
      this.dialogPvVisible = true
      this.$nextTick(function() {
        for (var key in this.formAdd) {
          this.formAdd[key] = row[key] || ''
        }
        if (row.id || row.id === 0) {
          this.dialogTitle = '修改角色'
          this.formAdd.roleId = row.id
          this.platTypeSatus = true
        } else {
          this.dialogTitle = '添加角色'
          this.platTypeSatus = false
          delete this.formAdd.roleId
        }
      })
    },
    createPrim() {
      var obj = {
        permIds: this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys()),
        roleId: this.roleId
      }
      // console.log(this.$refs.tree.getHalfCheckedKeys(), '====', this.$refs.tree.getCheckedKeys())
      // return
      fetchUpdateRole(obj).then(response => {
        this.$message.success('绑定成功')
        this.dialogPrims = false
      })
    },
    createConfirm(formName) {
      var vm = this
      var titleM = '添加成功'
      var responseDo = function() {
        vm.$message({
          message: titleM,
          type: 'success'
        })
        vm.refreshList()
        vm.dialogPvVisible = false
      }
      var obj = JSON.parse(JSON.stringify(vm.formAdd))
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (obj.roleId) {
            titleM = '修改成功'
            fetchUpdate(obj).then(responseDo)// 修改的基本信息
          } else {
            fetchAdd(obj).then(responseDo)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    fetchDelete(row) {
      this.$confirm('确认删除角色？').then(() => {
        fetchDelete({ roleId: row.id }).then(res => {
          this.$message.success('删除成功')
          this.refreshList()
        })
      })
    },
    refreshList() {
      this.listQuery.pageNo = 1
      this.getList()
    }
  }
}
</script>

<style scoped>
  .role-list .el-checkbox {
    margin-left: 30px;
  }
</style>
