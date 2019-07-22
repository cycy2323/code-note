<template>
  <div class="navbar">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>

    <breadcrumb class="breadcrumb-container"/>

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <el-popover
          v-if="MerchantHost===documentDomain"
          placement="bottom"
          trigger="click"
          @show="popoShow(true)"
          @hide="popoShow(false)">
          <div v-if="AllorderMessages.length>0" class="dropdown-orderMsg">
            <div class="list-item">
              <b>订单通知</b>
              <span class="all-ignore noneSelect" @click="handleIgnore('',null)">忽略全部</span>
            </div>

            <div id="rule" class="infinite-list-wrapper order-drop">
              <ul
                id="orderUl"
                class="list"
                infinite-scroll-disabled="disabled">
                <li v-for="(val,idx) in orderMessages" :key="val+idx" class="list-item">
                  <el-row style="display: flex;align-items: center">
                    <el-col :span="2" style="text-align: center;">
                      <span style="font-size: 18px">{{ idx+1 }}</span>
                    </el-col>
                    <el-col :span="3" style="text-align: center;">
                      <svg-icon icon-class="success" class="success-icon"/>
                    </el-col>
                    <el-col :span="19">
                      <div class="order-txt"><span class="parameter-content">{{ val.parameterContent }}</span>
                      </div>
                    </el-col>
                  </el-row>
                  <div class="list-item-bottom">
                    <span class="msg-time">{{ val.createDate| parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                    <span style="float: right;">
                      <el-button
                        type="primary"
                        size="mini"
                        @click="goToOrderList(val.id,val.orderNo,idx)">查看</el-button>
                      <el-button type="" size="mini" @click="handleIgnore(val.id,idx)">忽略</el-button>
                    </span>
                  </div>
                </li>
              </ul>
              <p v-if="loading" class="scrollIip">加载中...</p>
              <p v-if="noMore" class="scrollIip">没有更多了</p>
            </div>

          </div>
          <div class="list-lastItem checkMore">
            <div @click="handleCheckAll"><span class="noneSelect">{{ checkAll?'查看最新':'查看全部' }}</span>
            <i :class="checkAll?'el-icon-arrow-up':'el-icon-arrow-down'"/></div>
          </div>
          <span id="orderBtn" slot="reference" class="el-dropdown-link">
            <span class="notifications">
              <svg-icon icon-class="orderNote" class="order-icon"/>
              <div v-if="orderTotal" class="note-icon">{{ orderTotal }}</div>
            </span>
            <span id="dropDown" class="note-type noneSelect">订单通知</span>
          </span>
        </el-popover>
        <!--系统通知-->
        <span>
          <i v-if="MerchantHost===documentDomain" class="el-icon-bell notifications" @click="showNotes(true)">
            <div v-if="notesAmount" class="note-icon">{{ notesAmount }}</div>
          </i>
          <span v-if="MerchantHost===documentDomain" class="note-type noneSelect" @click="showNotes(true)">系统通知</span>
        </span>

        <el-tooltip
          :content="$t('navbar.screenfull')"
          effect="dark"
          placement="bottom"
          style="vertical-align: middle;height: 32px">
          <screenfull class="screenfull right-menu-item"/>
        </el-tooltip>

        <el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom">
          <size-select class="international right-menu-item"/>
        </el-tooltip>

        <!-- <lang-select class="international right-menu-item"/> -->
        <!--
        <el-tooltip :content="$t('navbar.theme')" effect="dark" placement="bottom">
          <theme-picker class="theme-switch right-menu-item"/>
        </el-tooltip> -->
      </template>

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar"> -->
          <svg-icon icon-class="logo" class-name="card-panel-icon" style="width: 30px;height:30px"/>
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              {{ $t('navbar.dashboard') }}
            </el-dropdown-item>
          </router-link>
          <!--<a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">-->
          <!--<el-dropdown-item>-->
          <!--{{ $t('navbar.github') }}-->
          <!--</el-dropdown-item>-->
          <!--</a>-->
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 查看订单状态 -->
    <div class="check-dialog">
      <el-dialog
        :visible="dialogFormVisible"
        :close-on-click-modal="false"
        :title="title"
        width="1000px"
        @close="dialogFormVisible = false">
        <el-form
          ref="dataForm"
          :model="orderDetail"
          :inline="true"
          label-width="140px">
          <el-form-item label="平台订单号">
            <span>{{ orderDetail.orderNo }}</span>
          </el-form-item>
          <el-form-item label="商户订单号:">
            <span>{{ orderDetail.merOrderNo }}</span>
          </el-form-item>
          <el-form-item label="平台商户ID:">
            <span>{{ orderDetail.merId }}</span>
          </el-form-item>
          <el-form-item label="订单来源:">
            <span>{{ orderDetail.orderSource==1?'api':'web' }}</span>
          </el-form-item>
          <el-form-item label="银行:">
            <span>{{ orderDetail.bankName }}</span>
          </el-form-item>
          <el-form-item label="订单金额:">
            <span>{{ orderDetail.orderAmount }}</span>
          </el-form-item>
          <el-form-item label="订单状态">
            <el-tag :type="orderDetail.orderState === 1 ? 'success' : 'danger' ">
              {{ orderDetail.orderState === -1 ? '预下单':orderDetail.orderState === 0 ? '待支付' : orderDetail.orderState ===
                1 ?
              '支付成功': orderDetail.orderState === 2 ? '失败': orderDetail.orderState === 3 ? '支付成功（已冻结）' :'补单' }}
            </el-tag>
          </el-form-item>
          <el-form-item label="手续费（元）">
            <span>{{ orderDetail.merCommission }}</span>
          </el-form-item>
          <el-form-item label="创建时间:">
            <span>{{ (orderDetail.createDate || '') | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </el-form-item>
          <el-form-item label="完成时间:">
            <span>{{ (orderDetail.receiveNotifyDate || '') | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">{{ $t('order.confirm') }}</el-button>
        </div>
      </el-dialog>
    </div>
    <!--系统通知列表-->
    <el-dialog
      :visible="sysVisible"
      :close-on-click-modal="false"
      custom-class="sys-notice-dialog"
      width="1000px"
      @close="dialogFormVisible = false">
      <div v-for="(item, idx) in sysNoticeList" :key="idx" class="list-item">
        <div class="header">
          <i class="el-icon-close close-icon" @click="closeSysNotice(idx)"/>
          <div v-if="item">{{ item.notificationTitle }}</div>
        </div>
        <div v-if="item" class="content">
          {{ item.notificationContext }}
        </div>
        <div class="footer">
          <div>{{ item.notificationDate| parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</div>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      :visible="showNewVisible"
      :close-on-click-modal="false"
      :show-close="false"
      custom-class="sys-new-dialog"
      width="500px"
      @close="showNewVisible = false">
      <div v-if="sysNoticeList[0]" class="list-item">
        <div class="header">
          <!--<i class="el-icon-close close-icon" @click="closeSysNewNotice"/>-->
          <div>{{ sysNoticeList[0].notificationTitle }}</div>
        </div>
        <div class="content">
          {{ sysNoticeList[0].notificationContext }}
        </div>
        <div class="footer">
          <div>{{ sysNoticeList[0].notificationDate|parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</div>
        </div>
        <div class="confirm-btn">
          <el-button type="primary" @click="showNewVisible = false">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import LangSelect from '@/components/LangSelect'
import ThemePicker from '@/components/ThemePicker'
import { getNotification, getOrderMsg, updateSeenOrder } from '@/api/merchant/navabar/navabar'
import { merchantTransactionOrderList } from '@/api/merchant/merchantOrderCheck/merchantTransactionOrder'
import { parseTime } from '@/utils'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    LangSelect,
    ThemePicker
  },
  data() {
    return {
      popoverShow: false, // 订单通知下拉弹框状态

      documentDomain: '',
      hideOnClick: false,
      notesAmount: '',
      sysNoticeList: [{ notificationTitle: '', notificationContext: '' }],
      sysNoticeListStore: [],
      sysVisible: false,
      showNewVisible: false,
      sysParams: {
        pageNo: '1',
        pageSize: '99999'
      },

      orderTotal: '',
      orderParams: {
        notificationCategory: '1', // 通知类型 0 系统通知 1订单通知
        orReadFlag: '0', // 查看类型 ，0未读，1已读
        pageNo: 1, // 分页当前页
        pageSize: '10' // 每页几条
      },
      orderMessages: [], // 展示数组
      AllorderMessages: [1], // 存储数组 1:使onscroll起作用
      checkAll: false,
      loading: false,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        orderNo: undefined // 平台订单号
      },
      orderLoading: false,

      orderDetail: {
        orderNo: '',
        merOrderNo: '',
        merId: '',
        orderSource: '',
        bankName: '',
        orderAmount: '',
        orderState: '',
        merCommission: '',
        createDate: null,
        receiveNotifyDate: null
      },
      dialogFormVisible: false,
      title: '订单详情',

      timer: null
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar',
      'device'
    ]),
    noMore() {
      if (this.checkAll) {
        return this.orderMessages.length >= this.orderTotal
      }
    },
    disabled() {
      if (this.checkAll) {
        return this.loading || this.noMore
      }
    }
  },
  created() {
    this.getDocumentDomain()
    this.getNotes()
    this.initOderList()
    this.timer = setInterval(() => {
      this.repeatRequest()
    }, 30000)
  },

  mounted() {
    //  无限滚动原生
    this.InfiniteScroll()
  },

  beforeDestroy() {
    this.timer = null
  },

  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    },
    // 域名获取
    getDocumentDomain() {
      this.documentDomain = document.domain
    },
    isMerchant() { // 是商户后台才显示订单通知和系统通知
      return this.MerchantHost === this.documentDomain
    },
    popoShow(status) {
      this.popoverShow = status
      this.AllorderMessages.length === 0 && this.closeOrderModal()
    },

    // 系统通知消息
    getNotes() {
      this.isMerchant() &&
        getNotification(this.sysParams).then(data => {
          this.sysNoticeList = data.list
          this.sysNoticeListStore = []
          data.list.map((val) => {
            this.sysNoticeListStore.push(val)
          })
          this.notesAmount = data.total
          // 判断系统通知是否有变动
          if (data.total > 0) {
            //  自动弹出弹框
            setTimeout(() => this.showNotes(false), 0)
          }
        })
    },
    // 系统公告列表
    showNotes(status) { // 判断是否手动点击
      if (status) {
        getNotification(this.sysParams).then(data => {
          this.sysNoticeList = data.list
          this.notesAmount = data.total
          if (data.total > 0) {
            this.sysVisible = true
          }
        })
      } else {
        if (this.notesAmount > 0) {
          this.sysVisible = true
        }
      }
    },
    closeSysNotice(idx) {
      this.sysNoticeList.splice(idx, 1)
      if (this.sysNoticeList.length === 0) {
        this.sysVisible = false
      }
    },
    // 系统新公告弹出
    showSysNotice() {
      this.sysVisible = false
      this.showNewVisible = true
    },

    // 订单通知刷新
    initOderList() {
      this.isMerchant() &&
        getOrderMsg(this.orderParams).then(data => {
          this.AllorderMessages = data.list
          this.orderTotal = data.total
          this.setOrderMessages()
        })
    },

    // 轮询
    repeatRequest() {
      if (this.isMerchant()) {
        // 订单通知
        const params = {
          notificationCategory: '1',
          orReadFlag: '0',
          pageNo: 1,
          pageSize: '10'
        }
        getOrderMsg(params).then(data => {
          if (this.AllorderMessages.length > 0) {
            // 测试数据*4
            // this.AllorderMessages = []
            // const aaa = { id: 50, orReadFlag: 0, orderNo: 'T3990', parameterContent: '订单支付成功3131' }
            // this.AllorderMessages.unshift(aaa)
            // console.log(2, this.AllorderMessages)
            if (this.AllorderMessages[0].orderNo !== data.list[0].orderNo) { // 弹新消息判断：第一条是否变动
              const newOrders = data.total - this.orderTotal // 判断增加了几条
              let requestTimes = Math.ceil(newOrders / 10)
              // 请求新消息回来——拼接进下拉列表：其中有一页可能同时有新消息和旧消息
              if (requestTimes < 6) {
                const PromiseArr = []// 多个异步请求
                const newOrderArrs = []// 多请求结果的二维数组
                for (let i = requestTimes; i > 0; i--) { //  拼顺序数组(请求有快慢)
                  params.pageNo = i
                  PromiseArr.push(
                    (() => {
                      return new Promise((open) => {
                        let unitData = []// 每页数组
                        getOrderMsg(params).then(data => {
                          this.orderTotal = data.total
                          unitData = data.list
                          if (i === requestTimes) { // 新旧消息拼接页
                            if (newOrders % 10 === 0) {
                              newOrderArrs[i - 1] = unitData
                            } else {
                              this.AllorderMessages.splice(0, 10 - (newOrders % 10))
                              newOrderArrs[i - 1] = unitData
                            }
                          } else {
                            newOrderArrs[i - 1] = unitData
                          }
                          open()
                        })
                      })
                    })()
                  )
                }
                Promise.all(PromiseArr).then(() => {
                  [].concat.apply([], newOrderArrs).reverse().map((val) => { // 二维数组变一维数组-反转-unshift
                    this.AllorderMessages.unshift(val)
                  })
                  this.orderParams.pageNo = Math.ceil(this.AllorderMessages.length / 10) - 1
                  this.setOrderMessages()
                  setTimeout(this.showOrderMsg, 0)//  最新通知 setTimeout妙用：数据触发组件dom渲染后再回调
                })
              } else { // 大于5页50条时，直接将数据替换成前5页
                requestTimes = 5
                const PromiseArr = []
                const newOrderArrs = []
                for (let i = requestTimes; i > 0; i--) {
                  params.pageNo = i
                  PromiseArr.push(
                    (() => {
                      return new Promise((open) => {
                        getOrderMsg(params).then(data => {
                          this.orderTotal = data.total
                          newOrderArrs[i - 1] = data.list
                          open()
                        })
                      })
                    })()
                  )
                }
                Promise.all(PromiseArr).then(() => {
                  this.AllorderMessages = [].concat.apply([], newOrderArrs)
                  this.orderParams.pageNo = Math.ceil(this.AllorderMessages.length / 10) - 1
                  this.setOrderMessages()
                  setTimeout(this.showOrderMsg, 0)
                })
              }
            }
          } else { // 存储数组初始为[]
            if (data.list.length > 0) {
              this.AllorderMessages = data.list
              this.orderTotal = data.total
              this.orderParams.pageNo = 1
              this.setOrderMessages()
              setTimeout(this.showOrderMsg, 0)
            }
          }
        })
        // 系统通知
        getNotification(this.sysParams).then(data => {
          this.notesAmount = data.total
          this.sysNoticeList = data.list
          // 判断系统通知第一条是否有变动
          if (data.list.length > 0) {
            if (this.sysNoticeListStore.length === 0) {
              // 直接弹第一条
              this.sysNoticeListStore = []
              data.list.map((val) => {
                this.sysNoticeListStore.push(val)
              })
              setTimeout(() => this.showSysNotice(), 0)
            } else {
              // 对比第一条
              if (this.sysNoticeListStore[0].notificationDate !== data.list[0].notificationDate) {
                this.sysNoticeListStore = []
                data.list.map((val) => {
                  this.sysNoticeListStore.push(val)
                })
                setTimeout(() => this.showSysNotice(), 0)
              } else {
                this.sysNoticeListStore = []
                data.list.map((val) => {
                  this.sysNoticeListStore.push(val)
                })
              }
            }
          } else {
            this.sysNoticeList = []
            this.sysNoticeListStore = []
            this.sysVisible = false
          }
        })
      }
    },
    // 新消息弹框
    showOrderMsg() {
      this.$notify.closeAll()
      this.$notify({
        dangerouslyUseHTMLString: true,
        onClick: this.modalClicks,
        message: `<div><span class="new-order-tips">${this.AllorderMessages[0].parameterContent}</div>
                <div class="modal-bottom">
                  <span class="msg-time">${parseTime(this.AllorderMessages[0].createDate, '{y}-{m}-{d} {h}:{i}:{s}')}</span>
                  <span class="modal-operation">
                    <div id="orderCheck" class="new-check">查看</div>&nbsp;&nbsp;&nbsp;
                    <div id="orderIgnore" class="new-ignore">忽略</div>
                  </span>
              </div>`,
        offset: 70,
        duration: 0,
        customClass: 'notes-message'
      })
      this.modalClicks()
    },
    modalClicks() {
      const closeNew = document.getElementsByClassName('el-notification__closeBtn el-icon-close')//  关闭弹框
      document.getElementById('orderCheck').onclick = () => {
        this.goToOrderList(this.AllorderMessages[0].id, null, 0)
        closeNew[0].click()
      }
      document.getElementById('orderIgnore').onclick = () => {
        this.handleIgnore(this.AllorderMessages[0].id, 0)
        closeNew[0].click()
      }
    },
    // 查看 // 查看、忽略操作时：1.存储数组切掉对应item,2.计算出存储数据所占页码（下拉请求是要获取页码）,3.变更orderTotal
    goToOrderList(id, orderNo, idx) {
      this.$router.push('/merchantOrderCheck/merchantTransactionOrder')
      const params = {
        id: id, // id
        orReadFlag: '1', // 查看标记，0 未读，1已读
        seeNotificationDate: new Date(), // 当前查看通知的时间
        delAllFlag: '' // del全部标识
      }
      updateSeenOrder(params).then(() => {
        this.orderTotal--
        this.AllorderMessages.splice(idx, 1)// 修改存储数组
        this.orderParams.pageNo = Math.ceil(this.AllorderMessages.length / 10) - 1 // 下拉时，重新加载可能不完整的存储数组尾页
        this.setOrderMessages()
        this.AllorderMessages.length === 0 && this.closeOrderModal()
      })
      // 请求订单详情
      if (orderNo === 0 || orderNo) {
        this.listQuery.orderNo = orderNo
      } else {
        this.listQuery.orderNo = this.AllorderMessages[0].orderNo
      }
      merchantTransactionOrderList(this.listQuery).then(response => {
        if (response.list[0]) {
          this.orderDetail = response.list[0]
        }
        // this.orderDetail = {
        //   orderNo: '56484643',
        //   merOrderNo: '46546',
        //   merId: '56',
        //   orderSource: '1',
        //   bankName: '中国银行',
        //   orderAmount: '10000',
        //   orderState: '46546',
        //   merCommission: '102',
        //   createDate: 1562816549709,
        //   receiveNotifyDate: 1562816549709
        // }
        // console.log('detail', this.orderDetail)
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    //  更新到视图（下拉列表）
    setOrderMessages() {
      if (this.checkAll) {
        this.orderMessages = this.AllorderMessages
      } else {
        if (this.AllorderMessages.length > 4) {
          this.orderMessages = this.AllorderMessages.slice(0, 5)
        } else {
          this.orderMessages = this.AllorderMessages
        }
      }
    },
    // 忽略
    handleIgnore(id, idx) {
      const params = {
        id: id, // id
        orReadFlag: '1', // 查看标记，0 未读，1已读
        seeNotificationDate: new Date(), // 当前查看通知的时间.
        delAllFlag: (idx || idx === 0) ? '' : 'all' // del全部标识
      }
      updateSeenOrder(params).then(() => {
        if (idx || idx === 0) {
          this.orderTotal--
          this.AllorderMessages.splice(idx, 1)
          this.orderParams.pageNo = Math.ceil(this.AllorderMessages.length / 10) - 1
          this.setOrderMessages()
        } else {
          this.orderTotal = 0
          this.AllorderMessages = []
          this.orderParams.pageNo = -1
          this.setOrderMessages()
        }
        this.AllorderMessages.length === 0 && this.closeOrderModal()
      })
    },
    // 展开全部/查看最新
    handleCheckAll() {
      this.checkAll = !this.checkAll
      if (this.AllorderMessages.length >= 10) { // 存储数组小于10都重新请求第一页，避免无法下拉
        this.setOrderMessages()
      } else {
        this.orderParams.pageNo = 1
        getOrderMsg(this.orderParams).then(data => {
          this.AllorderMessages = data.list
          this.orderTotal = data.total
          this.setOrderMessages()
        })
      }
    },
    // 关闭弹框
    closeOrderModal() { // 打开情况下才能调用
      this.popoverShow && document.getElementById('orderBtn').click()
    },
    // 无缝滚动
    InfiniteScroll() {
      const rule = document.getElementById('rule')
      const orderUl = document.getElementById('orderUl')
      if (rule) {
        rule.onscroll = () => {
          if (!this.checkAll || this.AllorderMessages.length >= this.orderTotal) {
            return
          }
          const bottom = orderUl.offsetHeight - rule.offsetHeight // ul高 - 父元素高+底部的元素（查看最新）
          // console.log('bottom', bottom)
          // console.log('rule.scrollTop', rule.scrollTop) // 上部卷起的高度
          if (!this.orderLoading) {
            if (bottom < rule.scrollTop + 10) {
              this.orderLoading = true
              if (this.orderParams.pageNo === Math.ceil(this.orderTotal / 10)) {
                return
              }
              let lastPageArr = [] // 存储数组最后页码的数据
              let lastPageOrderNoArr = []
              if (this.AllorderMessages % 10) {
                lastPageArr = this.AllorderMessages.slice(-(this.AllorderMessages % 10))
              } else {
                lastPageArr = this.AllorderMessages.slice(-10)
              }
              lastPageOrderNoArr = lastPageArr.map((val) => {
                return val.orderNo
              })
              // 增加this.orderMessages数据
              this.orderParams.pageNo++
              this.loading = true
              setTimeout(() => {
                getOrderMsg(this.orderParams).then(data => {
                  data.list.map((item) => {
                    // 判断是否已有（查看等操作会导致存储数组残留当前pageNo的数据）arr.indexOf("apple")
                    if (lastPageOrderNoArr.indexOf(item.orderNo) < 0) { // 用唯一的orderNo甄别
                      this.AllorderMessages.push(item)
                    }
                  })
                  this.orderMessages = this.AllorderMessages
                  this.loading = false
                  this.orderLoading = false
                })
              }, 1000)
            }
          }
        }
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0px !important;

    .hamburger-container {
      line-height: 58px;
      height: 50px;
      float: left;
      padding: 0 10px;
    }

    .breadcrumb-container {
      float: left;
    }

    .notifications {
      position: relative;
      line-height: 50px;
      font-size: 30px;
      margin-left: 10px;
      cursor: pointer;
    }

    .order-icon {
      font-size: 28px;
    }

    .note-type {
      font-size: 14px;
      top: -10px;
      cursor: pointer;
      margin-left: 2px;
      margin-right: 5px;
    }

    .note-icon {
      font-size: 12px;
      line-height: 16px;
      color: white;
      font-weight: bold;
      text-align: center;
      position: absolute;
      right: -2px;
      bottom: 30%;
      background: red;
      width: 16px;
      height: 16px;
      border-radius: 50%;
    }

    .errLog-container {
      display: inline-block;
      vertical-align: top;
    }

    .right-menu {
      float: right;
      height: 100%;

      &:focus {
        outline: none;
      }

      .right-menu-item {
        display: inline-block;
        margin: 0 8px;
      }

      .screenfull {
        height: 20px;
      }

      .international {
        vertical-align: top;
      }

      .theme-switch {
        vertical-align: 15px;
      }

      .avatar-container {
        height: 50px;
        margin-right: 30px;

        .avatar-wrapper {
          margin-top: 5px;
          position: relative;

          .user-avatar {
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }

          .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss">
  .dropdown-orderMsg {
    max-height: 800px;
    overflow: auto;
  }

  .notes-message {
    .el-notification__title {
      font-size: 14px;
    }
  }

  .dropdown-orderMsg .list-item {
    padding: 10px 0 5px;
    border-bottom: 1px solid #eee;
    width: 400px;
  }

  .dropdown-orderMsg .list-item:hover {
    background: #fff;
    color: #606266;
  }

  .all-ignore {
    float: right;
    color: #9AA8BC;
  }

  .dropdown-orderMsg .success-icon {
    width: 34px !important;
    height: 34px !important;
    font-size: 34px;
  }

  .dropdown-orderMsg .order-txt {
    display: inline-block;
    margin-left: 15px;
  }

  .dropdown-orderMsg .parameter-content {
    font-weight: bold;
  }

  .dropdown-orderMsg .msg-time {
    opacity: 0.7;
    font-size: 13px;
    color: #606266;
    letter-spacing: 0;
    line-height: 13px;
  }

  .dropdown-orderMsg .list-item-bottom {
    line-height: 2.5;
  }

  .list-lastItem {
    text-align: center;
    color: #409EFF;
    height: 36px;
    margin: 0 -13px -10px;
    line-height: 30px;
  }

  .order-drop {
    max-height: 600px;
    overflow: auto;
  }

  .noneSelect {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .checkMore {
    box-shadow: 0 -2px 2px #ddd;
    padding-top: 4px;
    border-left: none;
    border-right: none;
  }

  .list {
    list-style-type: none;
    margin-top: 0px;
    margin-bottom: 0px;
    padding-inline-start: 0px;
  }

  .scrollIip {
    text-align: center;
    margin-bottom: 10px;
  }

  /*新弹框*/
  .new-order-tips {
    font-weight: bold;
  }

  .order-no {
    color: #0099CC;
  }

  .modal-bottom {
    position: relative;
    line-height: 3;
  }

  .modal-operation {
    position: absolute;
    right: 0;
  }

  .new-check, .new-ignore {
    display: inline-block;
    color: #fff;
    border-radius: 2.5px;
    background: #409EFF;
    line-height: 1.8;
    padding: 0 10px 0 10px;
  }

  .new-ignore {
    line-height: 1.7;
    color: #409EFF;
    background: #fff;
    border: 1px solid #409EFF;
  }

  .new-check:hover {
    background: #66b1ff;
  }

  .new-ignore:hover {
    border-color: #606266;
    color: #606266;
  }

  .notes-message {
    border-color: rgba(204, 204, 204, 1);
  }

  .notes-message .el-notification__group {
    width: 100vw;
  }

</style>
<style rel="stylesheet/scss" lang="scss">
  .check-dialog .el-form--inline .el-form-item {
    width: 49.5%;
    margin-right: 0;
  }

  .check-dialog .el-form-item__label {
    float: left;
  }

  .check-dialog .up-news .el-form-item__content {
    max-width: 66%;
  }

  .sys-notice-dialog {
    width: 1000px;
    max-height: 700px;
    overflow: auto;
    background: rgba(0, 0, 0, 0);
    box-shadow: unset;
    .el-dialog__header {
      display: none;
      height: 0px;
    }
    .el-dialog__body {
      padding: 0 10px 0 10px;
    }
    .list-item{
      padding:10px;
      position: relative;
      background: #fff;
      border-radius: 5px;
      margin-bottom: 15px;
      text-align: center;
      .header{
        text-align: center;
        font-size: 20px;
        color: #FF6600;
        .close-icon{
          color:#333333;
          font-size: 28px;
          position: absolute;
          right: 10px;
          top:10px;
        }
      }
      .content{
        padding: 10px;
        text-align: center;
      }
      .footer{
        text-align: right;
        line-height: 1;
        padding: 10px;
      }
    }
  }
  .sys-new-dialog {
    max-height: 800px;
    overflow: auto;
    border-radius: 10px;
    .el-dialog__header {
      display: none;
      height: 0px;
    }
    .el-dialog__body {
      padding: 0 20px 0 20px;
    }
    .header{
      color: #FF0000;
      font-size: 24px;
      text-align: center;
      border-bottom: 1px solid #ccc;
      padding: 10px 0 10px 0;
    }
    .content{
      padding: 20px 0 20px 0 ;
      text-align: center;
    }
    .footer{
      text-align: right;
    }
    .confirm-btn{
      text-align: center;
      margin-bottom: 15px;
    }
  }
</style>
