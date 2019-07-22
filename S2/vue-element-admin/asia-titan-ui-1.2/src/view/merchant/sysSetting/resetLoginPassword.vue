<template>
  <div class="container">
    <div :class="code === '1' ? 'manage' : ''" class="reset-passwod">
      <div v-if="(code === '3301' || code === '1')" class="cont">
        <!-- <h1>请重置登入密码</h1> -->
        <p v-if="usreInfo.resetFlag === 1" class="tip">为保证账户安全，初始密码登录需要重新设置密码</p>
        <el-form ref="form" :rules="rules" :model="formData" label-position="top" label-width="200px" style="width: 400px;margin:0 auto;">
          <el-form-item v-if="usreInfo.resetFlag === 2" label="旧密码" prop="oldPassword">
            <el-input v-model="formData.oldPassword" type="password" style="width: 400px;" />
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword" type="password">
            <el-input v-model="formData.newPassword" type="password" style="width: 400px;" />
          </el-form-item>
          <el-form-item label="确认新密码" prop="ckPassword">
            <el-input v-model="formData.ckPassword" type="password" style="width: 400px;" />
          </el-form-item>
          <el-form-item v-if="usreInfo.bindGoogle === 1" label="谷歌验证码" prop="googleCode">
            <el-input v-model="formData.googleCode" style="width: 400px;" />
          </el-form-item>
        </el-form>
        <div class="foot-btn">
          <el-button class="filter-item" type="primary" @click="modifyPassword">修 改</el-button>
        </div>
      </div>
      <div v-else-if="code === '3302'" class="cont">
        <p class="tip">请绑定谷歌验证码</p>
        <div class="step">
          1、下载谷歌验证码APP<br>
          2、使用谷歌验证码APP，扫描下面二维码获取验证码<br>
          3、输入验证码，绑定验证码
        </div>
        <div class="qr-code-vaild-code">
          <div id="qr-code" class="qr-code">
            <img :src="qrImg" alt="">
          </div>
          <div class="vaild-code">
            <el-input v-model="bindGoogleCode" placeholder="请输入谷歌验证码" style="width: 200px;" />
            <el-button class="" type="primary" @click="getQueryUrl('1')">刷新验证码</el-button>
            <el-button class="filter-item" style="margin-left:0" type="primary" @click="bingGoogle">确认绑定</el-button>
          </div>
        </div>
      </div>
      <div v-else class="cont">
        <p class="tip">为保证资金安全，请设置资金密码</p>
        <el-form ref="capitalForm" :rules="capitalRules" :model="capitalForm" label-position="top" label-width="200px" style="width: 400px;margin:0 auto;">
          <el-form-item v-if="usreInfo.bindPayPass === 1" label="旧密码" prop="oldPassword">
            <el-input v-model="capitalForm.oldPassword" type="password" style="width: 400px;" />
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword" type="password">
            <el-input v-model="capitalForm.newPassword" type="password" style="width: 400px;" />
          </el-form-item>
          <el-form-item label="确认新密码" prop="ckPassword">
            <el-input v-model="capitalForm.ckPassword" type="password" style="width: 400px;" />
          </el-form-item>
          <el-form-item label="谷歌验证码" prop="googleCode">
            <el-input v-model="capitalForm.googleCode" style="width: 400px;" />
          </el-form-item>
        </el-form>
        <div class="foot-btn">
          <el-button class="filter-item" type="primary" @click="capitalPassword">确 认</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Cookies from 'js-cookie'
import { changePassword, queryBindGoogle, bindGoogle, capitalPassword, refreshGoogle } from '@/api/resetPassword'
import QRCode from 'qrcodejs2'

