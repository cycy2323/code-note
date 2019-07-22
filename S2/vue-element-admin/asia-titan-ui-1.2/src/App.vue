<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style>
#app .el-table__body tr.current-row > td{
  background:rgba(49, 59, 75, 0.2)
}
</style>
