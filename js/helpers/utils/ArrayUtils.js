/**
 * Created by RaoMeng on 2019/9/15
 * Desc: 数组相关工具类
 */

export default class ArrayUtils {
  /**
   * 判断两个数组是否相等
   * @param arr1
   * @param arr2
   * @returns {boolean}
   */
  static isEqual = (arr1, arr2) => {
    if (!(arr1 && arr2)) {
      return false;
    }
    if (arr1.length !== arr2.length) {
      return false;
    }
    for (let i = 0, len = arr1.length; i < len; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
    return true;
  };

  /**
   * 更新数组，若item已存在，则将其从数组中移除；若不存在，则将其添加到数组
   * @param array
   * @param item
   */
  static updateArray = (array, item) => {
    for (let i = 0, len = array.length; i < len; i++) {
      if (item === array[i]) {
        array.splice(i, 1);
        return;
      }
    }
    array.push(item);
  };

  /**
   * 将数组中指定元素移除
   * @param array
   * @param item
   * @param id
   */
  static remove = (array, item, id) => {
    if (!array) {
      return;
    }
    for (let i = 0, len = array.length; i < len; i++) {
      const obj = array[i];
      if (item === obj || (obj && obj[id] && obj[id] === item[id])) {
        array.splice(i, 1);
      }
    }
    return array;
  };

  /**
   * clone 数组
   * @param from
   */
  static clone = from => {
    if (!from) {
      return [];
    }
    let newArray = [];
    for (let i = 0, len = from.length; i < len; i++) {
      newArray[i] = from[i];
    }
    return newArray;
  };
}
