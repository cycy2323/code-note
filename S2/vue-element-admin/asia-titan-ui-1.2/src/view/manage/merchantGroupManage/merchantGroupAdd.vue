<template>
  <div class="new-merchant-group app-container">
    <el-form ref="formData" :model="formData" label-position="right" label-width="120px" class="from-bank">
      <el-form-item label="商户组名称">
        <el-input v-model="formData.groupName" placeholder="商户组名称" style="width: 199px;"/>
      </el-form-item>
      <el-form-item label="商户ID">
        <!--<el-select v-model="formData.merIds" multiple filterable default-first-option reserve-keyword placeholder="请选择商户ID" @focus="focusSelet(1)">-->
        <!--<el-option v-for="item in merIdsArr" :key="item.id" :label="item.nickName" :value="item.id"/>-->
        <!--</el-select>-->
        <el-input v-model="merIdsStr" type="textarea" placeholder="请输入ID" rows="3" style="width: 300px;"/>
        <p style="margin:0">每个ID之间以&nbsp;&nbsp;'&nbsp;,&nbsp;'&nbsp;&nbsp;号分割</p>
      </el-form-item>
      <el-form-item label="配置支付通道">
        <el-select v-model="channelList1" multiple filterable default-first-option reserve-keyword value-key="id" placeholder="请选择" @focus="focusSelet(2)">
          <el-option v-for="item in channelArr1" :key="item.id" :value="item" :label="item.channelAccountName + '（' + item.name + '）'"/>
        </el-select>
      </el-form-item>
      <el-form-item label="支付手续费费率">
        <el-input v-model="formData.payRatio" style="width: 199px;"><template slot="append">&nbsp;&nbsp;%&nbsp;&nbsp;</template></el-input>
      </el-form-item>
      <el-form-item label="配置代付通道">
        <el-select v-model="channelList2" multiple filterable default-first-option reserve-keyword value-key="id" placeholder="请选择" @focus="focusSelet(3)">
          <el-option v-for="item in channelArr2" :key="item.id" :value="item" :label="item.channelAccountName + '（' + item.name + '）'"/>
        </el-select>
      </el-form-item>
      <el-form-item label="代付手续费费率">
        <el-input v-model="formData.remitRatio" style="width: 199px;"><template slot="append">每笔</template></el-input>
      </el-form-item>
      <el-form-item label="">
        <span style="color: red">{{ errTxt }}</span>
      </el-form-item>
    </el-form>
    <div style="margin-left: 40px;margin-top:60px;">
      <el-button type="primary" size="small" @click="$router.push({ path: '/manageMerchantAccount/merchantIGroupList' })">返回列表</el-button>
      <el-button type="primary" size="small" @click="resetForm('formData')">重置</el-button>
      <el-button type="primary" size="small" @click="createConfirm('formData')">添加商户组</el-button>
    </div>
  </div>
</template>

<script>

import { fetchAdd, fetchChannel } from '@/api/manage/merchantGroupManage/merchantGroupAdd'

export default {
  name: 'MerchantGroupAdd',
  data() {
    return {
      formData: {
        groupName: '',
        merIds: [],
        channelIds: [],
        channelNames: [],
        payRatio: '',
        remitRatio: ''
      },
      merIdsStr: '',
      errTxt: '',
      merIdsArr: [],
      channelArr1: [],
      channelArr2: [],
      channelList1: [],
      channelList2: []
    }
  },
  created() {
    // fetchQuery({}).then(response => {
    //   this.merIdsArr = response
    // })
    fetchChannel({ type: 1 }).then(response => {
      this.channelArr1 = response
    })
    fetchChannel({ type: 2 }).then(response => {
      this.channelArr2 = response
    })
  },
  methods: {
    createConfirm(formName) {
      this.errTxt = ''
      var str = this.merIdsStr.replace(/，|\s+/ig, ',').split(',')
      this.formData.merIds = str.filter(item => Number(item))
      var obj = JSON.parse(JSON.stringify(this.formData))
      var reg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/
      if (obj.payRatio || obj.remitRatio) {
        if (!reg.test(obj.payRatio) || !reg.test(obj.remitRatio)) {
          this.errTxt = '手续费费率不能小于0，最多两位小数'
        }
      }
      for (var key in obj) {
        if (!obj[key]) {
          this.errTxt = '请填写所有表单内容'
        }
      }
      // if (!obj.merIds.length) {
      //   this.errTxt = '请选择商户ID'
      // }
      // if (!this.channelList1.length || !this.channelList2.length) {
      //   this.errTxt = '请选择通道'
      // }
      if (this.errTxt) {
        // this.$message.error(this.errTxt)
        return
      }
      [this.channelList1, this.channelList2].forEach(item => {
        for (var i = 0; i < item.length; i++) {
          obj.channelIds.push(item[i].id)
          obj.channelNames.push(item[i].channelAccountName)
        }
      })
      fetchAdd(obj).then(response => {
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.$router.push({ path: '/manageMerchantAccount/merchantIGroupList' })
      })
    },
    resetForm() {
      for (var key in this.formData) {
        this.formData[key] = ''
      }
      this.formData.merIds = []
      this.channelList1 = []
      this.channelList2 = []
    },
    focusSelet(num) {
      var vm = this
      vm.$nextTick(() => {
        const elSelect = document.querySelectorAll('.el-select-dropdown')
        for (var i = 0; i < elSelect.length; i++) {
          var parent = elSelect[i].parentNode
          var elSelectWrap = elSelect[i].querySelector('.el-select-dropdown__wrap.el-scrollbar__wrap')
          var allSelect = elSelectWrap.querySelector('.go-select-all')
          if (!allSelect && parent.tagName === 'BODY') {
            var evdiv = document.createElement('div')
            evdiv.className = 'go-select-all'
            evdiv.innerHTML = '<span id="select-all">全选</span><span id="selection-all">反选</span>'
            elSelectWrap.querySelector('.el-scrollbar__view.el-select-dropdown__list').style.paddingTop = '0px'
            elSelectWrap.insertBefore(evdiv, elSelectWrap.childNodes[0])
            evdiv.querySelector('#select-all').addEventListener('click', function() {
              vm.afterSelect(num, true)
            })
            evdiv.querySelector('#selection-all').addEventListener('click', function() {
              vm.afterSelect(num)
            })
          }
        }
      }, 1000)
    },
    afterSelect(num, boole) {
      var arr = []
      if (num === 1) {
        if (boole) {
          arr = this.merIdsArr.map((item) => {
            return item.id
          })
        }
        this.formData.merIds = arr
      } else if (num === 2) {
        if (boole) arr = this.channelArr1
        this.channelList1 = arr
      } else {
        if (boole) arr = this.channelArr2
        this.channelList2 = arr
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.new-merchant-group{
  .confirm-btn{
    border-top: 1px solid #eee;
    padding-top: 20px;
  }
}
.new-merchant-group /deep/ .el-form-item{
  // .el-select__tags{
  //   span{
  //     display: none;
  //   }
  // }
}
</style>
<style>
  .el-select-dropdown__wrap .go-select-all{
    font-size: 14px;
    position: relative;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #535455;
    height: 34px;
    line-height: 34px;
    border-bottom: 1px solid #ebe8e8;
  }
  .el-select-dropdown__wrap .go-select-all span{
    display: inline-block;
    text-align: center;
    width: 50%;
    cursor: pointer;
  }
  .el-select-dropdown__wrap .go-select-all span:hover{
    color: #409EFF;
  }
  .el-select-dropdown__wrap .go-select-all span:last-child{
    border-left: 1px solid #ebe8e8;
  }
</style>

