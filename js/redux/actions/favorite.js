import actionTypes from '../constant/actionTypes';
import FavoriteDao from '../../helpers/dao/FavoriteDao';
import ProjectModel from '../../model/ProjectModel';

/**
 * 获取收藏列表的异步action
 * @param flag 获取的数据类型：最热 | 收藏
 * @param isShowLoading 是否显示加载框
 * @returns {Function}
 */
export const loadFavorite = (flag, isShowLoading) => {
  return dispatch => {
    if (isShowLoading) {
      dispatch({type: actionTypes.FAVORITE_LOAD_DATA, storeName: flag});
    }
    const favoriteDao = new FavoriteDao(flag);
    favoriteDao
      .getAllItems()
      .then(items => {
        const wrapProjectModels = [];
        for (let i = 0, len = items.length; i < len; i++) {
          wrapProjectModels.push(new ProjectModel(items[i], true));
        }
        dispatch({
          type: actionTypes.FAVORITE_LOAD_SUCCESS,
          projectModels: wrapProjectModels,
          storeName: flag,
        });
      })
      .catch(error => {
        dispatch({
          type: actionTypes.FAVORITE_LOAD_FAIL,
          error,
          storeName: flag,
        });
      });
  };
};
