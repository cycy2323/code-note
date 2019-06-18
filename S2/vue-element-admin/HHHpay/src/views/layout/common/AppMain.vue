<template>
  <div class="main-app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'AppMain.vue'
}
</script>

<style scoped>
.main-app {
  min-height: calc(100vh - 125px);
  margin-top: 2px;
  width: 100%;
  position: relative;
  overflow: hidden;
  background-color: #F5F8FA;
}
</style>
