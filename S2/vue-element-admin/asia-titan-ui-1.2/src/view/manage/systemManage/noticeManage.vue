<template>
  <div class="app-container system-notice">
    <el-form ref="listQuery" :inline="true" :model="listQuery" class="demo-form-inline">
      <el-form-item label="公告标题">
        <el-input v-model="listQuery.notificationTitle" placeholder="请输入标题" style="width: 160px;" @keyup.enter.native="refreshList" />
      </el-form-item>
      <el-form-item label="公告日期">
        <el-date-picker
          v-model="listQuery.notificationDate"
          type="date"
          format="yyyy-MM-dd"
          placeholder="时间"/>
      </el-form-item>
      <el-form-item label="公告类型">
        <el-select v-model="listQuery.notificationType" clearable placeholder="全部" >
          <el-option :value="0" label="草稿"/>
          <el-option :value="1" label="已发布"/>
        </el-select>
      </el-form-item>
      <el-button v-waves class="filter-item" type="primary" @click="refreshList">{{ $t('table.search') }}</el-button>
      <el-button v-waves class="filter-item" type="primary" @click="resetForm('listQuery')">重置</el-button>
      <el-button v-handle="addB" v-waves class="filter-item" type="primary" icon="el-icon-circle-plus" @click="handleShow({}, 'newNotice')">新建公告</el-button>
    </el-form>

    <!-- 列表 -->
    <el-table v-loading="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="公告标题" prop="notificationTitle" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.notificationTitle.length > 15 ? scope.row.notificationTitle.substr(0, 15) + '...' : scope.row.notificationTitle }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公告时间" prop="notificationDate" align="center">
        <template slot-scope="scope">
          <span>{{ (scope.row.notificationDate || '') | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="生效时间" prop="effectDate" align="center">
        <template slot-scope="scope">
          <span>{{ (scope.row.effectDate || '') | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="截止时间" prop="closingDate" align="center">
        <template slot-scope="scope">
          <span>{{ (scope.row.closingDate || '') | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作者" prop="author" align="center"/>
      <el-table-column label="公告类型" prop="notificationType" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.notificationType === 0 ? '草稿' : '已发布' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleShow(scope.row, 'look')">查看</el-button>
          <el-button v-handle="updateB" v-if="scope.row.notificationType === 0" type="primary" size="mini" @click="handleShow(scope.row, 'edit')">编辑</el-button>
          <el-button v-handle="deletaB" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <!--// 编辑 查看-->
    <el-dialog :visible.sync="dialogEditView" :title="textMap[dialogStatus]" :close-on-click-modal="false" width="692px">
      <el-form
        ref="EditViewDataForm"
        :model="temp"
        :inline="true"
        :rules="rules"
        label-position="left"
        label-width="99px"
        class="EditViewDataForm"
      >
        <el-form-item label="公告标题:" prop="notificationTitle" class="item-title">
          <el-input v-model="temp.notificationTitle" :disabled="dialogStatus === 'look'" maxlength="20" show-word-limit @blur="filterspace('notificationTitle')"/>
        </el-form-item>
        <br>
        <el-row>
          <el-col :span="12">
            <el-form-item label="生效时间:" prop="effectDate">
              <!-- <span v-if="dialogStatus === 'look'">{{ (temp.startTime || '') | parseTime('{y}-{m}-{d}') }}</span> -->
              <el-date-picker v-model="effectDate" :disabled="dialogStatus === 'look'" :picker-options="startDatePicker" type="datetime" placeholder="选择日期" style="width: 100%;" @change="dateChange(1)"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="截止时间:" prop="closingDate">
              <!-- <span v-if="dialogStatus === 'look'">{{ (temp.endTime || '') | parseTime('{y}-{m}-{d}') }}</span> -->
              <el-date-picker v-model="closingDate" :disabled="dialogStatus === 'look'" :picker-options="endDatePicker" type="datetime" placeholder="选择日期" style="width: 100%;" @change="dateChange(2)"/>
            </el-form-item>
          </el-col>
        </el-row>
        <br>
        <el-form-item label="公告内容:" prop="notificationContext" class="item-title">
          <el-input v-model="temp.notificationContext" :disabled="dialogStatus === 'look'" type="textarea" rows="6" maxlength="1000" show-word-limit style="width: 100%;" @blur="filterspace('notificationContext')" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditView = false">取消</el-button>
        <el-button v-if="dialogStatus !== 'look'" type="success" @click="updateMerchants(0)">存草稿</el-button>
        <el-button v-if="dialogStatus !== 'look'" type="primary" @click="updateMerchants(1)">立即发送</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, fetchAdd, fetchUpdate, fetchDelete } from '@/api/manage/systemManage/noticeManage'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { parseTime } from '@/utils'

export default {
  name: 'NoticeManage',
  components: { Pagination },
  directives: { waves },
  filters: { parseTime },
  data() {
    return {
      deletaB: 'systemManage:noticeManage:delete',
      updateB: 'systemManage:noticeManage:update',
      addB: 'systemManage:noticeManage:add',
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      dialogEditView: false,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        notificationTitle: '',
        notificationDate: '',
        notificationType: ''
      },
      dialogStatus: '',
      textMap: {
        edit: '编辑公告',
        look: '查看公告',
        newNotice: '新建公告',
        systemNotice: '系统通知'
      },
      effectDate: '',
      closingDate: '',
      startDatePicker: this.beginDate(),
      endDatePicker: this.processDate(),
      temp: {
        notificationTitle: '',
        notificationContext: '',
        notificationType: 1,
        effectDate: '',
        closingDate: ''
      },
      rules: {
        notificationTitle: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        notificationContext: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        effectDate: [
          { required: true, message: '请输入生效日期', trigger: 'blur' }
        ],
        closingDate: [
          { required: true, message: '请输入截止日期', trigger: 'blur' }
        ]
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
        if (this.listQuery.pageNo > 1 && !response.list.length && response.total > 0) {
          var page = Math.ceil(response.total / this.listQuery.pageSize)
          this.listQuery.pageNo = page
          this.getList()
        }
        this.listLoading = false
      })
    },
    refreshList() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    // 重置
    resetForm() {
      for (const key in this.listQuery) {
        this.listQuery[key] = ''
        this.listQuery.pageNo = 1
        this.listQuery.pageSize = 10
      }
    },
    // 查看
    handleShow(row, type) {
      this.temp.id = row.id
      this.effectDate = row.effectDate
      this.closingDate = row.closingDate
      this.temp.effectDate = row.effectDate
      this.temp.closingDate = row.closingDate
      this.temp.notificationContext = row.notificationContext
      this.temp.notificationTitle = row.notificationTitle
      this.dialogStatus = type
      this.dialogEditView = true
    },
    // 删除
    handleDelete(row) {
      var vm = this
      this.$confirm('确认删除此公告吗？', '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        fetchDelete({ id: row.id }).then(response => {
          vm.$message.success('删除成功')
          vm.getList()
        })
      })
    },
    updateMerchants(type) {
      this.temp.notificationType = type
      this.$refs.EditViewDataForm.validate((valid) => {
        if (valid) {
          if (this.temp.id) {
            fetchUpdate(this.temp).then(response => {
              this.dialogEditView = false
              this.getList()
              this.$message.success('修改成功')
            })
          } else {
            fetchAdd(this.temp).then(response => {
              this.dialogEditView = false
              this.getList()
              this.$message.success('添加成功')
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    dateChange(type) {
      this.temp.effectDate = this.effectDate ? parseTime(this.effectDate, '{y}-{m}-{d} {h}:{i}:{s}') : ''
      this.temp.closingDate = this.closingDate ? parseTime(this.closingDate, '{y}-{m}-{d} {h}:{i}:{s}') : ''
      if (this.effectDate && this.closingDate) {
        var start = new Date(this.effectDate).getTime()
        var end = new Date(this.closingDate).getTime()
        if (end <= start) {
          this.temp.closingDate = parseTime(start + (24 * 60 * 60 * 1000), '{y}-{m}-{d} {h}:{i}:{s}')
          this.closingDate = parseTime(start + (24 * 60 * 60 * 1000), '{y}-{m}-{d} {h}:{i}:{s}')
        }
      }

      // if (this.effectDate && this.closingDate) {
      //   var start = new Date(this.effectDate).getTime()
      //   var end = new Date(this.closingDate).getTime()
      //   if (end <= start) {
      //     if (type === 1) {
      //       this.temp.effectDate = parseTime(end - (24 * 60 * 60 * 1000), '{y}-{m}-{d} {h}:{i}:{s}')
      //       this.effectDate = parseTime(end - (24 * 60 * 60 * 1000), '{y}-{m}-{d} {h}:{i}:{s}')
      //     } else {
      //       this.temp.closingDate = parseTime(start + (24 * 60 * 60 * 1000), '{y}-{m}-{d} {h}:{i}:{s}')
      //       this.closingDate = parseTime(start + (24 * 60 * 60 * 1000), '{y}-{m}-{d} {h}:{i}:{s}')
      //     }
      //   }
      // }
    },
    filterspace(key) {
      var str = this.temp[key].replace(/\s+/g, '')
      if (!str) {
        this.$set(this.temp, key, '')
      }
    },
    // 提出结束时间必须大于提出开始时间
    processDate() {
      var self = this
      var date = new Date()
      return {
        disabledDate(time) {
          function oT() {
            return time.getTime() < new Date(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' 00:00:00')
          }
          if (self.temp.effectDate) {
            return time.getTime() < new Date(self.temp.effectDate).getTime() || oT()
          } else {
            return oT()
          }
        }
      }
    },
    beginDate() {
      var self = this
      var date = new Date()
      return {
        disabledDate(time) {
          function oT() {
            return time.getTime() < new Date(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' 00:00:00')
          }
          if (self.temp.closingDate) {
            return time.getTime() > new Date(self.temp.closingDate).getTime() || oT()
          } else {
            return oT()
          }
        }
      }
    }
  }
}
</script>
<style>
  .EditViewDataForm .el-form-item {
    width: 100%;
  }
  .EditViewDataForm .item-title .el-form-item__content {
    width: 83%;
  }
  .system-notice .el-dialog__title {
    color: #FF6600;
  }
  .system-notice .el-input .el-input__count .el-input__count-inner{
    background: none
  }
</style>
