import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import NavigationBar from '../component/common/NavigationBar';
import ViewHelper from '../helpers/common/ViewHelper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import WebView from 'react-native-webview';
import NavigationUtil from '../helpers/utils/NavigationUtil';
import BackPressHelper from '../helpers/common/BackPressHelper';
import FavoriteDao from '../helpers/dao/FavoriteDao';
import ObjectUtils from '../helpers/utils/ObjectUtils';

/**
 * Created by RaoMeng on 2019/9/6
 * Desc: 通用WebView页面
 */

export default class WebViewPage extends Component {
  constructor(props) {
    super(props);
    this.backPressHelper = new BackPressHelper({backPress: this._goBack});
    const {title, url} = this.props.navigation.state.params;
    this.state = {
      title,
      url,
      webCanGoBack: false,
    };
  }

  componentDidMount(): void {
    this.backPressHelper.componentDidMount();
  }

  componentWillUnmount(): void {
    this.backPressHelper.componentWillUnmount();
  }

  render() {
    const {url} = this.state;
    return (
      <View style={styles.root}>
        {this._renderNavigationBar()}
        <WebView
          ref={webview => {
            this.webview = webview;
          }}
          startInLoadingState={true}
          onNavigationStateChange={this._onNavigationStateChange}
          source={{uri: url}}
        />
      </View>
    );
  }

  _onNavigationStateChange = navState => {
    this.setState({
      webCanGoBack: navState.canGoBack,
      url: navState.url,
    });
  };

  _renderNavigationBar = () => {
    return (
      <NavigationBar
        title={this.state.title}
        leftButton={ViewHelper.getLeftBackButton(this._goBack)}
      />
    );
  };

  _goBack = () => {
    if (this.state.webCanGoBack) {
      this.webview.goBack();
    } else {
      NavigationUtil.goBack(this.props.navigation);
    }
    return true;
  };
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  actionMenuRoot: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
