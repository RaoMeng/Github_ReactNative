import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  FlatList,
  RefreshControl,
  ToastAndroid,
  ActivityIndicator, DeviceEventEmitter,
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
import {FLAG_STORAGE} from '../helpers/dao/DataStore';
import FavoriteUtil from '../redux/common/FavoriteUtil';
import FavoriteDao from '../helpers/dao/FavoriteDao';
import EventEmitterTypes from '../constants/EventEmitterTypes';
import GlobalStyles from '../configs/GlobalStyles';

/**
 * Created by RaoMeng on 2019/9/6
 * Desc: 最热页面
 */

class FavoritePage extends Component {
  state = {};

  constructor(props) {
    super(props);
    this.favoriteType = [
      {
        label: '最热',
        flag: FLAG_STORAGE.flag_popular,
      },
      {
        label: '趋势',
        flag: FLAG_STORAGE.flag_trending,
      },
    ];
  }

  render() {
    const {theme} = this.props;
    const FavoriteTab =
      this.favTab === undefined || this.themeColor !== theme.themeColor
        ? (this.favTab = createAppContainer(this._getFavoriteTab()))
        : this.favTab;
    return (
      <View style={GlobalStyles.root_container}>
        <NavigationBar
          statusBar={{
            backgroundColor: this.props.theme.themeColor,
            barStyle: 'light-content',
          }}
          title={'收藏'}
        />
        <FavoriteTab />
      </View>
    );
  }

  _getFavoriteTab = () => {
    const FINAL_TABS = {};
    this.themeColor = this.props.theme.themeColor;
    this.favoriteType.forEach((item, index) => {
      FINAL_TABS[item.flag] = {
        screen: props => (
          <FavoriteTabWithRedux
            {...props}
            tabBarLabel={item.label}
            storeName={item.flag}
          />
        ),
        navigationOptions: {
          tabBarLabel: item.label,
        },
      };
    });
    return (this.bottomNavigator = createMaterialTopTabNavigator(FINAL_TABS, {
      lazy: false, //默认值是 false。如果是true，Tab 页只会在被选中或滑动到该页时被渲染。当为 false 时，所有的 Tab 页都将直接被渲染
      // initialLayout: {width: 100, height: 46}, //可选对象, 其中包含初始的 height 和 width，可以通过传递该对象，来防止 react-native-tab-view 渲染时一个帧的延迟。
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
        scrollEnabled: false, //是否支持选项卡滚动
      },
    }));
  };
}

const mapStateToProps = state => ({
  theme: state.theme,
});
const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FavoritePage);

class FavoriteTab extends Component {
  constructor(props) {
    super(props);
    this.storeName = props.storeName;
    this._favoriteDao = new FavoriteDao(this.storeName);
  }

  componentDidMount(): void {
    this.loadData();
    this.switchListener = DeviceEventEmitter.addListener(
      EventEmitterTypes.HOME_BOTTOM_TAB_SWITCH,
      params => {
        if (params.to === 2) {
          this.loadData();
        }
      },
    );
  }

  componentWillUnmount(): void {
    this.switchListener.remove();
  }

  render() {
    let store = this._store();
    return (
      <FlatList
        data={store.projectModels}
        style={{backgroundColor: '#eee'}}
        renderItem={this._renderItem}
        keyExtractor={item => '' + (item.itemData.id || item.itemData.fullName)}
        refreshControl={
          <RefreshControl
            title={store.isRefreshing ? '正在刷新...' : '下拉刷新'}
            colors={[this.props.theme.themeColor]}
            tintColor={this.props.theme.themeColor}
            titleColor={this.props.theme.themeColor}
            onRefresh={this.loadData.bind(this, true)}
            refreshing={store.isRefreshing}
          />
        }
      />
    );
  }

  _renderItem = ({item, index}) => {
    const ItemComponent =
      this.storeName === FLAG_STORAGE.flag_popular ? PopularItem : TrendingItem;
    return (
      <ItemComponent
        projectModel={item}
        index={index}
        theme={this.props.theme}
        onItemClick={this._onItemClick}
        onFavorite={this._onFavoriteClick}
      />
    );
  };

  _onFavoriteClick = (item, isFavorite) => {
    FavoriteUtil.onFavorite(
      this._favoriteDao,
      item,
      isFavorite,
      this.storeName,
    );
    if (this.storeName === FLAG_STORAGE.flag_popular) {
      DeviceEventEmitter.emit(EventEmitterTypes.FAVORITE_CHANGE_POPULAR);
    } else if (this.storeName === FLAG_STORAGE.flag_trending) {
      DeviceEventEmitter.emit(EventEmitterTypes.FAVORITE_CHANGE_TRENDING);
    }
  };

  loadData = isShowLoading => {
    const {loadFavorite} = this.props;
    loadFavorite(this.storeName, isShowLoading);
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
      flag: this.storeName,
    });
  };

  /**
   * 取出当前页面相关数据
   * @private
   */
  _store = () => {
    const {favorite} = this.props;
    let store = favorite[this.storeName];
    if (!store) {
      store = {
        isRefreshing: false,
        projectModels: [], //要显示的数据
      };
    }
    return store;
  };
}

const mapStateToTabProps = state => ({
  favorite: state.favorite,
  theme: state.theme,
});
const mapDispatchToTabProps = dispatch => ({
  loadFavorite: (flag, isShowLoading) =>
    dispatch(actions.loadFavorite(flag, isShowLoading)),
});

const FavoriteTabWithRedux = connect(
  mapStateToTabProps,
  mapDispatchToTabProps,
)(FavoriteTab);

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
  },
  tabStyle: {
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
