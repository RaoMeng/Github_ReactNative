import actionTypes from '../constant/actionTypes';

const defaultState = {};

/**
 * favorite:{
 *  popular:{
 *    projectModels:[],
 *    isRefreshing:false
 *  },
 *  trending:{
 *    projectModels:[],
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
    case actionTypes.FAVORITE_LOAD_DATA:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          isRefreshing: true,
        },
      };
    case actionTypes.FAVORITE_LOAD_SUCCESS:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          projectModels: action.projectModels,
          isRefreshing: false,
        },
      };
    case actionTypes.FAVORITE_LOAD_FAIL:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          isRefreshing: false,
        },
      };
    default:
      return state;
  }
};
