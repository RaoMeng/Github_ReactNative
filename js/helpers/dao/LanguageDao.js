import AsyncStorage from '@react-native-community/async-storage';
import keys from '../../configs/json/keys';
import langs from '../../configs/json/langs';

/**
 * Created by RaoMeng on 2019/9/15
 * Desc: 编程语言列表数据处理
 */
export const FLAG_LANGUAGE = {
  flag_language: 'language_dao_language',
  flag_key: 'language_dao_key',
};

export default class LanguageDao {
  constructor(flag) {
    this.flag = flag;
  }

  /**
   * 获取语言或标签
   * @returns {Promise<R>}
   */
  getData = () => {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(this.flag, (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        if (!result) {
          const data = this.flag === FLAG_LANGUAGE.flag_language ? langs : keys;
          this._save(data);
          resolve(data);
        } else {
          try {
            resolve(JSON.parse(result));
          } catch (e) {
            console.log(e);
            reject(e);
          }
        }
      });
    });
  };

  _save = objectData => {
    AsyncStorage.setItem(this.flag, JSON.stringify(objectData), error => {
    });
  };
}
