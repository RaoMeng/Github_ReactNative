import AsyncStorage from '@react-native-community/async-storage';
import keys from '../../configs/json/keys';
import langs from '../../configs/json/langs';
import ThemeFactory, {ThemeFlags} from '../../configs/ThemeFactory';

/**
 * Created by RaoMeng on 2019/9/15
 * Desc: 主题样式的操作类
 */

const THEME_KEY = 'theme_key';
export default class ThemeDao {
  /**
   * 获取当前主题
   * @returns {Promise<R>}
   */
  getTheme = () => {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(THEME_KEY, (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        if (!result) {
          this._save(ThemeFlags.Default);
          result = ThemeFlags.Default;
        }
        resolve(ThemeFactory.createTheme(result));
      });
    });
  };

  _save = themeFlag => {
    AsyncStorage.setItem(THEME_KEY, themeFlag, error => {
    });
  };
}
