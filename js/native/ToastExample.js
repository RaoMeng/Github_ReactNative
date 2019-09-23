import {NativeModules} from 'react-native';

/**
 * Created by RaoMeng on 2019/9/19
 * Desc: 为了让你的功能从JavaScript端访问起来更为方便，
 * 通常我们都会把原生模块封装成一个JavaScript模块。
 * 这不是必须的，但省下了每次都从NativeModules中获取对应模块的步骤。
 * 这个JS文件也可以用于添加一些其他JavaScript端实现的功能。
 */

export default NativeModules.ToastExample;
