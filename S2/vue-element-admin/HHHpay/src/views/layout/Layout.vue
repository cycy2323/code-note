<template>
    <div>
      <Sidebar></Sidebar>
      <tags-view v-if="isTagsView"></tags-view>
      <div class="main-container">
        <app-main></app-main>
      </div>
      <!--<router-view></router-view>-->
    </div>
</template>

<script>
import Sidebar from './common/Sidebar'
import AppMain from './common/AppMain'
import TagsView from './common/TagsView'
export default {
  name: 'index',
  components: { Sidebar, AppMain, TagsView },
  data () {
    return {
      isTagsView: '1'
    }
  },
  created () {},
  methods: {}
}
</script>

<style scoped>

</style>
