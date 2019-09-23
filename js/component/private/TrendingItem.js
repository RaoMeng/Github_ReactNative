/**
 * Created by RaoMeng on 2019/9/11
 * Desc: 最热列表item
 */

import React, {Component} from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import HTMLView from 'react-native-htmlview';
import BaseItem from '../common/BaseItem';

export default class TrendingItem extends BaseItem {
  state = {};

  componentDidMount(): void {
  }

  render() {
    const {projectModel} = this.props;
    const {itemData} = projectModel;
    return (
      !itemData || (
        <TouchableOpacity
          style={styles.root}
          onPress={this._onItemSelect}>
          <Text style={styles.title}>{itemData.fullName}</Text>
          <HTMLView
            value={itemData.description}
            onLinkPress={() => {
            }}
            stylesheet={{
              p: styles.description,
              a: styles.description,
            }}
            style={styles.intro}
          />
          <View style={styles.bottomRoot}>
            <Text style={styles.caption}>Built By:</Text>
            {itemData.contributors.map((item, index, arr) => {
              return (
                <Image
                  key={index}
                  style={styles.authorImg}
                  source={{uri: arr[index]}}
                />
              );
            })}
            <Text style={{...styles.caption, marginLeft: 10}}>Star:</Text>
            <Text style={styles.caption}>{itemData.starCount}</Text>
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
    margin: 2,
  },
  caption: {
    fontSize: 16,
    color: '#333',
    paddingRight: 4,
  },
});
