/*
*
* 描述：
* @author lee
* @create 2019-03-06 3:19 PM
*/
import React from 'react'
import {InputItem, List, Picker, Icon, Button} from 'antd-mobile'
import {soulContext} from 'soul'
import {failCallBack} from 'common/tools/index'
import PromptTemplate from 'common/components/prompt/PromptView'
import DepositMethodView from './DepositMethodView'
import ImageTextItemList from 'common/components/ImageTextItemList'
import DepositSubmitModal from './DepositSubmitModal'
//通知
const RenderPrompt = (props) => {
  return <div className="savingPrompt">
    <PromptTemplate
      text='温馨提示：完成存款后，请前往活动大厅申请活动优惠。'
      mode='closable'
      loop={false}
    />
  </div>
}
//支付方式
const RenderDepositMethod = (props) => {
  return (
    'online' === props.code ? null : <div className='savingType'>
      <div className='savingType-tips'>
        <div className='tips-icon'/>
        <span className='tips-text'>{props.code === 'bitcoin' ? '账号名称' : '存款方式'}</span>
      </div>
      {/*存款方式*/}
      <ImageTextItemList
        index={props.depositMethod}
        data={props.arrayList}
        handleClick={(index) => {
          props.handleClick({
            depositMethod: index,
            rechargeAmount: 0,
            randomAmount: props.arrayList[index].randomAmount
          })
        }}
        textItemName={props.code === 'bitcoin' ? 'account,fullName' : 'payName,aliasName'}
        imageOrigin={'http://test01.ccenter.test.so'}
        imageItemName={'imgUrl'}
      />
    </div>
  )
}
//快速选择金额
const RenderQuickSelectMoney = (props) => {
  let max = props.arrayList[props.depositMethod] ? props.arrayList[props.depositMethod].singleDepositMax : 0
  let min = props.arrayList[props.depositMethod] ? props.arrayList[props.depositMethod].singleDepositMin : 0
  return (
    props.code === 'bitcoin'
      ? <Button
        activeStyle={false}
        className="default"
        onClick={props.handleButtonClick}
      >
        提交
      </Button>
      : <div>
        <div className='selectCount'>
          <div className='selectCount-tips'>
            <div className='tips-icon'/>
            <span className='tips-text'>选择金额</span>
          </div>
          {/*遍历筹码*/}
          <div className='chipsList'>
            <div className='imgList'>
              {props.data.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={'chip get-chip' + item}
                    onClick={() => {
                      props.handleClick(item)
                    }}>
                    {item}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className="saveInput">
          <InputItem
            type='money'
            placeholder={props.arrayList.length > 0 ? min.toLocaleString() + '~' + max.toLocaleString() : null}
            clear
            moneyKeyboardAlign="left"
            moneyKeyboardWrapProps={true}
            extra={props.randomAmount ?
              <span style={{background: '#ddd'}}>{((Math.floor(Math.random() * (88)) + 11) / 100)}</span> : ''}
            value={props.rechargeAmount ? props.rechargeAmount.toLocaleString() : undefined}
            onChange={(value) => {
              let indexOfMark = value.indexOf('.')
              if (indexOfMark >= 0) value = value.slice(0, indexOfMark)
              props.handleChangeInput({//确保不以'.'开始
                rechargeAmount: isNaN(Number.parseInt(value)) || value <= max ? value : props.rechargeAmount
              })
            }}
            onVirtualKeyboardConfirm={value => {//确保不以'.'结束
              props.handleChangeInput({
                rechargeAmount: isNaN(Number.parseInt(value)) || value <= max ? value : props.rechargeAmount
              })
            }
            }
          >
            存款金额
          </InputItem>
        </div>
        <div className={props.code === 'online' ? 'bankSelect' : 'bankSelect hide'}>
          <Picker
            data={props.bankList}
            value={props.onlineBank}
            cols={1}
            onChange={(value) => props.handleChangeInput({onlineBank: value})}
          >
            <List.Item arrow="horizontal">支付银行</List.Item>
          </Picker>
        </div>
        {/*按钮*/}
        <Button
          activeStyle={false}
          className="default"
          onClick={props.handleButtonClick}
        >
          提交
        </Button>
      </div>

  )
}
const RenderTips = (props) => {
  return <section className='com-page-end-description'>
    <h4>温馨提示</h4>
    {props.randomAmount ? <p>*为了提高对账速度及成功率，当前支付方式已开随机额度，请输入整数存款金额，将随机增加0.11~0.99元！</p> : null}
    <p>*请保留好转账单据作为核对证明。</p>
    <p>*如出现充值失败或充值后未到账等情况，请联系在线客服获取帮助。<a className='link' href='#'>点击联系客服</a></p>
  </section>
}

class DepositPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      seachSale: {},
      activityId: null,
      submitDeposit: false,
      selectedChannel: 0,//选中存款通道
      singleDepositMax: 0,
      singleDepositMin: 0,
      arrayList: [],
      quickMoneys: [],//快速选择金额
      data: [],
      depositMethod: 0,
      randomAmount: false,
      onlineBank: [],
      rechargeAmount: undefined,
      bankList: sessionStorage.getItem('depositBankList') ? JSON.parse(sessionStorage.getItem('depositBankList')) : []
    }
    this.dictBankName = sessionStorage.getItem('depositDictBankName') ? JSON.parse(sessionStorage.getItem('depositDictBankName')) : {}
    this.handleGetChannelDetail = this.handleGetChannelDetail.bind(this)
    this.handleChangeState = this.handleChangeState.bind(this)
    this.handleSubmitNext = this.handleSubmitNext.bind(this)
  }

  // 请求存款方式数据
  handleGetChannelDetail(index) {
    let code = _.get(this.state, `data[${index}].code`)
    let needRequest = !_.get(this.state, `data[${index}].switchValue`)
    let prevCode = this.state.code
    if (code && needRequest && code !== prevCode) {
      this.setState({
        selectedChannel: index,
        activityId: null,
        code: code,
        depositMethod: 0,
        rechargeAmount: 0,
        arrayList: prevCode === 'online' ? [] : this.state.arrayList//避免因存款方式数量差距较大引发的页面闪动
      })
      //判断本地缓存是否有数据
      let sessionStorageCode = 'deposit' + code
      let localStorage = sessionStorage.getItem(sessionStorageCode)
      localStorage ?
        this.setState({
          ...JSON.parse(localStorage),
          randomAmount: JSON.parse(localStorage).arrayList[0].randomAmount
        }) :
        this.props.$service.depositOrigin(code).index.post()
          .then(res => {
            if (res.code === '0') {
              //TODO 暂时无法取消axios的请求
              if (index === this.state.selectedChannel) {
                //一次性生成在线支付下拉列表
                if (code === 'online') {
                  let bankList = res.data.arrayList.map(item => {
                    this.dictBankName[item.bankCode] = item.payName
                    return {
                      label: item.payName,
                      value: item.bankCode
                    }
                  })
                  sessionStorage.setItem('depositDictBankName', JSON.stringify(this.dictBankName))
                  sessionStorage.setItem('depositBankList', JSON.stringify(bankList))
                  this.setState({
                    bankList: bankList
                  })
                }
                this.setState({
                  ...res.data,
                  randomAmount: res.data.arrayList[0].randomAmount
                })
                sessionStorage.setItem(sessionStorageCode, JSON.stringify(res.data))
              }
            } else {
              failCallBack({history: this.props.history, message: res.message, code: res.code})
            }
          })
    }
  }

  //修改state值
  handleChangeState(obj, callBack) {
    this.setState({
      ...obj,
    }, () => {
      if (callBack) callBack
    })
  }

  //获取初始化数据并存储在sessionStorage里
  handleGetIndexData() {
    // 存款方式初始化
    this.props.$service.depositOrigin().index.post()
      .then(res => {
        if (res.code === '0') {
          sessionStorage.setItem('depositIndexData', JSON.stringify(res.data))
          this.setState({
            data: res.data,
          }, () => {
            this.handleGetChannelDetail(0)
          })
        } else {
          failCallBack({history: this.props.history, message: res.message, code: res.code})
        }
      })
  }

  //提交存款相关信息到存款页面
  handleSubmitNext() {
    let totalDepositValue = parseFloat(this.state.rechargeAmount)
    let depositMethodData = this.state.arrayList[this.state.depositMethod]
    if ((!isNaN(Number.parseFloat(totalDepositValue)) && totalDepositValue > 0) || this.state.code === 'bitcoin') {
      if (depositMethodData.type === '2') {
        //开启弹窗获取手续费和跳转url
        this.props.$service.depositOrigin().seachSale.post({
          'result.rechargeAmount': totalDepositValue,
          'account': depositMethodData.searchId,
          'depositWay': depositMethodData.depositWay,
          'result.bankOrder': depositMethodData.bankOrder
        })
          .then(res => {
            if (res.code === '0') {
              this.handleChangeState({
                submitDeposit: true,
                seachSale: {...res.data}
              })
            } else {
              failCallBack({
                code: res.code,
                message: res.message,
                history: this.props.history
              })
            }
          })
      } else {
        // 跳转公司扫码入款界面
        this.props.history.push({
          pathname: '/deposit/detail',
          state: {
            bankInfo: depositMethodData,
            rechargeAmount: this.state.rechargeAmount,
            code: this.state.code,
            counterRechargeTypes: this.state.counterRechargeTypes
          }
        })
      }
    }
  }

  //提交最终的充值
  handleSubmitDeposit() {
    let state = this.state
    let curDepositMethodData = this.state.arrayList[this.state.depositMethod]
    let api = state.depositType === 'onlinePay' ? 'onlinePay' : 'scanPay'
    this.props.$service.depositOrigin()[api].post(
      state.depositType === 'onlinePay'
        ? {
          'result.rechargeAmount': state.rechargeAmount,
          'result.rechargeType': curDepositMethodData.rechargeType,
          'activityId': state.activityId,
          'account': curDepositMethodData.searchId
        }
        : {
          'result.rechargeAmount': state.rechargeAmount,
          'result.rechargeType': curDepositMethodData.rechargeType,
          'activityId': state.activityId,
          'account': curDepositMethodData.searchId,
          'Result.payerBankcard': state.payerBankcard
        }
    )
      .then(res => {
        if (res.code === '0') {
          window.location = res.data.payLink
        } else {
          failCallBack({
            code: res.code,
            message: res.message,
            history: this.props.history
          })
        }
      })
  }

  componentDidMount() {
    //当当前浏览器有缓存时直接取缓存数据，不需要额外请求数据
    sessionStorage.getItem('depositIndexData') ?
      this.setState({
        data: JSON.parse(sessionStorage.getItem('depositIndexData')),
      }, () => {
        this.handleGetChannelDetail(0)
      }) :
      this.handleGetIndexData()
  }

  render() {
    return (
      <div>
        <DepositSubmitModal
          rechargeAmount={this.state.rechargeAmount}
          counterFee={this.state.seachSale.counterFee}
          activityId={this.state.activityId}
          data={this.state.seachSale.sales}
          title='消息'
          submitText='马上存款'
          onClose={() => this.handleChangeState({
            activityId: null,
            submitDeposit: false
          })}
          onSubmit={() => this.handleSubmitDeposit()}
          onChange={(id) => {
            this.handleChangeState({
              activityId: id
            })
          }}
          visible={this.state.submitDeposit}
        />
        {/*温馨提示*/}
        {RenderPrompt()}
        {/*九宫格*/}
        {DepositMethodView(
          {
            className: 'savingGrid',
            columnNumber: 5,
            discount: '优惠',
            selectedIndex: this.state.selectedChannel,
            changeSelectedIndex: this.handleGetChannelDetail,
            data: this.state.data
          }
        )}
        <div className='saveItems'>
          {/*存款方式*/}
          {RenderDepositMethod({
            code: this.state.code,
            depositMethod: this.state.depositMethod,
            arrayList: this.state.arrayList,
            handleClick: obj => this.handleChangeState(obj)
          })}
          {/*选择金额并提交*/}
          {RenderQuickSelectMoney({
            randomAmount: this.state.randomAmount,
            code: this.state.code,
            onlineBank: this.state.onlineBank,
            depositMethod: this.state.depositMethod,
            rechargeAmount: this.state.rechargeAmount,
            data: this.state.quickMoneys,
            arrayList: this.state.arrayList,
            bankList: this.state.bankList,
            handleButtonClick: this.handleSubmitNext,
            handleClick: (value) => {
              let totalValue = this.state.rechargeAmount ? Number.parseFloat(this.state.rechargeAmount) + value : value
              if (totalValue <= this.state.arrayList[this.state.depositMethod].singleDepositMax) {
                this.handleChangeState({
                  rechargeAmount: totalValue
                })
              }
            },
            handleChangeInput: (obj) => {
              this.handleChangeState(obj)
            }
          })}
        </div>
        {/*提示*/}
        {RenderTips({
          arrayList: this.state.arrayList,
          depositMethod: this.state.depositMethod,
          randomAmount: this.state.randomAmount
        })}
      </div>
    )
  }
}

export default soulContext()(DepositPage)
