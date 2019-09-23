/**
 * Created by RaoMeng on 2019/9/5
 * Desc:欢迎页
 */

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import NavigationUtil from '../helpers/utils/NavigationUtil';
import {connect} from 'react-redux';
import actions from '../redux/actions';

class WelcomePage extends Component {
  state = {
    countDown: 5,
  };

  componentDidMount(): void {
    this.props.themeInit();
    this.countDown = setInterval(() => {
      let {countDown} = this.state;
      if (countDown > 1) {
        this.setState({
          countDown: --countDown,
        });
      } else {
        NavigationUtil.toPage(this.props.navigation, 'mainNavigator');
      }
    }, 1000);
  }

  componentWillUnmount(): void {
    //清除计时器
    this.countDown && clearInterval(this.countDown);
  }

  render() {
    const {countDown} = this.state;
    return (
      <View style={[styles.root, {backgroundColor: this.props.theme.themeColor}]}>
        <StatusBar hidden />
        <Text style={{color: 'white', fontSize: 24}}>GITHUB REACT NATIVE</Text>
        <Text style={{color: 'white', fontSize: 30, marginTop: 10}}>
          WELCOME
        </Text>
        <TouchableOpacity
          style={styles.pass}
          onPress={() => {
            NavigationUtil.toPage(this.props.navigation, 'mainNavigator');
          }}>
          <Text style={styles.passText}>点击跳过</Text>
          <Text style={{...styles.passText, marginLeft: 6}}>{countDown}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  theme: state.theme,
});

const mapDispatchToProps = dispatch => ({
  themeInit: () => {
    dispatch(actions.themeInit());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WelcomePage);

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    paddingTop: 160,
    alignItems: 'center',
  },
  pass: {
    position: 'absolute',
    top: 20,
    right: 12,
    backgroundColor: '#f2be45',
    borderWidth: 1,
    borderColor: '#88ada6',
    borderRadius: 50,
    paddingVertical: 6,
    paddingHorizontal: 14,
    flexDirection: 'row',
  },
  passText: {
    color: 'white',
    fontSize: 16,
  },
});
