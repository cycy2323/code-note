import React from 'react'
import {Grid} from 'antd-mobile'
import {soulContext} from 'soul'
import AppIcon from "common/components/image/AppIcon";

class TabGrid extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
    this.$service = this.props.$service
    this.history = this.props.history
    this.t=this.props.t
  }
  //点击Item
  linkTo = (el, index) => {
    // 处理参数
    let params='',gameLink=el.gameLink;
    let i=gameLink.indexOf('html?')+5;
    params=gameLink.slice(i).split(/=|&/)
    let arr1=[],arr2=[];
    for(let a=0;a<params.length;a++){
      if(a%2===0){
        arr1.push(params[a])
      }else{
        arr2.push(params[a])
      }
    }
    let newparams={}
    for(let n=0;n<arr1.length;n++){
      newparams[arr1[n]]=arr2[n]
    }
    this.$service.origin().getGameLink.get(newparams)
      .then(res => {
        if (parseInt(res.code) === 1001) {
          this.history.push('/login')
          return;
        }else{
          if(res.data.gameLink){
            self.location.href= res.data.gameLink;
          }
        }
      })
      .catch(err => {
        // console.log('进入err',err)
      })
  }
  render() {
    return <div className='gamesGrid'>
      {this.props.viewType?
          <Grid data={this.props.arr}
                className='games-grid'
                columnNum={3}
                hasLine={false}
                onClick={this.linkTo}
                renderItem={dataItem => <div className='item-content'>
                  <img src={'http://test01.ccenter.test.so' + dataItem.cover} alt=""/>
                  <div className='itemText'>
                    {dataItem.name}
                  </div>
                </div>
                }
          />:
        <div className='games-item-list'>
          <Grid data={this.props.arr}
                columnNum={1}
                hasLine={false}
                onClick={this.linkTo}
                renderItem={dataItem => <div className='item-content'>
                  <img src={'http://test01.ccenter.test.so' + dataItem.cover} alt=""/>
                  <div className='itemText'>
                    <p className='name'>{dataItem.name}</p>
                    <p className='hot'>{this.props.gameType}</p>
                    <p className='type'>{this.props.gameTypeName}</p>
                  </div>
                  <div className='play-game'
                  >
                    {AppIcon({name: '#icon-playGame'})}
                  </div>
                </div>
                }
          />
        </div>

      }

    </div>
  }
}
export default soulContext()(TabGrid)
