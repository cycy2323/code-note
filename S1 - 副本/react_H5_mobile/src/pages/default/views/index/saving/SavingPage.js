import React from 'react'
import {soulContext} from 'soul'
import {Button, Icon, InputItem, Modal, Picker, Tabs, Toast, WingBlank} from 'antd-mobile'
import PromptTemplate from 'common/components/prompt/PromptView'
import FundManageTemplate from '../../../components/fundManage/FundManageView'
import MainNav from "common/components/header/MainHeader";
import {failCallBack} from "common/tools";
import DepositPage from "./deposit/DepositPage";

const alert = Modal.alert;

class SavingPage extends React.Component {
  // 提现按钮
  takeMoneyCommit = (history) => {
    if (!this.state.isBindCard) {
      //未绑定银行卡
      const alertInstance = alert('请先绑定银行卡', '', [
        {text: '取消', onPress: () => console.log('cancel'), style: 'default'},
        {text: '确定', onPress: () => console.log('ok')},
      ]);

    } else if (!this.state.balanceIsEnough) {
      //钱包余额不足
      history.push('/balanceWarning')
    } else {
      // 提交成功
      const alertInstance = alert('提交成功', '', [
        {text: '取消', onPress: () => console.log('cancel'), style: 'default'},
        {text: '确定', onPress: () => console.log('ok')},
      ]);
      // setTimeout(() => {
      //     // 可以调用close方法以在外部close
      //     alertInstance.close();
      // }, 5000);
    }
  }
  // 根据apiId回收，无参数则为全部回收
  handleRecycleByApiId = (api) => {
    // 单个回收 之后刷新
    if (api) {
      this.$service.mineOrigin().recovery.post(api)
        .then(res => {
          console.log('单个回收成功')
          if (res.success) {
            console.log(res)
            // 回收成功以后调一键刷新接口
            this.$service.userInfoOrigin().refreshApi.post(api)
              .then(res => {
                if (res.success) {
                  console.log('单个刷新成功')
                }
              })
          }
        })
    } else {
      //一键回收
      this.$service.mineOrigin().recovery.post()
        .then(res => {
          if (res.success) {
            console.log('全部回收成功')
            this.$service.userInfoOrigin().getUserAssert.post()
              .then(res => {
                console.log(res)
                if (res.success) {

                  console.log('全部刷新成功')
                }
              })
          }


        })
    }
  }
  // 一键刷新
  handleRefreshAll = () => {
    this.$service.userInfoOrigin().getUserAssert.post()
      .then(res => {
        console.log(res)
        if (res.success) {
          console.log('全部刷新成功')
          this.setState({
            apis: res.data.apis
          })
        }
      })
  }

  constructor(props) {
    super(props)
    this.$service = this.props.$service
    this.tabs = [
      {title: '存款'},
      {title: '资金'},
      {title: '提现'}
    ]
    this.state = {
      payMin: 0,  // 存款最小金额
      payMax: 0,  // 存款最大金额
      withdrawAmountInput: '',
      currencySign: '£',
      administrativeFee: 0,   // 行政费
      counterFee: 0,      //手续费
      deductFavorable: 0, //扣除优惠
      actualWithdraw: '',//最终可取
      bankcardMap: {
        "id": 770547,
        "userId": 1989365,
        "bankcardMasterName": "e*e",
        "bankcardNumber": "3231 2331 **** 1231",
        "createTime": 1547688107438,
        "useCount": 0,
        "useStauts": true,
        "bankName": "ccb",
        "bankDeposit": "1231233123",
        "type": "1",
        "bankUrl": "/1.0.0.0/rcenter/mobile-api/common/pay_bank/ccb.png",
        "default": true
      },
      bankList: [],
      count: 0,
      code: '',   // 支付方式code
      user: {
        totalAssets: '1018381738',
        walletBalance: '100000.00',
        apis: [],
        currency: '￥'
      },

      // 模拟九宫格数据
      gridData: '',
      // 存款方式数据
      savingType: Array.from(new Array(4)).map((_val, i) => ({
        url: 'http://pic.51yuansu.com/pic3/cover/01/07/40/59016efb1df30_610.jpg',
        text: `name${i}`,
      })),
      // 筹码
      quickMoney: [],
      value: [''],
      isBindCard: false,  //TODO 判断是否绑定银行卡
      balanceIsEnough: false, //TODO 判断钱包是否余额足够
      SavingGridIndex: 0
    }
  }



  handleGetWithDrawInit() {
    // 提现相关请求
    this.$service.withdrawOrigin().getWithDraw.get()
      .then(res => {
        console.log(res)
        // if(res.success){
        this.setState({
          administrativeFee: res.data.auditMap.administrativeFee,
          counterFee: res.data.auditMap.counterFee,
          deductFavorable: res.data.auditMap.deductFavorable,
          isBindCard: res.data.hasBank,
          currencySign: res.data.currencySign
        })
        // }
      })
  }

  handleGetUserInfo() {
    this.$service.userInfoOrigin().getUserInfo.get()
      .then(res => {
        console.log("api资金列表", res)
        if (res.success) {
          console.log('user', res)
          this.setState({
            user: res.data.user
          })
        }
      })
  }


  getActualWithdraw(withdrawAmount) {
    let data = {withdrawAmount: withdrawAmount}
    this.$service.withdrawOrigin().withdrawFee.post(data)
      .then(res => {
        if (res.code === '0') {
          this.setState({
            actualWithdraw: res.data.actualWithdraw
          })
        } else {
          failCallBack({history: this.props.history, message: res.message, code: res.code})
        }
      })

  }

