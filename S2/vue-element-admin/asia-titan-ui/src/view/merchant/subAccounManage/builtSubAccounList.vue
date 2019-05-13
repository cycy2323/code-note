<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="150px" class="demo-ruleForm">
    <el-form-item label="子账户登录名" prop="userName">
      <el-input v-model="ruleForm.userName" style="width: 200px"/>
    </el-form-item>
    <el-form-item label="昵称" prop="nickName">
      <el-input v-model="ruleForm.nickName" style="width: 200px"/>
    </el-form-item>
    <el-form-item label="角色" prop="roleId">
      <el-select v-model="ruleForm.roleId" placeholder="请选择角色">
        <el-option v-for="(v,index) in roleData" :key="index" :label="v.roleName" :value="v.roleId"/>
      </el-select>
      <!--<el-button type="text">客服1权限详情</el-button>-->
      <!--<el-button type="text">财务1权限详情</el-button>-->
    </el-form-item>
    <!--<el-form-item label="活动时间" required>-->
    <!--<el-col :span="11">-->
    <!--<el-form-item prop="date1">-->
    <!--<el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1" style="width: 100%;"></el-date-picker>-->
    <!--</el-form-item>-->
    <!--</el-col>-->
    <!--<el-col class="line" :span="2">-</el-col>-->
    <!--<el-col :span="11">-->
    <!--<el-form-item prop="date2">-->
    <!--<el-time-picker placeholder="选择时间" v-model="ruleForm.date2" style="width: 100%;"></el-time-picker>-->
    <!--</el-form-item>-->
    <!--</el-col>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="即时配送" prop="delivery">-->
    <!--<el-switch v-model="ruleForm.delivery"></el-switch>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="活动性质" prop="type">-->
    <!--<el-checkbox-group v-model="ruleForm.type">-->
    <!--<el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>-->
    <!--<el-checkbox label="地推活动" name="type"></el-checkbox>-->
    <!--<el-checkbox label="线下主题活动" name="type"></el-checkbox>-->
    <!--<el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>-->
    <!--</el-checkbox-group>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="特殊资源" prop="resource">-->
    <!--<el-radio-group v-model="ruleForm.resource">-->
    <!--<el-radio label="线上品牌商赞助"></el-radio>-->
    <!--<el-radio label="线下场地免费"></el-radio>-->
    <!--</el-radio-group>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="绑定IP" prop="userBindIp">-->
    <!--<el-input v-model="ruleForm.userBindIp" type="textarea" style="width: 200px"/>-->
    <!--<span style="color:red;">多个ip之间请用英文分号(;)隔开！</span>-->
    <!--</el-form-item>-->
    <el-form-item label="登录密码" prop="password">
      <el-input v-model="ruleForm.password" type="password" style="width: 200px"/>
    </el-form-item>
    <el-form-item label="确认登录密码" prop="confirmPassword">
      <el-input v-model="ruleForm.confirmPassword" type="password" style="width: 200px"/>
    </el-form-item>
    <el-form-item label="员工支付密码" prop="userPayPass">
      <el-input v-model="ruleForm.userPayPass" type="password" style="width: 200px"/>
    </el-form-item>
    <el-form-item label="确认支付密码" prop="confirmUserPayPass">
      <el-input v-model="ruleForm.confirmUserPayPass" type="password" style="width: 200px"/>
    </el-form-item>
    <el-form-item label="谷歌验证码" prop="googleCode">
      <el-input v-model="ruleForm.googleCode" style="width: 200px"/>
    </el-form-item>
    <el-form-item>
      <el-button v-handle="submitBtn" type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { getRoles } from '@/api/merchant/merchantSubAccoun/subAccounList'
import { builtSubmit } from '@/api/merchant/merchantSubAccoun/builtSubAccounList'
import { Message } from 'element-ui'

export default {
  name: 'BuiltSubAccounList',
  data() {
    return {
      roleData: [],
      ruleForm: {
        userName: undefined,
        nickName: undefined,
        roleId: undefined,
        userBindIp: undefined,
        password: undefined,
        confirmPassword: undefined,
        userPayPass: undefined,
        confirmUserPayPass: undefined,
        googleCode: undefined
      },
      rules: {
        userName: [
          { required: true, message: '请输入子账户登录ID', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '请输入昵称', trigger: 'blur' }
        ],
        roleId: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ],
        userBindIp: [
          { required: true, message: '请输入绑定IP', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请输入确认登录密码', trigger: 'blur' }
        ],
        userPayPass: [
          { required: true, message: '请输入员工支付密码', trigger: 'blur' }
        ],
        confirmUserPayPass: [
          { required: true, message: '请输入确认支付密码', trigger: 'blur' }
        ],
        googleCode: [
          { required: true, message: '请输入谷歌验证码', trigger: 'blur' }
        ]
      },
      submitBtn: 'subAccounManage:builtSubAccounList:submitBtn'
    }
  },
  created() {
    this.getAllRoles()
  },
  methods: {
    submitForm(formName) {
      this.listLoading = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 加密参数
          this.ruleForm.password = this.$md5(this.ruleForm.password)
          this.ruleForm.confirmPassword = this.$md5(this.ruleForm.confirmPassword)
          this.ruleForm.userPayPass = this.$md5(this.ruleForm.userPayPass)
          this.ruleForm.confirmUserPayPass = this.$md5(this.ruleForm.confirmUserPayPass)
          this.ruleForm.roleId = this.ruleForm.roleId.toString()

          // 提交接口
          builtSubmit(this.ruleForm).then(response => {
            Message({
              message: '操作成功',
              type: 'success',
              duration: 5 * 1000
            })
            this.resetForm('ruleForm')
            this.listLoading = false
          }).catch(() => {
            this.listLoading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },

    getAllRoles() {
      getRoles().then(response => {
        this.roleData = response
      })
    }
  }
}
</script>
<style scoped>
  .demo-ruleForm{
    width: 50%;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background: #FFF;
    box-shadow: 0px 0px 3px 0px #aaa;
  }
</style>

