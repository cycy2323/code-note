<template>
  <div class="security-info">
    <div class="index-line">
      <span>{{ title }}</span>
    </div>
    <div v-for="item in divContainer" :key="item.title" class="index-line display-flex-container">
      <div style="width: 100px"><p style="margin: 0">{{ item.txtTitle }}</p></div>
      <div><p style="margin: 0">{{ item.txtContent }}</p></div>
      <div v-if="item.tagButton"><el-button size="mini" type="success" @click="item.callback">{{ item.tagButton }}</el-button></div>
      <!--<div v-else><el-button size="mini" type="success" @click="item.callback=!item.callback">{{ item.tagButton }}</el-button></div>-->
    </div>
  </div>
</template>

<script>
export default {
  name: 'AccountSecurity',
  props: {
    title: {
      type: String,
      default: ''
    },
    childrenTitle: {
      type: Array,
      default: undefined
    },
    divContainer: {
      type: Array,
      default: undefined
    },
    dialogObject: {
      type: Object,
      default: function() {
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    buttonClick() {
      if (typeof this.dialogObject === 'function') {
        this.dialogObject()
      } else {
        this.dialogObject.dialogVisible = true
        return
      }
    }
  }
}
</script>

<style scoped>
  .security-info {
    width: 100%;
    background: #FFFFFF;
    padding-bottom: 30px;
    margin-bottom: 20px;
  }
  .index-line {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #E8EBEE;
    line-height: 40px;
    font-size: 14px;
    font-weight: bold;
  }
  .index-line span {
    margin-left: 1%;
  }
  .display-flex-container {
    display: flex;
    justify-content: space-between;
    margin: 0 2%;
  }
</style>
