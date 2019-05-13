<template>
  <el-container>
    <el-header style="height: auto;display: flex;justify-content: space-between">
      <span>收款账号</span>
      <span>
        <el-button class="filter-item pan-btn green-btn" type="primary" @click="getBankList">添加收款账号</el-button>
      </span>
      <el-dialog
        :visible.sync="dialogVisible"
        title="添加收款账号"
        width="50%"
      >
        <div>
          <el-form :label-position="labelPosition" :model="dialogForm" label-width="100px">
            <el-form-item label="账户类型">
              <el-radio v-model="radioAccount" label="1">对私账户</el-radio>
              <el-radio v-model="radioAccount" label="2">对公账户</el-radio>
            </el-form-item>
            <el-form-item label="持卡人姓名">
              <el-input v-model="realName" :readonly="true" style="width: 300px"/>
            </el-form-item>
            <el-form-item label="银行名称">
              <el-select v-model="bankCode" value-key="code" style="width: 300px">
                <el-option
                  v-for="item in bankList"
                  :key="item.code"
                  :label="item.name"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="银行卡号">
              <el-input v-model="bankID" style="width: 300px"/>
            </el-form-item>
            <el-form-item label="支行名称">
              <el-input v-model="branchName" style="width: 300px"/>
            </el-form-item>
            <el-form-item label="谷歌验证码">
              <el-input v-model="googleCode" style="width: 300px"/><span style="color: #16C5AE;margin-left: 20px;cursor: pointer">使用短信验证码</span>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addReceiptsAccount">提交</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
    </el-header>
    <el-main>
      <div class="receivables-container">
        <div class="index-line"><span>收款方式</span></div>
        <div style="padding-bottom: 20px;display: flex;flex-wrap: wrap">
          <div v-for="item in bankCards" :key="item" class="payMethods-container">
            <div style="display: flex;justify-content: space-between">
              <div style="margin: 10px 20px">
                <svg-icon icon-class="UnifiedBank" style="width: 30px;height: 30px;vertical-align: middle"/>
                <span style="font-weight: bold;font-size: 14px">{{ item.bankName }}</span>
              </div>
              <div style="margin: 0 20px">
                <p style="color: #FDCE38;font-size: 14px">{{ isEnable }}</p>
              </div>
            </div>
            <div style="padding: 20px;">
              <span style="font-weight: bolder;font-size: 14px;color: #373737">卡号：{{ item.bankAccountNo | bankNumberFilter }}</span>
            </div>
            <div style="display: flex;flex-direction: row-reverse;margin-right: 10px">
              <span class="div-edit-title" style="color: #F55D6A" @click="deleteData(item)">删除</span>
              <span class="div-edit-title" style="color: #0CC2AA" @click="getUpdateInfo(item)">编辑</span>
            </div>
          </div>
        </div>
      </div>
      <el-dialog
        :visible.sync="dialogVisibleEdit"
        title="编辑修改"
        width="30%"
      >
        <el-form :label-position="labelPosition" :model="dialogForm" label-width="100px">
          <el-form-item label="银行名称">
            <el-input v-model="bankName" :readonly="true" style="width: 300px"/>
          </el-form-item>
          <el-form-item label="银行卡号">
            <el-input v-model="updateBank" style="width: 300px"/>
          </el-form-item>
          <el-form-item label="支行名称">
            <el-input v-model="updateBranch" style="width: 300px"/>
          </el-form-item>
          <el-form-item label="谷歌验证码">
            <el-input v-model="googleCode" style="width: 300px"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="createUpdate">确定</el-button>
        </div>
      </el-dialog>
      <el-dialog
        :visible.sync="dialogVisibleDelete"
        title="请输入谷歌验证码"
        width="30%"
      >
        <el-form :label-position="labelPosition" :model="dialogForm" label-width="100px">
          <el-form-item label="谷歌验证码">
            <el-input v-model="googleCode" style="width: 300px"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleDelete = false">取消</el-button>
          <el-button type="primary" @click="deleteInfo">确定</el-button>
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import { agentBankCards, addAccount, getBankList, updateBankCard, deleteBankCard } from '@/api/agent/receipts'
import { personalInformation } from '@/api/agent/basicInformation'
// import waves from '@/directive/waves'
export default {
  name: 'Receipts',
  filters: {
    bankNumberFilter(value) {
      return '**********' + value.slice(value.length - 4, value.length)
    }
  },
  data() {
    return {
      bankCards: [],
      radioAccount: '1',
      userName: undefined,
      bankID: undefined,
      bankIdCopy: undefined,
      bankCode: {},
      bankName: undefined,
      branchName: undefined,
      googleCode: undefined,
      realName: undefined,
      code: undefined,
      id: undefined,
      updateBank: undefined,
      updateBranch: undefined,
      bankList: [],
      bankType: '',
      isEnable: '未启用',
      account: '',
      dialogVisible: false,
      dialogVisibleEdit: false,
      dialogVisibleDelete: false,
      dialogForm: {
        account: ''
      }
    }
  },
  created() {
    this.getAgentBankCards()
    this.getPersonalInformation()
  },
  methods: {
    getAgentBankCards() {
      agentBankCards().then(response => {
        this.bankCards = response.data
      })
    },
    getPersonalInformation() {
      personalInformation().then(response => {
        const data = response.data
        this.realName = data.realName
      })
    },
    getBankList() {
      this.dialogVisible = true
      getBankList().then(response => {
        this.bankList = response.data
      })
    },
    addReceiptsAccount() {
      addAccount({
        accountType: this.radioAccount,
        googleCode: this.googleCode,
        bankAccountName: this.realName,
        bankBranchName: this.branchName,
        bankAccountNo: this.bankID,
        bankCode: this.bankCode.code
      }).then(response => {
        if (response.code === 200) {
          this.dialogVisible = false
          this.getAgentBankCards()
          this.$message({
            message: '添加成功',
            type: 'success'
          })
        }
      })
    },
    getUpdateInfo(item) {
      this.dialogVisibleEdit = true
      this.bankName = item.bankName
      this.updateBank = item.bankAccountNo
      this.id = item.id
      this.updateBranch = item.bankBranchName
    },
    deleteData(item) {
      this.dialogVisibleDelete = true
      this.bankIdCopy = item.id
    },
    deleteInfo() {
      deleteBankCard({
        bankId: this.bankIdCopy,
        googleCode: this.googleCode
      }).then(response => {
        this.dialogVisibleDelete = false
        this.getAgentBankCards()
        if (response.code === 200) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }
      })
    },
    createUpdate() {
      // if (this.bankID !== this.updateBank && this.branchName === this.updateBranch) {
      updateBankCard({
        id: this.id,
        googleCode: this.googleCode,
        bankAccountNo: this.updateBank,
        bankBranchName: this.updateBranch
      }).then(response => {
        if (response.code === 200) {
          this.dialogVisibleEdit = false
          this.getAgentBankCards()
          this.$message({
            message: '编辑成功',
            type: 'success'
          })
        }
      })
      // }
      // else if (this.branchName !== this.updateBranch && this.bankID === this.updateBank) {
      //   updateBankCard({
      //     id: this.id,
      //     googleCode: this.googleCode,
      //     bankBranchName: this.updateBranch
      //   }).then(response => {
      //     if (response.code === 200) {
      //       this.dialogVisibleEdit = false
      //       this.$message({
      //         message: '编辑成功',
      //         type: 'success'
      //       })
      //     }
      //   })
      // } else if (this.bankID !== this.updateBank && this.branchName !== this.updateBranch) {
      //   updateBankCard({
      //     id: this.id,
      //     googleCode: this.googleCode,
      //     bankAccountNo: this.updateBank,
      //     bankBranchName: this.updateBranch
      //   }).then(response => {
      //     if (response.code === 200) {
      //       this.dialogVisibleEdit = false
      //       this.$message({
      //         message: '编辑成功',
      //         type: 'success'
      //       })
      //     }
      //   })
      // } else this.dialogVisibleEdit = false
      // // updateBankCard({
      // //   id: this.id,
      // //   googleCode: this.googleCode
      // // }).then(response => {
      // //   if (response.code === 200) {
      // //     this.dialogVisibleEdit = false
      // //     this.$message({
      // //       message: '编辑成功',
      // //       type: 'success'
      // //     })
      // //   }
      // // })
    }
  }
}
</script>

<style scoped>
  /*@import "../../../style/grmpay/bankMedia.scss";*/
  .index-line span {
    margin-left: 1%;
  }
  .receivables-container {
    background: #FFFFFF;
  }

</style>
