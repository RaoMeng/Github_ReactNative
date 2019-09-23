import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  FlatList,
  RefreshControl,
  ToastAndroid,
  ActivityIndicator,
  TouchableOpacity,
  DeviceEventEmitter,
} from 'react-native';
import {
  createMaterialTopTabNavigator,
  createAppContainer,
} from 'react-navigation';
import {connect} from 'react-redux';
import NavigationUtil from '../helpers/utils/NavigationUtil';
import actions from '../redux/actions';
import TrendingItem from '../component/private/TrendingItem';
import NavigationBar from '../component/common/NavigationBar';
import TrendingDialog, {timeSpans} from '../component/private/TrendingDialog';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {concat} from 'react-native-reanimated';
import EventEmitterTypes from '../constants/EventEmitterTypes';
import FavoriteDao from '../helpers/dao/FavoriteDao';
import {FLAG_STORAGE} from '../helpers/dao/DataStore';
import FavoriteUtil from '../redux/common/FavoriteUtil';
import GlobalStyles from '../configs/GlobalStyles';
import {FLAG_LANGUAGE} from '../helpers/dao/LanguageDao';
import ArrayUtils from '../helpers/utils/ArrayUtils';

/**
 * Created by RaoMeng on 2019/9/6
 * Desc: 趋势页面
 */

const URL = 'https://github.com/trending';
const QUERY_STR = '?since=daily';
const PAGESIZE = 10;
const _favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending);

class TrendingPage extends Component {
  state = {
    timeSpan: timeSpans[0],
  };

  constructor(props) {
    super(props);
  }

  componentDidMount(): void {
    const {onLoadLanguages} = this.props;
    onLoadLanguages(FLAG_LANGUAGE.flag_language);
  }

  render() {
    const {keys, theme} = this.props;
    const TrendingTab = keys.length
      ? this.treTab === undefined ||
      !ArrayUtils.isEqual(this.prevKeys, keys) ||
      this.themeColor !== theme.themeColor
        ? (this.treTab = createAppContainer(this._getTrendingTab()))
        : this.treTab
      : null; //优化效率：根据需要选择是否重新创建导航，通常tab改变后才重新创建。
    return (
      <View style={GlobalStyles.root_container}>
        <NavigationBar
          statusBar={{
            backgroundColor: this.props.theme.themeColor,
            barStyle: 'light-content',
          }}
          titleView={this._getActionTitle()}
        />
        {TrendingTab && <TrendingTab />}
        {this._renderTrendingDialog()}
      </View>
    );
  }

  _renderTrendingDialog = () => {
    return (
      <TrendingDialog
        ref={dialog => {
          this.dialog = dialog;
        }}
        onSelect={tab => {
          this._onSelectTimeSpan(tab);
        }}
      />
    );
  };

  _onSelectTimeSpan = timeSpan => {
    DeviceEventEmitter.emit(
      EventEmitterTypes.EVENT_TRENDING_TIMESPAN_SWITCH,
      timeSpan,
    );
    this.dialog.dismiss();
    this.setState({
      timeSpan,
    });
  };

  _getActionTitle = () => {
    const {timeSpan} = this.state;
    return (
      <TouchableOpacity
        underlayColor="transparent"
        onPress={() => {
          this.dialog.show();
        }}>
        <View style={styles.actionRoot}>
          <Text
            ellipsizeMode={'head'}
            numberOfLines={1}
            style={styles.actionText}>
            趋势 {timeSpan.showText}
          </Text>
          <MaterialIcons
            name={'arrow-drop-down'}
            size={24}
            style={{color: 'white'}}
          />
        </View>
      </TouchableOpacity>
    );
  };