export default {
  data() {
    var checkNewPassword = (rule, value, callback) => {
      if (value) {
        const reg = /^[a-zA-Z0-9]{6,16}$/
        if (this.formData.ckPassword !== '') {
          this.$refs.form.validateField('ckPassword')
        }
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('密码由6-16位英文或数字组成'))
        }
      } else {
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value) {
        if (value !== this.formData.newPassword) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var checkCapital = (rule, value, callback) => {
      if (value) {
        const reg = /^[a-zA-Z0-9]{6,16}$/
        if (this.capitalForm.ckPassword !== '') {
          this.$refs.capitalForm.validateField('ckPassword')
        }
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('密码由6-16位英文或数字组成'))
        }
      } else {
        callback()
      }
    }
    var checkCapital2 = (rule, value, callback) => {
      if (value) {
        if (value !== this.capitalForm.newPassword) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      formData: {
        oldPassword: '',
        newPassword: '',
        ckPassword: '',
        googleCode: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新秘密', trigger: 'blur' },
          { validator: checkNewPassword, trigger: ['blur', 'change'] }
        ],
        ckPassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validatePass2, trigger: ['blur', 'change'] }
        ],
        googleCode: [
          { required: true, message: '请输入谷歌验证码', trigger: 'blur' }
        ]
      },
      capitalForm: {
        ckPassword: '',
        oldPassword: '',
        newPassword: '',
        googleCode: ''
      },
      capitalRules: {
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新秘密', trigger: 'blur' },
          { validator: checkCapital, trigger: ['blur', 'change'] }
        ],
        ckPassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: checkCapital2, trigger: ['blur', 'change'] }
        ],
        googleCode: [
          { required: true, message: '请输入谷歌验证码', trigger: 'blur' }
        ]
      },
      bindGoogleCode: '',
      usreInfo: {},
      qrImg: '',
      code: ''
    }
  },
  watch: {
    $route(newVal, oldVal) {
      this.code = newVal.params.typeId
      this.getQueryUrl()
    }
  },
  created() {
    this.code = this.$route.params.typeId || '1'
    var cookies = Cookies.get('oauth2_info')
    if (cookies) {
      this.usreInfo = JSON.parse(cookies)
    }
  },
  mounted() {
    this.getQueryUrl()
  },
  methods: {
    modifyPassword() {
      var vm = this
      this.$refs['form'].validate((valid) => {
        if (valid) {
          var params = {
            newPassword: vm.$md5(vm.formData.newPassword)
          }
          if (vm.usreInfo.resetFlag === 2) {
            params.oldPassword = vm.$md5(vm.formData.oldPassword)
          }
          if (vm.usreInfo.bindGoogle === 1) {
            params.googleCode = vm.formData.googleCode
          }
          changePassword(params).then(response => {
            vm.$message({
              message: '修改成功',
              type: 'success'
            })

            // 1 代表超级管理员手动修改 所以不做以下操作
            if (vm.code !== '1') {
              vm.usreInfo.resetFlag = 2
              Cookies.set('oauth2_info', JSON.stringify(vm.usreInfo))
              if (vm.usreInfo.bindGoogle === 0) {
                vm.$router.push({ name: 'reset', params: { typeId: '3302' }})
              } else {
                vm.$router.push({ path: '/' })
              }
            } else {
              this.$refs['form'].resetFields()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    bingGoogle() {
      var vm = this
      if (!this.bindGoogleCode) {
        vm.$message({
          message: '请输入谷歌验证码',
          type: 'error'
        })
        return
      }
      bindGoogle({ googleCode: this.bindGoogleCode }).then(response => {
        vm.$message({
          message: '绑定成功',
          type: 'success'
        })
        vm.usreInfo.bindGoogle = 1
        Cookies.set('oauth2_info', JSON.stringify(vm.usreInfo))
        if (vm.usreInfo.bindPayPass === 0) {
          vm.$router.push({ name: 'reset', params: { typeId: '3303' }})
        } else if (vm.usreInfo.resetFlag === 1) {
          vm.$router.push({ name: 'reset', params: { typeId: '3301' }})
        } else {
          vm.$router.push({ path: '/' })
        }
      })
    },
    capitalPassword() {
      var vm = this
      this.$refs['capitalForm'].validate((valid) => {
        if (valid) {
          var params = {
            newPassword: vm.$md5(vm.capitalForm.newPassword),
            googleCode: vm.capitalForm.googleCode
          }
          if (vm.usreInfo.bindPayPass === 1) {
            params.oldPassword = vm.$md5(vm.capitalForm.oldPassword)
          }
          capitalPassword(params).then(response => {
            vm.$message({
              message: '设置成功',
              type: 'success'
            })
            vm.usreInfo.bindPayPass = 1
            Cookies.set('oauth2_info', JSON.stringify(vm.usreInfo))
            vm.$router.push({ path: '/' })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getQueryUrl(val) {
      var vm = this
      if (this.code === '3302') {
        if (val) {
          refreshGoogle().then(response => {
            vm.qrImg = response.QRBarUrl
          })
        } else {
          queryBindGoogle().then(response => {
            vm.qrImg = response.QRBarUrl
            // vm.qrcode(response.QRBarUrl)
          })
        }
      }
    },
    qrcode(url) {
      new QRCode('qr-code', {
        width: 160,
        height: 160,
        text: url, // 二维码地址
        colorDark: '#000',
        colorLight: '#fff'
      })
    }
  }
}
</script>

<style scoped>
  .container{
    border-radius: 5px;
    background: #fff;
    margin: 30px;
    height: calc(100vh - 144px);
  }
  .reset-passwod{
    background: #f2f2f2;
    height: 100%;
    width: 100%;
    min-height: 600px;
    min-width: 500px;
    position: fixed;
  }
  .reset-passwod .cont{
    width: 600px;
    position: absolute;
    top: 50%;
    left: 50%;
    background: #fff;
    border-radius: 3px;
    transform: translate(-50%, -50%);
    padding: 60px 30px;
  }
  .reset-passwod.manage, .reset-passwod.manage .cont{
    position: static;
    transform: translate(0, 0);
    background: none;
  }
  .reset-passwod .cont h1{
    text-align: center;
    font-size: 22px;
    height: 60px;
    margin-bottom: 30px;
    border-bottom: 1px solid #f2f2f2;
  }
  .reset-passwod .foot-btn{
    margin-top: 30px;
    text-align: center;
  }
  .reset-passwod .foot-btn .filter-item{
    width: 400px;
  }
  .reset-passwod .cont .tip{
    color:  red;
    text-align: center;
    font-size: 13px;
  }
  .reset-passwod .cont .step{
    font-size: 14px;
    line-height: 30px;
    color: #5a5858;
  }
  .reset-passwod .qr-code-vaild-code{
    display: flex;
    margin-top: 20px;
  }
  .reset-passwod .qr-code{
    padding: 10px;
    border: 1px solid #f2f2f2;
    width: 180px;
    margin-right: 20px;
  }
  .reset-passwod .vaild-code{
    padding-top: 30px;
  }
  .reset-passwod .vaild-code .filter-item{
    width: 200px;
    margin-top: 60px;
  }
  .reset-passwod >>> .el-form-item__label{
    line-height: 30px;
    padding-bottom: 0;
  }
</style>
