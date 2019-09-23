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
 * Desc: 详情页
 */

export default class DetailPage extends Component {
  constructor(props) {
    super(props);
    this.backPressHelper = new BackPressHelper({backPress: this._goBack});
    const {projectModel, flag} = this.props.navigation.state.params;
    this.favoriteDao = new FavoriteDao(flag);
    const {itemData} = projectModel;
    if (itemData) {
      let title = itemData.full_name || itemData.fullName;
      let url = itemData.html_url || 'https://github.com/' + itemData.fullName;
      this.state = {
        title,
        url,
        webCanGoBack: false,
        isFavorite: projectModel.isFavorite,
      };
    }
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
        rightButton={this._renderRightButton()}
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

  _renderRightButton = () => {
    const {isFavorite} = this.state;
    return (
      <View style={styles.actionMenuRoot}>
        <TouchableOpacity
          onPress={this._onFavoriteButtonClick}
          underlayColor={'transparent'}
          style={{paddingHorizontal: 6}}>
          <FontAwesome
            name={isFavorite ? 'star' : 'star-o'}
            size={20}
            style={{color: 'white'}}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
          }}
          underlayColor={'transparent'}
          style={{paddingHorizontal: 6}}>
          <Ionicons
            name={'md-share'}
            size={20}
            style={{color: 'white'}}
          />
        </TouchableOpacity>
      </View>
    );
  };

  _onFavoriteButtonClick = () => {
    const {projectModel, callback} = this.props.navigation.state.params;
    const {itemData} = projectModel;
    const isFavorite = (projectModel.isFavorite = !projectModel.isFavorite);
    //通过回调函数更新列表状态
    if (ObjectUtils.isFunction(callback)) {
      callback(isFavorite);
    }
    this.setState({
      isFavorite,
    });
    const key = itemData.fullName || itemData.id.toString();
    if (isFavorite) {
      this.favoriteDao.saveFavoriteItem(
        key,
        JSON.stringify(projectModel.itemData),
      );
    } else {
      this.favoriteDao.removeFavoriteItem(key);
    }
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