  _getTrendingTab = () => {
    const FINAL_TABS = {};
    const {keys, theme} = this.props;
    this.prevKeys = keys;
    this.themeColor = theme.themeColor;
    keys.forEach((item, index) => {
      if (item.checked) {
        FINAL_TABS[`T${index}`] = {
          screen: props => (
            <TrendingTabWithRedux
              {...props}
              tabBarLabel={item.name}
              timeSpan={this.state.timeSpan}
            />
          ),
          navigationOptions: {
            tabBarLabel: item.name,
          },
        };
      }
    });
    return (this.bottomNavigator = createMaterialTopTabNavigator(FINAL_TABS, {
      lazy: true, //默认值是 false。如果是true，Tab 页只会在被选中或滑动到该页时被渲染。当为 false 时，所有的 Tab 页都将直接被渲染
      initialLayout: {width: 100, height: 46}, //可选对象, 其中包含初始的 height 和 width，可以通过传递该对象，来防止 react-native-tab-view 渲染时一个帧的延迟。
      tabBarOptions: {
        tabStyle: {
          ...styles.tabStyle,
        },
        labelStyle: {
          ...styles.labelStyle,
        },
        style: {
          backgroundColor: this.themeColor,
        },
        indicatorStyle: styles.indicatorStyle,
        upperCaseLabel: false, //是否使标签大写，默认为true
        scrollEnabled: true, //是否支持选项卡滚动
      },
    }));
  };
}

