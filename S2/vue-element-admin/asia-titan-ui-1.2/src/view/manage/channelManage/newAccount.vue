<template>
  <div class="new-account app-container">
    <h6>基本信息配置：</h6>
    <el-form :inline="true" label-position="right" label-width="120px" class="demo-form-inline" style="width:800px;">
      <el-form-item label="通道平台选择">
        <el-select v-if="routeId === 'new'" v-model="formData.channelPlatformId" @change="setProperty">
          <el-option v-for="(item, idx) in listKey" :key="idx" :label="item.name" :value="item.id"/>
        </el-select>
        <el-input v-else v-model="formData.channelPlatformName" :disabled="true" style="width: 199px;"/>
      </el-form-item>
      <el-form-item label="通道账户号">
        <el-input v-if="routeId === 'new'" v-model="formData.accountNo" style="width: 199px;"/>
        <el-input v-else v-model="formData.accountNo" :disabled="true" style="width: 199px;"/>
      </el-form-item>
      <el-form-item label="通道账号名称">
        <el-input v-model="formData.name" style="width: 199px;"/>
      </el-form-item>
      <el-form-item label="账户限额">
        <el-input v-model="formData.dailyQuota" style="width: 199px;"/>
      </el-form-item>
      <el-form-item label="账户状态">
        <el-select v-model="formData.status" style="width: 120px;">
          <el-option :value="1" label="启用"/>
          <el-option :value="2" label="关闭"/>
          <el-option :value="3" label="冻结"/>
        </el-select>
      </el-form-item>
    </el-form>
    <h6>对接信息配置</h6>
    <el-form label-position="right" label-width="120px" class="from-bank">
      <el-form-item v-for="(item, idx) in propertylist" :key="idx" :label="item.name">
        <el-input v-model="item.value" style="width: 199px;"/>
        <span style="color: #8c8c8c;">{{ item.description }}</span>
      </el-form-item>
    </el-form>

    <h6>通道配置</h6>
    <el-table v-loading="listLoading" :data="tablelist" :key="tableKey" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="通道类型" prop="type" align="center">
        <template slot-scope="scope"><span>{{ scope.row.type == 1 ? '支付' : '代付' }}</span></template>
      </el-table-column>
      <el-table-column label="通道名称" prop="name" align="center"/>
      <el-table-column label="通知地址" prop="notifyUrl" align="center">
        <template slot-scope="scope">
          <span v-if="routeId === 'new'">添加后生成</span>
          <span v-else>绑定代理机外网IP地址{{ scope.row.notifyUrl }}</span>
        </template>
      </el-table-column>
      <el-table-column label="使用类型" prop="usageType" align="center">
        <template slot-scope="scope">
          <!-- <span>{{ scope.row.usageType | getUserType }}</span> -->
          <el-select v-model="scope.row.usageType" style="width: 120px;">
            <el-option :value="0" label="全部"/>
            <el-option :value="1" label="API"/>
            <el-option :value="2" label="后台"/>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="权重" prop="weight" align="center">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.weight" :min="0" :controls="false" style="width: 80px;" @blur="setEditStatus(scope.$index, 'weight')"/>
          <!-- <el-input-number v-if="scope.row.editStatus" v-model="scope.row.copyWeight" :controls="false" style="width: 80px;"/>
          <span v-else>{{ scope.row.weight }}</span> -->
        </template>
      </el-table-column>
      <el-table-column label="费率" prop="poundage" align="center">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.poundage" :min="0" :controls="false" style="width: 80px;" @blur="setEditStatus(scope.$index, 'poundage')"/>
          <!-- <el-input-number v-if="scope.row.editStatus" v-model="scope.row.copyPoundage" :controls="false" style="width: 80px;"/>
          <span v-else>{{ scope.row.poundage }}</span> -->
          <span>{{ scope.row.poundageUnit === 1 ? '&nbsp;&nbsp;%&nbsp;&nbsp;&nbsp;' : '元/笔' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" align="center">
        <template slot-scope="scope">
          <el-select v-model="scope.row.status" style="width: 120px;">
            <el-option :value="1" label="启用"/>
            <el-option :value="2" label="关闭"/>
            <el-option :value="3" label="冻结"/>
          </el-select>
          <!-- <el-select v-if="scope.row.editStatus" v-model="scope.row.copyStatus" style="width: 120px;">
            <el-option :value="1" label="启用"/>
            <el-option :value="2" label="关闭"/>
            <el-option :value="3" label="冻结"/>
          </el-select>
          <span v-else>{{ scope.row.status | getStatus }}</span> -->
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <div v-if="scope.row.editStatus">
            <el-button type="danger" icon="el-icon-close" circle @click="setEditStatus(scope.row, false)" />
            <el-button type="success" icon="el-icon-check" circle @click="saveEditStatus(scope.row)" />
          </div>
          <div v-else>
            <el-button size="mini" plain @click="setEditStatus(scope.row, true)">
              编辑
            </el-button>
          </div>
        </template>
      </el-table-column> -->
    </el-table>
    <div v-if="routeId !== 'new'">
      <h6>安全验证</h6>
      <el-form label-position="right" label-width="120px" class="from-bank" style="width:800px;">
        <el-form-item label="支付密码">
          <el-input v-model="formData.payPass" type="password" style="width: 199px;"/>
        </el-form-item>
        <el-form-item label="谷歌验证码">
          <el-input v-model="formData.googleCode" style="width: 199px;"/>
        </el-form-item>
      </el-form>
    </div>
    <div class="confirm-btn">
      <el-button type="danger" size="small" @click="$router.push({ path: '/manageChannelManage/channelAccountList' })">取消</el-button>
      <el-button type="primary" size="small" @click="createConfirm()">{{ routeId === 'new' ? '添加通道账号' : '修改通道账号' }}</el-button>
    </div>
  </div>
</template>

<script>

import { fetchUpdate, fetchAdd, fetchDetail, fetchKey, getProperty, getChannel } from '@/api/manage/channelManage/channelAccountList'

export default {
  filters: {
    getUserType(key) {
      var arr = ['全部', 'API', '后台']
      return arr[key]
    },
    getStatus(key) {
      var arr = ['启用', '关闭', '冻结']
      return arr[key - 1]
    }
  },
  data() {
    return {
      tableKey: 0,
      routeId: this.$route.params.id,
      formData: {
        channelPlatformId: '',
        name: '',
        accountNo: '',
        dailyQuota: '',
        payPass: '',
        googleCode: '',
        status: ''
      },
      editStatus: false,
      listLoading: false,
      tablelist: [],
      listKey: [],
      propertylist: []
    }
  },
  created() {
    var vm = this
    if (vm.routeId === 'new') {
      this.formData.payPass = 'nothing'// 添加时随意填写，防止表达验证时被拦截
      this.formData.googleCode = 'nothing'// 添加时随意填写，防止表达验证时被拦截
      fetchKey().then(response => {
        vm.listKey = response
        vm.formData.channelPlatformId = vm.listKey[0].id
        vm.getProperty(vm.listKey[0].id)
        vm.getChannel(vm.listKey[0].id)
      })
    } else {
      fetchDetail({ id: this.routeId }).then(response => {
        var obj = JSON.parse(JSON.stringify(response))
        delete obj.properties
        delete obj.channels
        this.$set(this, 'formData', obj)
        // for (var i = 0; i < response.channels.length; i++) {
        //   response.channels[i].copyPoundage = response.channels[i].poundage
        //   response.channels[i].copyStatus = response.channels[i].status
        //   response.channels[i].weight = response.channels[i].copyWeight
        // }
        this.propertylist = response.properties
        this.tablelist = response.channels
      })
    }
  },
  methods: {
    getProperty(id) {
      var vm = this
      getProperty({ channelPlatformId: id }).then(response => {
        vm.propertylist = response
      })
    },
    getChannel(id) {
      var vm = this
      getChannel({ channelPlatformId: id }).then(response => {
        for (var i = 0; i < response.length; i++) {
          response[i].poundage = 0
        }
        vm.tablelist = response
      })
    },
    setProperty(value) {
      this.getProperty(value)
      this.getChannel(value)
    },
    setEditStatus(idx, type) {
      // debugger
      if (!this.tablelist[idx][type] && this.tablelist[idx][type] !== 0) {
        this.$set(this.tablelist[idx], type, 0)
        this.tableKey += 1
      }
      if (type === 'poundage') {
        var x = String(this.tablelist[idx][type]).indexOf('.') + 1
        var y = String(this.tablelist[idx][type]).length - x
        if (y > 2) {
          this.$set(this.tablelist[idx], type, Number(this.tablelist[idx][type].toFixed(2)))
          this.tableKey += 1
        }
      }
    },
    createConfirm() {
      var vm = this
      var err = ''
      for (var key in this.formData) {
        if (!this.formData[key]) err = '请先完善信息'
      }
      for (var i = 0; i < this.propertylist.length; i++) {
        if (!this.propertylist[i].value) err = '请先填写' + this.propertylist[i].name
      }
      if (this.formData.dailyQuota) {
        if (!Number(this.formData.dailyQuota)) {
          err = '账户限额只能输入数字'
        } else {
          this.formData.dailyQuota = Number(this.formData.dailyQuota)
        }
      }
      if (err) {
        this.$message({
          message: err,
          type: 'error'
        })
        return
      }
      var obj = JSON.parse(JSON.stringify(this.formData))
      obj.properties = this.propertylist
      obj.channels = this.tablelist

      // 发送请求
      function resultTip(title) {
        vm.$message({
          message: title,
          type: 'success'
        })
        vm.$router.push({ path: '/manageChannelManage/channelAccountList' })
      }
      if (vm.routeId === 'new') {
        delete obj.payPass
        delete obj.googleCode
        fetchAdd(obj).then(response => {
          resultTip('添加成功')
        })
      } else {
        obj.id = vm.routeId
        obj.payPass = this.$md5(obj.payPass)
        fetchUpdate(obj).then(response => {
          resultTip('修改成功')
        })
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.new-account{
  h6{
    font-size: 20px;
    color: #333;
    padding: 0;
    margin: 30px 0 10px;
  }
  .el-form{
    padding-top: 22px;
    border: 1px solid #eee;
  }
  // .el-form{
  //   height: 600px;
  //   margin-top: 20px;
  //   .form-inline{
  //     padding-right: 40px;
  //     float: left;
  //   }
  // }
  .confirm-btn{
    padding-top: 20px;
    margin-top: 20px;
  }
}
</style>
