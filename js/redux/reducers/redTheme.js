import actionTypes from '../constant/actionTypes';
import ThemeFactory, {ThemeFlags} from '../../configs/ThemeFactory';

const defaultState = {
  ...ThemeFactory.createTheme(ThemeFlags.Default),
  customThemeViewVisible: false,
};

const redTheme = (state = defaultState, action) => {
  if (action == undefined) {
    return state;
  }

  switch (action.type) {
    case actionTypes.THEME_INIT:
      return defaultState;
    case actionTypes.THEME_CHANGE:
      return {
        ...state,
        ...action,
      };
    case actionTypes.SHOW_THEME_VIEW:
      return {
        ...state,
        customThemeViewVisible: action.customThemeViewVisible,
      };
    default:
      return state;
  }
};

export default redTheme;
