/*
*
* 描述： 下拉刷新，上拉翻页
* @author lee
* @create 2019-03-05 10:29 AM
*/
import React from 'react'
import ReactDOM from "react-dom";
import {PullToRefresh, ListView} from 'antd-mobile';

class ComListView extends React.Component {
  // onRefresh = () => {
  //   this.setState({refreshing: true, isLoading: true});
  //   // simulate initial Ajax
  //   setTimeout(() => {
  //     this.rData = genData();
  //     this.setState({
  //       dataSource: this.state.dataSource.cloneWithRows(this.rData),
  //       refreshing: false,
  //       isLoading: false,
  //     });
  //   }, 600);
  // };

  // If you use redux, the data maybe at props, you need use `componentWillReceiveProps`
  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.dataSource !== this.props.dataSource) {
  //     this.setState({
  //       dataSource: this.state.dataSource.cloneWithRows(nextProps.dataSource),
  //     });
  //   }
  // }
  onEndReached = (event) => {
    console.log('reach end', event);
    this.setState({isLoading: true});
    if (this.props.currentPage * this.props.pageSize < this.props.maxPageSize) {
      this.props.handleGetMoreData({
          pageNumber: this.props.currentPage + 1
        }
      )
    } else {
      this.setState({
        hasMore: false
      })
    }

  };

  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });

    this.state = {
      dataSource,
      data: undefined,
      refreshing: true,
      isLoading: true,
      height: document.documentElement.clientHeight,
      useBodyScroll: false,
      hasMore: true
    };
  }

  componentDidMount() {
    const hei = this.state.height - ReactDOM.findDOMNode(this.lv).offsetTop;
    console.log(this.props.data)
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.props.data || []),
      data: this.props.data,
      height: hei,
      refreshing: false,
      isLoading: false,
    });
  }

  render() {
    const data = this.props.data || []
    if (this.state.data) {
      let _data = this.state.data.concat(this.props.data)
      console.log(this.state.data.length, this.props.currentPage, this.props.pageSize)
      if (this.state.data.length < this.props.currentPage * this.props.pageSize) {
        console.log(this.state.data.concat(this.props.data))
        this.setState({
          data: this.state.data.concat(this.props.data),
          dataSource: this.state.dataSource.cloneWithRows(this.state.data.concat(this.props.data)),
          isLoading: false,
        });
      }
    }
    const row = (rowData, sectionID, rowID) => {
      return (
        this.props.rowDom(rowData)
      )
    };
    return (
      <ListView
        initialListSize={this.props.initialListSize || 20}
        ref={el => this.lv = el}
        dataSource={this.state.dataSource}
        renderHeader={this.props.renderHeader}
        renderFooter={() => (this.props.data ? <div style={{padding: 30, textAlign: 'center'}}>
          {this.state.isLoading ? 'Loading...' : ''}
        </div> : null)}
        renderRow={row}
        renderSeparator={this.props.renderSeparator}
        useBodyScroll={this.state.useBodyScroll}
        className={this.props.className}
        pullToRefresh={
          <PullToRefresh
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
            damping={100}
            direction={'down'}
            distanceToRefresh={25}
          />}
        onEndReached={this.onEndReached}
        pageSize={5}
      />)
  }
}

export default ComListView
