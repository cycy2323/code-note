import React from 'react'
import {soulContext} from 'soul'
import {Tabs} from 'antd-mobile';
import TabItem from "./TabItem/TabItem";
import TabGrid from "./Grid/TabGrid";
import NoData from 'common/components/NoData'

class Table extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      itemSelect: 0,
      arr:[],
      searchId:{},
      searchName:'',
      casinoGames:null,
      newCasinoGames:null
    }
    this.$service = this.props.$service
    this.history = this.props.history
    this.t=this.props.t
  }
  componentDidMount(){
    this.getVideoGames()
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if(nextProps.gameTypeName!==this.props.gameTypeName){
      this.setState({
        itemSelect: 0,
      },this.getVideoGames);
    }else if(nextProps.searchName!==this.props.searchName){
      this.setState({
        searchName: nextProps.searchName,
      },this.getVideoGames);
    }
  }
  searchGame = () =>{
    if(this.state.searchName!==''){
      let arr=this.state.casinoGames,newArr=[];
      arr.map((val)=>{
        if(val.name.indexOf(this.state.searchName)!==-1){
          newArr.push(val)
        }
      })
      this.setState({
        newCasinoGames:newArr
      })
    }else{
      this.setState({
        newCasinoGames:this.state.casinoGames
      })

    }
  }
  // 请求指定种类游戏
  getVideoGames = () =>{
    let param=Object.assign(
      {
      'paging.pageNumber':null,
      'paging.pageSize':'18000',
      'search.name':'',
      'tagId':this.props.arr[this.state.itemSelect].key,
      },
      this.props.searchId
    );
    this.$service.origin().getCasinoGame.get(param)
      .then(res => {
        if (parseInt(res.code) === 1001) {
          this.history.push('/login')
          return;
        }else{
          if (res.code === '0') {
            this.setState({
              ...res.data,
            },this.searchGame)
          }
        }
      })
  }

  getItem= () =>{
    if(Array.isArray(this.state.newCasinoGames)){
      return this.state.newCasinoGames.length!==0 ?
        <TabGrid gameType={this.props.arr[this.state.itemSelect].value}
                 viewType={this.props.viewType}
                 gameTypeName={this.props.gameTypeName}
                 arr={this.state.newCasinoGames}
        />:
        <NoData/>
    }
  }

  tabClick = (val,index) =>{
    this.setState({
      itemSelect: index,
      newCasinoGames:null,
    },this.getVideoGames)
  }

  render() {
    const {history, t, arr} = this.props
    return (
      <div className='video-game'>
          <Tabs
            className='tab-bar'
            initialPage={0}
            tabs={arr}
            onTabClick={this.tabClick}
            tabBarInactiveTextColor={'black'}
            renderTab={
              props => <TabItem {...props} page={6}/>
            }
            renderTabBar={
              props => {
                props.renderTab = (props) => {
                  return TabItem({...props})
                }
                return <Tabs.DefaultTabBar {...props} page={6}/>
              }}
          >
          </Tabs>
        {/*是否有数据*/}
        <div className='content'>
          {this.getItem()}
        </div>
      </div>
    );
  }
}

export default soulContext()(Table)
