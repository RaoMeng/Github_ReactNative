/**
 * Created by RaoMeng on 2019/9/6
 * Desc: AsyncStorage Demo页面
 */

import React, {Component} from 'react';
import {StyleSheet, View, Text, TextInput, Button} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const KEY = 'test_key';
export default class AsyncStorageDemoPage extends Component {
  state = {
    inputValue: '',
    storageText: '',
  };

  componentDidMount(): void {
  }

  render() {
    const {inputValue, storageText} = this.state;
    return (
      <View style={styles.root}>
        <Text style={styles.title}>AsyncStorage Demo</Text>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={text => {
            this.setState({
              inputValue: text,
            });
          }}
        />
        <View style={styles.operateRoot}>
          <Button title={'存储'} onPress={this.saveData} />
          <Button title={'删除'} onPress={this.deleteData} />
          <Button title={'获取'} onPress={this.getData} />
        </View>
        <Text style={styles.title}>{storageText}</Text>
      </View>
    );
  }

  /**
   * 存储数据
   */
  saveData = async () => {
    const {inputValue} = this.state;
    /*//用法一
    AsyncStorage.setItem(KEY, inputValue, error => {
      error && console.log(error.toString());
    });

    //用法二
    AsyncStorage.setItem(KEY, inputValue).catch(error => {
      error && console.log(error.toString());
    });*/

    //用法三
    try {
      await AsyncStorage.setItem(KEY, inputValue);
    } catch (error) {
      error && console.log(error.toString());
    }
  };

  deleteData = async () => {
    /*//用法一
    AsyncStorage.removeItem(KEY, error => {
      error && console.log(error.toString());
    });

    //用法二
    AsyncStorage.removeItem(KEY).catch(error => {
      error && console.log(error.toString());
    });*/

    //用法三
    try {
      await AsyncStorage.removeItem(KEY);
    } catch (error) {
      error && console.log(error.toString());
    }
  };

  getData = async () => {
    /*//用法一
    AsyncStorage.getItem(KEY, (error, value) => {
      this.setState({
        storageText: value,
      });
      error && console.log(error.toString());
    });

    //用法二
    AsyncStorage.getItem(KEY)
      .then(value => {
        this.setState({
          storageText: value,
        });
      })
      .catch(error => {
        error && console.log(error.toString());
      });*/

    //用法三
    try {
      let value = await AsyncStorage.getItem(KEY);
      this.setState({
        storageText: value,
      });
    } catch (error) {
      error && console.log(error.toString());
    }
  };
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    padding: 16,
  },
  title: {
    fontSize: 18,
    paddingVertical: 8,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
  },
  operateRoot: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
