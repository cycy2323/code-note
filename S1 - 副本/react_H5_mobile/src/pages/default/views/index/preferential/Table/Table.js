import React from 'react'
import {soulContext} from 'soul'
import {Tabs} from 'antd-mobile';
import TabItem from "./TabItem/TabItem";


class Table extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      TypeList:'',
      Type:[],
      selectIndex:0,
    }
    this.$service = this.props.$service
    this.t = this.props.t
    this.history = this.props.history
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      Type: nextProps.Type
    },()=>this.askPreferList(this.state.selectIndex));
  }
  //请求优惠2级列表
  askPreferList =(index) => {
    // console.log('变化后的Type', this.state.Type);
    // 请求 找ID对应2级列表
    let TypeId=this.state.Type[index]&&this.state.Type[index].activityKey
    // （新）：优惠活动列表:/mobile-api/discountsOrigin/getActivityTypeList.html
    TypeId&&
    this.$service.discountsOrigin().getActivityTypeList.post({'search.activityClassifyKey':TypeId})
      .then(res => {
        console.log('请求列表数据',res.data)
        this.setState({TypeList:res.data.list})
      })
  }
  typeList =() => {
    console.log('渲染TypeList', this.state.TypeList);
    let arr=[];
    // 判断Typelist是否返回空
    if(this.state.TypeList.length>0){
      this.state.TypeList&&this.state.TypeList.map((item,index)=>{
          arr.push(
            <div key={index} className='listItem'>
              <div className='itemImg'>
                <img src={'http://test01.ccenter.test.so' + item.photo} alt=""/>
              </div>
              <div className='itemBottom'>
                <span className='itemText'>{item.name}</span>
                <span className='checkDetail'
                ><a href={`http://test01.ccenter.test.so${item.url}`}>查看详情</a></span>
              </div>
            </div>
          )
      })
      return arr
    }else if(Array.isArray(this.state.TypeList) && this.state.TypeList.length === 0){
      arr.push(
        <div key={'noData'} className='noData'>
          <table/>
          <div className='noDataImg'>
            <img src={require('@/assets/image/img_nodata.png')}/>
          </div>
          <div className='noDataTip'>当前没有正在进行中的活动</div>
        </div>
      )
      return arr
    }
  }
  //切换表头
  changeHeader =(TabData,index) => {
    // console.log('Type的index', index);
     this.askPreferList(index)
  }

  render() {
    const {Type} = this.props
    // console.log('Type', Type);
    return (
      <div className='commonTable'>
        <Tabs
          // initialPage={'0'}
          tabs={this.props.Type}
          tabBarActiveTextColor='black'
          tabBarInactiveTextColor='black'
          onTabClick={this.changeHeader}
          renderTabBar={
            props => {
              props.renderTab = (props) => {
                // console.log('item',props);
                return TabItem({...props})
              }
              return <Tabs.DefaultTabBar {...props} page={4}/>
            }}
        >
          {/*优惠活动随时更新,不作tabs缓存加载,切换触发请求,可能会慢*/}
          {/*{this.renderContent}*/}
        </Tabs>
        {/*tab内容列表*/}
        <div className='typeList'>
          {this.typeList()}
        </div>
      </div>
    );
  }
}

export default soulContext()(Table)
