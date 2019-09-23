import {BackHandler} from 'react-native';

/**
 * Created by RaoMeng on 2019/9/12
 * Desc: Android 物理返回键处理
 */

export default class BackPressHelper {
  constructor(props) {
    this.props = props;
  }

  componentDidMount = () => {
    if (this.props.backPress) {
      BackHandler.addEventListener(
        'hardwareBackPress',
        this._onHardwareBackPress,
      );
    }
  };

  componentWillUnmount = () => {
    if (this.props.backPress) {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        this._onHardwareBackPress,
      );
    }
  };

  _onHardwareBackPress = e => {
    return this.props.backPress(e);
  };
}
