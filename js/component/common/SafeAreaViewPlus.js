import React, {Component} from 'react';
import {StyleSheet, View, Text, SafeAreaView} from 'react-native';
import PropTypes from 'prop-types';
import GlobalStyles from '../../configs/GlobalStyles';

/**
 * Created by RaoMeng on 2019/9/19
 * Desc: 全面屏适配布局
 */

export default class SafeAreaViewPlus extends Component {
  static propTypes = {
    // eslint-disable-next-line no-undef
    ...ViewPropTypes,
    topColor: PropTypes.string,
    bottomColor: PropTypes.string,
    enablePlus: PropTypes.bool,
    topInset: PropTypes.bool,
    bottomInset: PropTypes.bool,
  };

  static defaultProps = {
    topColor: 'transparent',
    bottomColor: '#f8f8f8',
    enablePlus: true,
    topInset: true,
    bottomInset: false,
  };

  render() {
    const {enablePlus} = this.props;
    return enablePlus ? this._renderSafeAreaViewPlus() : this._renderSafeAreaView();
  }

  _renderSafeAreaViewPlus = () => {
    const {children, topColor, bottomColor, topInset, bottomInset} = this.props;
    return (
      <View style={[styles.container, this.props.style]}>
        {this._renderTopArea(topColor, topInset)}
        {children}
        {this._renderBottomArea(bottomColor, bottomInset)}
      </View>
    );
  };

  _renderSafeAreaView = () => {
    return (
      <SafeAreaView
        style={[GlobalStyles.root_container, this.props.style]}
        {...this.props}>
        {this.props.children}
      </SafeAreaView>
    );
  };

  _renderTopArea = (topColor, topInset) => {

  };

  _renderBottomArea = (bottomColor, bottomInset) => {
  };
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
