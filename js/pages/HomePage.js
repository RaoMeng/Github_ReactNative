import React, {Component} from 'react';
import {StyleSheet, View, Text, BackHandler, DeviceEventEmitter} from 'react-native';
import {createAppContainer} from 'react-navigation';
import NavigationUtil from '../helpers/utils/NavigationUtil';
import HOME_BOTTOM_TABS from '../configs/home_bottom_tabs';
import TabBarBottom from '../component/common/TabBarBottom';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {NavigationActions} from 'react-navigation';
import {connect} from 'react-redux';
import BackPressHelper from '../helpers/common/BackPressHelper';
import EventEmitterTypes from '../constants/EventEmitterTypes';
import CustomThemeDialog from '../component/private/CustomThemeDialog';
import GlobalStyles from '../configs/GlobalStyles';
import actions from '../redux/actions';

/**
 * Created by RaoMeng on 2019/9/6
 * Desc: 首页
 */

class HomePage extends Component {
  state = {};

  constructor(props): void {
    super(props);
    this.backPressHelper = new BackPressHelper({backPress: this.onBackPress});
  }

  componentDidMount(): void {
    this.backPressHelper.componentDidMount();
  }

  componentWillUnmount(): void {
    this.backPressHelper.componentWillUnmount();
  }

  render() {
    const {customThemeViewVisible, showCustomThemeView} = this.props;
    NavigationUtil.homeNavigation = this.props.navigation;
    //禁止从其他页面返回到主页面时，主页面频繁刷新的问题
    const TabNav =
      this.bottomNav ||
      (this.bottomNav = createAppContainer(this._getTabNavigator()));
    return (
      <View style={GlobalStyles.root_container}>
        <TabNav
          onNavigationStateChange={(prevState, newState, action) => {
            DeviceEventEmitter.emit(EventEmitterTypes.HOME_BOTTOM_TAB_SWITCH, {
              from: prevState.index,
              to: newState.index,
            });
          }}
        />
        <CustomThemeDialog
          visible={customThemeViewVisible}
          {...this.props}
          onClose={() => showCustomThemeView(false)}
        />
      </View>
    );
  }

  _getTabNavigator = () => {
    const {
      popularPage,
      trendingPage,
      favoritePage,
      minePage,
    } = HOME_BOTTOM_TABS;

    const FINAL_TABS = {popularPage, trendingPage, favoritePage, minePage};
    popularPage.navigationOptions.tabBarLabel = '最热'; //动态配置tab属性
    return createBottomTabNavigator(FINAL_TABS, {
      tabBarComponent: TabBarBottom,
    });
  };

  onBackPress = () => {
    const {dispatch, nav} = this.props;
    if (nav.routes[1].index == 0) {
      // 如果AppNavigator中的mainNavigator的index为0，则不处理事件
      return false;
    }
    dispatch(NavigationActions.back());
    return true;
  };
}

const mapStateToProps = state => ({
  nav: state.nav,
  theme: state.theme,
  customThemeViewVisible: state.theme.customThemeViewVisible,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  showCustomThemeView: show => {
    dispatch(actions.showCustomThemeView(show));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomePage);
