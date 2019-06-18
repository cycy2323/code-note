<template>
  <div class="new-channel app-container">
    <el-form ref="dataForm" :rules="rules" :model="formData" label-position="right" label-width="99px">
      <el-form-item label="通道ID">
        <span>系统自动配置</span>
      </el-form-item>
      <!-- <el-form-item label="通道名称" prop="name">
        <el-input v-model="formData.name" style="width: 199px;"/>
      </el-form-item> -->
      <el-form-item label="映射">
        <el-select v-model="formData.key">
          <el-option v-for="(item, idx) in listKey" :key="idx" :label="item.name" :value="item.key"/>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="开关">
        <el-radio-group v-model="formData.kaiguan" size="small" type="info">
          <el-radio-button label="1">开</el-radio-button>
          <el-radio-button label="2">关</el-radio-button>
        </el-radio-group>
      </el-form-item> -->
    </el-form>
    <div class="confirm-btn">
      <el-button size="small" type="primary" @click="createConfirm('dataForm')">{{ $t('table.confirm') }}</el-button>
    </div>
  </div>
</template>
<script>
import { fetchAdd, fetchKey } from '@/api/manage/channelManage/channelList'
export default {
  data() {
    return {
      formData: {
        key: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入通道账号名称，如：转化', trigger: 'blur' }
        ]
      },
      listKey: []
    }
  },
  created() {
    var vm = this
    fetchKey().then(response => {
      vm.listKey = response
      vm.formData.key = vm.listKey[0].key
    })
  },
  methods: {
    createConfirm(formName) {
      var vm = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          fetchAdd(vm.formData).then(response => {
            vm.$message({
              message: '创建成功',
              type: 'success'
            })
            vm.$router.push({ path: '/manageChannelManage/channelList' })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.new-channel .confirm-btn {
  border-top: 1px solid #eee;
  padding-top: 20px;
  padding-left: 100px;
  .el-button{
    width: 100px;
  }
}
</style>
