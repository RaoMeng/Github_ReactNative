import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {FLAG_LANGUAGE} from '../helpers/dao/LanguageDao';

/**
 * Created by RaoMeng on 2019/9/14
 * Desc: 菜单配置
 */

/**
 * 我的页面菜单配置
 * @type {*[]}
 */
export const MINE_MENU = [
  {
    type: '',
    menus: [
      {
        name: '教程',
        iconEle: Ionicons,
        iconName: 'ios-bookmarks',
        page: 'webViewPage',
        params: {
          title: 'RaoMeng的主页',
          url: 'https://github.com/RaoMeng',
        },
        childMenus: [],
      },
    ],
  },
  {
    type: '趋势管理',
    menus: [
      {
        name: '自定义语言',
        iconEle: Ionicons,
        iconName: 'md-checkbox-outline',
        page: 'customKeyPage',
        params: {
          flag: FLAG_LANGUAGE.flag_language,
        },
      },
      {
        name: '语言排序',
        iconEle: MaterialCommunityIcons,
        iconName: 'sort',
        page: 'sortKeyPage',
        params: {
          flag: FLAG_LANGUAGE.flag_language,
        },
      },
    ],
  },
  {
    type: '最热管理',
    menus: [
      {
        name: '自定义标签',
        iconEle: Ionicons,
        iconName: 'md-checkbox-outline',
        page: 'customKeyPage',
        params: {
          flag: FLAG_LANGUAGE.flag_key,
        },
      },
      {
        name: '标签排序',
        iconEle: MaterialCommunityIcons,
        iconName: 'sort',
        page: 'sortKeyPage',
        params: {
          flag: FLAG_LANGUAGE.flag_key,
        },
      },
      {
        name: '标签移除',
        iconEle: Ionicons,
        iconName: 'md-remove',
        page: 'customKeyPage',
        params: {
          flag: FLAG_LANGUAGE.flag_key,
          isRemoveKey: true,
        },
      },
    ],
  },
  {
    type: '设置',
    menus: [
      {
        name: '自定义主题',
        iconEle: Ionicons,
        iconName: 'ios-color-palette',
      },
      {
        name: '关于作者',
        iconEle: Octicons,
        iconName: 'smiley',
        page: 'aboutMePage',
      },
      {
        name: '反馈',
        iconEle: MaterialIcons,
        iconName: 'feedback',
      },
      {
        name: 'CodePush',
        iconEle: MaterialIcons,
        iconName: 'feedback',
        page: 'codePushPage',
      },
    ],
  },
];

/**
 * 关于页面菜单
 * @type {Array}
 */
export const ABOUT_MENU = {
  type: '',
  menus: [
    {
      name: '教程',
      iconEle: Ionicons,
      iconName: 'ios-bookmarks',
      page: 'webViewPage',
      params: {
        title: 'RaoMeng的主页',
        url: 'https://github.com/RaoMeng',
      },
    },
    {
      name: '关于作者',
      iconEle: Octicons,
      iconName: 'smiley',
      page: 'aboutMePage',
      params: {},
      childMenus: [],
    },
    {
      name: '反馈',
      iconEle: MaterialIcons,
      iconName: 'feedback',
      page: '',
      params: {},
      childMenus: [],
    },
  ],
};

/**
 * 关于作者菜单
 * @type {{menus: *[], type: string}}
 */
export const ABOUT_ME_MENU = {
  type: '',
  menus: [
    {
      name: '技术博客',
      iconEle: Ionicons,
      iconName: 'ios-laptop',
      isExpand: false,
      childMenus: [
        {
          name: 'CSDN',
          page: 'webViewPage',
          params: {
            title: 'RaoMeng的CSDN',
            url: 'https://blog.csdn.net/RaoMeng1995',
          },
        },
        {
          name: '简书',
          page: 'webViewPage',
          params: {
            title: 'RaoMeng的简书',
            url: 'https://www.jianshu.com/u/7fd9272259a4',
          },
        },
        {
          name: '思否',
          page: 'webViewPage',
          params: {
            title: 'RaoMeng的思否',
            url: 'https://segmentfault.com/u/raomeng',
          },
        },
        {
          name: 'GitHub',
          page: 'webViewPage',
          params: {
            title: 'RaoMeng的GitHub',
            url: 'https://github.com/RaoMeng',
          },
        },
      ],
    },
    {
      name: '联系方式',
      iconEle: Ionicons,
      iconName: 'ios-contacts',
      isExpand: false,
      childMenus: [
        {
          name: 'QQ:3039904317',
        },
        {
          name: 'Email:raomeng0109@163.com',
        },
      ],
    },
  ],
};
