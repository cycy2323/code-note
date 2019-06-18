<template>
  <div class="mixin-components-container">
    <div class="container-1">
      <el-container>
        <el-header>网站配置</el-header>
        <el-main>
          <el-form size="mini" class="left">
            <el-form-item label="商户信息变更">
              <el-radio v-model="radio1" :label="2">锁定</el-radio>
              <el-radio v-model="radio1" :label="1">解锁</el-radio>
            </el-form-item>
            <el-form-item label="自动隐藏未支付订单">
              <el-radio v-model="radio2" :label="1">开启</el-radio>
              <el-radio v-model="radio2" :label="2">关闭</el-radio>
            </el-form-item>
            <el-form-item label="新订单提醒">
              <el-radio v-model="radio3" :label="1">开启</el-radio>
              <el-radio v-model="radio3" :label="2">关闭</el-radio>
            </el-form-item>
            <el-form-item label="订单错误提醒">
              <el-radio v-model="radio4" :label="1">开启</el-radio>
              <el-radio v-model="radio4" :label="2">关闭</el-radio>
            </el-form-item>
          </el-form>
          <el-form size="mini" class="right">
            <el-form-item label="订单错误警报声音">
              <el-radio v-model="radio5" :label="1">开启</el-radio>
              <el-radio v-model="radio5" :label="2">关闭</el-radio>
            </el-form-item>
            <el-form-item label="充值账号转换">
              <el-radio v-model="radio6" :label="2">转小写</el-radio>
              <el-radio v-model="radio6" :label="3">转大写</el-radio>
              <el-radio v-model="radio6" :label="1">保持不变</el-radio>
            </el-form-item>
            <el-form-item label="未支付订单监控">
              <el-radio v-model="radio7" :label="1">开启</el-radio>
              <el-radio v-model="radio7" :label="2">关闭</el-radio>
            </el-form-item>
          </el-form>
        </el-main>
      </el-container>
    </div>
    <div class="container-4" style="width: 100%">
      <el-container>
        <el-header>访问后台IP限制</el-header>
        <el-main style="border: none;">
          <div class="float-left-1">
            <el-form class="">
              <el-form-item label="是否开启IP限制" style="width: 100%">
                <el-radio v-model="radio8" :label="1">是</el-radio>
                <el-radio v-model="radio8" :label="2">否</el-radio>
                <span style="font-size: 10px;color: #999999;letter-spacing: 0;">（开启后，仅加入白名单的IP可访问后台）</span>
              </el-form-item>
              <el-form-item label="新增白名单" class="el-form-item-left">
                <el-input
                  ref="saveTagInput"
                  v-model="inputValue"
                  clearable
                  placeholder="仅支持输入数字"
                  size="small"
                  style="width: 32%"
                />
                <el-button type="primary" size="mini" @click="showInput">确定</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="float-left-2" >
            <div class="bold-title">目前已设置白名单地址</div>
            <div class="white-name-input">
              <el-tag
                v-for="( item, index ) in whiteName"
                :key="item"
                :disable-transitions="false"
                closable
                size="medium"
                @close="handleClose(item,index)"
              >
                {{ item }}
              </el-tag>
            </div>
          </div>
        </el-main>
      </el-container>
    </div>
    <div class="container-3">
      <el-container>
        <el-header>订单列表自动刷新秒数设置</el-header>
        <el-main>
          <el-form class="add-second" style="width: 30%">
            <el-form-item label="新增秒数"><br>
              <el-input
                ref="saveButtonInput"
                v-model="secondValue"
                onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"
                placeholder="仅支持输入数字"
                size="small"
                min="5"
                max="600"
                style="width: 80%"
              />
              <el-button type="primary" size="mini" @click="showButton">确定</el-button>
            </el-form-item>
            <br>
            <br>
            <el-form-item label="可选设置秒数"><br>
              <!--<el-button v-for="item in secondSetting" :key="item" type="primary" size="mini" plain>{{ item }}</el-button>-->
              <el-tag
                v-for="(item, index) in orderRefIntervalTime"
                :key="item"
                :disable-transitions="false"
                closable
                @close="buttonClose(item, index)"
              >
                {{ item }}
              </el-tag>
            </el-form-item>
            <!--<div class="verification">-->
            <!--<span style="color: #606266;font-weight: bold">请输入谷歌验证码</span>&nbsp;-->
            <!--<el-input size="mini" placeholder="请输入谷歌验证码" style="width: 50%"/>-->
            <!--<br>-->
            <!--<el-button type="primary" size="mini" class="btn-mini" @click="submitSwitch">提交</el-button>-->
            <!--</div>-->
          </el-form>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import { getWebsite, whiteConfig, delWhiteList, addWhiteList, submitWebsite } from '@/api/merchant/myWebsite'
