/**
 * Created by RaoMeng on 2019/9/10
 * Desc: 网络工具类
 */
export default class NetworkUtils {
  /**
   * 拼接url参数 ?a=1&b=2
   * @param {obj} params
   */
  static splicingParams = params => {
    let paramUrl = '';
    if (params) {
      for (let key in params) {
        let value = params[key] !== undefined ? params[key] : '';
        paramUrl += `&${key}=${encodeURIComponent(value)}`;
      }
    }
    return paramUrl ? `?${paramUrl.substr(1)}` : '';
  };

  /**
   * 获取全部url参数,并转换成json对象
   * @param url
   */
  static getUrlAllParams = url => {
    url = url ? url : window.location.href;
    let _pa = url.substring(url.indexOf('?') + 1),
      _arrS = _pa.split('&'),
      _rs = {};
    for (let i = 0, _len = _arrS.length; i < _len; i++) {
      let pos = _arrS[i].indexOf('=');
      if (pos == -1) {
        continue;
      }
      let name = _arrS[i].substring(0, pos),
        value = window.decodeURIComponent(_arrS[i].substring(pos + 1));
      _rs[name] = value;
    }
    return _rs;
  };

  /**
   * 删除url指定参数，返回url
   * @param url
   * @param name
   * @returns {string|*}
   */
  static delParamsUrl = (url, name) => {
    let baseUrl = url.split('?')[0] + '?';
    let query = url.split('?')[1];
    if (query.indexOf(name) > -1) {
      let obj = {};
      let arr = query.split('&');
      for (let i = 0; i < arr.length; i++) {
        arr[i] = arr[i].split('=');
        obj[arr[i][0]] = arr[i][1];
      }
      delete obj[name];
      let url =
        baseUrl +
        JSON.stringify(obj)
          .replace(/[\"\{\}]/g, '')
          .replace(/\:/g, '=')
          .replace(/\,/g, '&');
      return url;
    } else {
      return url;
    }
  };
}
