import {rootCom, AppNavigator} from '../../navigators/AppNavigator';

/**
 * 1、指定默认state
 * @type {any}
 */
const initNav = AppNavigator.router.getStateForAction(
  AppNavigator.router.getActionForPathAndParams(rootCom),
);

/**
 * 2、创建自己的 navigation reducer
 * @type {Reducer<unknown>}
 */
const redNav = (state = initNav, action) => {
  const nextState = AppNavigator.router.getStateForAction(action, state);
  //如果 nextState 为null或未定义，只需返回原始 state
  return nextState || state;
};

export default redNav;
