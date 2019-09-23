import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

/**
 * Created by RaoMeng on 2019/9/12
 * Desc:封装【最热】和【趋势】列表item的通用部分
 */

export default class BaseItem extends Component {
  static propTypes = {
    projectModel: PropTypes.object,
    onSelect: PropTypes.func,
    onFavorite: PropTypes.func,
    theme: PropTypes.object,
  };

  state = {
    isFavorite: this.props.projectModel.isFavorite,
  };

  /**
   * props发生变化时，更新state的回调方法
   * componentWillReceiveProps 在新版React中不能再用了
   * @param nextProps
   * @param prevState
   */
  static getDerivedStateFromProps(nextProps, prevState) {
    const isFavorite = nextProps.projectModel.isFavorite;
    if (prevState.isFavorite !== isFavorite) {
      return {
        isFavorite,
      };
    }
    return null;
  }

  /**
   * 生成收藏按钮
   * @returns {*}
   * @public
   */
  favoriteIcon = () => {
    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          right: 0,
          padding: 8,
        }}
        underlayColor={'transparent'}
        onPress={this._onPressFavorite}>
        <FontAwesome
          name={this.state.isFavorite ? 'star' : 'star-o'}
          size={20}
          style={{color: this.props.theme.themeColor}}
        />
      </TouchableOpacity>
    );
  };

  _onItemSelect = () => {
    const {onItemClick, projectModel} = this.props;
    onItemClick(projectModel, isFavorite => {
      this.setFavoriteState(isFavorite);
      //这里调用是为了在收藏页面进入详情页的操作能刷新【最热】和【趋势】
      this.props.onFavorite(this.props.projectModel.itemData, isFavorite);
    });
  };

  /**
   * 收藏按钮点击事件
   * @private
   */
  _onPressFavorite = () => {
    const {isFavorite} = this.state;
    this.setFavoriteState(!isFavorite);
    this.props.onFavorite(this.props.projectModel.itemData, !isFavorite);
  };

  setFavoriteState = isFavorite => {
    this.props.projectModel.isFavorite = isFavorite;
    this.setState({
      isFavorite,
    });
  };
}
