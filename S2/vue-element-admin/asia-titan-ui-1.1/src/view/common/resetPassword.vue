<template>
  <div :class="code === '1' ? 'manage' : ''" class="reset-passwod">
    <div v-if="(code === '3301' || code === '1')" class="cont">
      <!-- <h1>请重置登入密码</h1> -->
      <p v-if="usreInfo.resetFlag === 1" class="tip">为保证账户安全，初始密码登录需要重新设置登录密码</p>
      <el-form ref="form" :rules="rules" :model="formData" label-position="top" label-width="200px" style="width: 400px;margin:0 auto;">
        <el-form-item v-if="usreInfo.resetFlag === 2" label="旧密码" prop="oldPassword">
          <el-input v-model="formData.oldPassword" type="password" style="width: 400px;" />
        </el-form-item>
        <el-form-item label="新登录密码" prop="newPassword" type="password">
          <el-input v-model="formData.newPassword" type="password" style="width: 400px;" />
        </el-form-item>
        <el-form-item label="确认新登录密码" prop="ckPassword">
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
        3、输入验证码，绑定验证码<br>
        4、如果二维码展示不出来，请在谷歌验证器中手动输入以下密钥:
        <div style="color: #409EFF"> {{ keyPassword }} </div>
      </div>
      <div class="qr-code-vaild-code">
        <div style="width: 200px;height: 200px;">
          <div id="qr-code" class="qr-code">
            <!-- <img :src="qrImg" alt=""> -->
          </div>
        </div>
        <div class="vaild-code">
          <el-input v-model="bindGoogleCode" placeholder="请输入谷歌验证码" style="width: 200px;" />
          <el-button class="" type="primary" @click="getQueryUrl('1')">刷新验证码</el-button>
          <el-button class="filter-item" style="margin-left:0" type="primary" @click="bingGoogle">确认绑定</el-button>
        </div>
      </div>
    </div>
    <div v-else class="cont">
      <p class="tip">为保证资金安全，请设置<span class="cl-red">资金密码</span><br>该密码<span class="cl-red">非常有用</span>,请务必谨慎设置并<span class="cl-red">记住该密码</span></p>
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
</template>

<script>

import Cookies from 'js-cookie'
import { changePassword, queryBindGoogle, bindGoogle, capitalPassword, refreshGoogle } from '@/api/resetPassword'
import QRCode from 'qrcodejs2'

export default {
  name: 'ResetLoginPassword',
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
      keyPassword: '',
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
          document.getElementById('qr-code').innerHTML = ''
          refreshGoogle().then(response => {
            let secret = response.QRBarcode.split('secret=')[1]
            if (secret.includes('&')) {
              secret = secret.split('&')[0]
            }
            vm.keyPassword = secret
            vm.qrcode(response.QRBarcode)
          })
        } else {
          queryBindGoogle().then(response => {
            // vm.qrImg = response.QRBarUrl
            let secret = response.QRBarcode.split('secret=')[1]
            if (secret.includes('&')) {
              secret = secret.split('&')[0]
            }
            vm.keyPassword = secret
            vm.qrcode(response.QRBarcode)
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
    font-size: 20px;
    font-weight: bold;
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
    height: 180px;
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

  .reset-passwod .cont .tip .cl-red {
    color: red;
    font-weight: bold;
  }

   .reset-passwod .cont .tip{
     font-size: 20px;
     color:#409EFF;
     margin: 10px;
     animation: changeshadow 1s  ease-in  infinite ;
     /* 其它浏览器兼容性前缀 */
     -webkit-animation: changeshadow 1s linear infinite;
     -moz-animation: changeshadow 1s linear infinite;
     -ms-animation: changeshadow 1s linear infinite;
     -o-animation: changeshadow 1s linear infinite;
   }
  @keyframes changeshadow {
    0%{ text-shadow: 0 0 4px #409EFF}
    50%{ text-shadow: 0 0 40px #409EFF}
    100%{ text-shadow: 0 0 4px #409EFF}
  }
  /* 添加兼容性前缀 */
  @-webkit-keyframes changeshadow {
    0%{ text-shadow: 0 0 4px #409EFF}
    50%{ text-shadow: 0 0 40px #409EFF}
    100%{ text-shadow: 0 0 4px #409EFF}
  }
  @-moz-keyframes changeshadow {
    0%{ text-shadow: 0 0 4px #409EFF}
    50%{ text-shadow: 0 0 40px #409EFF}
    100%{ text-shadow: 0 0 4px #409EFF}
  }
  @-ms-keyframes changeshadow {
    0%{ text-shadow: 0 0 4px #409EFF}
    50%{ text-shadow: 0 0 40px #409EFF}
    100%{ text-shadow: 0 0 4px #409EFF}
  }
  @-o-keyframes changeshadow {
    0%{ text-shadow: 0 0 4px #409EFF}
    50%{ text-shadow: 0 0 40px #409EFF}
    100%{ text-shadow: 0 0 4px #409EFF}
  }

</style>
