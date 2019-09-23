/**
 * Created by RaoMeng on 2019/9/10
 * Desc: DataStore 使用示例
 */

import React, {Component} from 'react';
import {StyleSheet, View, Text, TextInput, Button} from 'react-native';
import DataStore from '../helpers/dao/DataStore';

export default class DataSourceDemoPage extends Component {
  state = {
    inputValue: '',
    storageText: '',
  };

  constructor(props) {
    super(props);
    this.dataStore = new DataStore();
  }

  componentDidMount(): void {

  }

  render() {
    const {inputValue, storageText} = this.state;
    return (
      <View style={styles.root}>
        <Text style={styles.title}>DataStore 使用</Text>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={text => {
            this.setState({
              inputValue: text,
            });
          }}
        />
        <Button title={'获取数据'} onPress={this._loadData} />
        <Text style={styles.title}>{storageText}</Text>
      </View>
    );
  }

  _loadData = () => {
    const url = `https://api.github.com/search/repositories?q=${
      this.state.inputValue
    }`;
    this.dataStore
      .getData(url)
      .then(response => {
        const showData = `上次网络数据加载时间：${new Date(
          response.timestamp,
        )}\n${JSON.stringify(response.data)}`;
        this.setState({
          storageText: showData,
        });
      })
      .catch(error => {
        this.setState({
          storageText: error,
        });
      });
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
});
