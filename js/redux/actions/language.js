import LanguageDao from '../../helpers/dao/LanguageDao';
import actionTypes from '../constant/actionTypes';

export const onLoadLanguages = flagKey => {
  return dispatch => {
    new LanguageDao(flagKey)
      .getData()
      .then(result => {
        dispatch({
          type: actionTypes.LANGUAGE_LOAD_SUCCESS,
          languages: result,
          flag: flagKey,
        });
      })
      .catch(error => {
        console.log(error);
      });
  };
};
