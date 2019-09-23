import actionTypes from '../constant/actionTypes';
import DataStore, {FLAG_STORAGE} from '../../helpers/dao/DataStore';
import {handleData, _wrapProjectModel} from '../common/ActionUtil';
import ObjectUtils from '../../helpers/utils/ObjectUtils';

/**
 * 获取最热数据的异步action
 * @param storeName
 * @param url
 * @param pageSize
 * @param favoriteDao
 */
export const popularRefresh = (storeName, url, pageSize, favoriteDao) => {
  return dispatch => {
    dispatch({type: actionTypes.POPULAR_REFRESH, storeName: storeName});
    let dataStore = new DataStore();
    dataStore
      .getData(url, FLAG_STORAGE.flag_popular)
      .then(response => {
        handleData(
          dispatch,
          storeName,
          response,
          pageSize,
          actionTypes.POPULAR_REFRESH_SUCCESS,
          favoriteDao,
        );
      })
      .catch(error => {
        dispatch({
          type: actionTypes.POPULAR_REFRESH_FAIL,
          storeName,
          error,
        });
      });
  };
};

/**
 * 加载更多
 * @param storeName
 * @param pageIndex
 * @param pageSize
 * @param dataArray
 * @param favoriteDao
 * @param callBack
 * @returns {Function}
 */
export const popularLoadMore = (
  storeName,
  pageIndex,
  pageSize,
  dataArray = [],
  favoriteDao,
  callBack,
) => {
  return dispatch => {
    setTimeout(() => {
      //模拟网络请求
      if ((pageIndex - 1) * pageSize >= dataArray.length) {
        if (ObjectUtils.isFunction(callBack)) {
          callBack('没有更多数据');
        }
        dispatch({
          type: actionTypes.POPULAR_LOAD_MORE_FAIL,
          error: '没有更多数据',
          storeName,
          pageIndex: --pageIndex,
          projectModels: dataArray,
        });
      } else {
        //本次可载入的最大数量
        const max =
          pageSize * pageIndex > dataArray.length
            ? dataArray.length
            : pageSize * pageIndex;
        _wrapProjectModel(
          dataArray.slice(0, max),
          favoriteDao,
          wrapProjectModel => {
            dispatch({
              type: actionTypes.POPULAR_LOAD_MORE_SUCCESS,
              storeName,
              pageIndex,
              projectModels: wrapProjectModel,
            });
          },
        );
      }
    }, 1000);
  };
};

/**
 * 刷新已加载的数据
 * @param storeName
 * @param pageIndex
 * @param pageSize
 * @param dataArray
 * @param favoriteDao
 * @returns {Function}
 */
export const popularFlush = (
  storeName,
  pageIndex,
  pageSize,
  dataArray = [],
  favoriteDao,
) => {
  return dispatch => {
    //本次可载入的最大数量
    const max =
      pageSize * pageIndex > dataArray.length
        ? dataArray.length
        : pageSize * pageIndex;
    _wrapProjectModel(
      dataArray.slice(0, max),
      favoriteDao,
      wrapProjectModel => {
        dispatch({
          type: actionTypes.POPULAR_FLUSH_DATA,
          storeName,
          pageIndex,
          projectModels: wrapProjectModel,
        });
      },
    );
  };
};
