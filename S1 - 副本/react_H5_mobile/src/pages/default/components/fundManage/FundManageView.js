import React from 'react'
import {soulContext} from 'soul'
import {Grid,Toast} from 'antd-mobile'


class FundManageTemplate extends React.Component {
  // constructor(props) {
  //   super(props)
  //   this.state = {
      fundAsyncStatus='资金已完成同步 2019-01-24 02:40:00'
      $service = this.props.$service
  //   }
  // }



  // 金额转千位符格式数字
  toThousands(num, status) {
    if (status) return status
    let n = '00', i, result = ''
    num = num.toString()
    if (num.indexOf('.') != -1) {
      n = num.split('.')[1]
      n = n.length == 1 ? n + '0' : n
      num = num.split('.')[0]
    }
    num = num.toString()
    while (num.length > 3) {
      result = ',' + num.slice(-3) + result
      num = num.replace(num.slice(-3), '')
    }
    result = num + result + '.' + n
    return result
  }

  render() {
    const {history, t} = this.props
    return (
      <div className='fund-manage-view'>
        <div className='fund-spread-status'>
          <div className="total-fund">
            <p>总资产</p>
            <p>{this.props.data.currency + this.toThousands(this.props.data.totalAssets)}</p>
          </div>
          <div className='saving-middle-line'></div>
          <div className='rest-fund'>
            <p>钱包余额</p>
            <p>{this.props.data.currency + this.toThousands(this.props.data.walletBalance)}</p>
          </div>
        </div>

        {/*资金同步状况*/}
        <div className='fund-async-status'>
          {this.fundAsyncStatus}
        </div>
        <Grid data={this.props.data.apis}
          columnNum={3}
          hasLine={true}
          square={false}
          activeStyle={false}
          itemStyle={{
            color: '#000',
            fontSize: 'calc(20vmin*var(--rate))',
            height: 'calc(144vmin*var(--rate))'

          }}
          renderItem={(dataItem, idx) => (

            <div className={dataItem.status === '' ? 'fund-spread-grid' : 'fund-spread-grid-lock'}>
              <div className='fund-spread-item-top'>
                <div className='item-name'>{dataItem.apiName}</div>
                <div className='item-icon' onClick={
                    ()=>{
                        if(dataItem.status){
                            Toast.info('游戏维护或暂停转账中,不能刷新')
                        }else{
                            // alert(dataItem.apiId)
                            this.props.recycleByApiId(dataItem.apiId)
                            Toast.info('正在刷新中')
                        }
                    }
                }>&nbsp;</div>
              </div>
              <div className='fund-spread-item-bottom'>
                <span className={dataItem.balance == 0 ? 'font-color-gray' : ''}>
                  {this.toThousands(dataItem.balance, dataItem.status)}
                </span>
              </div>
            </div>
          )}
        />
        <div className='no-more-content'>
          <img
            src="data:image/png;base64,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"
            alt=""/>
          <span>没有更多内容啦！</span>
        </div>

        <div className='recycle-refresh-btn-box'>
          <span className='one-key-recycle' onClick={()=>{
              // console.log('回收')
              this.props.recycleByApiId()
          }}>一键回收</span>
          <span className='one-key-refresh' onClick={()=>{
              // console.log('刷新')
              this.props.refreshAll()
          }}>一键刷新</span>
        </div>

      </div>
    )
  }
}

export default soulContext()(FundManageTemplate)
