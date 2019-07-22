<template >
  <el-form v-loading="listLoading" label-position="right" label-width="23%" >
    <el-form-item label="上传头图"/>
    <el-form-item label="PC端">
      <el-upload
        :headers="uploadHeads"
        :action="uploadIconUrl()"
        :on-success="uploadPCSuccess"
        :before-upload="beforeUpload"
        :file-list="fileListPC"
        :on-progress="uploadProgressPC"
        :on-remove="fileRemovePC"
        multiple
        drag
        list-type="picture"
        style="width: 399px">
        <i class="el-icon-upload"/>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png/gif文件，且不超过10MB</div>
      </el-upload>
    </el-form-item>
    <el-form-item label="手机端">
      <el-upload
        :headers="uploadHeads"
        :action="uploadIconUrl()"
        :on-success="uploadWAPSuccess"
        :before-upload="beforeUpload"
        :file-list="fileListWap"
        :on-progress="uploadProgressWap"
        :on-remove="fileRemoveWap"
        multiple
        drag
        list-type="picture"
        style="width: 399px">
        <i class="el-icon-upload"/>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png/gif文件，且不超过10MB</div>
      </el-upload>
    </el-form-item>

    <el-form-item label="编辑充值说明文案">
      <div>
        <tinymce :height="300" v-model="baseConf.rechargeDesc"/>
      </div>
    </el-form-item>
    <el-form-item label="编辑可选金额"><br>
      <el-select
        v-model="quickAmount"
        placeholder="从现有组合中选择"
        clearable
        style="width: 15%"
        class="filter-item"
        @clear="qkAmountClear">
        <el-option
          v-for="(item,index) in qkAmountList"
          :key="index"
          :label="item.groupName"
          :value="item.amount"/>
      </el-select>
      <br>
      <div style="margin-top: 10px;">
        <!--<div style="margin-right: 10px; width:10%;display:inline">已经选中组合</div>-->
        <el-button v-for="(item,index) in quickAmount" :key="item+'-'+index" type="primary">{{ item }}</el-button>
      </div>
    </el-form-item>
    <el-form-item label="选择支付方式(PC)">
      <div v-for="item in pcPayConfCopy" :key="item.payType" style="margin: 15px 0 " >
        <el-checkbox v-model="item.isUseBoolean" style="width: 15%">
          <svg-icon v-if="item.icon" :icon-class="item.icon" class-name="payTypeIconSize" />
          {{ payTypeMap[item.payType] }}
        </el-checkbox>
        <el-checkbox v-model="item.isRecommendBoolean" :disabled="!item.isUseBoolean" style="width: 9%">
          推荐
        </el-checkbox>
        <el-input v-model="item.recommend" :disabled="!item.isUseBoolean" clearable placeholder="输入说明文案" style="width: 20%;position: absolute;margin-right: auto" />
        <el-input v-model="item.sortNum" :disabled="!item.isUseBoolean" clearable placeholder="输入排序值 数字越大越靠前" style="width:40%; position: absolute;right:10%;"/>
      </div>
    </el-form-item>
    <el-form-item label="WAP是否与PC一致">
      <el-switch
        v-model="isSame2Pc"
        active-color="#13ce66"
        inactive-color="#ff4949"
        active-text="是"
        inactive-text="否"
        @change="switchChange"/>
    </el-form-item>
    <el-collapse-transition>
      <el-form-item v-if="!isSame2Pc" label="选择支付方式(WAP)">
        <div v-for="item in wapPayConfCopy" :key="item.payType" style="margin: 15px 0 " >
          <el-checkbox v-model="item.isUseBoolean" style="width: 15%">
            <svg-icon v-if="item.icon" :icon-class="item.icon" class-name="payTypeIconSize" />
            {{ payTypeMap[item.payType] }}
          </el-checkbox>
          <el-checkbox v-model="item.isRecommendBoolean" :disabled="!item.isUseBoolean" style="width: 9%">
            推荐
          </el-checkbox>
          <el-input v-model="item.recommend" :disabled="!item.isUseBoolean" clearable placeholder="输入说明文案" style="width: 20%;position: absolute;margin-right: auto" />
          <el-input v-model="item.sortNum" :disabled="!item.isUseBoolean" clearable placeholder="输入排序值 数字越大越靠前" style="width:40%; position: absolute;right:10%;"/>
        </div>
      </el-form-item>
    </el-collapse-transition>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">提交</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { getConf, myCashierSave, qkAmountList } from '@/api/merchant/myCashier'
import { Message, MessageBox } from 'element-ui'
import { isAccessTokenExpired } from '@/utils/auth'
import { refreshToken } from '@/api/login'
import store from '@/store'
import Tinymce from '@/components/Tinymce'

