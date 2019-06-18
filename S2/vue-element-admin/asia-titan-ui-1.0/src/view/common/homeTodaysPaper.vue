<template>
  <div class="font-size-16 survey-container">
    <div class="index-line">
      <div class="float-left">{{ title }}</div>
      <div class="font-size-12 float-right">
        <span>更新时间: {{ updateTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>&nbsp;
        <span style="color: #13C4AD;cursor: pointer" @click="targetAction">{{ tag }}</span>
      </div>
    </div>
    <div class="display-flex-row">
      <svg-icon icon-class="survey" style="width: 60px;height: 60px;"/>
      <p v-for="child in children" :key="child.title" >{{ child.title }}<br><span style="color: #13C4AD">{{ child.content }}</span></p>
      <!--<p>今日业绩收入<br><span style="color: #13C4AD">hello</span></p>-->
      <!--<p>订单数<br><span style="color: #13C4AD">hello</span></p>-->
      <!--<p>今日总流水<br><span style="color: #13C4AD">hello</span></p>-->
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeTodaysPaper',
  props: {
    title: {
      type: String,
      default: ''
    },
    tag: {
      type: String,
      default: ''
    },
    targetAction: {
      type: Object,
      default: undefined
    },
    updateTime: {
      type: Date,
      default: undefined
    },
    children: {
      type: Array,
      default: undefined
    }
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
  .font-size-16 div {
    margin: 15px 15px;
  }
  .font-size-12 {
    font-size: 12px;
    color: #6B6A6B;
    vertical-align: middle;
  }
  .survey-container {
    width: 45%;
    float: left;
  }
  .index-line {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #00ff00;
  }
  .display-flex-row {
    display: flex;
    justify-content: space-around;
  }
  .display-flex-row p {
    color: #4C4B4C;
    font-size: 14px;
    text-align: center;
  }
  .display-flex-row p span {
    position: relative;
    top: 10px;
  }
</style>
