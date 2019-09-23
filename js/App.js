/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {createAppContainer} from 'react-navigation';
import AppNavigator from './navigators/AppNavigator';
import {Provider} from 'react-redux';
import store from './redux/store';

export default class App extends Component {
  constructor(props) {
    super(props);
    console.disableYellowBox = true;
  }

  render() {
    const AppContainer = createAppContainer(AppNavigator);
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}
