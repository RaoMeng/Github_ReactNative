import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
  Linking,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavigationBar from '../component/common/NavigationBar';
import {MINE_MENU} from '../configs/menu.configs';
import SettingItem from '../component/private/SettingItem';
import {connect} from 'react-redux';
import GlobalStyles from '../configs/GlobalStyles';
import ViewHelper from '../helpers/common/ViewHelper';
import NavigationUtil from '../helpers/utils/NavigationUtil';
import actions from '../redux/actions';

/**
 * Created by RaoMeng on 2019/9/6
 * Desc: 我的页面
 */
class MinePage extends Component {
  state = {};

  componentDidMount(): void {
  }

  render() {
    return (
      <View style={GlobalStyles.root_container}>
        {this.initNavBar()}
        <ScrollView alwaysBounceVertical>
          {this._renderMineHeader()}
          {ViewHelper.getDividingLine()}
          {this._renderMenuItems()}
          <View style={{height: 50}} />
        </ScrollView>
      </View>
    );
  }

  /**
   * 生成我的页面顶部
   * @private
   */
  _renderMineHeader = () => {
    return (
      <TouchableOpacity
        style={styles.headerRoot}
        onPress={this._onMenuSelect.bind(this, {
          page: 'aboutPage',
        })}>
        <Fontisto
          name={'github'}
          size={40}
          style={{color: this.props.theme.themeColor}}
        />
        <Text style={styles.headerText}>RaoMeng</Text>
        <Ionicons
          name={'ios-arrow-forward'}
          size={16}
          style={{alignSelf: 'center', color: this.props.theme.themeColor}}
        />
      </TouchableOpacity>
    );
  };

  /**
   * 生成菜单列表
   * @returns {[]}
   * @private
   */
  _renderMenuItems = () => {
    const {theme} = this.props;
    const menuItems = [];
    if (MINE_MENU) {
      MINE_MENU.forEach((menuParent, index) => {
        if (!menuParent) {
          return true;
        }
        if (menuParent.type) {
          menuItems.push(
            <Text style={styles.menuType}>{menuParent.type}</Text>,
          );
        }
        if (menuParent.menus && menuParent.menus.length > 0) {
          menuParent.menus.forEach((menuItem, index) => {
            menuItems.push(
              <SettingItem
                menuModel={menuItem}
                menuItem
                color={theme.themeColor}
                onMenuSelect={this._onMenuSelect.bind(this, menuItem)}
              />,
            );
            if (index < menuParent.menus.length - 1) {
              menuItems.push(ViewHelper.getDividingLine());
            }
          });
        }
      });
    }
    return menuItems;
  };

  /**
   * 通用menu点击事件
   * @param menuItem
   * @private
   */
  _onMenuSelect = menuItem => {
    if (menuItem.name === '反馈') {
      const url = 'mailto://raomeng0109@163.com';
      Linking.canOpenURL(url)
        .then(suppport => {
          if (!suppport) {
            ToastAndroid.show('当前设备未安装邮箱应用！');
          } else {
            Linking.openURL(url);
          }
        })
        .catch(error => {
          ToastAndroid.show(error, ToastAndroid.SHORT);
        });
    } else if (menuItem.name === '自定义主题') {
      this.props.showCustomThemeView(true);
    } else if (menuItem.page) {
      NavigationUtil.toPage(
        NavigationUtil.homeNavigation,
        menuItem.page,
        menuItem.params,
      );
    } else {
      ToastAndroid.show('点击了' + menuItem.name, ToastAndroid.SHORT);
    }
  };

  initNavBar = () => {
    return (
      <NavigationBar
        title={'我的'}
        // leftButton={<View></View>}
        // rightButton={this._getRightButton()}
      />
    );
  };

  _getRightButton = () => {
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity onPress={() => {
        }}>
          <Feather name={'search'} size={20} style={{color: 'white'}} />
        </TouchableOpacity>
      </View>
    );
  };
}

const mapStateToProps = state => ({
  theme: state.theme,
});

const mapDispatchToProps = dispatch => ({
  showCustomThemeView: show => {
    dispatch(actions.showCustomThemeView(show));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MinePage);

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  menuType: {
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    color: '#333',
  },
  headerRoot: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    height: 80,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  headerText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingHorizontal: 10,
  },
});
