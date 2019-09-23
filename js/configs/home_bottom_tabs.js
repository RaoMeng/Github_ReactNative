import PopularPage from '../pages/PopularPage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TrendingPage from '../pages/TrendingPage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FavoritePage from '../pages/FavoritePage';
import MinePage from '../pages/MinePage';
import Entypo from 'react-native-vector-icons/Entypo';
import React from 'react';

const HOME_BOTTOM_TABS = {
  popularPage: {
    screen: PopularPage,
    navigationOptions: {
      tabBarLabel: '最热',
      tabBarIcon: ({tintColor, focused}) => {
        return (
          <MaterialIcons
            name={'whatshot'}
            size={26}
            style={{color: tintColor}}
          />
        );
      },
    },
  },
  trendingPage: {
    screen: TrendingPage,
    navigationOptions: {
      tabBarLabel: '趋势',
      tabBarIcon: ({tintColor, focused}) => {
        return (
          <Ionicons
            name={'md-trending-up'}
            size={26}
            style={{color: tintColor}}
          />
        );
      },
    },
  },
  favoritePage: {
    screen: FavoritePage,
    navigationOptions: {
      tabBarLabel: '收藏',
      tabBarIcon: ({tintColor, focused}) => {
        return (
          <MaterialIcons
            name={'favorite'}
            size={26}
            style={{color: tintColor}}
          />
        );
      },
    },
  },
  minePage: {
    screen: MinePage,
    navigationOptions: {
      tabBarLabel: '我的',
      tabBarIcon: ({tintColor, focused}) => {
        return (
          <Entypo
            name={'user'}
            size={26}
            style={{color: tintColor}}
          />
        );
      },
    },
  },
};

export default HOME_BOTTOM_TABS;
