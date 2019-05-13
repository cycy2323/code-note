import React from 'react'
import {soulContext} from '@soul/react/src'
import {Button, Picker, Card, Icon, InputItem, List, Flex, Toast} from 'antd-mobile'
import MainNav from 'common/components/header/MainHeader'
import {failCallBack} from 'common/tools'
import CopyText from 'common/components/CopyText'
import DepositSubmitModal from "./DepositSubmitModal";

const RenderQRcodeType = (props) => {
  return <div className='pay-type-info'>
    <div className='pay-type-method'>
      <img src={`http://test01.ccenter.test.so${props.accountImg}`} alt={props.payName}/>
      <div className='sub-title'>{props.aliasName}{CopyText(props.aliasName)}</div>
    </div>
    {/*账号信息*/}
    <List.Item>
      <Card className='wallet-info'>
        <Card.Body className='list-item'>
          <List.Item extra={CopyText(props.account)}>
            <span className='label'>账户</span>
            <span className='value'>{props.account}</span>
          </List.Item>
          <List.Item extra={CopyText(props.fullName)}>
            <span className='label'>姓名</span>
            <span className='value'>{props.fullName}</span>
          </List.Item>
        </Card.Body>
      </Card>
    </List.Item>

    {/*二维码*/}
    {
      props.qrCodeUrl
        ? <List.Item>
          <Card className='qr-code-card'>
            <Card.Header title="扫一扫付款"/>
            <Card.Body>
              <img className='qr-code-img' src={`http://test01.ccenter.test.so/${props.qrCodeUrl}`} alt=""/>
              <p className='qr-code-save'>保存到手机</p>
            </Card.Body>
          </Card>
        </List.Item>
        : null
    }


    {/*输入框部分*/}
    {props.accountInformation
      ? <InputItem
        placeholder={props.accountPrompt}
        type='number'
        style={{
          textAlign: 'right',
        }}
      >
        {props.accountInformation}
      </InputItem>
      : null
    }

    <InputItem
      placeholder='填写可提升到账速度'
      clear
      style={{textAlign: 'right'}}
    >
      订单号后五位
    </InputItem>
  </div>
}
const RenderBankType = (props) => {
  return <div className='company-pay-info'>
    {/*账户和玩家姓名*/}
    <List.Item>
      <Card className='company-bankcard'>
        <Card.Header
          thumb={`http://test01.ccenter.test.so${props.accountImg}`}
          extra='储蓄卡'
        />
        <Card.Body>
          <div className='company-bankcard-body'>
            <List.Item extra={CopyText(props.aliasName)}>
              <span className='label'>账号</span>
              <span className='value'>{props.aliasName}</span>
            </List.Item>
            <List.Item extra={CopyText(props.fullName)}>
              <span className='label'>开户名</span>
              <span className='value'>{props.fullName}</span>
            </List.Item>
            <List.Item extra={CopyText(props.openAcountName)}>
              <span className='label'>开户行</span>
              <span className='value'>{props.openAcountName}</span>
            </List.Item>
          </div>
        </Card.Body>
      </Card>
    </List.Item>

    {/*输入框部分*/}
    {
      props.code === 'counter'
        ?
        <Picker
          cols={1}
          value={props.depositType}
          onChange={v => props.handleChangeState({depositType: v})}
          onOk={v => props.handleChangeState({depositType: v})}
          extra='请选择存款渠道'
          data={props.counterRechargeTypes}>
          <List.Item arrow="horizontal">存款渠道</List.Item>
        </Picker>
        : null
    }
    <InputItem
      placeholder='请填写您的姓名'
      style={{
        textAlign: 'right',
      }}
      onChange={value => props.handleChangeState({payerName: value})}
      value={props.payerName}
    >
      存款人姓名
    </InputItem>
    {
      props.code === 'counter'
        ? <InputItem
          placeholder='请填写您的存款地址'
          clear
          style={{textAlign: 'right'}}
          onChange={value => props.handleChangeState({rechargeAddress: value})}
          value={props.rechargeAddress}
        >
          存款地址
        </InputItem>
        : null
    }
  </div>
}

