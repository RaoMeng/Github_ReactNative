/**
 * Created by RaoMeng on 2019/9/9
 * Desc: 自定义底部TabBar
 */

import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {BottomTabBar} from 'react-navigation-tabs';
import {connect} from 'react-redux';

class TabBarBottom extends Component {
  constructor(props) {
    super(props);
    // this.theme = {
    //   tintColor: props.activeTintColor,
    //   updateTime: new Date().getTime(),
    // };
  }

  componentDidMount(): void {
  }

  render() {
    /*const {routes, index} = this.props.navigation.state;
    //这里要取当前切换到的tab页params
    if (routes && routes[index] && routes[index].params) {
      const {theme} = routes[index].params;
      //以最新的更新时间为主，防止被其他tab之前的修改覆盖掉
      if (theme && theme.updateTime > this.theme.updateTime) {
        this.theme = theme;
      }
    }*/
    return (
      <BottomTabBar
        {...this.props}
        activeTintColor={this.props.theme.themeColor}
      />
    );
  }
}

let mapStateToProps = state => ({
  theme: state.theme,
});
let mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TabBarBottom);

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
  },
});
