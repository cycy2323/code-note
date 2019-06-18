<template>
    <div class="sidebar-container">
      <div class="logo-title">
        <span>HHH PAY</span>
      </div>
      <div class="menu-wrapper">
        <!--<ul>-->
          <div v-for="(item, idx) in optionsRoutes" :key="idx">
            <router-link :to="item.path">
              <!--<Item :icon="item.meta.icon"></Item>-->
              <img src="../../../assets/images/Home.png"/>
              <span>{{ item.title }}</span>
            </router-link>
          </div>
        <!--</ul>-->
      </div>
      <div class="sidebar-content-right">
        <span class="bindingGoogle">谷歌验证器 {{ bindingGoogle }}</span>
        <span class="line"></span>
        <span class="account">管理员账号 {{ account }}</span>
        <img src="../../../assets/images/manage-order.png" alt="">
        <el-dropdown trigger="click" style="cursor: pointer">
          <span class="el-dropdown-link">
            <span style="color: #222222;">{{accountUserName}}</span>
            <i class="el-icon-caret-bottom el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item class="clearfix">
              <span @click="loginOut">登出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
</template>

<script>
// import Item from './Item'
export default {
  name: 'index',
  // components: {Item},
  data () {
    return {
      // activeMenu: '2',
      bindingGoogle: '未绑定',
      account: '22222222@qq.com',
      accountUserName: 'hello',
      optionsRoutes: [],
      title: ''
    }
  },
  created () {
    this.sidebarInfo()
  },
  methods: {
    sidebarInfo () {
      var routers = this.$router.options.routes
      this.optionsRoutes = []
      routers.filter(item => {
        if (item.meta && item.meta.head) {
          this.optionsRoutes.push({path: item.path, title: item.meta.title})
        }
      })
      // debugger
      // var optionsRoutes = this.$router.options.routes
      // optionsRoutes.forEach((item, index) => {
      //   if (item.children) {
      //     this.title = item.meta.title
      //   }
      // })
      // debugger
      // console.log(this.$router.options.routes)
    },
    loginOut () {
      this.$router.push('/login')
      console.log(this.$route)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .sidebar-container {
    width: 100%;
    height: 70px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background: #FFFFFF;
    box-shadow: 0 1px 5px 0 rgba(0,0,0,0.13);
    .logo-title {
      font-size: 30px;
      color: #02A5BD;
      margin-right: 10%;
      margin-left: 1.6%;
    }
    .menu-wrapper {
        display: flex;
        div {
          display: flex;
          align-items: center;
          cursor: pointer;
          a {
            display: flex;
            align-items: center;
            span {
              margin-left: 5px;
              margin-right: 65px;
              font-size: 16px;
              color: #02A5BD;
            }
          }
        }
    }
    .sidebar-content-right {
      position: absolute;
      right: 30px;
      line-height: 38px;
      padding-left: 21px;
      padding-right: 21px;
      background: #FFFFFF;
      border: 1px solid #E4E3ED;
      border-radius: 4px;
      display: flex;
      align-items: center;
      .account {
        margin-right: 10px;
        color: #9090AB;
      }
      .bindingGoogle {
        margin-right: 10px;
        color: #9090AB;
      }
      .line {
        display: inline-block;
        border-right: 1px solid #9090AB;
        height: 16px;
        margin-right: 10px;
      }
      img {
        width: 21px;
        height: 21px;
        margin-right: 10px;
      }
    }
  }
</style>
