import ObjectUtils from '../utils/ObjectUtils';
import NetworkUtils from '../utils/NetworkUtils';

/**
 * Created by RaoMeng on 2019/9/10
 * Desc: Fetch网络请求封装
 */

export default class FetchRequest {
  static post = (url, params, header) => {
    if (window.navigator.onLine == false) {
      return Promise.reject('网络连接失败，请检查网络连接');
    }
    if (ObjectUtils.isNull(header)) {
      header = {};
    }

    let formData = new FormData();
    if (params) {
      for (let key in params) {
        // if ((typeof params[key]) === 'string') {
        //     formData.append(key, encodeURI(params[key].toString()))
        // } else {
        formData.append(key, params[key]);
        // }
      }
    }
    const request = fetch(url, {
      method: 'POST',
      body: formData,
      mode: 'cors',
      // credentials: 'include',
      // cache: "force-cache",
      // eslint-disable-next-line no-undef
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        // Authorization: userInfo.token,
        ...header,
      }),
    });
    return this.fetchResult(request);
  };

  static get = (url, params, header) => {
    if (window.navigator.onLine == false) {
      return Promise.reject('网络连接失败，请检查网络连接');
    }
    if (ObjectUtils.isNull(header)) {
      header = {};
    }

    let paramsStr = NetworkUtils.splicingParams(params);
    url = url + paramsStr;

    const request = fetch(url, {
      method: 'GET',
      mode: 'cors',
      // credentials: 'include',
      // cache: "force-cache",
      // eslint-disable-next-line no-undef
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        // 'Authorization': userInfo.token,
        ...header,
      }),
    });
    return this.fetchResult(request);
  };

  /**
   * 处理网络请求结果
   * @param request
   * @returns {*}
   */
  static fetchResult = request => {
    return (
      request
        .then(response => {
          if (response.status == 200) {
            return response;
          } else {
            throw response;
          }
        })
        .then(result => {
          let resultJson = result.json();
          return resultJson;
        })
        // .then(result => {
        //   if (result.success) {
        //     return result;
        //   } else {
        //     throw result;
        //   }
        // })
        .catch(error => {
          try {
            const errorJson = JSON.parse(error);
            if (errorJson.exceptionInfo) {
              if (errorJson.exceptionInfo.length > 40) {
                return Promise.reject('接口请求异常');
              } else {
                return Promise.reject(errorJson.exceptionInfo);
              }
            } else {
              return Promise.reject('接口请求异常');
            }
          } catch (e) {
            return Promise.reject('接口请求异常');
          }
        })
    );
  };
}