const mapStateToProps = state => ({
  theme: state.theme,
  keys: state.languages.languages,
});
const mapDispatchToProps = dispatch => ({
  onLoadLanguages: flag => {
    dispatch(actions.onLoadLanguages(flag));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TrendingPage);

class TrendingTab extends Component {
  constructor(props) {
    super(props);
    this.timeSpan = props.timeSpan;
    this.loadData();
    this.isFavoriteChanged = false;
  }

  componentDidMount(): void {
    this.timeSpanSwitchListener = DeviceEventEmitter.addListener(
      EventEmitterTypes.EVENT_TRENDING_TIMESPAN_SWITCH,
      timeSpan => {
        this.timeSpan = timeSpan;
        this.loadData();
      },
    );
    this.favoriteChangeListener = DeviceEventEmitter.addListener(
      EventEmitterTypes.FAVORITE_CHANGE_TRENDING,
      () => {
        this.isFavoriteChanged = true;
      },
    );
    this.tabSwitchListener = DeviceEventEmitter.addListener(
      EventEmitterTypes.HOME_BOTTOM_TAB_SWITCH,
      params => {
        if (params.to === 1 && this.isFavoriteChanged) {
          this.loadData(false, true);
          this.isFavoriteChanged = false;
        }
      },
    );
  }

  componentWillUnmount(): void {
    this.timeSpanSwitchListener.remove();
    this.favoriteChangeListener.remove();
    this.tabSwitchListener.remove();
  }

  render() {
    let store = this._store();
    return (
      <FlatList
        data={store.projectModels}
        style={{backgroundColor: '#eee'}}
        renderItem={({item, index}) => {
          return (
            <TrendingItem
              projectModel={item}
              index={index}
              theme={this.props.theme}
              onItemClick={this._onItemClick}
              onFavorite={(item, isFavorite) => {
                FavoriteUtil.onFavorite(
                  _favoriteDao,
                  item,
                  isFavorite,
                  FLAG_STORAGE.flag_trending,
                );
              }}
            />
          );
        }}
        keyExtractor={item => '' + (item.itemData.id || item.itemData.fullName)}
        refreshControl={
          <RefreshControl
            title={store.isRefreshing ? '正在刷新...' : '下拉刷新'}
            colors={['blue']}
            tintColor={'red'}
            titleColor={'red'}
            onRefresh={this.loadData}
            refreshing={store.isRefreshing}
          />
        }
        ListFooterComponent={() => {
          return store.hideLoadingMore ? (
            store.isRefreshing || (
              <Text style={{fontSize: 16, padding: 16, textAlign: 'center'}}>
                没有更多数据
              </Text>
            )
          ) : (
            <View style={{marginVertical: 6, alignItems: 'center'}}>
              <ActivityIndicator
                size="small"
                color={this.props.theme.themeColor}
                animating={true}
              />
              <Text style={{fontSize: 14, paddingTop: 2}}>正在加载...</Text>
            </View>
          );
        }}
        onEndReachedThreshold={0.1}
        onEndReached={() => {
          if (this.isCanLoadMore) {
            this.loadData(true);
            this.isCanLoadMore = false;
          }
        }}
        onContentSizeChange={() => {
          this.isCanLoadMore = true; // flatview内部组件布局完成以后会调用这个方法
        }}
      />
    );
  }

  loadData = (loadmore, isFlushData) => {
    const {
      tabBarLabel,
      trendingRefresh,
      trendingLoadMore,
      trendingFlush,
    } = this.props;
    const url = this.genUrl(tabBarLabel);
    const store = this._store();
    if (loadmore) {
      trendingLoadMore(
        tabBarLabel,
        ++store.pageIndex,
        PAGESIZE,
        store.items,
        _favoriteDao,
        msg => {
          ToastAndroid.show(msg, ToastAndroid.SHORT);
        },
      );
    } else if (isFlushData) {
      trendingFlush(
        tabBarLabel,
        store.pageIndex,
        PAGESIZE,
        store.items,
        _favoriteDao,
      );
    } else {
      trendingRefresh(tabBarLabel, url, PAGESIZE, _favoriteDao);
    }
  };

  /**
   * item点击事件
   * @param itemData
   * @private
   */
  _onItemClick = (projectModel, callback) => {
    NavigationUtil.toPage(NavigationUtil.homeNavigation, 'detailPage', {
      projectModel,
      callback,
      flag: FLAG_STORAGE.flag_trending,
    });
  };

  /**
   * 取出当前页面相关数据
   * @private
   */
  _store = () => {
    const {trending, tabBarLabel} = this.props;
    let store = trending[tabBarLabel];
    if (!store) {
      store = {
        items: [],
        isRefreshing: false,
        projectModels: [], //要显示的数据
        hideLoadingMore: true, //默认隐藏加载更多
      };
    }
    return store;
  };

  genUrl = key => {
    return (
      URL + (key === 'All' ? '' : '/' + key) + '?' + this.timeSpan.searchText
    );
  };
}

const mapStateToTabProps = state => ({
  trending: state.trending,
  theme: state.theme,
});
const mapDispatchToTabProps = dispatch => ({
  trendingRefresh: (storeName, url, pageSize, favoriteDao) =>
    dispatch(actions.trendingRefresh(storeName, url, pageSize, favoriteDao)),
  trendingLoadMore: (
    storeName,
    pageIndex,
    pageSize,
    items,
    favoriteDao,
    callBack,
  ) =>
    dispatch(
      actions.trendingLoadMore(
        storeName,
        pageIndex,
        pageSize,
        items,
        favoriteDao,
        callBack,
      ),
    ),
  trendingFlush: (
    storeName,
    pageIndex,
    pageSize,
    dataArray = [],
    favoriteDao,
  ) =>
    dispatch(
      actions.trendingFlush(
        storeName,
        pageIndex,
        pageSize,
        dataArray,
        favoriteDao,
      ),
    ),
});

const TrendingTabWithRedux = connect(
  mapStateToTabProps,
  mapDispatchToTabProps,
)(TrendingTab);

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
  },
  tabStyle: {
    width: 120, //这里如果没有指定宽度属性，则Tab选项不会立刻显示出来
    height: 46, //这里需要固定Tab的高度，不然在开启scrollEnabled的时候，Tab会先变高，再变矮
  },
  labelStyle: {
    fontSize: 16,
  },
  indicatorStyle: {
    height: 4,
    backgroundColor: 'white',
  },
  actionRoot: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 20,
    color: 'white',
  },
});
