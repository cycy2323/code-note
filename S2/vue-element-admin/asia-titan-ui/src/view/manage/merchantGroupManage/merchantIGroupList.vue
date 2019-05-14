<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-form-item label="商户ID">
        <el-input v-model="listQuery.merId" clearable style="width: 200px;" onkeyup="this.value=this.value.replace(/\D/g,'')"/>
      </el-form-item>
      <el-form-item label="商户组名称">
        <el-input v-model="listQuery.groupName" clearable style="width: 200px;" />
      </el-form-item>
      <!-- <el-form-item label="通道账户名称">
        <el-input v-model="listQuery.channelAccountName" style="width: 160px;" />
      </el-form-item> -->
      <el-button v-waves class="filter-item" type="primary" @click="refreshList">{{ $t('table.search') }}</el-button>
      <el-button v-handle="add" v-waves class="filter-item" type="primary" @click="$router.push({ path: '/manageMerchantAccount/merchantGroupAdd' })">添加商户组</el-button>
    </el-form>
    <el-table v-loading="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="商户组名称" prop="groupName" align="center"/>
      <el-table-column label="商户id集合" prop="merIds" align="center"/>
      <el-table-column label="通道名称集合" prop="accountName" align="center"/>
      <el-table-column label="支付费率" prop="payRatio" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.payRatio + '%' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="代付费率" prop="remitRatio" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remitRatio + '元/笔' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state === 0 ? 'danger' : 'success'">
            {{ scope.row.state === 0 ? '禁用' : '启用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding" width="360px">
        <template slot-scope="scope">
          <el-button size="mini" @click="showDialog(scope.row)">查看</el-button>
          <el-button v-handle="updateM" size="mini" @click="showMerchant(scope.row)">修改商户</el-button>
          <el-button v-handle="updateC" size="mini" @click="$router.push({ name: 'MerchantGroupChannel', params: { id: scope.row.id }})">修改通道</el-button>
          <el-button v-handle="updateR" size="mini" @click="showRatio(scope.row)">修改费率</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <!-- 查看弹窗 -->
    <el-dialog :visible.sync="dialogPvVisible" :close-on-click-modal="false" title="订单详情" width="600px" class="detail">
      <el-form label-position="right" label-width="120px">
        <el-form-item label="商户组名称:">
          <span>{{ detailData.groupName }}</span>
        </el-form-item>
        <el-form-item label="商户id集合:">
          <span>{{ detailData.merIds }}</span>
        </el-form-item>
        <el-form-item label="通道名称集合:">
          <span>{{ detailData.accountName }}</span>
        </el-form-item>
        <el-form-item label="支付费率:">
          <span>{{ detailData.payRatio + '%' }}</span>
        </el-form-item>
        <el-form-item label="代付费率:">
          <span>{{ detailData.remitRatio + '元/笔' }}</span>
        </el-form-item>
        <el-form-item label="状态:">
          <span>{{ detailData.state === 0 ? '禁用' : '启用' }}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogPvVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 修改商户列表 -->
    <el-dialog :visible.sync="dialogMerchant" :close-on-click-modal="false" title="修改商户列表" width="600px">
      <el-form label-position="right" label-width="120px">
        <el-form-item label="商户组名称">
          <!-- <el-input v-model="merchantForm.groupName" style="width: 199px;"/> -->
          <span>{{ merchantForm.groupName }}</span>
        </el-form-item>
        <el-form-item label="选择商户ID">
          <el-select v-model="merchantForm.merIds" multiple filterable default-first-option reserve-keyword placeholder="请选择商户ID" @focus="focusSelet(1)">
            <el-option v-for="item in merIdsArr" :key="item.id" :label="item.nickName" :value="item.id"/>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateMerchants">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改商户组费率 -->
    <el-dialog :visible.sync="dialogRatio" :close-on-click-modal="false" title="修改商户组费率" width="600px">
      <el-form label-position="right" label-width="120px">
        <el-form-item label="商户组名称">
          <!-- <el-input v-model="ratioForm.groupName" style="width: 199px;"/> -->
          <span>{{ merchantForm.groupName }}</span>
        </el-form-item>
        <el-form-item label="支付手续费">
          <el-input v-model="ratioForm.payRatio" style="width: 199px;"><template slot="append">&nbsp;&nbsp;%&nbsp;&nbsp;</template></el-input>
        </el-form-item>
        <el-form-item label="代付手续费">
          <el-input v-model="ratioForm.remitRatio" style="width: 199px;"><template slot="append">每笔</template></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateRatio">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>

import { fetchList, fetchQuery, updateRatio, updateMerchant } from '@/api/manage/merchantGroupManage/merchantIGroupList'
import waves from '@/directive/waves' // Waves directive
// import { Message } from 'element-ui'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'MerchantIGroupList',
  components: { Pagination },
  directives: { waves },
  filters: {
    getOrderState(key) {
      const obj = { '1': '处理中', '2': '成功', '3': '失败待退款', '4': '失败已退款', '5': '退款待审核' }
      return obj[key + '']
    }
  },
  data() {
    return {
      add: 'manageMerchantAccount:merchantIGroupList:add',
      update: 'manageMerchantAccount:merchantIGroupList:update',
      updateC: 'manageMerchantAccount:merchantIGroupList:updateC',
      updateR: 'manageMerchantAccount:merchantIGroupList:updateR',
      updateM: 'manageMerchantAccount:merchantIGroupList:updateM',
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      qishiDate: '',
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        merId: '',
        groupName: ''
      },
      merchantForm: {
        id: '',
        merIds: [],
        groupName: ''
      },
      merIdsArr: [],
      ratioForm: {
        id: '',
        groupName: '',
        payRatio: '',
        remitRatio: ''
      },
      detailData: {},
      dialogPvVisible: false,
      dialogRatio: false,
      dialogMerchant: false
    }
  },
  created() {
    this.getList()
    fetchQuery({}).then(response => {
      this.merIdsArr = response
    })
  },
  methods: {
    getList() {
      this.listLoading = true
      var obj = Object.assign({}, this.listQuery)
      obj.merId = this.listQuery.merId.replace(/\s+/g, '')
      // if (typeof (this.listQuery.merId) === 'string' || typeof (this.listQuery.agentId) === 'string') {
      //   this.listLoading = false
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
    showMerchant(row) {
      this.listLoading = true
      fetchQuery({ id: row.id }).then(response => {
        var arr = response || []
        this.merchantForm.merIds = arr.map(item => item.id)
        this.merchantForm.id = row.id
        this.merchantForm.groupName = row.groupName
        this.listLoading = false
        this.dialogMerchant = true
      })
    },
    showRatio(row) {
      this.ratioForm.id = row.id
      this.ratioForm.groupName = row.groupName
      this.ratioForm.payRatio = row.payRatio
      this.ratioForm.remitRatio = row.remitRatio
      this.dialogRatio = true
    },
    refreshList() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    showDialog(row) {
      for (var key in row) {
        this.detailData[key] = row[key]
      }
      this.dialogPvVisible = true
    },
    updateMerchants() {
      if (this.merchantForm.merIds.length) {
        updateMerchant(this.merchantForm).then(this.updateTip)
      } else {
        this.$message.error('请选择商户ID')
      }
    },
    updateRatio() {
      var err = ''
      var obj = JSON.parse(JSON.stringify(this.ratioForm))
      if (!obj.payRatio || !obj.remitRatio) {
        err = '请填写手续费'
      }
      if (!Number(obj.payRatio) | Number(obj.payRatio) < 0 || !Number(obj.remitRatio) || Number(obj.remitRatio) < 0) {
        err = '请填写手续费，只能填写数字，并且不能小于0'
      }
      if (err) {
        this.$message.error(err)
        return
      }
      obj.payRatio = Number(obj.payRatio)
      obj.remitRatio = Number(obj.remitRatio)
      updateRatio(obj).then(this.updateTip)
    },
    updateTip() {
      this.$message({
        message: '修改成功',
        type: 'success'
      })
      this.refreshList()
      this.dialogRatio = false
      this.dialogMerchant = false
    },
    focusSelet() {
      var vm = this
      vm.$nextTick(() => {
        const elSelect = document.querySelectorAll('.el-select-dropdown')
        for (var i = 0; i < elSelect.length; i++) {
          var parent = elSelect[i].parentNode
          var elSelectWrap = elSelect[i].querySelector('.el-select-dropdown__wrap.el-scrollbar__wrap')
          var allSelect = elSelectWrap.querySelector('.go-select-all')
          if (!allSelect && parent.tagName === 'BODY') {
            var evdiv = document.createElement('div')
            evdiv.className = 'go-select-all'
            evdiv.innerHTML = '<span id="select-all">全选</span><span id="selection-all">反选</span>'
            elSelectWrap.querySelector('.el-scrollbar__view.el-select-dropdown__list').style.paddingTop = '0px'
            elSelectWrap.insertBefore(evdiv, elSelectWrap.childNodes[0])
            evdiv.querySelector('#select-all').addEventListener('click', function() {
              vm.merchantForm.merIds = vm.merIdsArr.map((item) => {
                return item.id
              })
            })
            evdiv.querySelector('#selection-all').addEventListener('click', function() {
              vm.merchantForm.merIds = []
            })
          }
        }
      }, 1000)
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
