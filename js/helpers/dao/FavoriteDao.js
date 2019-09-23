import AsyncStorage from '@react-native-community/async-storage';

/**
 * Created by RaoMeng on 2019/9/12
 * Desc: 收藏的数据
 */

const FAVORITE_KEY_PREFIX = 'favorite_';

export default class FavoriteDao {
  constructor(flag) {
    this.favoriteKey = FAVORITE_KEY_PREFIX + flag;
  }

  /**
   * 收藏项目，保存收藏的项目
   * @param key 项目id
   * @param value 收藏的项目
   * @param callback
   */
  saveFavoriteItem = (key, value, callback) => {
    AsyncStorage.setItem(key, value, (error, result) => {
      if (!error) {
        //更新Favorite的key
        this.updateFavoriteKeys(key, true);
      }
    });
  };

  /**
   * 取消收藏，移除已收藏的项目
   * @param key
   */
  removeFavoriteItem = key => {
    AsyncStorage.removeItem(key, (error, result) => {
      if (!error) {
        this.updateFavoriteKeys(key, false);
      }
    });
  };

  /**
   * 更新Favorite key集合
   * @param key
   * @param isAdd true：添加，false：删除
   */
  updateFavoriteKeys = (key, isAdd) => {
    AsyncStorage.getItem(this.favoriteKey, (error, result) => {
      if (!error) {
        let favoriteKeys = [];
        if (result) {
          favoriteKeys = JSON.parse(result);
        }
        let index = favoriteKeys.indexOf(key);
        if (isAdd) {
          //如果是添加且key不存在，则添加到数组中
          if (index === -1) {
            favoriteKeys.push(key);
          }
        } else {
          //如果是删除且key存在，则将其从数值中移除
          if (index !== -1) {
            favoriteKeys.splice(index, 1);
          }
        }
        AsyncStorage.setItem(this.favoriteKey, JSON.stringify(favoriteKeys));
      }
    });
  };

  /**
   * 获取当前模块收藏的所有key
   * @returns {Promise<R>}
   */
  getFavoriteKeys = () => {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(this.favoriteKey, (error, result) => {
        if (!error) {
          try {
            resolve(JSON.parse(result));
          } catch (e) {
            reject(e);
          }
        } else {
          reject(error);
        }
      });
    });
  };

  getAllItems = () => {
    return new Promise((resolve, reject) => {
      this.getFavoriteKeys()
        .then(keys => {
          let items = [];
          if (keys) {
            AsyncStorage.multiGet(keys, (error, stores) => {
              try {
                stores.map((item, index, arr) => {
                  let key = item[0];
                  let value = item[1];
                  if (value) {
                    items.push(JSON.parse(value));
                  }
                });
                resolve(items);
              } catch (e) {
                reject(e);
              }
            });
          } else {
            resolve(items);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  };
}