class DepositDetailPage extends React.Component {
  constructor(props) {
    super(props)
    //转账方式
    this.state = {
      depositType: [],
      ... (_.get(props.location, 'state.bankInfo') || {}),
      rechargeAmount: _.get(props.location, 'state.rechargeAmount') || 0,
      seachSale: {},
      submitDeposit: false
    }
    //存款渠道
    this.code = _.get(props.location, 'state.code')
    //转账类型下拉菜单
    this.counterRechargeTypes = _.get(props.location, 'state.counterRechargeTypes')
      ? _.get(props.location, 'state.counterRechargeTypes')
        .map(item => {
          return {label: item.name, value: item.code, status: item.status}
        })
      : []
    this.handleChangeState = this.handleChangeState.bind(this)
    this.handleSubmitDeposit = this.handleSubmitDeposit.bind(this)
    this.handleGetSales = this.handleGetSales.bind(this)
  }

  handleGetSales() {
    //开启弹窗获取手续费和跳转url
    this.props.$service.depositOrigin().seachSale.post({
      'result.rechargeAmount': this.state.rechargeAmount,
      'account': this.state.searchId,
      'depositWay': this.state.depositWay,
      'result.bankOrder': this.state.bankOrder
    })
      .then(res => {
        if (res.code === '0') {
          this.setState({
            seachSale: {...res.data},
            submitDeposit: true
          })
        } else {

        }
      })
  }

  handleSubmitDeposit() {
    let state = this.state
    let requestUrl = this.code === 'company' || this.code === 'counter' ? 'companyPay' : 'electronicPay'
    let params = requestUrl === 'companyPay'
      ? {
        'result.rechargeAmount': state.rechargeAmount,// 存款金额	result.rechargeAmount	double	是----
        'result.rechargeType': this.code,// 充值类型	result.rechargeType	string	是
        'result.payerName': state.payerName,// 存款人姓名	result.payerName
        'result.rechargeAddress': state.rechargeAddress,// 存款地址	result.rechargeAddress string	否（柜员机存款必填）
        'activityId': state.activityId,// 优惠id	activityId	int	否
        'account': state.searchId// 存款渠道(searchId)	account	string	是
      }
      : {
        'result.rechargeAmount': state.rechargeAmount,// 存款金额	result.rechargeAmount	double	是----
        'result.rechargeType': this.code,// 充值类型	result.rechargeType	string	是
        'result.payerName': this.code === 'alipay' ? state.payerName : null,// 支付户名(只针对支付宝电子支付)	result.payerName
        'activityId': state.activityId,// 优惠id	activityId	int	否
        'account': state.searchId,// 存款渠道(searchId)	account	string	是
        'result.bankOrder': state.bankOrder,// 订单号后５位	result.bankOrder	int	否
        'result.payerBankcard': state.payerBankCard// 支付账号	result.payerBankcard string	是
      }
    this.props.$service.depositOrigin()[requestUrl].post(params)
      .then(res => {
        if (res.code === '0') {
          this.setState({
            submitDeposit: false
          })
        } else {
          failCallBack({
            message: res.message,
            code: res.code,
            history: this.props.history
          })
        }
      })
  }

  //修改state
  handleChangeState(obj) {
    this.setState({...obj})
  }

  componentDidMount() {
  }

  render() {
    const {history, t} = this.props
    return (
      <div>
        <MainNav
          leftEvent={() => {
            sessionStorage.setItem('indexSelectTab', 'saving')
            history.push({
              pathname: '/index'
            })
          }}
          leftContent={<Icon type='left' size='lg'/>}
          title='存款'
          className="com-header-nav"
        />
        <DepositSubmitModal
          rechargeAmount={this.state.rechargeAmount}
          counterFee={this.state.seachSale.counterFee}
          activityId={this.state.activityId}
          data={this.state.seachSale.sales}
          title='消息'
          submitText='保存'
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
        <List className='pay-container'>
          {/*账号信息*/}
          <List.Item className='title'>账号信息</List.Item>
          {this.code === 'company' || this.code === 'counter'
            ? RenderBankType({
              ...this.state,
              handleChangeState: this.handleChangeState,
              counterRechargeTypes: this.counterRechargeTypes,
              code: this.code
            })
            : RenderQRcodeType({
              ...this.state
            })
          }
          {/*按钮*/}
          <List.Item className='button'>
            <Button
              activeStyle={false}
              className="default"
              onClick={this.handleGetSales}
            >
              提交
            </Button>
          </List.Item>

          {/*提示*/}
          <div className='com-page-end-description'>
            <h4>温馨提示</h4>
            <p>*存款金额请加以小数点或尾数，以便区别。如充值200元，请
              输入201元或200.1之类小数。</p>
            <p>*如有任何疑问，请联系在线客服获取帮助。<a className='link' href='#'>点击联系客服</a></p>
          </div>
        </List>
      </div>
    )
  }
}

export default soulContext()(DepositDetailPage)
