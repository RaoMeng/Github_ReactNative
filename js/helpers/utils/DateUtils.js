/**
 * Created by RaoMeng on 2019/9/10
 * Desc: 时间日期工具类
 */
export default class DateUtils {
  /**
   * 距现在的已过时间
   * @desc   格式化${startTime}
   * @param  {Date} startTime
   * @return {String}
   */
  static formatPassTime = startTime => {
    let currentTime = Date.parse(new Date()),
      time = currentTime - startTime,
      day = parseInt(time / (1000 * 60 * 60 * 24)),
      hour = parseInt(time / (1000 * 60 * 60)),
      min = parseInt(time / (1000 * 60)),
      month = parseInt(day / 30),
      year = parseInt(month / 12);
    if (year) {
      return year + '年前';
    } else if (month) {
      return month + '个月前';
    } else if (day) {
      return day + '天前';
    } else if (hour) {
      return hour + '小时前';
    } else if (min) {
      return min + '分钟前';
    } else {
      return '刚刚';
    }
  };

  /**
   * [countDown 倒计时]
   * @param  {[Int]} restSeconds   [剩余秒数，必填]
   * @param  {[Int]} timeInterval   [时间间隔，非必填，默认1000ms]
   * @param  {[Function]} func   [每倒计时一次，就需要执行一次的回调函数名，非必填]
   * @param  {[Function]} endFun [倒计时结束需要执行的函数名，非必填]
   * @return {[null]}        [无返回值]
   */
  static countDown = (restSeconds, timeInterval = 1000, func, endCallback) => {
    let timer = null;
    let total = restSeconds;
    timeInterval = timeInterval ? timeInterval : 1000;
    timer = setInterval(() => {
      --total;
      if (total <= 0) {
        clearInterval(timer);
        endCallback && endCallback();
      }
      func && func(total);
    }, timeInterval);
  };

  /**
   * @param  {s} 秒数
   * @return {String} 字符串
   *
   * @example formatHMS(3610) // -> 1h0m10s
   */
  static formatHMS(s) {
    let str = '';
    if (s > 3600) {
      str =
        Math.floor(s / 3600) +
        'h' +
        Math.floor((s % 3600) / 60) +
        'm' +
        (s % 60) +
        's';
    } else if (s > 60) {
      str = Math.floor(s / 60) + 'm' + (s % 60) + 's';
    } else {
      str = (s % 60) + 's';
    }
    return str;
  }

  /**
   * 获取某月有多少天
   * @param time
   * @returns {*}
   */
  static getMonthOfDay(time) {
    let date = new Date(time);
    let year = date.getFullYear();
    let mouth = date.getMonth() + 1;
    let days;

    //当月份为二月时，根据闰年还是非闰年判断天数
    if (mouth == 2) {
      days =
        (year % 4 == 0 && year % 100 == 0 && year % 400 == 0) ||
        (year % 4 == 0 && year % 100 != 0)
          ? 28
          : 29;
    } else if (
      mouth == 1 ||
      mouth == 3 ||
      mouth == 5 ||
      mouth == 7 ||
      mouth == 8 ||
      mouth == 10 ||
      mouth == 12
    ) {
      //月份为：1,3,5,7,8,10,12 时，为大月.则天数为31；
      days = 31;
    } else {
      //其他月份，天数为：30.
      days = 30;
    }
    return days;
  }

  /**
   * 获取某年有多少天
   * @param time
   * @returns {number}
   */
  static getYearOfDay(time) {
    let firstDayYear = this.getFirstDayOfYear(time);
    let lastDayYear = this.getLastDayOfYear(time);
    let numSecond =
      (new Date(lastDayYear).getTime() - new Date(firstDayYear).getTime()) /
      1000;
    return Math.ceil(numSecond / (24 * 3600));
  }

  /**
   * 获取某年的第一天
   * @param time
   * @returns {string}
   */
  static getFirstDayOfYear(time) {
    let year = new Date(time).getFullYear();
    return year + '-01-01 00:00:00';
  }

  /**
   * 获取某年最后一天
   * @param time
   * @returns {string}
   */
  static getLastDayOfYear(time) {
    let year = new Date(time).getFullYear();
    let dateString = year + '-12-01 00:00:00';
    let endDay = this.getMonthOfDay(dateString);
    return year + '-12-' + endDay + ' 23:59:59';
  }

  /**
   * 获取某个日期是当年中的第几天
   * @param time
   * @returns {number}
   */
  static getDayOfYear(time) {
    let firstDayYear = this.getFirstDayOfYear(time);
    let numSecond =
      (new Date(time).getTime() - new Date(firstDayYear).getTime()) / 1000;
    return Math.ceil(numSecond / (24 * 3600));
  }

