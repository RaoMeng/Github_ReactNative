import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert,
} from 'react-native';
import BackPressHelper from '../helpers/common/BackPressHelper';
import {connect} from 'react-redux';
import actions from '../redux/actions';
import LanguageDao, {FLAG_LANGUAGE} from '../helpers/dao/LanguageDao';
import NavigationBar from '../component/common/NavigationBar';
import ViewHelper from '../helpers/common/ViewHelper';
import CheckBox from '@react-native-community/checkbox';
import NavigationUtil from '../helpers/utils/NavigationUtil';
import ArrayUtils from '../helpers/utils/ArrayUtils';

/**
 * Created by RaoMeng on 2019/9/15
 * Desc: 自定义标签/自定义语言/标签移除
 */

class CustomKeyPage extends Component {
  /**
   * 获取标签
   * @param props
   * @param original 移除标签时使用，是否从props获取原始对的标签
   * @param state 移除标签时使用
   * @returns {*}
   * @private
   */
  static _keys = (props, original, state) => {
    const {flag, isRemoveKey} = props.navigation.state.params;
    const {languages} = props;
    const key = flag === FLAG_LANGUAGE.flag_key ? 'keys' : 'languages';
    if (isRemoveKey && !original) {
      //如果state中的keys为空则从props中获取
      return (
        (state &&
          state.langKeys &&
          state.langKeys.length > 0 &&
          state.langKeys) ||
        languages[key].map(item => {
          return {
            ...item,
            checked: false,
          };
        })
      );
    } else {
      return languages[key];
    }
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const keys = CustomKeyPage._keys(nextProps, null, prevState);
    if (prevState.langKeys !== keys) {
      return {
        langKeys: keys,
      };
    }
    return null;
  }

  state = {
    langKeys: [],
  };

  constructor(props) {
    super(props);
    this.backPressHelper = new BackPressHelper({backPress: this._onBackPress});
    this.params = this.props.navigation.state.params;
    this._changeValues = [];
    this.isRemoveKey = this.params.isRemoveKey;
    this.languageDao = new LanguageDao(this.params.flag);
  }

  componentDidMount(): void {
    this.backPressHelper.componentDidMount();
    //如果从props中获取到的标签为空，则从本地存储中读取标签
    if (CustomKeyPage._keys(this.props).length === 0) {
      const {onLoadLanguages} = this.props;
      //这里需要重写getDerivedStateFromProps方法刷新页面
      onLoadLanguages(this.params.flag);
    } else {
      this.setState({langKeys: CustomKeyPage._keys(this.props)});
    }
  }

  componentWillUnmount(): void {
    this.backPressHelper.componentWillUnmount();
  }

  render() {
    const {langKeys} = this.state;
    let title = this.isRemoveKey ? '标签移除' : '自定义标签';
    title =
      this.params.flag === FLAG_LANGUAGE.flag_language ? '自定义语言' : title;
    const rightButtonTitle = this.isRemoveKey ? '移除' : '保存';
    return (
      <View style={styles.root}>
        <NavigationBar
          title={title}
          leftButton={ViewHelper.getLeftBackButton(this._onBackPress)}
          rightButton={this._renderRightButton(
            rightButtonTitle,
            this._onRightClick,
          )}
        />
        <FlatList
          keyExtractor={(item, index) => index + ''}
          data={langKeys}
          numColumns={2}
          ItemSeparatorComponent={() => {
            return ViewHelper.getDividingLine();
          }}
          renderItem={({item, index}) => {
            return this._renderListItem(
              item,
              index,
              this._onCheckChanged.bind(this, index),
            );
          }}
        />
      </View>
    );
  }

  _renderListItem = (item, index, onCheckChanged) => {
    const {theme} = this.props;
    return (
      <View style={styles.itemRoot}>
        <Text style={styles.itemText}>{item.name}</Text>
        <CheckBox
          value={item.checked}
          tintColors={{
            true: theme.themeColor,
          }}
          onValueChange={value => onCheckChanged(value)}
        />
      </View>
    );
  };

  _onCheckChanged = (index, value) => {
    const {langKeys} = this.state;
    const checkKey = langKeys[index];
    checkKey.checked = !checkKey.checked;
    ArrayUtils.updateArray(this._changeValues, checkKey);
    this.setState({
      langKeys,
    });
  };

  _onRightClick = () => {
    this._onSaveChange();
  };

  _renderRightButton = (title, callback) => (
    <TouchableOpacity style={{alignItems: 'center'}} onPress={callback}>
      <Text style={{fontSize: 20, color: 'white'}}>{title}</Text>
    </TouchableOpacity>
  );

  /**
   * 页面回退事件
   * @private
   */
  _onBackPress = () => {
    if (this._changeValues.length > 0) {
      Alert.alert('提示', '是否保存修改？', [
        {
          text: '否',
          onPress: () => {
            NavigationUtil.goBack(this.props.navigation);
          },
        },
        {
          text: '是',
          onPress: this._onSaveChange,
        },
      ]);
    } else {
      NavigationUtil.goBack(this.props.navigation);
    }
    return true;
  };

  _onSaveChange = () => {
    if (this._changeValues.length <= 0) {
      NavigationUtil.goBack(this.props.navigation);
      return;
    }
    const {langKeys} = this.state;

    //移除标签的出路
    let keys;
    if (this.isRemoveKey) {
      for (let i = 0, len = this._changeValues.length; i < len; i++) {
        ArrayUtils.remove(
          (keys = CustomKeyPage._keys(this.props, true)),
          this._changeValues[i],
          'name',
        );
      }
    }

    this.languageDao._save(keys || langKeys);
    //刷新语言的store
    const {onLoadLanguages} = this.props;
    onLoadLanguages(this.params.flag);
    NavigationUtil.goBack(this.props.navigation);
  };
}

const mapStateToProps = state => ({
  languages: state.languages,
  theme: state.theme,
});

const mapDispatchToProps = dispatch => ({
  onLoadLanguages: flag => {
    dispatch(actions.onLoadLanguages(flag));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CustomKeyPage);

const window = Dimensions.get('window');
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  itemRoot: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    width: window.width / 2,
  },
  itemText: {
    flex: 1,
    fontSize: 18,
    color: '#333',
  },
});
