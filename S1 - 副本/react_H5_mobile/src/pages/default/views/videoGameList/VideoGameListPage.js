/*
* 电子游戏列表
* @author lemon
*/
import React from 'react'
import {soulContext} from 'soul'
import {Icon,SearchBar, PullToRefresh, Toast,NavBar} from 'antd-mobile'
import Table from "./Table/Table";
import NoData from 'common/components/NoData'
import {getLocationParams} from "common/tools";
import GameTypeView from "./GameType/GameTypeView";

class VideoGameListPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      gameTypeShow:false,
      data:null,
      viewType:true,
      gameSearchStatus:false,
      searchName:'',
      selectedVal:'',//选中的游戏类型数据
      gameType:[],
    }
    this.$service = this.props.$service
    this.history = this.props.history
    this.t=this.props.t
  }

  handleGetData=()=> {
    this.$service.origin().getGameTag.get({
      ...getLocationParams()
    })
      .then(res => {
        if (parseInt(res.code) === 1001) {
          this.history.push('/login')
          return;
        }else{
          if (res.code === '0') {
            this.setState({
              ...res,
              searchIds:{...getLocationParams()}
            })
          }
        }
      })
  //获取电子游戏类型数据
    this.$service.origin().mainIndex.get()
      .then(res => {
        res.data.siteApiRelation.map((val) => {
          if(val.apiType===2){
            this.setState({
              gameType: val.siteApis,
            })
          }
        })
      })
  }

  //请求列表:电子类型更换时
  gameTypeChange=()=> {
    let params={
      'search.apiId':this.state.selectedVal.apiId.toString(),
      'search.apiTypeId':this.state.selectedVal.apiTypeId.toString(),
    }
    this.$service.origin().getGameTag.get(params).then(res => {
      if (parseInt(res.code) === 1001) {
        this.history.push('/login')
        return;
      }else{
        if (res.code === '0') {
          this.setState({
            ...res,
            searchIds:params
          })
        }
      }
    })
  }

  componentDidMount() {
    this.handleGetData();
  }
  handleSearch= ()=>{
    this.setState({
      gameSearchStatus:!this.state.gameSearchStatus
    })
  }
  viewType= (bool) =>{
    this.setState({viewType:bool})
  }
  getTab = () =>{
    if(Array.isArray(this.state.data)){
      // console.log('所有电子游戏类型gameType', this.props.location.gameType);
      return this.state.data.length!==0?
        <Table gameTypeName={this.props.location.state}
               searchName={this.state.searchName}
               className='game-tabs'
               viewType={this.state.viewType}
               searchId={this.state.searchIds}
               arr={this.state.data}
        />:
        <div className='noTabData'>
          <NoData/>
        </div>
    }
  }
  changeSearchName = (val) =>{
    this.setState({
      searchName: val,
    })
  }

  SearchGo = () =>{
    this.setState({
      gameSearchStatus: false,
    })
  }
  cancelSearch = () =>{
    this.setState({
      searchName:'',
      gameSearchStatus: false,
    })
  }
  //显示电子类型
  showTabBar = () =>{
    this.setState({
      gameTypeShow:true,
    })
  }
  //选中电子类型
  gameTypeClik  = (selectedVal) =>{
    // console.log('选中的游戏类型数据', selectedVal);
    this.setState({
      selectedVal:selectedVal,
      data:'' //迫使2级tab重新挂载,选择项初始化
    },this.gameTypeChange)
  }

  render() {
    // console.log('渲染页面');
    const {t,history} = this.props
    return <div className='video-game-list-page'>
      <NavBar
        className='com-header-nav'
        leftContent={<Icon type="left" size='md'/>}
        rightContent={<div>
          <Icon type="search" size='md'
                onClick={this.handleSearch}/>
          <Icon type="search" size='md'
                onClick={() => {this.viewType(false)}}/>
          <Icon type="search" size='md'
                onClick={() => {this.viewType(true)}}/>
        </div>}
        onLeftClick={() => {
          history.go(-1)
        }}
      />
      {/*搜索弹框*/}
      <div className={this.state.gameSearchStatus?'gameSearchOn':'gameSearchOff'}>
        <div className='search-name-content' >
          <div className='back-cover' onClick={this.cancelSearch}/>
          <SearchBar
            placeholder="输入游戏名称"
            value={this.state.searchName}
            onChange={this.changeSearchName}
            onCancel={this.SearchGo}
            showCancelButton={true}
            cancelText='搜索'
          />
        </div>
      </div>
      <PullToRefresh
        className='game-tab-content'
        direction='down'
        refreshing={false}
        damping={100}
        onRefresh={this.showTabBar}
        distanceToRefresh={60}>
          {/*游戏类型**/}
          <div className='hidden-gameType-tabBar'>
            <div className={this.state.gameTypeShow?'game-type-show':'game-type-hide'}>
              <GameTypeView  data={this.state.gameType}
                             tabClik={this.gameTypeClik}
                             gameTypeSelectIndex={this.props.location.gameTypeIndex}
              />
            </div>
          </div>
          {/*列表*/}
          {
            this.getTab()
          }
      </PullToRefresh>
    </div>
  }
}

export default soulContext()(VideoGameListPage)
