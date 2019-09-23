/**
 * Created by RaoMeng on 2019/9/10
 * Desc: 设备相关工具类
 */
export default class DeviceUtils {
  /**
   * 获取手机类型
   * @returns {string}
   */
  static deviceInfo() {
    const agent = navigator.userAgent;
    let phone = '';
    if (agent.indexOf('Android') > -1 || agent.indexOf('Linux') > -1) {
      //安卓手机
      phone = 'Android';
    } else if (agent.indexOf('iPhone') > -1) {
      //苹果手机
      phone = 'iPhone';
    } else if (agent.indexOf('iPad') > -1) {
      //iPad
      phone = 'iPad';
    } else if (agent.indexOf('Windows Phone') > -1) {
      //winphone手机
      phone = 'Windows Phone';
    }
    return phone;
  }

  /**
   * 是否是Android设备
   * @returns {boolean}
   */
  static isAndroid = () => {
    return this.deviceInfo() === 'Android';
  };

  /**
   * 是否是IOS设备
   * @returns {boolean}
   */
  static isIOS = () => {
    return this.deviceInfo() === 'iPhone';
  };

  /**
   * 是否手机浏览器
   * @returns {boolean}
   */
  static isPhone = () => {
    return /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);
  };

  /**
   * 是否为PC端
   * @returns {boolean}
   */
  static isPC = () => {
    const userAgentInfo = navigator.userAgent;
    let Agents = [
      'Android',
      'iPhone',
      'SymbianOS',
      'Windows Phone',
      'iPad',
      'iPod',
    ];
    let flag = true;
    for (let v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
        flag = false;
        break;
      }
    }
    return flag;
  };

  /**
   * 全屏
   */
  static fullScreen = () => {
    let element = document.documentElement;
    if (window.ActiveXObject) {
      // eslint-disable-next-line no-undef
      let WsShell = new ActiveXObject('WScript.Shell');
      WsShell.SendKeys('{F11}');
    } else if (element.requestFullScreen) {
      element.requestFullScreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    } else if (element.webkitRequestFullScreen) {
      element.webkitRequestFullScreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    }
  };

  /**
   * 退出全屏
   */
  static fullExit() {
    let element = document.documentElement;
    if (window.ActiveXObject) {
      // eslint-disable-next-line no-undef
      let WsShell = new ActiveXObject('WScript.Shell');
      WsShell.SendKeys('{F11}');
    } else if (element.requestFullScreen) {
      document.exitFullscreen();
    } else if (element.msRequestFullscreen) {
      document.msExitFullscreen();
    } else if (element.webkitRequestFullScreen) {
      document.webkitCancelFullScreen();
    } else if (element.mozRequestFullScreen) {
      document.mozCancelFullScreen();
    }
  }

  /**
   * 返回顶部
   */
  static backToTop() {
    cancelAnimationFrame(this.timers);
    this.timers = requestAnimationFrame(function fn() {
      let distance =
        document.body.scrollTop || document.documentElement.scrollTop;
      const step = distance / 50;
      if (distance > 0) {
        distance -= step;
        document.documentElement.scrollTop = distance;
        document.body.scrollTop = distance;
        this.timers = requestAnimationFrame(fn);
      } else {
        cancelAnimationFrame(this.timers);
      }
    });
  }
}
