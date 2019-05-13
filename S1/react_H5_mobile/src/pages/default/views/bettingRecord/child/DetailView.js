/*
*
* 描述：记录详情展示
* @author lee
* @create 2019-02-04 11:53 AM
*/
import React from 'react'
import {Card, Icon, List, Toast} from 'antd-mobile'
import MainNav from 'common/components/header/MainHeader'
import {soulContext} from 'soul'
import {getLocationParams} from "common/tools";
import AppIcon from 'common/components/image/AppIcon';

let currency = sessionStorage.getItem('currency') || ''
//相关信息展示
let renderHeader = (props) => {
  return (
    <List>
      <List.Item
        className='com-list'
        extra={props.betId}
      >
        {props.t('view.local.betting.detail.betId')}
      </List.Item>
      <List.Item
        className='com-list'
        extra={props.gameType}
      >
        {props.t('view.local.betting.detail.gameType')}

      </List.Item>
      <List.Item
        className='com-list'
        error={!props.betTime}
        extra={props.betTime ? moment(props.betTime).format('YYYY-MM-DD HH:mm:ss') : '--'}
      >
        {props.t('view.local.betting.detail.betTime')}
      </List.Item>
      <List.Item
        className='com-list'
        error={props.effectiveTradeAmount !== Number.parseFloat(props.effectiveTradeAmount)}
        extra={currency + (props.effectiveTradeAmount === Number.parseFloat(props.effectiveTradeAmount) ? props.effectiveTradeAmount.toFixed(2) : '--')}
      >
        {props.t('view.local.betting.detail.effectiveTradeAmount')}
      </List.Item>
      <List.Item
        className='com-list'
        error={!props.payoutTime}
        extra={props.payoutTime ? moment(props.payoutTime).format('YYYY-MM-DD hh:mm:ss') : '--'}
      >
        {props.t('view.local.betting.detail.payoutTime')}
      </List.Item>
      <List.Item
        className='com-list'
        error={props.profitAmount !== Number.parseFloat(props.profitAmount)}
        extra={currency + (props.profitAmount === Number.parseFloat(props.profitAmount) ? props.profitAmount.toFixed(2) : '--')}
      >
        {props.t('view.local.betting.detail.profitAmount')}
      </List.Item>
      <List.Item
        className='com-list'
        error={props.contributionAmount !== Number.parseFloat(props.contributionAmount)}
        extra={currency + (props.contributionAmount === Number.parseFloat(props.contributionAmount) ? props.contributionAmount.toFixed(2) : '--')}
      >
        {props.t('view.local.betting.detail.contributionAmount')}
      </List.Item>
    </List>
  )
}
renderHeader.defaultProps = {
  betId: '',
  gameType: '',
  betTime: '',
  effectiveTradeAmount: '',
  payoutTime: '',
  profitAmount: '',
  contributionAmount: ''
};
//生成结果图片
let renderPocketImage = (array) => {
  return array.map(item => {
    return (AppIcon({name: '#icon-' + item, key: item}))
  })
}
//相关记录展示
//TODO 根据不同的结果进行渲染
let renderFooter = (props) => {
  return (
    <div>
      <p className='subtitle'>{props.t('view.local.betting.detail.subtitle')}</p>
      <Card className='game-record'>
        <span className='sub-title'>玩法（彩种）</span>
        <span className='sub-content'>{_.get(props, 'resultVo.tableInfo')}待定</span>
      </Card>
      <Card className='game-record'>
        <span className='sub-title'>场次（期号）</span>
        <span className='sub-content'>{_.get(props, 'resultVo.tableInfo')}</span>
      </Card>
      <Card className='game-record game-record-result'>
        <span className='sub-title'>游戏详情</span>
        <div className='sub-content'>
          <div className='sub-content-item'>
            <div>
              <span>庄：</span>
            </div>
            {(_.get(props, 'resultVo.porkerList') || []).length > 0 ?
              <div>({renderPocketImage(_.get(props, 'resultVo.porkerList'))})</div> : null}
          </div>
          {_.get(props, 'resultVo.porkerListSet') ? _.get(props, 'resultVo.porkerListSet').map((item, index) => {
              let node = renderPocketImage(item)
              return (
                <div
                  className='sub-content-item'
                  key={index}>
                  <div>
                    <span>座位{index + 1}:</span>
                  </div>
                  <div>
                    ({node})
                  </div>
                </div>
              )
            }
          ) : ''}
        </div>
      </Card>
    </div>
  )
}

@soulContext()
class DetailView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {}
    }
  }

  handleGetDetail(params) {
    this.props.$service.mineOrigin().getBettingDetails.post(params)
      .then(res => {
        if (res.code === '0') {
          this.setState({
            data: res.data.result
          })
        } else {
          Toast.fail(res.message)
        }
      })
  }

  componentDidMount() {
    this.handleGetDetail(getLocationParams())
  }


  render() {
    const {t, history} = this.props
    const data = this.state.data
    return <div className='com-detail-view detail-view'>
      {MainNav({
        leftContent: <Icon type='left'/>,
        leftEvent: () => {
          history.push({
            pathname: '/fund/betting',
            state: history.location.state
          })
        },
        title: t('view.local.betting.detail.title'),
        className: 'com-header-nav'
      })}
      <div className='betting-page-content'>
        {renderHeader({
          t,
          ...data
        })}
        {renderFooter({
          t,
          ...data
        })}
      </div>
    </div>
  }
}

export default DetailView
