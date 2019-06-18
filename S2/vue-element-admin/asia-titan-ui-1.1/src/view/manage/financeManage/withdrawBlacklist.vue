<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-form-item label="银行卡号">
        <el-input v-model="listQuery.bankNo" clearable style="width: 200px;" @keyup.enter.native="refreshList" />
      </el-form-item>
      <el-button v-waves class="filter-item" type="primary" @click="refreshList">{{ $t('table.search') }}</el-button>
      <el-button v-handle="addbank" v-waves class="filter-item" type="primary" @click="dialogPvVisible = true">添加银行卡号</el-button>
      <upload-excel-component v-handle="upload" :on-success="handleSuccess" :before-upload="beforeUpload" :drop="false" />
    </el-form>

    <el-table v-loading="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="银行卡号" prop="bankNo" align="center"/>
      <el-table-column label="创建日期" prop="createDate" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createDate | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" prop="createId" align="center"/>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :visible.sync="dialogPvVisible" :close-on-click-modal="false" title="添加银行卡" width="600px">
      <el-form ref="formAdd" label-position="right" label-width="190px">
        <el-form-item label="银行卡号" prop="bankNo">
          <el-input v-model="bankNo" style="width: 220px;"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogPvVisible = false">取 消</el-button>
        <el-button type="primary" @click="addBankNo()">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { fetchList, fetchImport } from '@/api/manage/financeManage/withdrawBlacklist'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { parseTime } from '@/utils'
import UploadExcelComponent from '@/components/UploadExcel/index.vue'

export default {
  name: 'WithdrawBlacklist',
  components: { Pagination, UploadExcelComponent },
  directives: { waves },
  filters: { parseTime },
  data() {
    return {
      addbank: 'financeManage:withdrawBlacklist:addbank',
      upload: 'financeManage:withdrawBlacklist:upload',
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      qishiDate: '',
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        bankNo: ''
      },
      bankNo: '',
      dialogPvVisible: false,
      tableData: [],
      tableHeader: []
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
    addBankNo() {
      var reg = /^\d{10,30}$/
      if (!reg.test(this.bankNo)) {
        this.$message.error('请填写正确的银行卡号')
        return
      }
      fetchImport([{ bankNo: this.bankNo }]).then(() => {
        this.$message.success('上传成功')
        this.dialogPvVisible = false
        this.refreshList()
      })
    },
    handleSuccess({ results, header }) {
      var arr = []
      var reg = /^\d{10,30}$/
      for (var i = 0; i < results.length; i++) {
        if (reg.test(results[i][header[0]])) {
          arr.push({ bankNo: results[i][header[0]] })
        }
      }
      if (arr.length) {
        fetchImport(arr).then(() => {
          this.$message.success('上传成功')
          this.refreshList()
        })
      } else {
        this.$message({
          message: '请上传正确的银行卡号',
          type: 'warning'
        })
      }
    }
  }
}
</script>
