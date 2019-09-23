import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
  Clipboard,
} from 'react-native';
import {connect} from 'react-redux';
import {ABOUT_ME_MENU} from '../../configs/menu.configs';
import SettingItem from '../../component/private/SettingItem';
import ViewHelper from '../../helpers/common/ViewHelper';
import NavigationUtil from '../../helpers/utils/NavigationUtil';
import AboutCommon, {FLAG_ABOUT} from './AboutCommon';
import github_app_config from '../../configs/json/github_app_config';
import StringUtil from 'GitHubTrending/trending/StringUtil';

/**
 * Created by RaoMeng on 2019/9/6
 * Desc: 关于作者页面
 */
class AboutMePage extends Component {
  state = {
    data: github_app_config,
    menuState: ABOUT_ME_MENU,
  };

  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    this.aboutCommon = new AboutCommon(
      {
        ...this.params,
        ...props,
        flagAbout: FLAG_ABOUT.flag_about_me,
      },
      data =>
        this.setState({
          ...data,
        }),
    );
  }

  render() {
    const content = <View>{this._renderAboutItems()}</View>;
    return this.aboutCommon.render(content, this.state.data.author);
  }

  /**
   * 生成菜单列表
   * @returns {[]}
   * @private
   */
  _renderAboutItems = () => {
    const {theme} = this.props;
    const {menuState} = this.state;
    const menuItems = [];
    if (menuState) {
      if (menuState.type) {
        menuItems.push(<Text style={styles.menuType}>{menuState.type}</Text>);
      }
      if (menuState.menus && menuState.menus.length > 0) {
        menuState.menus.forEach((menuItem, index) => {
          menuItems.push(
            <SettingItem
              menuModel={menuItem}
              color={theme.themeColor}
              onMenuSelect={this._onMenuSelect.bind(this, menuItem, index)}
              expandIcon={
                menuItem.childMenus && menuItem.childMenus.length > 0
                  ? menuItem.isExpand
                  ? 'ios-arrow-up'
                  : 'ios-arrow-down'
                  : null
              }
            />,
          );
          if (
            index < menuState.menus.length - 1 ||
            (menuItem.childMenus && menuItem.isExpand)
          ) {
            menuItems.push(ViewHelper.getDividingLine());
          }
          if (menuItem.childMenus && menuItem.isExpand) {
            menuItems.push(this._renderMenuChildItems(menuItem.childMenus));
          }
        });
      }
    }
    return menuItems;
  };

  _renderMenuChildItems = childMenus => {
    const childItems = [];
    const {theme} = this.props;
    childMenus.forEach((childItem, index) => {
      childItems.push(
        <SettingItem
          menuModel={childItem}
          color={theme.themeColor}
          onMenuSelect={this._onMenuSelect.bind(this, childItem, index)}
        />,
      );
      childItems.push(ViewHelper.getDividingLine());
    });
    return childItems;
  };

  /**
   * 通用menu点击事件
   * @param menuItem
   * @private
   */
  _onMenuSelect = (menuItem, index) => {
    if (menuItem.childMenus && menuItem.childMenus.length > 0) {
      const {menuState} = this.state;
      menuState.menus[index].isExpand = !menuState.menus[index].isExpand;
      this.setState({
        menuState,
      });
    } else if (
      menuItem.name.indexOf('QQ') === 0 ||
      menuItem.name.indexOf('Email') === 0
    ) {
      const position = menuItem.name.indexOf(':');
      const result = menuItem.name.substr(position + 1);
      Clipboard.setString(result);
      ToastAndroid.show(result + '已复制到剪切板', ToastAndroid.SHORT);
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

export default connect(mapStateToProps)(AboutMePage);

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