const payTypeMap = {
  'BANK': '网银',
  'ZFB': '支付宝',
  'QQ': 'QQ支付',
  'QQ_H5': 'QQ支付H5',
  'ZFB_H5': '支付宝H5',
  'ZFB_WAP': '支付宝WAP'
}

const pcPayConfCopy = []
const wapPayConfCopy = []

export default {
  components: { Tinymce },
  filters: {
  },
  data() {
    return {
      qkAmountList: undefined,
      isSame2Pc: true,
      pcPayConfCopy,
      wapPayConfCopy,
      payTypeMap,
      listLoading: false,
      fileUrlPC: undefined,
      pcIcon: undefined,
      fileUrlWap: undefined,
      wapIcon: undefined,
      fileListPC: [],
      fileListWap: [],
      pcPayConf: [
        {
          icon: undefined,
          isUseBoolean: false,
          isRecommendBoolean: false
        }
      ],
      wapPayConf: [
        {
          icon: undefined,
          isUseBoolean: false,
          isRecommendBoolean: false
        }
      ],
      baseConf: { rechargeDesc: null },
      quickAmount: undefined,
      quickAmountCache: undefined
    }
  },
  computed: {
    uploadHeads() {
      return { 'Authorization':	'Bearer ' + this.$store.getters.token }
    }
  },
  created() {
    this.init()
  },
  methods: {
    qkAmountClear() {
      this.quickAmount = this.quickAmountCache
    },
    payAmountList() {
      this.listLoading = true
      qkAmountList().then(response => {
        this.qkAmountList = response.data
        this.qkAmountList.forEach(item => {
          item.amount = item.quickAmount.split(',')
        })
        this.qkAmountList.push({ groupName: '使用中', amount: this.quickAmount })
        this.listLoading = false
      }).catch(err => {
        Message.error(err)
        this.listLoading = false
      })
    },
    switchChange() {
    },
    payTypeIcon(item) {
      switch (item.payType) {
        case 'ZFB': {
          item.icon = 'zfb'
          break
        }
        case 'BANK': {
          item.icon = 'wangyin'
          break
        }
        case 'QQ': {
          item.icon = 'QQPay'
          break
        }
        case 'QQ_H5': {
          item.icon = 'QQPay'
          break
        }
        case 'ZFB_H5': {
          item.icon = 'zfb'
          break
        }
        case 'ZFB_WAP': {
          item.icon = 'zfb'
          break
        }
      }
    },
    async init() {
      await this.getConf()
      this.payAmountList()
    },
    async getConf() {
      this.listLoading = true
      await getConf().then(response => {
        const data = response.data
        this.pcPayConf = Object.assign(this.pcPayConf, data.pcPayConf)
        if (data.wapPayConf.filter(item => item.isUse === 1).length > 0) this.isSame2Pc = false
        this.wapPayConf = Object.assign(this.wapPayConf, data.wapPayConf)
        this.pcPayConfCopy.length = 0
        this.wapPayConfCopy.length = 0
        this.pcPayConf.forEach(item => {
          this.payTypeIcon(item)
          item.isRecommendBoolean = item.isRecommend === 1
          item.isUseBoolean = item.isUse === 1
          this.pcPayConfCopy.push(item)
        })
        this.wapPayConf.forEach(item => {
          this.payTypeIcon(item)
          item.isRecommendBoolean = item.isRecommend === 1
          item.isUseBoolean = item.isUse === 1
          this.wapPayConfCopy.push(item)
        })
        this.baseConf = Object.assign(this.baseConf, data.baseConf)
        this.quickAmount = this.baseConf.quickAmount.split(',')
        this.quickAmountCache = this.quickAmount
        this.pcIcon = this.baseConf.pcIcon
        this.fileUrlPC = this.baseConf.fileBaseUrl + '/' + this.baseConf.pcIcon
        this.wapIcon = this.baseConf.wapIcon
        this.fileUrlWap = this.baseConf.fileBaseUrl + '/' + this.baseConf.wapIcon
        this.fileListPC = [{ name: '', url: this.fileUrlPC }]
        this.fileListWap = [{ name: '', url: this.fileUrlWap }]
        this.listLoading = false
      }).catch(err => {
        Message.error(err)
        this.listLoading = false
      })
    },
    onSubmit() {
      MessageBox.confirm('确认修改我的收银台信息', '我的收银台信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true

        if (this.pcIcon) this.baseConf.pcIcon = this.pcIcon
        if (this.wapIcon) this.baseConf.wapIcon = this.wapIcon
        const commitInfo = Object.assign({ payMethod: [] }, this.baseConf)
        commitInfo.quickAmount = this.quickAmount.toString()
        const pcPayConfCopy = this.pcPayConfCopy.filter(item => item.isUseBoolean)
        pcPayConfCopy.forEach(item => {
          delete item.id
          item.isUse = item.isUseBoolean ? 1 : 2
          item.isRecommend = item.isRecommendBoolean ? 1 : 2
        })
        /* eslint-disable */
        // if (this.isSame2Pc) this.wapPayConfCopy = _.cloneDeep(pcPayConfCopy)
        // 由于网银不包含在wap支付类型中 所以拷贝过来会使得wap类型增加 换一种方式
        if (this.isSame2Pc) {
          this.wapPayConfCopy.forEach(item => {
            pcPayConfCopy.forEach(item2 => {
              if (item.payType === item2.payType) {
                item.isUseBoolean = item2.isUseBoolean
              }
            })
          })
        }
        const wapPayConfCopy = this.wapPayConfCopy.filter(item => item.isUseBoolean)
        wapPayConfCopy.forEach(item => {
          item.isUse = item.isUseBoolean ? 1 : 2
          item.isRecommend = item.isRecommendBoolean ? 1 : 2
          if (this.isSame2Pc) {
            item.terminalType = 'WAP'
          }
        })
        Array.prototype.push.apply(commitInfo.payMethod, pcPayConfCopy)
        Array.prototype.push.apply(commitInfo.payMethod, wapPayConfCopy)
        myCashierSave(commitInfo).then(response => {
          // const data = response.data

          this.pcPayConfCopy.sort((a, b) => {
            if (a.sortNum > b.sortNum) {
              return -1
            } else if (a.sortNum < b.sortNum) {
              return 1
            }
            return 0
          })

          this.pcPayConfCopy.sort((a, b) => {
            if (a.isUseBoolean && !b.isUseBoolean) {
              return -1
            } else if (!a.isUseBoolean && b.isUseBoolean) {
              return 1
            }
            return 0
          })
          this.wapPayConfCopy.sort((a, b) => {
            if (a.sortNum > b.sortNum) {
              return -1
            } else if (a.sortNum < b.sortNum) {
              return 1
            }
            return 0
          })

          this.wapPayConfCopy.sort((a, b) => {
            if (a.isUseBoolean && !b.isUseBoolean) {
              return -1
            } else if (!a.isUseBoolean && b.isUseBoolean) {
              return 1
            }
            return 0
          })
          Message.success(response.message)
          this.listLoading = false
        }).catch(err => {
          Message.error(err)
          this.listLoading = false
        })
      })
    },
    uploadIconUrl() {
      const sysType = document.domain === this.MerchantHost ? this.Merchant : this.Manage
      return window.location.origin + sysType + '/cashConf/uploadIcon'
    },
    uploadProgressPC(event, file, fileList) {

    },
    uploadProgressWap(event, file, fileList) {
    },
    fileRemovePC(event, file, fileList) {
      this.fileUrlPC = undefined
      this.pcIcon = undefined
    },
    fileRemoveWap(event, file, fileList) {
      this.fileUrlWap = undefined
      this.wapIcon = undefined
    },
    uploadPCSuccess(response, file, fileListPC) {
      // alert(JSON.stringify(fileListPC))
      if (response.code === 200) {
        this.fileListPC.length = 0
        const data = response.data
        this.pcIcon = data.iconUrl
        this.fileUrlPC = data.fileBaseUrl + '/' + data.iconUrl
        this.fileListPC.push({ name: file.name, url: this.fileUrlPC })
        Message.success(response.message)
      } else {
        Message.error(response.message)
      }
    },
    uploadWAPSuccess(response, file, fileListPC) {
      if (response.code === 200) {
        this.fileListWap.length = 0
        const data = response.data
        this.wapIcon = data.iconUrl
        this.fileUrlWap = data.fileBaseUrl + '/' + data.iconUrl
        this.fileListWap.push({ name: file.name, url: this.fileUrlWap })
        Message.success(response.message)
      } else {
        Message.error(response.message)
      }
    },
    async beforeUpload(file) {
      // alert(this.uploadHeads.Authorization)
      this.listLoading = true
      if (isAccessTokenExpired()) {

          /* 发起刷新token的请求*/
          await refreshToken().then(res => {
            // window.isRefreshing = false

            this.uploadHeads.Authorization = res.token_type + ' ' + res.access_token
            store.dispatch('refreshToken', res)
          }).catch(error => {
            // window.isRefreshing = false
            Message.error(error)
          })
      }
      this.listLoading = false
    }
  }
}

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  #cashier-form {
    position: relative;
    top: 110px;
  }
  .choice-1 {
    position: relative;
    top: 13px;
  }
  .choice-2 {
    position: relative;
    top: 28px;
  }
  .wxzf img {
    vertical-align: center;
  }
  .payTypeIconSize {
    width: 30px;
    height: 30px;
    position: relative;
    top: 7px;
  }
</style>
