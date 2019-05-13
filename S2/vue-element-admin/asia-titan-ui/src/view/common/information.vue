<template>
  <div class="personal-info">
    <div class="index-line">
      <span>{{ titleInfo }}</span>
    </div>
    <div style="margin-left: 3%;padding-bottom: 40px">
      <p v-for="item in collections" :key="item.title" style="font-weight: bolder;font-size: 14px">{{ item.title }} : {{ item.content }}</p>
      <!--<p>用户名：</p>-->
      <!--<p>分润比例：</p>-->
      <!--<p>创建时间：</p>-->
    </div>
  </div>
</template>

<script>
export default {
  name: 'Information',
  props: {
    titleInfo: {
      type: String,
      default: ''
    },
    collections: {
      type: Array,
      default: undefined
    }
  }
}
</script>

<style scoped>
  .personal-info {
    width: 25%;
    border: 0 solid;
    background: #FFFFFF;
  }
  .index-line {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #E8EBEE;
    line-height: 40px;
    font-size: 16px;
    font-weight: bold;
  }
  .index-line span {
    margin-left: 3%;
  }
</style>
