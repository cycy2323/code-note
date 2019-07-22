<template>
  <div class="app-container merchants-modify-channel">
    <div class="filter-container">
      <label>商户组ID&nbsp;:&nbsp;&nbsp;{{ groupId }}&nbsp;&nbsp;&nbsp;&nbsp;</label>
      <label>商户组名称&nbsp;:&nbsp;&nbsp;{{ groupName }}&nbsp;&nbsp;&nbsp;&nbsp;</label>
      <el-select v-model="typeValue" style="width: 120px;" @change="typeChange" @focus="focusSelet()">
        <el-option :value="0" label="全部通道"/>
        <el-option :value="1" label="支付通道"/>
        <el-option :value="2" label="代付通道"/>
      </el-select>
      <el-button type="primary" @click="dialogPvVisible = true">
        添加通道
      </el-button>
      <el-button type="danger" @click="$router.push({ path: '/manageMerchantAccount/merchantIGroupList' })">返回列表</el-button>
    </div>
    <el-table v-loading="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="通道账号名称" prop="accountName" align="center">
        <template slot-scope="scope"><span>{{ scope.row.accountName }}</span></template>
      </el-table-column>
      <el-table-column label="通道名称" prop="name" align="center">
        <template slot-scope="scope"><span>{{ scope.row.channelName }}</span></template>
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
      <el-table-column label="类型" prop="type" align="center">
        <template slot-scope="scope"><span>{{ scope.row.type === 1 ? '支付' : '代付' }}</span></template>
      </el-table-column>
      <el-table-column label="手续费" prop="poundage" align="center">
        <template slot-scope="scope">
          <el-input-number v-if="scope.row.editStatus" v-model="scope.row.copyPoundage" :controls="false" style="width: 80px;"/>
          <span v-else>{{ scope.row.poundage }}</span>
          <span>{{ scope.row.poundageUnit === 1 ? '/ %' : '元/笔' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" plain @click="deleteGroupChannel(scope.row.channelId)">
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogPvVisible" :close-on-click-modal="false" title="添加通道" width="600px">
      <el-form label-position="right" label-width="120px">
        <el-form-item label="商户组名称">
          <span>{{ groupName }}</span>
        </el-form-item>
        <el-form-item label="配置支付通道">
          <el-select v-model="channelList1" multiple filterable default-first-option reserve-keyword placeholder="请选择" @focus="focusSelet('1')">
            <el-option v-for="item in channelArr1" :key="item.id" :value="item.id" :label="item.channelAccountName + '（' + item.name + '）'"/>
          </el-select>
        </el-form-item>
        <el-form-item label="配置代付通道">
          <el-select v-model="channelList2" multiple filterable default-first-option reserve-keyword placeholder="请选择" @focus="focusSelet('2')">
            <el-option v-for="item in channelArr2" :key="item.id" :value="item.id" :label="item.channelAccountName + '（' + item.name + '）'"/>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { Message } from 'element-ui'
import { fetchList, fetchChannel, updateGroupChannel, deleteGroupChannel } from '@/api/manage/merchantGroupManage/merchantGroupChannel'

export default {
  filters: {
    getStatus(key, type) {
      var arr = ['启用', '禁用', '冻结']
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
      tableKey: 0,
      list: [],
      copyList: [],
      groupId: this.$route.params.id,
      groupName: '',
      typeValue: 0,
      channelIds: [],
      channelArr1: [],
      channelArr2: [],
      channelList1: [],
      channelList2: [],
      listLoading: true,
      dialogPvVisible: false
    }
  },
  created() {
    this.getList()
    fetchChannel({ type: 1, status: ['1', '2'] }).then(response => {
      this.channelArr1 = response
    })
    fetchChannel({ type: 2, status: ['1', '2'] }).then(response => {
      this.channelArr2 = response
    })
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList({ id: this.groupId }).then(response => {
        this.typeValue = 0
        this.list = response.list
        this.copyList = response.list
        this.groupName = response.groupName
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    typeChange(value) {
      if (value === 0) {
        this.$set(this, 'list', this.copyList)
      } else {
        this.$set(this, 'list', this.copyList.filter(item => item.type === value))
      }
    },
    focusSelet(key) {
      var vm = this
      vm.$nextTick(() => {
        const elSelect = document.querySelectorAll('.el-select-dropdown')
        for (var i = 0; i < elSelect.length; i++) {
          var parent = elSelect[i].parentNode
          var elSelectWrap = elSelect[i].querySelector('.el-select-dropdown__wrap.el-scrollbar__wrap')
          var allSelect = elSelectWrap.querySelector('.go-select-all')
          if (key) {
            if (!allSelect && parent.tagName === 'BODY') {
              var evdiv = document.createElement('div')
              evdiv.className = 'go-select-all'
              evdiv.innerHTML = '<span id="select-all">全选</span><span id="selection-all">反选</span>'
              elSelectWrap.querySelector('.el-scrollbar__view.el-select-dropdown__list').style.paddingTop = '0px'
              elSelectWrap.insertBefore(evdiv, elSelectWrap.childNodes[0])
              evdiv.querySelector('#select-all').addEventListener('click', function() {
                vm['channelList' + key] = vm['channelArr' + key].map(item => item.id)
              })
              evdiv.querySelector('#selection-all').addEventListener('click', function() {
                vm['channelList' + key] = []
              })
            }
          } else {
            if (allSelect) allSelect.parentNode.removeChild(allSelect)
          }
        }
      }, 1000)
    },
    deleteGroupChannel(id) {
      var vm = this
      deleteGroupChannel({ id: this.groupId, channelId: id }).then(() => {
        vm.$message({
          message: '移除成功',
          type: 'success'
        })
        vm.getList()
      })
    },
    createConfirm() {
      var vm = this
      if (!this.channelList1.length && !this.channelList2.length) {
        this.$message.error('请选择通道')
        return
      }
      var channelIds = this.channelList1.concat(this.channelList2)
      updateGroupChannel({ channelIds: channelIds, id: this.groupId }).then(response => {
        vm.$message({
          message: '添加成功',
          type: 'success'
        })
        vm.getList()
        vm.channelList1 = []
        vm.channelList2 = []
        vm.dialogPvVisible = false
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.new-merchant-group{
  .confirm-btn{
    border-top: 1px solid #eee;
    padding-top: 20px;
  }
}
.new-merchant-group /deep/ .el-form-item{
  // .el-select__tags{
  //   span{
  //     display: none;
  //   }
  // }
}
.merchants-modify-channel .filter-container{
  margin-top: 30px;
  margin-bottom: 30px;
}
.merchants-modify-channel .filter-container label{
  color: #606266
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
</style>
