<template>
  <div class="container">
    <h2 style="padding:30px 0 0px 30px;">系统设置-谷歌身份验证</h2>
    <div class="data-form" >
      <!--1-->
      <div v-if="googleCheck.bingGoogle==='true'" class="header-tips">
        <svg-icon icon-class="vaild" class-name="vaild-icon" />
        <span class="title-tips">你已绑定谷歌验证，如需更换，请联系客服人员</span>
      </div>
      <!--2-->
      <div v-if="googleCheck.bingGoogle!=='true'" class="header-tips">
        <div class="title-tips">为保证您的正常使用，请绑定谷歌验证码</div>
        <div>第一步  下载谷歌验证器</div>
        <div>第二步  在谷歌验证器 APP 中输入以下16位字符或直接使用谷歌验证码App扫码进行绑定</div>
        <div class="qr-code">
          <img :src="googleCheck.QRBarUrl" class="qr-url" title="谷歌二维码">
          <span style="background: #ddd">{{ googleCheck.QRBarcode }}</span>
        </div>
        <div style="margin-bottom: 20px">第三步 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;输入谷歌验证码</div>
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
          <el-form-item prop="googleCode">
            <el-input v-model="ruleForm.googleCode" class="pw-input" placeholder="请输入谷歌验证码"/>
          </el-form-item>
          <div style="margin-bottom: 20px">第四步</div>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">完成绑定</el-button>
          </el-form-item>
        </el-form>
      </div>
      <hr class="hr-sty">
      <div class="foot-text">
        <div>1.安装谷歌身份验证器，登录谷歌商店或App Store搜索 [iPhone设备Google Authenticator] 或 [Android设备 谷歌身份验证器]</div>
        <div>2.下载并安装应用程序</div>
        <div>3.添加您绑定的谷歌账号，然后用谷歌身份验证器App扫描二维码（QR CODE)</div>
        <div>4.输入谷歌身份验证器产生的验证码</div>
        <div>5.提交后将本账号绑定谷歌身份验证器整个流程完成</div>
        <div>6.如需更改谷歌验证账号请联系客服人员</div>
        <div>7.更多详情请查看Google官方指南</div>
      </div>
    </div>
  </div>
</template>
<script>
import { checkBindGoogle, bindGoogle } from '@/api/merchant/sysSetting/bindGoogle'
import { Message } from 'element-ui'
export default {
  name: 'ResetgoogleCode',
  data() {
    return {
      googleCheck: {
        QRBarcode: null,
        bingGoogle: null, // 注意：后端true/false返回时字符串类型
        QRBarUrl: 'https://mp.weixin.qq.com/mp/qrcode?scene=10000004&size=102&__biz=MzI0NjAzNzcyMw==&mid=502825321&idx=1&sn=542dd624d714ab83f2fd342aee467952&send_time='
      },
      ruleForm: {
        googleCode: ''
      },
      rules: {
        googleCode: [
          { required: true, message: '请输入谷歌验证码', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    checkBindGoogle().then((res) => {
      this.googleCheck.QRBarcode = res.QRBarcode
      this.googleCheck.bingGoogle = res.bingGoogle
      this.googleCheck.QRBarUrl = res.QRBarUrl
      console.log('res', res)
    })
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = Object.assign({}, this.ruleForm)
          bindGoogle(data).then(() => {
            Message({
              message: '操作成功',
              type: 'success',
              duration: 5 * 1000
            })
            this.resetForm('ruleForm')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
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
  overflow: auto;
}
  .pw-input{
    width: 200px;
  }
  .data-form{
    padding: 30px 60px 30px 30px;
    margin: 0 auto;
    border-radius: 5px;
  }
  .vaild-icon{
    vertical-align: middle;
    color:#2196F3;
    font-size: 74px
  }
  .title-tips{
    margin-bottom: 40px;
    margin-left: 20px;
    font-size: 24px;
  }
  .header-tips{
    margin-bottom: 40px;
  }
  .foot-text{
    font-size: 14px;
    margin-top: 40px;
    line-height: 30px;
  }
  .qr-url{
    vertical-align: middle;
    margin-right: 60px;
  }
.qr-code{
    margin: 20px 0 20px 100px;
  }
</style>
