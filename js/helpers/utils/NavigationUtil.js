export default class NavigationUtil {
  /**
   * 跳转到指定页面
   * @param props
   * @param page 页面路由
   * @param params  跳转参数
   */
  static toPage = (navigation, page, params) => {
    navigation && navigation.navigate(page, params);
  };

  /**
   * 返回上一页
   * @param navigation
   */
  static goBack = navigation => {
    navigation.goBack();
  };

  /**
   * 重置到首页
   * @param param
   */
  static resetToHomePage = param => {
    const {navigation} = param;
    navigation.navigate('homePage');
  };
}