  /**
   * 获取某个日期在这一年的第几周
   * @param time
   * @returns {number}
   */
  static getDayOfYearWeek(time) {
    let numdays = this.getDayOfYear(time);
    return Math.ceil(numdays / 7);
  }

  /**
   * 返回指定长度的月份集合
   *
   * @param  {time} 时间
   * @param  {len} 长度
   * @param  {direction} 方向：  1: 前几个月;  2: 后几个月;  3:前后几个月  默认 3
   * @return {Array} 数组
   *
   * @example   getMonths('2018-1-29', 6, 1)  // ->  ["2018-1", "2017-12", "2017-11", "2017-10", "2017-9", "2017-8", "2017-7"]
   */
  static getMonths = (time, len, dir) => {
    let mm = new Date(time).getMonth(),
      yy = new Date(time).getFullYear(),
      direction = isNaN(dir) ? 3 : dir,
      index = mm;
    let cutMonth = function(index) {
      if (index <= len && index >= -len) {
        return direction === 1
          ? formatPre(index).concat(cutMonth(++index))
          : direction === 2
            ? formatNext(index).concat(cutMonth(++index))
            : formatCurr(index).concat(cutMonth(++index));
      }
      return [];
    };
    let formatNext = function(i) {
      let y = Math.floor(i / 12),
        m = i % 12;
      return [yy + y + '-' + (m + 1)];
    };
    let formatPre = function(i) {
      let y = Math.ceil(i / 12),
        m = i % 12;
      m = m === 0 ? 12 : m;
      return [yy - y + '-' + (13 - m)];
    };
    let formatCurr = function(i) {
      let y = Math.floor(i / 12),
        yNext = Math.ceil(i / 12),
        m = i % 12,
        mNext = m === 0 ? 12 : m;
      return [yy - yNext + '-' + (13 - mNext), yy + y + '-' + (m + 1)];
    };
    // 数组去重
    let unique = function(arr) {
      if (Array.hasOwnProperty('from')) {
        return Array.from(new Set(arr));
      } else {
        let n = {},
          r = [];
        for (let i = 0; i < arr.length; i++) {
          if (!n[arr[i]]) {
            n[arr[i]] = true;
            r.push(arr[i]);
          }
        }
        return r;
      }
    };
    return direction !== 3
      ? cutMonth(index)
      : unique(
        cutMonth(index).sort(function(t1, t2) {
          return new Date(t1).getTime() - new Date(t2).getTime();
        }),
      );
  };

  /**
   * 返回指定长度的天数集合
   *
   * @param  {time} 时间
   * @param  {len} 长度
   * @param  {direction} 方向： 1: 前几天;  2: 后几天;  3:前后几天  默认 3
   * @return {Array} 数组
   *
   * @example date.getDays('2018-1-29', 6) // -> ["2018-1-26", "2018-1-27", "2018-1-28", "2018-1-29", "2018-1-30", "2018-1-31", "2018-2-1"]
   */
  static getDays(time, len, diretion) {
    let tt = new Date(time);
    let getDay = function(day) {
      let t = new Date(time);
      t.setDate(t.getDate() + day);
      let m = t.getMonth() + 1;
      return t.getFullYear() + '-' + m + '-' + t.getDate();
    };
    let arr = [];
    if (diretion === 1) {
      for (let i = 1; i <= len; i++) {
        arr.unshift(getDay(-i));
      }
    } else if (diretion === 2) {
      for (let i = 1; i <= len; i++) {
        arr.push(getDay(i));
      }
    } else {
      for (let i = 1; i <= len; i++) {
        arr.unshift(getDay(-i));
      }
      arr.push(
        tt.getFullYear() + '-' + (tt.getMonth() + 1) + '-' + tt.getDate(),
      );
      for (let i = 1; i <= len; i++) {
        arr.push(getDay(i));
      }
    }
    return diretion === 1
      ? arr.concat([
        tt.getFullYear() + '-' + (tt.getMonth() + 1) + '-' + tt.getDate(),
      ])
      : diretion === 2
        ? [
          tt.getFullYear() + '-' + (tt.getMonth() + 1) + '-' + tt.getDate(),
        ].concat(arr)
        : arr;
  }
}

/**
 * 日期格式化
 * @param fmt => yyyy-MM-dd hh:mm:ss
 * @returns {*}
 */
Date.prototype.format = function(fmt) {
  let o = {
    'M+': this.getMonth() + 1, //月份
    'd+': this.getDate(), //日
    'h+': this.getHours(), //小时
    'm+': this.getMinutes(), //分
    's+': this.getSeconds(), //秒
    'q+': Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + '').substr(4 - RegExp.$1.length),
    );
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length),
      );
    }
  }
  return fmt;
};
