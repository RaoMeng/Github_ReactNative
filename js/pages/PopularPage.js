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
  DeviceEventEmitter,
  TouchableOpacity,
} from 'react-native';
import {
  createMaterialTopTabNavigator,
  createAppContainer,
} from 'react-navigation';
import {connect} from 'react-redux';
import NavigationUtil from '../helpers/utils/NavigationUtil';
import actions from '../redux/actions';
import PopularItem from '../component/private/PopularItem';
import NavigationBar from '../component/common/NavigationBar';
import TrendingItem from '../component/private/TrendingItem';
import FavoriteDao from '../helpers/dao/FavoriteDao';
import {FLAG_STORAGE} from '../helpers/dao/DataStore';
import FavoriteUtil from '../redux/common/FavoriteUtil';
import EventEmitterTypes from '../constants/EventEmitterTypes';
import {popularFlush} from '../redux/actions/popular';
import GlobalStyles from '../configs/GlobalStyles';
import keys from '../configs/json/keys';
import {FLAG_LANGUAGE} from '../helpers/dao/LanguageDao';
import ArrayUtils from '../helpers/utils/ArrayUtils';
import Feather from 'react-native-vector-icons/Feather';
import ToastExample from '../native/ToastExample';

/**
 * Created by RaoMeng on 2019/9/6
 * Desc: 最热页面
 */

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const PAGESIZE = 10;
const _favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);

class PopularPage extends Component {
  state = {};

  constructor(props) {
    super(props);
  }

  componentDidMount(): void {
    this.nativeToastListener = DeviceEventEmitter.addListener(
      'toast_event',
      this._testNativeMethod,
    );
    const {onLoadLanguages} = this.props;
    onLoadLanguages(FLAG_LANGUAGE.flag_key);
  }

  componentWillUnmount(): void {
    this.nativeToastListener.remove();
  }

  render() {
    const {keys, theme} = this.props;
    const PopularTab = keys.length
      ? this.popTab === undefined ||
      !ArrayUtils.isEqual(this.prevKeys, keys) ||
      this.themeColor !== theme.themeColor
        ? (this.popTab = createAppContainer(this._getPopularTab()))
        : this.popTab
      : null;
    return (
      <View style={GlobalStyles.root_container}>
        <NavigationBar
          statusBar={{
            backgroundColor: this.props.theme.themeColor,
            barStyle: 'light-content',
          }}
          title={'最热'}
          rightButton={this._renderRightButton()}
        />
        {PopularTab && (
          <PopularTab
            navigationOptions={{
              tarBarOptions: {
                style: {
                  backgroundColor: this.props.theme.themeColor,
                },
              },
            }}
            onNavigationStateChange={(prevState, newState, action) => {
              console.log('raomeng', newState);
            }}
          />
        )}
      </View>
    );
  }

  _renderRightButton = () => (
    <TouchableOpacity onPress={this._searchPopular}>
      <Feather name={'search'} size={20} style={{color: 'white'}} />
    </TouchableOpacity>
  );

  _searchPopular = () => {
    ToastExample.show(
      '搜索',
      this.toastDuration == undefined
        ? (this.toastDuration = ToastExample.LONG)
        : this.toastDuration,
    )
      .then(response => {
        console.log('raomeng', response);
        this.toastDuration = ToastExample.LONG;
      })
      .catch(error => {
        console.log('raomeng', error.code + '=>' + error.message);
        this.toastDuration = ToastExample.SHORT;
      });
  };

  /**
   * 原生方法的发送事件
   * @private
   */
  _testNativeMethod = params => {
    if (params) {
      if (params.key === 'SHORT') {
        NavigationUtil.toPage(NavigationUtil.popNavigation, 'P0');
      } else if (params.key === 'LONG') {
        NavigationUtil.toPage(NavigationUtil.popNavigation, 'P2');
      }
    }
  };

  /**
   * 生成头部Tab
   * @returns {any}
   * @private
   */
  _getPopularTab = () => {
    const FINAL_TABS = {};
    const popularLanguages = this.props.keys;
    this.prevKeys = popularLanguages;
    this.themeColor = this.props.theme.themeColor;
    popularLanguages.forEach((item, index) => {
      if (item.checked) {
        FINAL_TABS[`P${index}`] = {
          screen: props => (
            <PopularTabWithRedux
              {...props}
              tabBarLabel={item.name}
              theme={this.props.theme}
            />
          ),
          navigationOptions: {
            tabBarLabel: item.name,
          },
        };
      }
    });
    return popularLanguages.length
      ? createMaterialTopTabNavigator(FINAL_TABS,
        {
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
        })
      : null;
  };
}

