<template>
  <div>
    <div id="main" style="width: 600px;height:400px;margin: 20px auto"/>
    <div style="text-align: center;font-size: 22px;font-weight: bolder">
      <span style="color: #409EFF">总推广数量=尚未审核数量+已审核数量</span><br>
      <span style="line-height: 55px;color: #FF40E9">将二维码或推广链接发给对方，对方通过你的链接注册成为码商后，之后可获得每笔订单<em style="color: black">{{ ratio | radioFilter }}</em>的分红。</span>
    </div>
    <div style="display: flex;justify-content: center;align-items: center;font-size: 20px">
      <div style="display: flex;flex-direction: column;align-items: center;margin-right: 100px">
        <vue-qr ref="qrImg" :logo-src="config.imagePath" :text="config.value" :size="200" :margin="0" :callback="getImgUrL" qid="1" />
        <span style="line-height: 50px;color: #0CC2AA;cursor: pointer"><a :href="downloadQRImg" :download="myQRImgName">下载</a></span>
      </div>
      <div style="font-size: 20px;line-height: 50px">
        <span style="font-weight: bolder">我的推广链接:</span><br>
        <el-input id="copyObj" v-model="config.value" readonly="true"/>
        <span style="cursor: pointer;color: #0CC2AA" @click="CopyUrl">复制链接</span>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import VueQr from 'vue-qr'
import { extensionInfo } from '@/api/agent/extension'
// import resize from "../../../components/Charts/mixins/resize";

// import message from 'element-ui'
export default {
  name: 'Extension',
  components: { VueQr },
  filters: {
    radioFilter(value) {
      return value * 10000 / 100 + '%'
    }
  },
  data() {
    return {
      chart: null,
      config: {
        value: undefined // 显示的值、跳转的地址
        // 中间logo的地址
        // imagePath: require('../../assets/images/zfb.png')
      },
      downloadQRImg: undefined,
      myQRImgName: undefined,
      alreadyReviewQuantity: undefined,
      ratio: undefined,
      registrationCode: undefined,
      totalPromotion: undefined,
      unauditedQuantity: undefined
    }
  },
  mounted() {
    this.initChart()
    this.getExtensionInfo()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    getExtensionInfo() {
      extensionInfo().then(response => {
        const data = response.data
        this.alreadyReviewQuantity = data.alreadyReviewQuantity
        this.ratio = data.ratio
        this.registrationCode = data.registrationCode
        this.totalPromotion = data.totalPromotion
        this.unauditedQuantity = data.unauditedQuantity
        this.config.value += this.registrationCode
        // alert(this.registrationCode)
        // this.$router.push({ path: '', params: { code: this.registrationCode }})
      })
    },
    getImgUrL(dataUrL, qId) {
      this.downloadQRImg = dataUrL
      if (this.$store.getters.user) { this.myQRImgName = this.$store.getters.user.name + '的推广二维码' } else this.myQRImgName = '我的推广二维码'
    },
    initChart() {
      this.chart = echarts.init(document.getElementById('main'))
      this.chart.setOption({
        legend: {},
        color: ['#C23531', '#42B983'],
        tooltip: {
          trigger: 'axis'
        },
        series: {
          type: 'pie',
          name: 'hello-world',
          radius: ['50%', '80%'],
          // data: this.pie_data
          data: [
            { name: '尚未审核数量', value: 3234 },
            { name: '已审核数量', value: 5678 }
          ]
        }
      })
      // this.config.value = 'https://www.helloworld.com/regist?code='
      this.config.value = 'http://mer.gt.com/#/register_index?code='
    },
    CopyUrl() {
      const url = document.querySelector('#copyObj')
      url.select() // 选择对象
      document.execCommand('Copy')
      this.$message(
        {
          message: '复制成功',
          type: 'success'
        }
      )
    }
  }
}
</script>

<style scoped>

</style>
