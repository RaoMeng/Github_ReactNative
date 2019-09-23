import actionTypes from '../constant/actionTypes';
import {FLAG_LANGUAGE} from '../../helpers/dao/LanguageDao';

const defaultState = {
  languages: [],
  keys: [],
};

export default (state = defaultState, action) => {
  if (action == undefined) {
    return state;
  }

  switch (action.type) {
    case actionTypes.LANGUAGE_LOAD_SUCCESS:
      if (action.flag == FLAG_LANGUAGE.flag_key) {
        return {
          ...state,
          keys: action.languages,
        };
      } else if (action.flag == FLAG_LANGUAGE.flag_language) {
        return {
          ...state,
          languages: action.languages,
        };
      }
    default:
      return state;
  }
};
