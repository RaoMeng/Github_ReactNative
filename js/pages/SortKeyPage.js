import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Alert,
  TouchableHighlight,
} from 'react-native';
import BackPressHelper from '../helpers/common/BackPressHelper';
import {connect} from 'react-redux';
import actions from '../redux/actions';
import LanguageDao, {FLAG_LANGUAGE} from '../helpers/dao/LanguageDao';
import NavigationBar from '../component/common/NavigationBar';
import ViewHelper from '../helpers/common/ViewHelper';
import NavigationUtil from '../helpers/utils/NavigationUtil';
import ArrayUtils from '../helpers/utils/ArrayUtils';
import SortableListView from 'react-native-sortable-listview';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

/**
 * Created by RaoMeng on 2019/9/15
 * Desc: 语言排序/标签排序
 */

class SortKeyPage extends Component {
  /**
   * 获取标签
   * @param props 获取原始数据
   * @param state 移除标签时使用
   * @returns {*}
   * @private
   */
  static _keys = (props, state) => {
    //如果state中有checkedArray则使用state中的checkedArray
    if (state && state.checkedArray && state.checkedArray.length) {
      return state.checkedArray;
    }
    const flag = SortKeyPage._flag(props);
    let dataArray = props.languages[flag] || [];
    const checkedKeys = [];
    for (let i = 0, len = dataArray.length; i < len; i++) {
      const dataObj = dataArray[i];
      if (dataObj.checked) {
        checkedKeys.push(dataObj);
      }
    }
    return checkedKeys;
  };

  static _flag = props => {
    const {flag} = props.navigation.state.params;
    return flag === FLAG_LANGUAGE.flag_key ? 'keys' : 'languages';
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const checkedArray = SortKeyPage._keys(nextProps, prevState);
    if (prevState.checkedArray !== checkedArray) {
      return {
        checkedArray,
      };
    }
    return null;
  }

  state = {
    checkedArray: SortKeyPage._keys(this.props),
  };

  constructor(props) {
    super(props);
    this.backPressHelper = new BackPressHelper({backPress: this._onBackPress});
    this.params = this.props.navigation.state.params;
    this.languageDao = new LanguageDao(this.params.flag);
  }

  componentDidMount(): void {
    this.backPressHelper.componentDidMount();
    //如果从props中获取到的标签为空，则从本地存储中读取标签
    if (SortKeyPage._keys(this.props).length === 0) {
      const {onLoadLanguages} = this.props;
      //这里需要重写getDerivedStateFromProps方法刷新页面
      onLoadLanguages(this.params.flag);
    }
  }

  componentWillUnmount(): void {
    this.backPressHelper.componentWillUnmount();
  }

  render() {
    const {checkedArray} = this.state;
    const title =
      this.params.flag === FLAG_LANGUAGE.flag_language
        ? '语言排序'
        : '标签排序';
    return (
      <View style={styles.root}>
        <NavigationBar
          title={title}
          leftButton={ViewHelper.getLeftBackButton(this._onBackPress)}
          rightButton={this._renderRightButton('保存', this._onRightClick)}
        />
        <SortableListView
          data={checkedArray}
          order={Object.keys(checkedArray)}
          onRowMoved={e => {
            const {checkedArray} = this.state;
            checkedArray.splice(e.to, 0, checkedArray.splice(e.from, 1)[0]);
            // this.forceUpdate();
            this.setState({
              checkedArray,
            });
          }}
          renderRow={this._renderListItem}
        />
      </View>
    );
  }

  _renderListItem = item => {
    const {theme} = this.props;
    return (
      <TouchableHighlight
        underlayColor={'#eee'}
        style={item.checked ? {} : styles.hidden}
        {...this.props.sortHandlers}>
        <View style={styles.itemRoot}>
          <MaterialCommunityIcons
            name={'sort'}
            size={16}
            style={{
              color: theme.themeColor,
            }}
          />
          <Text style={styles.itemText}>{item.name}</Text>
        </View>
      </TouchableHighlight>
    );
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
    if (
      !ArrayUtils.isEqual(
        this.state.checkedArray,
        SortKeyPage._keys(this.props),
      )
    ) {
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

  _onSaveChange = hadChecked => {
    if (!hadChecked) {
      //如果没有排序，则直接返回
      if (
        ArrayUtils.isEqual(
          SortKeyPage._keys(this.props),
          this.state.checkedArray,
        )
      ) {
        NavigationUtil.goBack(this.props.navigation);
        return;
      }
    }
    this.languageDao._save(this._getSortResult());
    //刷新语言的store
    const {onLoadLanguages} = this.props;
    onLoadLanguages(this.params.flag);
    NavigationUtil.goBack(this.props.navigation);
  };

  _getSortResult = () => {
    const flag = SortKeyPage._flag(this.props);
    //从原始全部数据中复制一份数据出来，以便对这份数据进行重新排序
    let sortResultArray = ArrayUtils.clone(this.props.languages[flag]);
    //获取排序之前的原始被选中数据的排列顺序
    const originalCheckedArray = SortKeyPage._keys(this.props);
    //遍历排序之前的数据，用排序后的数据checkedArray进行替换
    for (let i = 0, len = originalCheckedArray.length; i < len; i++) {
      const originalObj = originalCheckedArray[i];
      //找到要替换的元素所在位置
      const index = this.props.languages[flag].indexOf(originalObj);
      //替换
      sortResultArray.splice(index, 1, this.state.checkedArray[i]);
    }
    return sortResultArray;
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
)(SortKeyPage);

const window = Dimensions.get('window');
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  itemRoot: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  itemText: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  hidden: {
    height: 0,
  },
});
