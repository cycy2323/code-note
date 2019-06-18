<template>
  <div :style="container" class="font-size-16 income-container">
    <div class="index-line">
      <div>{{ title }}</div>
      <div v-if="enableEndTime" class="font-size-12">截至：{{ endTime | parseTime('{y}-{m}-{d}') }}</div>
    </div>
    <div class="money-cash-withdrawal">
      <div>{{ amount }}</div>
      <el-button v-if="enableButton" :type="buttonType" size="mini" @click="buttonClick">{{ buttonText }}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MoneyExhibition',
  props: {
    title: {
      type: String,
      default: ''
    },
    enableEndTime: {
      type: Boolean,
      default: false
    },
    endTime: {
      type: Date,
      default: undefined
    },
    amount: {
      type: Number,
      default: null
    },
    enableButton: {
      type: Boolean,
      default: false
    },
    buttonText: {
      type: String,
      default: '提现'
    },
    buttonType: {
      type: String,
      default: 'primary'
    },
    buttonClick: {
      type: Object,
      default: function() {
      }
    },
    dialogObject: {
      type: Object,
      default: function() {

      }
    },
    container: {
      type: Object,
      default: function() {
      }
    }
  },
  data() {
    return {
    }
  },
  methods: {
    // buttonClick() {
    //   if (typeof this.dialogObject === 'function') {
    //     this.dialogObject()
    //   } else {
    //     this.dialogObject.dialogVisible = true
    //     return
    //   }
    // }
  }
}
</script>

<style scoped>
  .font-size-16 {
    font-size: 16px;
    border: 0 solid;
    background: #FFFFFF;
    font-weight: bold;
  }
  .income-container {
    width: 16%;
    margin-right: 40px;
  }
  .font-size-16 div {
    margin: 15px 15px;
  }
  .index-line {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #00ff00;
  }
  .font-size-12 {
    font-size: 12px;
    color: #6B6A6B;
    vertical-align: middle;
  }
  .money-cash-withdrawal {
    display: flex;
    justify-content: space-between;
    line-height: 0;
  }
</style>
