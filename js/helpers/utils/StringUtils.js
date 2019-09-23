/**
 * Created by RaoMeng on 2019/9/10
 * Desc: 字符串工具类
 */
import ObjectUtils from './ObjectUtils';

export default class StringUtils {
  /**
   * 去除空格
   * @param  {str}
   * @param  {type}
   *       type:  1-所有空格  2-前后空格  3-前空格 4-后空格
   * @return {String}
   */
  static trim = (str, type) => {
    type = type || 1;
    switch (type) {
      case 1:
        return str.replace(/\s+/g, '');
      case 2:
        return str.replace(/(^\s*)|(\s*$)/g, '');
      case 3:
        return str.replace(/(^\s*)/g, '');
      case 4:
        return str.replace(/(\s*$)/g, '');
      default:
        return str;
    }
  };

  /**
   * 字符大小写切换
   * @param  {str}
   * @param  {type}
   *       type:  1:首字母大写  2：首页母小写  3：大小写转换  4：全部大写  5：全部小写
   * @return {String}
   */
  static changeCase = (str, type) => {
    type = type || 4;
    switch (type) {
      case 1:
        return str.replace(/\b\w+\b/g, word => {
          return (
            word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase()
          );
        });
      case 2:
        return str.replace(/\b\w+\b/g, word => {
          return (
            word.substring(0, 1).toLowerCase() + word.substring(1).toUpperCase()
          );
        });
      case 3:
        return str
          .split('')
          .map(function(word) {
            if (/[a-z]/.test(word)) {
              return word.toUpperCase();
            } else {
              return word.toLowerCase();
            }
          })
          .join('');
      case 4:
        return str.toUpperCase();
      case 5:
        return str.toLowerCase();
      default:
        return str;
    }
  };

  /**
   * 过滤html代码(把<>转换)
   * @param str
   * @returns {*}
   */
  static filterTag = str => {
    str = str.replace(/&/gi, '&amp;');
    str = str.replace(/</gi, '&lt;');
    str = str.replace(/>/gi, '&gt;');
    str = str.replace(' ', '&nbsp;');
    return str;
  };
}

/**
 * 是否以某一字符串开头
 * @param s
 * @returns {boolean}
 */
String.prototype.startWith = function(s) {
  if (s == null || s == '' || this.length == 0 || s.length > this.length) {
    return false;
  }
  if (this.substr(0, s.length) == s) {
    return true;
  } else {
    return false;
  }
};

/**
 * 是否以某一字符串结尾
 * @param s
 * @returns {boolean}
 */
String.prototype.endWith = function(s) {
  if (s == null || s == '' || this.length == 0 || s.length > this.length) {
    return false;
  }
  if (this.substring(this.length - s.length) == s) {
    return true;
  } else {
    return false;
  }
};

/**
 * 是否存在于参数字符串列表中
 * @returns {boolean}
 */
String.prototype.isStrEquals = function() {
  let args = arguments;
  if (
    ObjectUtils.isNull(args) ||
    ObjectUtils.isUndefined(args) ||
    args.length == 0
  ) {
    return false;
  } else {
    for (let i = 0; i < args.length; i++) {
      let arg = args[i];
      if (ObjectUtils.isNull(args) || ObjectUtils.isUndefined(args)) {
        return false;
      }
      if (this === arg) {
        return true;
      }
    }
    return false;
  }
};

/**
 * 字符串全局替换
 * @param reg
 * @param s
 * @returns {string}
 */
String.prototype.replaceAll = function(reg, s) {
  if (
    ObjectUtils.isNull(this) ||
    ObjectUtils.isUndefined(this) ||
    this.length === 0
  ) {
    return '';
  }
  return this.replace(new RegExp(reg, 'gm'), s);
};
