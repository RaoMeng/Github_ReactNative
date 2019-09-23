/**
 * Created by RaoMeng on 2019/9/11
 * Desc: 最热列表item
 */

import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import BaseItem from '../common/BaseItem';

export default class PopularItem extends BaseItem {
  state = {};

  componentDidMount(): void {
  }

  render() {
    const {projectModel} = this.props;
    const {itemData} = projectModel;
    return (
      !itemData ||
      !itemData.owner || (
        <TouchableOpacity
          style={styles.root}
          onPress={this._onItemSelect}>
          <Text style={styles.title}>{itemData.full_name}</Text>
          <Text style={styles.intro}>{itemData.description}</Text>
          <View style={styles.bottomRoot}>
            <Text style={styles.caption}>Author:</Text>
            <Image
              style={styles.authorImg}
              source={{uri: itemData.owner.avatar_url}}
            />
            <Text style={{...styles.caption, marginLeft: 10}}>Star:</Text>
            <Text style={styles.caption}>{itemData.stargazers_count}</Text>
            {this.favoriteIcon()}
          </View>
        </TouchableOpacity>
      )
    );
  }
}

const styles = StyleSheet.create({
  root: {
    marginHorizontal: 8,
    marginVertical: 4,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: 'gray',
    shadowOffset: {width: 0.5, height: 0.5},
    shadowRadius: 8,
    shadowOpacity: 0.2,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  intro: {
    fontSize: 14,
    color: '#666',
    paddingVertical: 4,
  },
  bottomRoot: {
    flexDirection: 'row',
    paddingVertical: 4,
    alignItems: 'center',
  },
  authorImg: {
    width: 20,
    height: 20,
  },
  caption: {
    fontSize: 16,
    color: '#333',
    paddingRight: 4,
  },
});
