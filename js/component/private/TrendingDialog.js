import React, {Component} from 'react';
import {StyleSheet, View, Text, Modal, TouchableOpacity} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TimeSpan from '../../model/TimeSpan';

/**
 * Created by RaoMeng on 2019/9/12
 * Desc: 趋势弹框
 */

export const timeSpans = [
  new TimeSpan('今 天', 'since=daily'),
  new TimeSpan('本 周', 'since=weekly'),
  new TimeSpan('本 月', 'since=monthly'),
];

export default class TrendingDialog extends Component {
  state = {
    visible: false,
  };

  render() {
    const {onClose, onSelect} = this.props;
    return (
      <Modal
        transparent={true}
        visible={this.state.visible}
        onRequestClose={() => onClose()}>
        <TouchableOpacity
          style={styles.root}
          onPress={() => {
            this.dismiss();
          }}>
          <MaterialIcons
            name={'arrow-drop-up'}
            style={styles.arrow}
            size={32}
          />
          <View style={styles.content}>
            {timeSpans.map((item, index, arr) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => onSelect(item)}
                  underlayColor={'transparent'}>
                  <View style={styles.dialog_item}>
                    <Text style={styles.item_text}>{item.showText}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }

  show = () => {
    this.setState({
      visible: true,
    });
  };

  dismiss = () => {
    this.setState({
      visible: false,
    });
  };
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
  },
  arrow: {
    marginTop: 30,
    color: 'white',
    padding: 0,
    margin: -15,
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 4,
    paddingVertical: 3,
  },
  dialog_item: {
    textAlign: 'center',
  },
  item_text: {
    fontSize: 16,
    color: 'black',
    fontWeight: '400',
    padding: 10,
    paddingHorizontal: 30,
  },
});
