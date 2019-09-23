import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ViewPropTypes,
  StatusBar,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import GlobalStyles from '../../configs/GlobalStyles';

/**
 * Created by RaoMeng on 2019/9/11
 * Desc: 自定义导航栏
 */

const StatusBarShape = {
  //设置状态栏所接受的属性
  barStyle: PropTypes.oneOf(['light-content', 'default']),
  hidden: PropTypes.bool,
  backgroundColor: PropTypes.string,
};
const NAV_BAR_HEIGHT_IOS = GlobalStyles.NAV_BAR_HEIGHT_IOS, //IOS导航栏高度
  NAV_BAR_HEIGHT_ANDROID = GlobalStyles.NAV_BAR_HEIGHT_ANDROID, //Android导航栏高度
  STATUS_BAR_HEIGHT = GlobalStyles.STATUS_BAR_HEIGHT; //状态栏高度

class NavigationBar extends Component {
  //属性的类型检查
  static propTypes = {
    style: ViewPropTypes.style,
    title: PropTypes.string,
    titleView: PropTypes.element,
    titleLayoutStyle: ViewPropTypes.style,
    hide: PropTypes.bool,
    statusBar: PropTypes.shape(StatusBarShape),
    rightButton: PropTypes.element,
    leftButton: PropTypes.element,
  };

  //设置默认属性
  static defaultProps = {
    statusBar: {
      barStyle: 'light-content',
      hidden: false,
    },
  };

  state = {};

  componentDidMount(): void {
  }

  render() {
    const {
      statusBar,
      titleView,
      title,
      hide,
      leftButton,
      rightButton,
      titleLayoutStyle,
      style,
    } = this.props;

    let myStatusBar = !statusBar.hidden && (
      <View style={styles.statusBar}>
        <StatusBar {...statusBar} />
      </View>
    );
    let myTitleView = titleView || (
      <Text ellipsizeMode={'head'} numberOfLines={1} style={styles.title}>
        {title}
      </Text>
    );
    let content = hide || (
      <View style={styles.navBar}>
        {this.getButtonElement(leftButton)}
        <View style={[styles.navBarTitleContainer, titleLayoutStyle]}>
          {myTitleView}
        </View>
        {this.getButtonElement(rightButton)}
      </View>
    );
    return (
      <View style={[styles.root, {backgroundColor: this.props.theme.themeColor}, style]}>
        {myStatusBar}
        {content}
      </View>
    );
  }

  getButtonElement = element => {
    return element ? (
      <View style={styles.navBarButton}>{element}</View>
    ) : (
      <View />
    );
  };
}

const mapStateToProps = state => ({
  theme: state.theme,
});

export default connect(mapStateToProps)(NavigationBar);

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 12,
    // backgroundColor: '#2196f3',
  },
  statusBar: {
    height: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT : 0, //Android系统会自动设置statusBar
  },
  title: {
    fontSize: 20,
    color: 'white',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: Platform.OS === 'ios' ? NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROID,
  },
  navBarButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navBarTitleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 60,
    right: 60,
    top: 0,
    bottom: 0,
  },
});
