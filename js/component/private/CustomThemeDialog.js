import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableHighlight,
  Platform,
  Dimensions,
  FlatList,
} from 'react-native';
import ThemeDao from '../../helpers/dao/ThemeDao';
import GlobalStyles from '../../configs/GlobalStyles';
import ThemeFactory, {ThemeFlags} from '../../configs/ThemeFactory';
import {connect} from 'react-redux';
import actions from '../../redux/actions';

/**
 * Created by RaoMeng on 2019/9/12
 * Desc: 主题样式修改弹框
 */

const window = Dimensions.get('window');

class CustomThemeDialog extends Component {
  constructor(props) {
    super(props);
    this.themeDao = new ThemeDao();
  }

  render() {
    return this.props.visible ? (
      <View style={GlobalStyles.root_container}>
        {this._renderContentView()}
      </View>
    ) : null;
  }

  _renderContentView = () => {
    return (
      <Modal
        animationType={'slide'}
        transparent={true}
        visible={this.props.visible}
        onRequestClose={this.props.onClose}>
        <FlatList
          data={Object.keys(ThemeFlags)}
          style={styles.modalContainer}
          numColumns={3}
          keyExtractor={(item, index) => index + ''}
          renderItem={({item, index}) => {
            return (
              <TouchableHighlight
                style={{
                  width: (window.width - 32) / 3,
                  height: (window.width - 32) / 3,
                  padding: 4,
                }}
                underlayColor={'white'}
                onPress={this._onSelectTheme.bind(this, item)}>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 8,
                    backgroundColor: ThemeFlags[item],
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      color: 'white',
                      fontWeight: '500',
                    }}>
                    {item}
                  </Text>
                </View>
              </TouchableHighlight>
            );
          }}
        />
      </Modal>
    );
  };

  _onSelectTheme = themeKey => {
    const {onThemeChange, onClose} = this.props;
    onClose();
    this.themeDao._save(ThemeFlags[themeKey]);
    onThemeChange(ThemeFactory.createTheme(ThemeFlags[themeKey]));
  };
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  onThemeChange: theme => {
    dispatch(actions.themeChange(theme));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CustomThemeDialog);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    margin: 12,
    marginTop: Platform.OS === 'ios' ? 32 : 12,
    marginBottom: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: 'gray',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
    padding: 4,
  },
});
