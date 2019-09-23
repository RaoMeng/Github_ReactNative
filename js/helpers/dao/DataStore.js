import AsyncStorage from '@react-native-community/async-storage';
import {call} from 'react-native-reanimated';
import FetchRequest from '../net/FetchRequest';
import Trending from 'GitHubTrending/trending/GitHubTrending';

/**
 * Created by RaoMeng on 2019/9/10
 * Desc: 数据离线缓存策略
 *
 * 优先获取本地数据，如果无本地数据或本地数据过期，则获取网络数据
 */

export const FLAG_STORAGE = {
  flag_popular: 'popular',
  flag_trending: 'trending',
};

export default class DataStore {
  /**
   * 保存数据，为数据包装时间戳
   * @param url
   * @param data
   * @param callback
   */
  saveData = (url, data, callback) => {
    if (!url || !data) {
      return;
    }

    AsyncStorage.setItem(url, JSON.stringify(this._wrapData(data), callback));
  };

  /**
   *为数据包装时间戳
   * @param data
   * @returns {{data: *, timestamp: *}}
   * @private
   */
  _wrapData = data => {
    return {
      data: data,
      timestamp: new Date().getTime(),
    };
  };

  /**
   * 获取数据
   * @param url
   * @param params
   * @param headers
   */
  getData = (url, flag, params, headers) => {
    return new Promise((resolve, reject) => {
      this.getLocalData(url, params, headers)
        .then(wrapData => {
          if (
            wrapData &&
            wrapData.data &&
            wrapData.data.length > 0 &&
            this.checkTimestampValid(wrapData.timestamp)
          ) {
            resolve(wrapData);
          } else {
            this.getNetData(url, flag, params, headers)
              .then(response => {
                resolve(this._wrapData(response));
              })
              .catch(error => {
                reject(error);
              });
          }
        })
        .catch(error => {
          this.getNetData(url, flag, params, headers)
            .then(response => {
              resolve(this._wrapData(response));
            })
            .catch(error => {
              reject(error);
            });
        });
    });
  };

  /**
   * 获取本地数据
   * @param url
   * @param params
   * @param headers
   * @returns {Promise<R>}
   */
  getLocalData = (url, params, headers) => {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(url, (error, result) => {
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

  /**
   * 获取网络数据
   * @param url
   * @param params
   * @param headers
   * @returns {Promise<R>}
   */
  getNetData = (url, flag, params, headers) => {
    return new Promise((resolve, reject) => {
      if (flag != FLAG_STORAGE.flag_trending) {
        FetchRequest.get(url, params, headers)
          .then(response => {
            this.saveData(url, response);
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      } else {
        new Trending()
          .fetchTrending(url)
          .then(response => {
            if (!response) {
              throw '数据为空';
            }
            this.saveData(url, response);
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      }
    });
  };

  /**
   * 检查timestamp是否在有效期内
   * @param timestamp
   * @returns {boolean}
   */
  checkTimestampValid = timestamp => {
    const currentDate = new Date();
    const targetDate = new Date();
    targetDate.setTime(timestamp);
    if (currentDate.getFullYear() !== targetDate.getFullYear()) {
      return false;
    }
    if (currentDate.getMonth() !== targetDate.getMonth()) {
      return false;
    }
    if (currentDate.getDate() !== targetDate.getDate()) {
      return false;
    }
    if (currentDate.getHours() - targetDate.getHours() > 4) {
      return false;
    }
    return true;
  };
}
