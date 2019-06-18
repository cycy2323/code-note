<template>
  <div class="tags-view-container">
    <div class="tags-content">
      <span
        v-for="(item, index) in titleList"
        :key="index"
        class="tagsTitleList"
        @click="submenuFlag(item)"
      >
        {{item.meta.title}}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TagsView',
  data () {
    return {
      tagsTitle: '基本信息',
      titleList: []
    }
  },
  watch: {
    '$route' (n, o) {
      // console.log(n)
      // // alert(n, o)
      // console.log(this.$router)
      this.addViewTags(n)
    }
  },
  created () {
    this.addViewTags(this.$route)
  },
  methods: {
    addViewTags (obj) {
      var titleRoutes = this.$router.options.routes
      this.titleList = []
      var path = obj.matched[0].path
      titleRoutes.forEach((item, index) => {
        // var name = this.$route.name
        if (item.path === path) {
          this.titleList = item.children
          // debugger
          // console.log(item.children)
        }
      })
    },
    submenuFlag (item) {
      // console.log(item)
      this.$router.push(item.path)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.tags-view-container {
  height: 50px;
  margin-top: 3px;
  width: 100%;
  background-color: #FFFFFF;
  display: flex;
  align-items: center;
  .tags-content {
    width: 70%;
    margin-left: 19%;
    cursor: pointer;
    .tagsTitleList {
      font-size: 14px;
      color: #9090AB;
      letter-spacing: 1px;
      margin-right: 64px;
      cursor: pointer;
    }
    .tagsTitleList::before {
      content: '';
      display: inline-block;
      width: 8px;
      height: 8px;
      background-color: #9090AB;
      margin-right: 3px;
    }
  }
}
</style>
