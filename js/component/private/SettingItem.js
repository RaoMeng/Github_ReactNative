import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

/**
 * Created by RaoMeng on 2019/9/14
 * Desc: 我的页面item
 */

export default class SettingItem extends Component {
  state = {};

  componentDidMount(): void {
  }

  render() {
    const {menuModel, color, expandIcon, onMenuSelect} = this.props;
    const IconEle = menuModel.iconEle;
    return (
      <TouchableOpacity onPress={onMenuSelect} style={styles.root}>
        {IconEle ? (
          <IconEle
            name={menuModel.iconName}
            size={16}
            style={{color: color || 'black'}}
          />
        ) : (
          <View
            style={{width: 16, height: 16, backgroundColor: 'transparent'}}
          />
        )}
        <Text style={styles.menuName}>{menuModel.name}</Text>
        <Ionicons
          name={expandIcon || 'ios-arrow-forward'}
          size={16}
          style={{alignSelf: 'center', color: color || 'black'}}
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    backgroundColor: 'white',
  },
  menuName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingHorizontal: 10,
  },
});
