import ObjectUtils from '../../helpers/utils/ObjectUtils';
import {call} from 'react-native-reanimated';
import ProjectModel from '../../model/ProjectModel';

/**
 * 处理数据
 * @param dispatch
 * @param storeName
 * @param response
 * @param pageSize
 * @private
 */
export const handleData = (
  dispatch,
  storeName,
  response,
  pageSize,
  actionType,
  favoriteDao,
) => {
  let fixItems = [];
  if (response && response.data) {
    if (ObjectUtils.isArray(response.data)) {
      fixItems = response.data;
    } else if (ObjectUtils.isArray(response.data.items)) {
      fixItems = response.data.items;
    }
  }
  //第一次要加载的数据
  const showItems =
    pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize);

  _wrapProjectModel(showItems, favoriteDao, wrapProjectModels => {
    dispatch({
      type: actionType,
      items: fixItems,
      projectModels: wrapProjectModels,
      storeName,
      pageIndex: 1,
    });
  });
};

export const _wrapProjectModel = async (showItems, favoriteDao, callback) => {
  let keys = [];
  try {
    keys = await favoriteDao.getFavoriteKeys();
  } catch (e) {
    console.log(e);
  }
  let wrapProjectModels = [];
  for (let i = 0, len = showItems.length; i < len; i++) {
    wrapProjectModels.push(
      new ProjectModel(showItems[i], _checkFavorite(showItems[i], keys)),
    );
  }
  if (ObjectUtils.isFunction(callback)) {
    callback(wrapProjectModels);
  }
};

const _checkFavorite = (item, keys) => {
  if (!keys) {
    return false;
  }
  for (let i = 0, len = keys.length; i < len; i++) {
    const id = item.id ? item.id : item.fullName;
    if (id.toString() === keys[i]) {
      return true;
    }
  }
  return false;
};
