import React from 'react';
import {
  StyleSheet,
  Platform,
  Image,
  Text,
  View,
  Dimensions,
  StatusBar,
  Animated,
} from 'react-native';
import BackPressHelper from '../../helpers/common/BackPressHelper';
import NavigationUtil from '../../helpers/utils/NavigationUtil';
import github_app_config from '../../configs/json/github_app_config';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import {connect} from 'react-redux';
import GlobalStyles from '../../configs/GlobalStyles';
import ObjectUtils from '../../helpers/utils/ObjectUtils';
import ViewHelper from '../../helpers/common/ViewHelper';

/**
 * Created by RaoMeng on 2019/9/14
 * Desc: 关于页面公共内容封装（组装着模式）
 */

const window = Dimensions.get('window');
const AVATAR_SIZE = 60;
const PARALLAX_HEADER_HEIGHT = 240;
const STICKY_HEADER_HEIGHT =
  Platform.OS === 'ios'
    ? GlobalStyles.NAV_BAR_HEIGHT_IOS
    : GlobalStyles.NAV_BAR_HEIGHT_ANDROID;
export const FLAG_ABOUT = {flag_about: 'about', flag_about_me: 'about_me'};

export default class AboutCommon {
  constructor(props, updateState) {
    this.props = props;
    this.backPressHelper = new BackPressHelper({backPress: this.onBackPress});
    this.updateState = updateState;
  }

  componentDidMount = () => {
    this.backPressHelper.componentDidMount();
    this.updateState({
      data: github_app_config,
    });
  };

  componentWilUnmount = () => {
    this.backPressHelper.componentWillUnmount();
  };

  render(contentView, params) {
    return (
      <ParallaxScrollView
        backgroundColor={this.props.theme.themeColor}
        contentBackgroundColor={GlobalStyles.ROOT_BACKGROUND_COLOR}
        parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
        stickyHeaderHeight={STICKY_HEADER_HEIGHT}
        backgroundScrollSpeed={10}
        {...this._getParallaxConfig(params)}>
        {contentView}
      </ParallaxScrollView>
    );
  }

  _getParallaxConfig = params => {
    const config = {};
    const avatar = ObjectUtils.isString(params.avatar)
      ? {uri: params.avatar}
      : params.avatar;
    config.renderBackground = () => (
      <View>
        <Image
          source={{
            uri: params.backgroundImg,
            width: window.width,
            height: PARALLAX_HEADER_HEIGHT,
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: 0,
            width: window.width,
            backgroundColor: 'rgba(0,0,0,0.4)',
            height: PARALLAX_HEADER_HEIGHT,
          }}
        />
      </View>
    );

    config.renderForeground = () => (
      <View key="parallax-header" style={styles.parallaxHeader}>
        <Image style={styles.avatar} source={avatar} />
        <Text style={styles.titleText}>{params.name}</Text>
        <Text style={styles.contentText}>{params.description}</Text>
      </View>
    );

    config.renderStickyHeader = () => (
      <View key="sticky-header" style={styles.stickySection}>
        <Text style={styles.stickySectionText}>{params.name}</Text>
      </View>
    );

    config.renderFixedHeader = () => (
      <View key="fixed-header" style={styles.fixedSection}>
        {ViewHelper.getLeftBackButton(() =>
          NavigationUtil.goBack(this.props.navigation),
        )}
        {ViewHelper.getShareButton(this._onShare)}
      </View>
    );

    return config;
  };

  _onShare = () => {

  };

  onBackPress = () => {
    NavigationUtil.goBack(this.props.navigation);
    return true;
  };
}

// const mapStateToProps = state => ({
//   theme: state.theme,
// });
//
// export default connect(mapStateToProps)(AboutCommon);

const styles = StyleSheet.create({
  parallaxHeader: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    marginTop: 46,
    borderRadius: AVATAR_SIZE,
    borderColor: 'red',
    borderWidth: 1,
  },
  titleText: {
    color: 'white',
    fontSize: 22,
    marginTop: 10,
  },
  contentText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    padding: 10,
    paddingHorizontal: 20,
  },
  stickySection: {
    alignItems: 'center',
    marginTop: GlobalStyles.STATUS_BAR_HEIGHT / 2,
  },
  stickySectionText: {
    fontSize: 20,
    color: 'white',
  },
  fixedSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'ios' ? GlobalStyles.STATUS_BAR_HEIGHT : 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
