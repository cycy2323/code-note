<template>
  <el-container>
    <el-header style="height: auto">
      基本信息1
    </el-header>
    <el-main>
      <information
        :title-info="'个人信息'"
        :collections="[{'title': 'ID','content':agentCode},
                       {'title': '用户名','content':userName},
                       {'title': '分润比例','content':ratio},
                       {'title': '创建时间','content':createDate}]"
      />
      <div class="account-info">
        <div class="security-info">
          <div class="index-line">
            <span>账户与安全</span>
          </div>
          <div class="index-line display-flex-container">
            <div style="width: 100px"><p style="margin: 0">{{ $t('extractCash.tellPhone') }}</p></div>
            <div>
              <p style="margin: 0">{{ tellPhone }}</p>
            </div>
            <div>
              <el-button size="mini" type="success" @click="dialogActivate">{{ $t('extractCash.amend') }}</el-button>
            </div>
          </div>
          <div class="index-line display-flex-container">
            <div style="width: 100px">
              <p style="margin: 0">{{ $t('extractCash.email') }}</p>
            </div>
            <div>
              <el-tag :type="emailBinding === 1 ? 'success' : 'danger' ">
                {{ emailBinding === 1 ? '已绑定' : '未绑定' }}
              </el-tag>
            </div>
            <div>
              <el-button size="mini" type="success" @click="emailAddress">{{ $t('extractCash.binding') }}</el-button>
            </div>
          </div>
          <div class="index-line display-flex-container">
            <div style="width: 100px">
              <p style="margin: 0">{{ $t('extractCash.googleCode') }}</p>
            </div>
            <div>
              <el-tag :type="googleBinding === 1 ? 'success' : 'danger' ">
                {{ googleBinding === 1 ? '已绑定' : '未绑定' }}
              </el-tag>
            </div>
            <div>
              <el-button size="mini" type="success" @click="googleAddress">{{ $t('extractCash.binding') }}</el-button>
            </div>
          </div>
          <div class="index-line display-flex-container">
            <div style="width: 100px">
              <p style="margin: 0">{{ $t('extractCash.loginPWD') }}</p>
            </div>
            <div>
              <p style="margin: 0">{{ loginPassword | passwordVisibleFilter }}</p>
            </div>
            <div>
              <el-button size="mini" type="success" @click="dialogActivatePWD">{{ $t('extractCash.amend') }}</el-button>
            </div>
          </div>
          <div class="index-line display-flex-container">
            <div style="width: 100px">
              <p style="margin: 0">{{ $t('extractCash.payPWD') }}</p>
            </div>
            <div>
              <p style="margin: 0">{{ payPassword | passwordVisibleFilter }}</p>
            </div>
            <div>
              <el-button size="mini" type="success" @click="paymentPWD">{{ $t('extractCash.amend') }}</el-button>
            </div>
          </div>
        </div>
        <el-dialog :visible.sync="dialogVisibleTellPhone" title="修改手机号" width="30%">
          <el-form label-width="120px">
            <el-form-item label="手机号">
              <el-input v-model="tellPhone" style="width: 250px"/>
            </el-form-item>
            <el-form-item label="谷歌验证码">
              <el-input v-model="google" style="width: 250px"/>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisibleTellPhone = false">取 消</el-button>
            <el-button type="primary" @click="createUpdateInfo">确 定</el-button>
          </div>
        </el-dialog>
        <el-dialog :visible.sync="dialogVisibleLoginPWD" title="修改登录密码" width="30%">
          <el-form label-width="120px">
            <el-form-item label="登录密码">
              <el-input v-model="loginPassword" type="password" style="width: 250px"/>
            </el-form-item>
            <el-form-item label="谷歌验证码">
              <el-input v-model="google" style="width: 250px"/>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisibleLoginPWD = false">取 消</el-button>
            <el-button type="primary" @click="createUpdateInfo">确 定</el-button>
          </div>
        </el-dialog>
        <el-dialog :visible.sync="dialogVisiblePayPWD" title="修改支付密码" width="30%">
          <el-form label-width="120px">
            <el-form-item label="支付密码">
              <el-input v-model="payPassword" type="password" style="width: 250px"/>
            </el-form-item>
            <el-form-item label="谷歌验证码">
              <el-input v-model="google" style="width: 250px"/>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisiblePayPWD = false">取 消</el-button>
            <el-button type="primary" @click="createUpdateInfo">确 定</el-button>
          </div>
        </el-dialog>
        <el-dialog :visible.sync="dialogVisibleEmail" title="绑定邮箱" width="30%">
          <el-form label-width="120px">
            <el-form-item label="邮箱">
              <el-input v-model="emailAds" style="width: 250px"/>
            </el-form-item>
            <el-form-item label="谷歌验证码">
              <el-input v-model="google" style="width: 250px"/>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisibleEmail = false">取 消</el-button>
            <el-button type="primary" @click="createUpdateInfo">确 定</el-button>
          </div>
        </el-dialog>
        <el-dialog :visible.sync="dialogVisibleGoogle" title="绑定谷歌验证器" width="30%">
          <el-form label-width="120px">
            <el-form-item label="谷歌秘钥">
              <el-input v-model="googlePwd" style="width: 250px"/>
            </el-form-item>
            <el-form-item label="谷歌验证码">
              <el-input v-model="google" style="width: 250px"/>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisibleGoogle = false">取 消</el-button>
            <el-button type="primary" @click="createUpdateInfo">确 定</el-button>
          </div>
        </el-dialog>
        <el-dialog :visible.sync="dialogVisibleGoogle" title="请使用以下方式绑定谷歌验证器" width="30%">
          <el-form label-width="140px">
            <el-form-item label="1.谷歌秘钥绑定：">
              <span>{{ secretKey }}</span>
            </el-form-item>
            <el-form-item label="2.扫描二维码绑定：">
              <vue-qr :text="qrcodeUrl" :size="200" :margin="0" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <!--<el-button @click="dialogVisibleGoogle = false">取 消</el-button>-->
            <el-button type="primary" @click="dialogVisibleAnewBind = true">确 定</el-button>
          </div>
        </el-dialog>
        <el-dialog :visible.sync="dialogVisibleAnewBind" width="30%" title="绑定谷歌验证器">
          <el-form label-width="140px">
            <el-form-item label="谷歌验证码">
              <el-input v-model="google" placeholder="请输入谷歌验证码" style="width: 250px;"/>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisibleAnewBind = false">取 消</el-button>
            <el-button type="primary" @click="anewGoogleAddress">绑 定</el-button>
          </div>
        </el-dialog>
        <!--<accountSecurity-->
        <!--:title="'账号与安全'"-->
        <!--:div-container="[{'txtTitle':'手机号','txtContent':tellPhone,'tagButton':'修改','callback':dialogActivate},-->
        <!--{'txtTitle':'邮箱','txtContent':emailBinding,'tagButton':'修改','callback':dialogActivate},-->
        <!--{'txtTitle':'谷歌验证码','txtContent':googleBinding,'tagButton':'绑定','callback':dialogActivate},-->
        <!--{'txtTitle':'登陆密码','txtContent':loginPassword,'tagButton':'修改','callback':dialogActivate},-->
        <!--{'txtTitle':'资金密码','txtContent':payPassword,'tagButton':'修改','callback':dialogActivate}]"/>-->
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="listQuery.pageNo"
          :limit.sync="listQuery.pageSize"
          @pagination="getLoginInfo"/>
        <div class="el-header" style="margin-bottom: 10px;">登录记录</div>
        <el-table
          v-loading="listLoading"
          :key="tableKey"
          :data="list"
          fit
          highlight-current-row>
          <el-table-column :label="$t('order.times')" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.loginDate | parseTime('{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('order.address')" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.loginAddress }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('order.IP')" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.loginIp }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import information from '../../common/information'
import accountSecurity from '../../common/accountSecurity'
import loginRecord from '../../common/loginRecord'
import { parseTime } from '@/utils'
import { personalInformation, getIpName, accountSafety, updateInfo } from '@/api/agent/basicInformation'
import VueQr from 'vue-qr'
import { googleBind, anewGoogleBind } from '@/api/manage/basicInformation'

export default {
  name: 'BasicInfo',
  components: { information, accountSecurity, loginRecord, parseTime, VueQr },
  filters: {
    passwordVisibleFilter() {
      return '********'
    }
  },
  data() {
    return {
      tellPhone: undefined,
      loginPassword: undefined,
      payPassword: undefined,
      emailBinding: undefined,
      googleBinding: undefined,
      emailAds: '',
      googlePwd: '',
      dialogVisible: false,
      dialogVisibleTellPhone: false,
      dialogVisibleLoginPWD: false,
      dialogVisibleEmail: false,
      dialogVisibleGoogle: false,
      dialogVisiblePayPWD: false,
      dialogVisibleAnewBind: false,
      agentCode: '',
      createDate: undefined,
      ratio: '',
      userName: '',
      payPwd: '',
      googleCode: '',
      secretKey: '',
      qrcodeUrl: '',
      merUUID: '',
      times: undefined,
      address: undefined,
      loginIp: undefined,
      listLoading: false,
      list: [],
      total: 0,
      listQuery: {
        pageNo: 1,
        pageSize: 10
      }
    }
  },
  // | parseTime('{y}-{m}-{d} {h}:{i}:{s}')
  created() {
    this.personalInformation()
    this.getLoginInfo()
    this.getAccountSafety()
  },
  methods: {
    dialogActivate() {
      if (this.googleBinding === 0) {
        this.$message({
          type: 'error',
          message: '请先绑定谷歌验证器！'
        })
      } else {
        this.dialogVisibleTellPhone = true
      }
    },
    dialogActivatePWD() {
      if (this.googleBinding === 0) {
        this.$message({
          type: 'error',
          message: '请先绑定谷歌验证器！'
        })
      } else {
        this.dialogVisibleLoginPWD = true
      }
    },
    emailAddress() {
      if (this.googleBinding === 0) {
        this.$message({
          type: 'error',
          message: '请先绑定谷歌验证器！'
        })
      } else {
        this.dialogVisibleEmail = true
      }
    },
    googleAddress() {
      this.dialogVisibleGoogle = true
      googleBind({ uuid: this.merUUID }).then(response => {
        const data = response.data
        this.secretKey = data.secert
        this.qrcodeUrl = data.qrcodeUrl
      })
    },
    anewGoogleAddress() {
      this.dialogVisibleAnewBind = true
      anewGoogleBind({ uuid: this.merUUID, googleCode: this.google }).then(() => {
        this.dialogVisibleAnewBind = false
        this.$message({
          type: 'success',
          message: '绑定谷歌验证器成功'
        })
      })
    },
    paymentPWD() {
      if (this.googleBinding === 0) {
        this.$message({
          type: 'error',
          message: '请先绑定谷歌验证器！'
        })
      } else {
        this.dialogVisiblePayPWD = true
      }
    },
    personalInformation() {
      personalInformation().then(response => {
        const data = response.data
        this.agentCode = data.agentCode
        this.createDate = data.createDate
        this.ratio = data.ratio
        this.userName = data.userName
      })
    },
    getLoginInfo() {
      this.listLoading = true
      getIpName(this.listQuery).then(response => {
        const data = response.data
        this.list = data.list
        this.total = data.total
        this.listLoading = false
      })
    },
    getAccountSafety() {
      accountSafety().then(response => {
        const data = response.data
        this.payPassword = data.payPassword
        this.tellPhone = data.phone
        this.loginPassword = data.password
        this.emailBinding = data.bindEmail
        this.googleBinding = data.bindGoogle
      })
    },
    createUpdateInfo() {
      updateInfo({
        googleCode: this.google,
        phone: this.tellPhone,
        password: this.loginPassword
      }).then(() => {
        this.dialogVisibleTellPhone = false
        this.dialogVisibleLoginPWD = false
        this.dialogVisibleEmail = false
        this.dialogVisibleGoogle = false
        this.dialogVisiblePayPWD = false
        this.$message({
          type: 'success',
          message: '修改成功'
        })
      })
    }
  }
}
</script>

<style scoped>
  /*@import "../../../style/grmpay/headerTitle.scss";*/
  .el-main {
    display: flex;
  }
  .account-info {
    width: 75%;
    border: 0 solid;
    margin-left: 5%;
    display: flex;
    flex-direction: column;
  }
  .security-info {
    width: 100%;
    background: #FFFFFF;
    padding-bottom: 30px;
  }
  .index-line span {
    margin-left: 2%;
  }
  .display-flex-container {
    display: flex;
    justify-content: space-between;
    margin: 0 2%;
    font-size: 14px;
  }
</style>
