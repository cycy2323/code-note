<template>
  <div class="new-account app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" @click="$router.push({ path: '/manageChannelManage/channelAccountList' })">返回</el-button>
    </div>
    <h6>基本信息配置：</h6>
    <el-form :inline="true" label-position="right" label-width="120px" class="demo-form-inline" style="width:800px;">
      <el-form-item label="通道平台选择">
        <!-- <el-input v-model="formData.channelPlatformName" :disabled="true" style="width: 199px;"/> -->
        <span style="width: 199px;display:inline-block">{{ formData.channelPlatformName }}</span>
      </el-form-item>
      <el-form-item label="通道账户号">
        <!-- <el-input v-model="formData.accountNo" :disabled="true" style="width: 199px;"/> -->
        <span style="width: 199px;display:inline-block">{{ formData.accountNo }}</span>
      </el-form-item>
      <el-form-item label="通道账号名称">
        <!-- <el-input v-model="formData.name" style="width: 199px;"/> -->
        <span style="width: 199px;display:inline-block">{{ formData.name }}</span>
      </el-form-item>
      <el-form-item label="账户限额">
        <!-- <el-input v-model="formData.dailyQuota" style="width: 199px;"/> -->
        <span style="width: 199px;display:inline-block">{{ formData.dailyQuota }}</span>
      </el-form-item>
      <el-form-item label="账户状态">
        <!-- <el-input v-model="formData.status" style="width: 199px;"/> -->
        <span style="width: 199px;display:inline-block">{{ formData.status | getStatus }}</span>
      </el-form-item>
    </el-form>
    <h6>对接信息配置</h6>
    <el-form label-position="right" label-width="120px" class="from-bank" style="width:800px;">
      <el-form-item v-for="(item, idx) in formData.properties" :key="idx" :label="item.name">
        <!-- <el-input v-model="item.value" style="width: 199px;"/> -->
        <span style="width: 199px;display:inline-block">{{ item.value }}</span>
      </el-form-item>
    </el-form>

    <h6>通道配置</h6>
    <el-table :data="formData.channels" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="通道信息" prop="type" align="center">
        <template slot-scope="scope"><span>{{ scope.row.type == 1 ? 'B2C支付' : 'B2C代付' }}</span></template>
      </el-table-column>
      <el-table-column label="类型" prop="usageType" align="center">
        <template slot-scope="scope"><span>{{ scope.row.usageType | getUserType }}</span></template>
      </el-table-column>
      <el-table-column label="费率" prop="poundage" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.poundage }}</span>
          <span>{{ scope.row.poundageUnit === 1 ? '/ %' : '元/笔' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status | getStatus }}</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- <h6>安全验证</h6>
    <el-form label-position="right" label-width="120px" class="from-bank" style="width:800px;">
      <el-form-item label="支付密码">
        <span style="width: 199px;display:inline-block">{{ formData.payPass }}</span>
      </el-form-item>
      <el-form-item label="谷歌验证码">
        <span style="width: 199px;display:inline-block">{{ formData.googleCode }}</span>
      </el-form-item>
    </el-form> -->
  </div>
</template>

<script>

import { fetchDetail } from '@/api/manage/channelManage/channelAccountList'

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
      routeId: this.$route.params.id,
      formData: {}
    }
  },
  created() {
    fetchDetail({ id: this.routeId }).then(response => {
      var obj = JSON.parse(JSON.stringify(response))
      this.$set(this, 'formData', obj)
      for (var i = 0; i < response.channels.length; i++) {
        response.channels[i].copyPoundage = response.channels[i].poundage
        response.channels[i].copyStatus = response.channels[i].status
      }
      this.propertylist = response.properties
      this.tablelist = response.channels
    })
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
