import actionTypes from '../constant/actionTypes';
import ThemeDao from '../../helpers/dao/ThemeDao';
//这里导入store会报错，待查明原因
//如果在除了根页面之外的地方import store的话，store会重新创建，并丢失所有的路由引用。
//看起来是Redux和react-navigation的兼容问题
// import store from '../store';

/**
 * 主题变更
 * @param theme
 * @returns {{type: *}}
 */
export const themeChange = theme => ({
  type: actionTypes.THEME_CHANGE,
  ...theme,
});

/**
 * 初始化主题
 */
export const themeInit = () => {
  return dispatch => {
    new ThemeDao().getTheme().then(theme => {
      dispatch(themeChange(theme));
    });
  };
};

/**
 * 显示自定义主题弹框
 * @param show
 */
export const showCustomThemeView = show => {
  return {
    type: actionTypes.SHOW_THEME_VIEW,
    customThemeViewVisible: show,
  };
};
