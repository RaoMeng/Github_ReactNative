import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import GlobalStyles from '../../configs/GlobalStyles';

/**
 * Created by RaoMeng on 2019/9/12
 * Desc: 布局生成助手
 */
export default class ViewHelper {
  /**
   * 获取标题栏左侧返回按钮
   * @param callback
   * @returns {*}
   */
  static getLeftBackButton = callback => {
    return (
      <TouchableOpacity onPress={callback}>
        <Ionicons name={'ios-arrow-back'} size={22} style={{color: 'white'}} />
      </TouchableOpacity>
    );
  };

  static getShareButton = callback => {
    return (
      <TouchableOpacity onPress={callback}>
        <Ionicons name={'md-share'} size={22} style={{color: 'white'}} />
      </TouchableOpacity>
    );
  };

  static getDividingLine = () => {
    return <View style={GlobalStyles.line} />;
  };
}
