<template>
<div class="nav-md">
  <div class="container body">
    <div class="main_container">
      <div class="col-md-3 left_col">
        <div class="left_col scroll-view">
          <div class="navbar nav_title" style="border: 0;">
            <a href="index.html" class="site_title"><img src="../assets/img/favicon.ico" alt="">&nbsp;&nbsp;<span>学子商城后台</span></a>
          </div>

          <div class="clearfix"></div>

          <!-- menu profile quick info -->
          <div class="profile clearfix">
            <div class="profile_pic">
              <img src="../assets/img/user.png" alt="..." class="img-circle profile_img">
            </div>
            <div class="profile_info">
              <span>欢迎回来,</span>
              <h2>超级管理员</h2>
            </div>
          </div>
          <!-- /menu profile quick info -->

          <br/>

          <!-- sidebar menu -->
          <div id="sidebar-menu" class="main_menu_side hidden-print main_menu">
            <div class="menu_section">
              <ul class="nav side-menu">
                <li class="active"><a href="index.html"><i class="fa fa-home"></i>后台首页</a></li>
              </ul>
            </div>
            <div class="menu_section">
              <h3>数据管理</h3>
              <ul class="nav side-menu">
                <li><a><i class="fa fa-laptop"></i> 商品管理 <span class="fa fa-chevron-down"></span></a>
                  <ul class="nav child_menu">
                    <li><a href="product_list.html">商品列表</a></li>
                    <li><a href="product_search.html">多条件搜索</a></li>
                    <li><a href="product_add.html">添加商品</a></li>
                  </ul>
                </li>
                <li><a><i class="fa fa-user"></i> 用户管理 <span class="fa fa-chevron-down"></span></a>
                  <ul class="nav child_menu">
                    <li><a href="user_list.html">用户列表</a></li>
                    <li><a href="user_search.html">用户检索</a></li>
                  </ul>
                </li>
                <li><a><i class="fa fa-shopping-cart"></i> 订单管理 <span class="fa fa-chevron-down"></span></a>
                  <ul class="nav child_menu">
                    <li><a href="order_list.html">订单列表</a></li>
                    <li><a href="order_search.html">搜素订单</a></li>
                  </ul>
                </li>
              </ul>
            </div>
            <div class="menu_section">
              <h3>内容管理</h3>
              <ul class="nav side-menu">
                <li><a><i class="fa fa-life-ring"></i> 首页商品管理 <span class="fa fa-chevron-down"></span></a>
                  <ul class="nav child_menu">
                    <li><a href="e_commerce.html">轮播广告</a></li>
                    <li><a href="projects.html">首页推荐</a></li>
                    <li><a href="contacts.html">最新上架</a></li>
                    <li><a href="project_detail.html">热销单品</a></li>
                  </ul>
                </li>
                <li><a><i class="fa fa-windows"></i> 功能页面 <span class="fa fa-chevron-down"></span></a>
                  <ul class="nav child_menu">
                    <li><a href="page_403.html">403错误页面</a></li>
                    <li><a href="page_404.html">404错误页面</a></li>
                    <li><a href="page_500.html">500错误页面</a></li>
                  </ul>
                </li>
              </ul>
            </div>

          </div>
          <!-- /sidebar menu -->

          <!-- /menu footer buttons -->
          <div class="sidebar-footer hidden-small">
            <a data-toggle="tooltip" data-placement="top" title="Settings">
              <span class="glyphicon glyphicon-cog" aria-hidden="true"></span>
            </a>
            <a data-toggle="tooltip" data-placement="top" title="FullScreen">
              <span class="glyphicon glyphicon-fullscreen" aria-hidden="true"></span>
            </a>
            <a data-toggle="tooltip" data-placement="top" title="Lock">
              <span class="glyphicon glyphicon-eye-close" aria-hidden="true"></span>
            </a>
            <a data-toggle="tooltip" data-placement="top" title="Logout" href="login.html">
              <span class="glyphicon glyphicon-off" aria-hidden="true"></span>
            </a>
          </div>
          <!-- /menu footer buttons -->
        </div>
      </div>

      <!-- top navigation -->
      <div class="top_nav">
        <div class="nav_menu">
          <nav>
            <div class="nav toggle">
              <a id="menu_toggle"><i class="fa fa-bars"></i></a>
            </div>

            <ul class="nav navbar-nav navbar-right">
              <li class="">
                <a href="javascript:;" class="user-profile dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                  <img src="../assets/img/user.png">超级管理员
                  <span class=" fa fa-angle-down"></span>
                </a>
                <ul class="dropdown-menu dropdown-usermenu pull-right">
                  <li><a href="javascript:;"> 基本信息 </a></li>
                  <li>
                    <a href="javascript:;">
                      <span class="badge bg-red pull-right">50%</span>
                      <span>用户设置</span>
                    </a>
                  </li>
                  <li><a href="javascript:;">使用说明</a></li>
                  <li><a href="login.html"><i class="fa fa-sign-out pull-right"></i> 退出登录</a></li>
                </ul>
              </li>

              <li role="presentation" class="dropdown">
                <a href="javascript:;" class="dropdown-toggle info-number" data-toggle="dropdown" aria-expanded="false">
                  <i class="fa fa-envelope-o"></i>
                  <span class="badge bg-green">6</span>
                </a>
                <ul id="menu1" class="dropdown-menu list-unstyled msg_list" role="menu">
                  <li>
                    <a>
                      <span class="image"><img src="../assets/img/user.png" alt="Profile Image"/></span>
                      <span>
                          <span>新用户注册</span>
                          <span class="time">3分钟以前</span>
                        </span>
                      <span class="message">
                          用户编号：3，用户名：doudou，完成注册。通过官网“邮件注册”功能实现注册。
                        </span>
                    </a>
                  </li>
                  <li>
                    <a>
                      <span class="image"><img src="../assets/img/user.png" alt="Profile Image"/></span>
                      <span>
                          <span>用户下单</span>
                          <span class="time">10小时以前</span>
                        </span>
                      <span class="message">
                          用户编号：1，用户名：dingding，完成下单。系统中当有已有未处理订单37件。
                        </span>
                    </a>
                  </li>
                  <li>
                    <a>
                      <span class="image"><img src="../assets/img/user.png" alt="Profile Image"/></span>
                      <span>
                          <span>用户信息修改</span>
                          <span class="time">1天以前</span>
                        </span>
                      <span class="message">
                          用户编号：1，用户名：dingding，通过官网“用户设置”功能完成个人基础信息修改。
                        </span>
                    </a>
                  </li>
                  <li>
                    <a>
                      <span class="image"><img src="../assets/img/user.png" alt="Profile Image"/></span>
                      <span>
                          <span>新用户注册</span>
                          <span class="time">5天以前</span>
                        </span>
                      <span class="message">
                          用户编号：1，用户名：dingding，完成注册。通过官网“用户注册”功能实现注册。
                        </span>
                    </a>
                  </li>
                  <li>
                    <div class="text-center">
                      <a>
                        <strong>查看所有消息</strong>
                        <i class="fa fa-angle-right"></i>
                      </a>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <!-- /top navigation -->

      <!-- page content -->
      <router-view></router-view>
      <!-- /page content -->

      <!-- footer content -->
      <footer>
        <div class="pull-right">
          学子商城 — 后台管理系统。 访问商城主页： <a href="http://www.codeboy.com/" target="_blank">学子商城</a>
        </div>
        <div class="clearfix"></div>
      </footer>
      <!-- /footer content -->
    </div>
  </div>
</div>
</template>

<script>
  import '../assets/css/bootstrap.css'
  import '../assets/css/font-awesome.css'
  import '../assets/css/animate.css'
  import '../assets/css/app.css'

  import '../assets/js/jquery.js'
  import '../assets/js/jquery.flot'
  import '../assets/js/bootstrap.js'
  //import '../assets/js/app.js'

  export default {
    data(){
      return {}
    },
    methods: {},
    mounted(){
      //当前组件已经挂载到DOM树，可以执行DOM结构查找了
      //import '../assets/js/app.js'   //import只能出现在代码的最顶层
      require('../assets/js/app.js');
    }
  }
</script>

<style>
</style>