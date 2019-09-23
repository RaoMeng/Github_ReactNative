import {applyMiddleware, createStore} from 'redux';
import reducers from '../reducers';
import thunk from 'redux-thunk';
import {middleware} from '../../navigators/AppNavigator';

/**
 * 自定义logger中间件
 */
const logger = store => next => action => {
  if (typeof action === 'function') {
    console.log('dispatching a function');
  } else {
    console.log('dispatching', action);
  }
  next(action);
  console.log('nextState', store.getState());
};

const middlewareList = [middleware, thunk, logger];

/**
 * 创建store
 */
export default createStore(reducers, applyMiddleware(...middlewareList));
