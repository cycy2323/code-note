import React from 'react'
import {Grid} from 'antd-mobile'
import {soulContext} from 'soul'

class TabGrid extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      itemSelect:0
    }
    this.$service = this.props.$service
    this.history = this.props.history
    this.t=this.props.t
  }
  //点击Item
  linkTo = (el, index) => {
    // console.log('点击的Item',el);
    // 处理参数
    let params='',videoParams='',gameLink=el.gameLink;
    // 找html?后续的下标
    let i=gameLink.indexOf('html?')+5;
    videoParams=gameLink.slice(i)
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

    // 判断是否为电子
    if (parseInt(el.apiTypeId) === 2) {
      this.history.push({
        pathname: '/videoGamesList',
        search: videoParams,
        state:el.name,
        gameTypeIndex:index
      })
    }else {
      this.$service.origin().getGameLink.get(newparams)
        .then(res => {
          if (parseInt(res.code) === 1001) {
            this.history.push('/login')
            return;
          }else{
            //已登录
            if(res.data.gameLink){
              self.location.href= res.data.gameLink;
            }
          }
        })
        .catch(err => {
          // console.log('进入err',err)
        })
    }
  }
  render() {
    return <div className='mainGrid'>
      <Grid data={this.props.arr}
            columnNum={3}
            hasLine={false}
            onClick={this.linkTo}
            renderItem={dataItem => <div>
              <div className='itemImg'>
                <img src={'http://test01.ccenter.test.so' + dataItem.cover} alt=""/>
              </div>
              <div className='itemText'>
                <span>{dataItem.name}</span>
              </div>
            </div>
            }
      />
    </div>
  }
}
export default soulContext()(TabGrid)
