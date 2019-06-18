<template>
  <div class="login-in-info">
    <div class="index-line">
      <span>{{ title }}</span>
    </div>
    <el-table
      :data="data"
      :show-header="true"
      width="98%"
    >
      <el-table-column v-for="(column, index) in columns" :key="index" :label="column.label" :prop="column.field" align="center"/>
      <!--<el-table-column prop="rowTitle" align="center"/>-->
      <!--<el-table-column prop="rowContent" align="center"/>-->
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'LoginRecord',
  props: {
    data: {
      type: Array,
      default: undefined
    },
    title: {
      type: String,
      default: ''
    },
    columns: {
      type: Array,
      default: undefined
    }
  }
}
</script>

<style scoped>
  .login-in-info {
    width: 100%;
    margin-top: 20px;
    background: #FFFFFF;
    padding-bottom: 30px;
  }
  /*.index-line {*/
    /*display: flex;*/
    /*justify-content: space-between;*/
    /*border-bottom: 1px solid #E8EBEE;*/
    /*line-height: 40px;*/
    /*font-size: 14px;*/
    /*font-weight: bold;*/
  /*}*/
  .index-line span {
    margin-left: 1%;
  }
</style>
