import actionTypes from '../constant/actionTypes';

const defaultState = {};

/**
 * trending:{
 *  Java:{
 *    items:[],
 *    isRefreshing:false
 *  },
 *  IOS:{
 *    items:[],
 *    isRefreshing:false
 *  }
 * }
 *
 * @param state
 * @param action
 * @returns {{}}
 */
export default (state = defaultState, action) => {
  if (action == undefined) {
    return state;
  }

  switch (action.type) {
    case actionTypes.TRENDING_REFRESH_SUCCESS:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          items: action.items, //原始数据
          projectModels: action.projectModels, //此次要展示的数据
          isRefreshing: false,
          pageIndex: action.pageIndex,
          hideLoadingMore: false,
        },
      };
    case actionTypes.TRENDING_REFRESH:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          isRefreshing: true,
          hideLoadingMore: true,
        },
      };
    case actionTypes.TRENDING_REFRESH_FAIL:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          isRefreshing: false,
        },
      };
    case actionTypes.TRENDING_LOAD_MORE_SUCCESS:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          projectModels: action.projectModels,
          hideLoadingMore: false,
          pageIndex: action.pageIndex,
        },
      };
    case actionTypes.TRENDING_LOAD_MORE_FAIL:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          hideLoadingMore: true,
          pageIndex: action.pageIndex,
        },
      };
    case actionTypes.TRENDING_FLUSH_DATA:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          projectModels: action.projectModels,
        },
      };
    default:
      return state;
  }
};