import { Message } from 'element-ui'

export default {
  data() {
    return {
      radio1: undefined,
      radio2: undefined,
      radio3: undefined,
      radio4: undefined,
      radio5: undefined,
      radio6: undefined,
      radio7: undefined,
      radio8: undefined,
      orderRefIntervalTime: [],
      secondValue: '',
      whiteName: [],
      inputValue: '',
      secondSetting: []
      // arr: []
    }
  },
  created() {
    this.getSubmit()
    this.getWhiteConfig()
  },
  methods: {
    buttonClose(item, index) {
      // this.orderRefIntervalTime.length = 0
      // this.orderRefIntervalTime.forEach((items) => {
      //   this.orderRefIntervalTime.push(items)
      // })
      this.orderRefIntervalTime.splice(this.orderRefIntervalTime.indexOf(item), 1)
      submitWebsite({ orderRefIntervalTime: this.orderRefIntervalTime.join(',') }).then(() => {
        this.orderRefIntervalTime.splice(index, 1)
      })
      // console.log(this.orderRefIntervalTime)
    },
    showButton() {
      this.$nextTick(_ => {
        this.$refs.saveButtonInput.$refs.input.focus()
      })
      const secondValue = this.secondValue
      if (secondValue) {
        this.orderRefIntervalTime.push(secondValue)
        if (this.orderRefIntervalTime.length > 10) {
          this.$message({ message: '可选择刷新秒数已达上限，如需继续添加请删除其他秒数设置！', type: 'warning' })
          this.orderRefIntervalTime.length = 10
        }
        // console.log(this.orderRefIntervalTime.join(','))
        // this.orderRefIntervalTime += ',' + secondValue
        submitWebsite({ orderRefIntervalTime: this.orderRefIntervalTime.join(',') }).then(() => {
          return true
        }).catch(err => {
          Message.error(err)
          // this.listLoading = false
        })
      }
      this.inputValue = ''
    },
    handleClose(item, index) {
      this.whiteName.splice(this.whiteName.indexOf(item), 1)
      delWhiteList(item).then(() => {
        this.whiteName.splice(index, 1)
      })
    },
    showInput() {
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
      const inputValue = this.inputValue
      if (inputValue) {
        addWhiteList(inputValue).then(() => {
          this.whiteName.push(inputValue)
        })
      }
      this.inputValue = ''
    },
    getSubmit() {
      getWebsite().then(response => {
        const data = response.data
        this.radio6 = data.accTransRole
        data.accTransRole = this.radio6
        this.radio5 = data.errOrderSoundSwit
        data.errOrderSoundSwit = this.radio5
        this.radio1 = data.merUpdateSwit
        data.merUpdateSwit = this.radio1
        this.radio2 = data.unpayOrderHiddenSwit
        data.unpayOrderHiddenSwit = this.radio2
        this.radio7 = data.unpayOrderMonitorSwit
        data.unpayOrderMonitorSwit = this.radio7
        this.radio3 = data.newOrderHintSwit
        data.newOrderHintSwit = this.radio3
        this.radio4 = data.newOrderHintSwit
        data.newOrderHintSwit = this.radio4
        this.radio8 = data.ipRestriction
        data.ipRestriction = this.radio8
        this.orderRefIntervalTime = data.orderRefIntervalTime.split(',')
      }).catch(err => {
        Message.error(err)
        this.listLoading = false
      })
    },
    getWhiteConfig() {
      whiteConfig().then(response => {
        const data = response.data
        this.whiteName = data
        // console.log(this.whiteName)
      }).catch(err => {
        Message.error(err)
        this.listLoading = false
      })
    }
    // submitSwitch() {
    //   this.$nextTick(_ => {
    //     this.$refs.saveButtonInput.$refs.input.focus()
    //   })
    //   const secondValue = this.secondValue
    //   if (secondValue) {
    //     this.orderRefIntervalTime += ',' + secondValue
    //   }
    //   this.inputValue = ''
    //   submitWebsite(
    //     {
    //       // orderRefIntervalTime: this.orderRefIntervalTime.join(',')
    //       ipRestriction: this.radio8
    //     }
    //   ).then(() => {
    //     return true
    //   }).catch(err => {
    //     Message.error(err)
    //     this.listLoading = false
    //   })
    // }
  }

}

</script>

<style scoped>
@import '../../style/myWebsite.css';

</style>
