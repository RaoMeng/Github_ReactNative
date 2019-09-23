/**
 * Created by RaoMeng on 2019/9/10
 * Desc: 对象相关的工具类
 */
export default class ObjectUtils {
  /**
   * 是否字符串
   * @param o
   * @returns {boolean}
   */
  static isString = o => {
    return Object.prototype.toString.call(o).slice(8, -1) === 'String';
  };

  /**
   * 是否数字
   * @param o
   * @returns {boolean}
   */
  static isNumber = o => {
    return Object.prototype.toString.call(o).slice(8, -1) === 'Number';
  };

  /**
   * 是否boolean
   * @param o
   * @returns {boolean}
   */
  static isBoolean = o => {
    return Object.prototype.toString.call(o).slice(8, -1) === 'Boolean';
  };

  /**
   * 是否函数
   * @param o
   * @returns {boolean}
   */
  static isFunction = o => {
    return Object.prototype.toString.call(o).slice(8, -1) === 'Function';
  };

  /**
   * 是否为null
   * @param o
   * @returns {boolean}
   */
  static isNull = o => {
    return Object.prototype.toString.call(o).slice(8, -1) === 'Null';
  };

  /**
   * 是否undefined
   * @param o
   * @returns {boolean}
   */
  static isUndefined = o => {
    return Object.prototype.toString.call(o).slice(8, -1) === 'Undefined';
  };

  /**
   * 是否对象
   * @param o
   * @returns {boolean}
   */
  static isObj = o => {
    return Object.prototype.toString.call(o).slice(8, -1) === 'Object';
  };

  /**
   * 是否数组
   * @param o
   * @returns {boolean}
   */
  static isArray = o => {
    return Object.prototype.toString.call(o).slice(8, -1) === 'Array';
  };

  /**
   * 是否时间
   * @param o
   * @returns {boolean}
   */
  static isDate = o => {
    return Object.prototype.toString.call(o).slice(8, -1) === 'Date';
  };

  /**
   * 是否正则
   * @param o
   * @returns {boolean}
   */
  static isRegExp = o => {
    return Object.prototype.toString.call(o).slice(8, -1) === 'RegExp';
  };

  /**
   * 是否错误对象
   * @param o
   * @returns {boolean}
   */
  static isError = o => {
    return Object.prototype.toString.call(o).slice(8, -1) === 'Error';
  };

  /**
   * 是否Symbol函数
   * @param o
   * @returns {boolean}
   */
  static isSymbol = o => {
    return Object.prototype.toString.call(o).slice(8, -1) === 'Symbol';
  };

  /**
   * 是否Promise对象
   * @param o
   * @returns {boolean}
   */
  static isPromise = o => {
    return Object.prototype.toString.call(o).slice(8, -1) === 'Promise';
  };

  /**
   * 是否Set对象
   * @param o
   * @returns {boolean}
   */
  static isSet = o => {
    return Object.prototype.toString.call(o).slice(8, -1) === 'Set';
  };

  /**
   * 对象作为判断条件，是否为false
   * @param o
   * @returns {boolean}
   */
  static isFalse = o => {
    if (
      !o ||
      o === 'null' ||
      o === 'undefined' ||
      o === 'false' ||
      o === 'NaN'
    ) {
      return true;
    }

    return false;
  };

  /**
   * 对象作为判断条件，是否为true
   * @param o
   * @returns {boolean}
   */
  static isTrue = o => {
    return !this.isFalse(o);
  };

  /**
   * 深度拷贝
   * @param obj
   * @returns {[]}
   */
  static deepCopy = obj => {
    let objCopy = obj instanceof Array ? [] : {};
    for (let item in obj) {
      objCopy[item] =
        typeof obj[item] === 'object' ? this.deepCopy(obj[item]) : obj[item];
    }
    return objCopy;
  };
}