const mapStateToProps = state => ({
  theme: state.theme,
  keys: state.languages.keys,
});
const mapDispatchToProps = dispatch => ({
  onLoadLanguages: flag => {
    dispatch(actions.onLoadLanguages(flag));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PopularPage);

class PopularTab extends Component {
  constructor(props) {
    super(props);
    NavigationUtil.popNavigation = props.navigation;
    this.loadData();
    this.isFavoriteChanged = false;
  }

  componentDidMount(): void {
    this.favoriteChangeListener = DeviceEventEmitter.addListener(
      EventEmitterTypes.FAVORITE_CHANGE_POPULAR,
      () => {
        this.isFavoriteChanged = true;
      },
    );
    this.tabSwitchListener = DeviceEventEmitter.addListener(
      EventEmitterTypes.HOME_BOTTOM_TAB_SWITCH,
      params => {
        if (params.to === 0 && this.isFavoriteChanged) {
          this.loadData(false, true);
          this.isFavoriteChanged = false;
        }
      },
    );
  }

  componentWillUnmount(): void {
    this.favoriteChangeListener.remove();
    this.tabSwitchListener.remove();
  }

  render() {
    let store = this._store();
    return (
      <FlatList
        data={store.projectModels}
        style={{backgroundColor: '#eee'}}
        renderItem={this._renderPopularItem}
        keyExtractor={item => '' + item.itemData.id}
        refreshControl={
          <RefreshControl
            title={store.isRefreshing ? '正在刷新...' : '下拉刷新'}
            colors={[this.props.theme.themeColor]}
            tintColor={this.props.theme.themeColor}
            titleColor={this.props.theme.themeColor}
            onRefresh={this.loadData}
            refreshing={store.isRefreshing}
          />
        }
        ListFooterComponent={this._renderFooter.bind(this, store)}
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

  _renderFooter = store => {
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
  };

  _renderPopularItem = ({item, index}) => {
    return (
      <PopularItem
        projectModel={item}
        index={index}
        theme={this.props.theme}
        onItemClick={this._onItemClick}
        onFavorite={(item, isFavorite) => {
          FavoriteUtil.onFavorite(
            _favoriteDao,
            item,
            isFavorite,
            FLAG_STORAGE.flag_popular,
          );
        }}
      />
    );
  };

  loadData = (loadmore, isFlushData) => {
    const {
      tabBarLabel,
      popularRefresh,
      popularLoadMore,
      popularFlush,
    } = this.props;
    const url = this.genUrl(tabBarLabel);
    const store = this._store();
    if (loadmore) {
      popularLoadMore(
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
      popularFlush(
        tabBarLabel,
        store.pageIndex,
        PAGESIZE,
        store.items,
        _favoriteDao,
      );
    } else {
      popularRefresh(tabBarLabel, url, PAGESIZE, _favoriteDao);
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
      flag: FLAG_STORAGE.flag_popular,
    });
  };

  /**
   * 取出当前页面相关数据
   * @private
   */
  _store = () => {
    const {popular, tabBarLabel} = this.props;
    let store = popular[tabBarLabel];
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
    return URL + key + QUERY_STR;
  };
}

const mapStateToTabProps = state => ({
  popular: state.popular,
  theme: state.theme,
});
const mapDispatchToTabProps = dispatch => ({
  popularRefresh: (storeName, url, pageSize, favoriteDao) =>
    dispatch(actions.popularRefresh(storeName, url, pageSize, favoriteDao)),
  popularLoadMore: (
    storeName,
    pageIndex,
    pageSize,
    items,
    favoriteDao,
    callBack,
  ) =>
    dispatch(
      actions.popularLoadMore(
        storeName,
        pageIndex,
        pageSize,
        items,
        favoriteDao,
        callBack,
      ),
    ),
  popularFlush: (storeName, pageIndex, pageSize, dataArray = [], favoriteDao) =>
    dispatch(
      actions.popularFlush(
        storeName,
        pageIndex,
        pageSize,
        dataArray,
        favoriteDao,
      ),
    ),
});

const PopularTabWithRedux = connect(
  mapStateToTabProps,
  mapDispatchToTabProps,
)(PopularTab);

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
  },
  tabStyle: {
    width: 100, //这里如果没有指定宽度属性，则Tab选项不会立刻显示出来
    height: 46, //这里需要固定Tab的高度，不然在开启scrollEnabled的时候，Tab会先变高，再变矮
  },
  labelStyle: {
    fontSize: 16,
  },
  indicatorStyle: {
    height: 4,
    backgroundColor: 'white',
  },
});
