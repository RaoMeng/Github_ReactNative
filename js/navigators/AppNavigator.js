import {
  createStackNavigator,
  createBottomTabNavigator,
  createMaterialTopTabNavigator,
  createSwitchNavigator,
} from 'react-navigation';

import WelcomePage from '../pages/WelcomePage';
import HomePage from '../pages/HomePage';
import DetailPage from '../pages/DetailPage';
import {connect} from 'react-redux';
import {
  createReactNavigationReduxMiddleware,
  createReduxContainer,
} from 'react-navigation-redux-helpers';
import DataStoreDemoPage from '../pages/DataStoreDemoPage';
import WebViewPage from '../pages/WebViewPage';
import AboutPage from '../pages/about/AboutPage';
import AboutMePage from '../pages/about/AboutMePage';
import CustomKeyPage from '../pages/CustomKeyPage';
import SortKeyPage from '../pages/SortKeyPage';
import CodePushPage from '../pages/CodePushPage';

export const rootCom = 'welcomePage';

const MainNavigator = createStackNavigator(
  {
    homePage: {
      screen: HomePage,
      navigationOptions: {
        header: null,
      },
    },
    detailPage: {
      screen: DetailPage,
      navigationOptions: {
        header: null,
      },
    },
    dataStoreDemo: {
      screen: DataStoreDemoPage,
    },
    webViewPage: {
      screen: WebViewPage,
      navigationOptions: {
        header: null,
      },
    },
    aboutPage: {
      screen: AboutPage,
      navigationOptions: {
        header: null,
      },
    },
    aboutMePage: {
      screen: AboutMePage,
      navigationOptions: {
        header: null,
      },
    },
    customKeyPage: {
      screen: CustomKeyPage,
      navigationOptions: {
        header: null,
      },
    },
    sortKeyPage: {
      screen: SortKeyPage,
      navigationOptions: {
        header: null,
      },
    },
    codePushPage: {
      screen: CodePushPage,
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    defaultNavigationOptions: {
      gesturesEnabled: true,
    },
  },
);

export const AppNavigator = createSwitchNavigator(
  {
    welcomePage: {
      screen: WelcomePage,
      navigationOptions: {
        header: null,
      },
    },
    mainNavigator: {
      screen: MainNavigator,
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    gesturesEnabled: true,
    defaultNavigationOptions: {
      gesturesEnabled: true,
    },
  },
);

/**
 * 1.初始化react-navigation与redux的中间件，
 * 该方法的一个很大的作用就是为createReduxContainer的key设置actionSubscribers(行为订阅者)
 * 设置订阅者@https://github.com/react-navigation/react-navigation-redux-helpers/blob/master/src/middleware.js#L29
 * 检测订阅者是否存在@https://github.com/react-navigation/react-navigation-redux-helpers/blob/master/src/middleware.js#L97
 * @type {Middleware}
 */
export const middleware = createReactNavigationReduxMiddleware(
  state => state.nav,
  'root',
);

/**
 * 2.将根导航器组件传递给 createReduxContainer 函数,
 * 并返回一个将navigation state 和 dispatch 函数作为 props的新组件；
 * 注意：要在createReactNavigationReduxMiddleware之后执行
 */
const AppWithNavigationState = createReduxContainer(AppNavigator, 'root');

/**
 * State到Props的映射关系
 * @param state
 */
const mapStateToProps = state => ({
  state: state.nav,
});
/**
 * 3.连接 React 组件与 Redux store
 */
export default connect(mapStateToProps)(AppWithNavigationState);
