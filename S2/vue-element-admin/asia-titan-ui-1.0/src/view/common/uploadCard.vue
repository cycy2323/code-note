<template>
  <div>
    <el-upload
      :headers="uploadHeads"
      :action="uploadIconUrl()"
      :on-success="uploadPCSuccess"
      :before-upload="beforeUpload"
      :file-list="fileListPC"
      :on-progress="uploadProgressPC"
      :on-remove="fileRemovePC"
      :name = "name"
      multiple
      drag
      list-type="picture"
      style="width: 399px">
      <i class="el-icon-upload"/>
      <div class="el-upload__text"><em>点击上传</em> {{ title }}</div>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png/gif文件，且不超过10MB</div>
    </el-upload>
    <!--<el-upload-->
    <!--:headers="uploadHeads"-->
    <!--:action="uploadIconUrl()"-->
    <!--:on-success="uploadPCSuccess"-->
    <!--:before-upload="beforeUpload"-->
    <!--:file-list="fileListPC"-->
    <!--:on-progress="uploadProgressPC"-->
    <!--:on-remove="fileRemovePC"-->
    <!--multiple-->
    <!--drag-->
    <!--list-type="picture"-->
    <!--style="width: 399px">-->
    <!--<i class="el-icon-upload"/>-->
    <!--<div class="el-upload__text"><em>点击上传</em> 身份证反面</div>-->
    <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png/gif文件，且不超过10MB</div>-->
    <!--</el-upload>-->
    <!--<el-upload-->
    <!--:headers="uploadHeads"-->
    <!--:action="uploadIconUrl()"-->
    <!--:on-success="uploadPCSuccess"-->
    <!--:before-upload="beforeUpload"-->
    <!--:file-list="fileListPC"-->
    <!--:on-progress="uploadProgressPC"-->
    <!--:on-remove="fileRemovePC"-->
    <!--multiple-->
    <!--drag-->
    <!--list-type="picture"-->
    <!--style="width: 399px">-->
    <!--<i class="el-icon-upload"/>-->
    <!--<div class="el-upload__text"><em>点击上传</em> 手持身份证照片</div>-->
    <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png/gif文件，且不超过10MB</div>-->
    <!--</el-upload>-->
  </div>
</template>

<script>
import Message from 'element-ui'
import { isAccessTokenExpired } from '@/utils/auth'
import { refreshToken } from '@/api/login'
import store from '@/store'

export default {
  name: 'UploadCard',
  model: {
    prop: 'resultInfo',
    event: 'success-final'
  },
  props: {
    name: {
      type: String,
      default: 'cardImg'
    },
    resultInfo: {
      type: Object,
      default: function() {
        return { fileBaseUrl: null, fid: null }
      }
    },
    title: {
      type: String,
      default: ''
    },
    uri: {
      type: String,
      default: '/manage/home/uploadPic'
    }
  },
  data() {
    return {
      fileListPC: []
    }
  },
  computed: {
    uploadHeads() {
      return { 'Authorization':	'Bearer ' + this.$store.getters.token }
    }
  },
  methods: {
    uploadIconUrl() {
      let sysType = null
      switch (document.domain) {
        case this.MerchantHost: {
          sysType = this.Merchant
          break
        }
        case this.ManageHost: {
          sysType = this.Manage
          break
        }
        case this.AgentHost: {
          sysType = this.Agent
          break
        }
        default: {
          sysType = this.Merchant
          break
        }
      }
      return window.location.origin + sysType + this.uri
    },
    uploadPCSuccess(response, file, fileListPC) {
      if (response.code === 200) {
        this.fileListPC.length = 0
        const data = response.data
        this.pcIcon = data.iconUrl
        if (!data.fileBaseUrl.endsWith('/')) {
          data.fileBaseUrl += '/'
        }
        this.fileUrlPC = data.fileBaseUrl + data.iconUrl
        this.fileListPC.push({ name: file.name, url: this.fileUrlPC })

        this.$emit('success-final', { fileBaseUrl: data.fileBaseUrl, fid: data.iconUrl })
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
    },
    uploadProgressPC(event, file, fileList) {

    },
    fileRemovePC(event, file, fileList) {
      this.fileUrlPC = undefined
      this.pcIcon = undefined
    }
  }
}
</script>

<style scoped>

</style>
