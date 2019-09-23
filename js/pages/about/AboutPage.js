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
import {connect} from 'react-redux';
import {ABOUT_MENU} from '../../configs/menu.configs';
import SettingItem from '../../component/private/SettingItem';
import ViewHelper from '../../helpers/common/ViewHelper';
import NavigationUtil from '../../helpers/utils/NavigationUtil';
import AboutCommon, {FLAG_ABOUT} from './AboutCommon';
import github_app_config from '../../configs/json/github_app_config';

/**
 * Created by RaoMeng on 2019/9/6
 * Desc: 相关页面
 */
class AboutPage extends Component {
  state = {
    data: github_app_config,
  };

  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    this.aboutCommon = new AboutCommon(
      {
        ...this.params,
        ...props,
        flagAbout: FLAG_ABOUT.flag_about,
      },
      data =>
        this.setState({
          ...data,
        }),
    );
  }

  render() {
    const content = <View>{this._renderAboutItems()}</View>;
    return this.aboutCommon.render(content, this.state.data.app);
  }

  /**
   * 生成菜单列表
   * @returns {[]}
   * @private
   */
  _renderAboutItems = () => {
    const {theme} = this.props;
    const menuItems = [];
    if (ABOUT_MENU) {
      if (ABOUT_MENU.type) {
        menuItems.push(<Text style={styles.menuType}>{ABOUT_MENU.type}</Text>);
      }
      if (ABOUT_MENU.menus && ABOUT_MENU.menus.length > 0) {
        ABOUT_MENU.menus.forEach((menuItem, index) => {
          menuItems.push(
            <SettingItem
              menuModel={menuItem}
              menuItem
              color={theme.themeColor}
              onMenuSelect={this._onMenuSelect.bind(this, menuItem)}
            />,
          );
          if (index < ABOUT_MENU.menus.length - 1) {
            menuItems.push(ViewHelper.getDividingLine());
          }
        });
      }
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
}

const mapStateToProps = state => ({
  theme: state.theme,
});

export default connect(mapStateToProps)(AboutPage);

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
