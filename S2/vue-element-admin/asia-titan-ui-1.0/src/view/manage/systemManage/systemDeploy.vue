<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-form-item label="字段名称">
        <el-input v-model="listQuery.baseKey" clearable style="width: 240px;" />
      </el-form-item>
      <el-form-item label="字段值">
        <el-input v-model="listQuery.baseValue" clearable style="width: 260px;" />
      </el-form-item>
      <el-button v-waves class="filter-item" type="primary" @click="refreshList">{{ $t('table.search') }}</el-button>
      <el-button v-handle="add" v-waves class="filter-item" type="primary" @click="handleUpdate">{{ $t('table.add') }}</el-button>
    </el-form>
    <el-table v-loading="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="字段名称" prop="baseKey" align="center"/>
      <el-table-column label="字段值" prop="baseValue" align="center"/>
      <el-table-column label="备注" prop="remarks" align="center"/>
      <el-table-column :label="$t('merchantList.operation')" align="center" width="250px">
        <template slot-scope="scope">
          <el-button v-handle="edit" type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :close-on-click-modal="false" width="500px" class="detail">
      <el-form :model="temp" label-position="right" label-width="120px">
        <el-form-item label="字段名称:">
          <el-input v-model="temp.baseKey" :disabled="temp.id ? true : false" style="width: 240px;"/>
        </el-form-item>
        <el-form-item label="字段值:">
          <el-input v-model="temp.baseValue" style="width: 240px;" />
        </el-form-item>
        <el-form-item label="备注:">
          <el-input v-model="temp.remarks" :disabled="temp.id ? true : false" type="textarea" style="width: 240px;" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateList">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { fetchList, updateSystemSet } from '@/api/manage/systemManage/systemDeploy'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { parseTime } from '@/utils'

export default {
  name: 'SystemDeploy',
  components: { Pagination },
  directives: { waves },
  filters: { parseTime },
  data() {
    return {
      add: 'systemManage:systemDeploy:add',
      edit: 'systemManage:systemDeploy:edit',
      tableKey: 0,
      list: [],
      total: 0,
      dialogVisible: false,
      listLoading: true,
      dialogTitle: '',
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        baseKey: '',
        baseValue: ''
      },
      temp: {
        id: undefined,
        baseKey: undefined,
        baseValue: undefined,
        remarks: undefined
      }
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
    refreshList() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    updateList() {
      updateSystemSet(this.temp).then(() => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.dialogVisible = false
        this.getList()
      })
    },
    handleUpdate(row) {
      if (!row.id) {
        this.dialogTitle = '添加'
      } else this.dialogTitle = '编辑修改'
      this.temp = Object.assign({}, row) // copy obj
      this.dialogVisible = true
      this.temp.id = row.id
    }
  }
}
</script>