  handleChangeState(obj) {
    this.setState({...obj})
  }

  render() {
    const {history, t} = this.props
    return (
      <div className="saving-page">
        <MainNav
          title='存款'
          className="com-header-nav"
        />
        <div className="savingTabsContainer">
          <Tabs
            tabs={this.tabs}
            page={this.props.currentTab}
            onTabClick={(item, index) => {
              this.props.handleChangeSavingSelected(index)
            }}
          >
            <DepositPage/>
            {/*资金TAB*/}
            <div style={{backgroundColor: '#fff'}}>

              {/*取款状态公告*/}
              <div style={{textAlign: 'center'}} className='savingPrompt'>
                <PromptTemplate text={'取款处理中：' + this.state.user.withdrawAmount}/>
              </div>

              {/*资金状况和分布九宫格*/}
              <FundManageTemplate recycleByApiId={this.handleRecycleByApiId} refreshAll={this.handleRefreshAll}
                                  data={this.state.user}/>
            </div>
            {/*提现*/}
            <div className="takeCash">
              <div className="cardAndBalance">
                {/*银行卡*/}
                <div className="listItem">
                  {
                    this.state.isBindCard
                    &&
                    <div className='hadBindCard'>
                      <InputItem
                        editable={false}
                        type={'money'}
                        value={this.state.bankcardMap.bankcardMasterName + " " + this.state.bankcardMap.bankcardNumber}
                        moneyKeyboardAlign="right"
                        moneyKeyboardWrapProps={true}
                      >
                        <img src={"http://test01.ccenter.test.so" + this.state.bankcardMap.bankUrl}
                             style={{width: '90px', height: '18.5px'}} alt=""/>
                      </InputItem>
                    </div>
                    ||
                    <div className='unbindCard'>
                      <InputItem
                        editable={false}
                        type={'money'}
                        moneyKeyboardAlign="right"
                      >
                        <span>请先绑定银行卡</span>
                        <svg className="icon" aria-hidden="true">
                          <use xlinkHref="#icon-bankCard"/>
                        </svg>
                      </InputItem>
                    </div>
                  }

                </div>
                {/*钱包余额*/}
                <div className="FinalListItem">
                  <InputItem
                    disabled={false}
                    editable={false}
                    type={'money'}
                    value={this.state.user.currency + ' ' +
                    this.state.user.walletBalance}
                    moneyKeyboardAlign="right"
                    moneyKeyboardWrapProps={true}
                  >
                    <div>钱包余额</div>
                  </InputItem>
                </div>
              </div>
              {/*取款金额*/}
              <div className="drawMoneyCount">
                <InputItem
                  type={'money'}
                  placeholder="¥1~¥999999999"
                  moneyKeyboardAlign="right"
                  moneyKeyboardWrapProps={true}
                  // onVirtualKeyboardConfirm={(val)=>{
                  //     this.getActualWithdraw(val*1)
                  // }}
                  onBlur={(val) => {
                    console.log(val)
                    this.setState({
                      withdrawAmountInput: val
                    })
                    this.getActualWithdraw(val * 1)
                  }}
                >
                  取款金额
                </InputItem>
              </div>
              {/*费用显示*/}
              <div className="FeeCalculate">
                <div className="listItem">
                  <InputItem
                    editable={false}
                    type={'money'}
                    value={this.state.currencySign + ' ' + this.state.counterFee}
                    moneyKeyboardAlign="right"
                    moneyKeyboardWrapProps={true}
                  >
                    手续费
                  </InputItem>
                </div>
                <div className="listItem">
                  <InputItem
                    editable={false}
                    type={'money'}
                    value={this.state.currencySign + ' ' + this.state.administrativeFee}
                    moneyKeyboardAlign="right"
                    moneyKeyboardWrapProps={true}
                  >
                    行政费
                  </InputItem>
                </div>
                <div className="listItem">
                  <InputItem
                    editable={false}
                    type={'money'}
                    value={this.state.currencySign + ' ' + this.state.deductFavorable}
                    moneyKeyboardAlign="right"
                    moneyKeyboardWrapProps={true}
                  >
                    扣除优惠
                  </InputItem>
                </div>
                <div className="FinalListItem">
                  <InputItem
                    editable={false}
                    type={'money'}
                    value={this.state.actualWithdraw ? this.state.currencySign + ' ' + this.state.actualWithdraw : ''}
                    moneyKeyboardAlign="right"
                    moneyKeyboardWrapProps={true}
                  >
                    最终可取
                  </InputItem>
                </div>
              </div>
              {/*查看稽核*/}
              <a className='checkAudit'
                 onClick={() => {
                   history.push('audit')
                 }}
              >查看稽核</a>
              {/*按钮*/}
              <WingBlank>
                <Button
                  // activeStyle={false}
                  className="default"
                  onClick={() => {
                    // console.log(this.state.withdrawAmountInput)
                    if (!this.state.withdrawAmountInput) {
                      Toast.info('取款金额不能为空！')
                      return
                    }
                    this.takeMoneyCommit(history)
                  }}
                >
                  确认提交
                </Button>
              </WingBlank>
            </div>
          </Tabs>
        </div>
      </div>
    )
  }
}

export default soulContext()(SavingPage)
