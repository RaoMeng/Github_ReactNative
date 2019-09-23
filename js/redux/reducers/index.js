/**
 * Created by RaoMeng on 2019/9/9
 * Desc: 数据处理中心
 */
import {combineReducers} from 'redux';
import redTheme from './redTheme';
import redNav from './redNavigation';
import redPopular from './redPopular';
import redTrending from './redTrending';
import redFavorite from './redFavorite';
import redLanguages from './redLanguages';

const reducers = combineReducers({
  nav: redNav,
  theme: redTheme,
  popular: redPopular,
  trending: redTrending,
  favorite: redFavorite,
  languages: redLanguages,
});

export default reducers;
