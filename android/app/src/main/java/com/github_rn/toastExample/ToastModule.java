package com.github_rn.toastExample;

import android.widget.Toast;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

public class ToastModule extends ReactContextBaseJavaModule {
    /**
     * 模块名前的RCT前缀会被自动移除。所以如果返回的字符串为"RCTToastExample"，
     * 在JavaScript端依然可以通过React.NativeModules.ToastExample访问到这个模块
     */
    public static final String NAME = "RCTToastExample";

    private static final String DURATION_SHORT_KEY = "SHORT";
    private static final String DURATION_LONG_KEY = "LONG";

    public ToastModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
    }

    /**
     * ReactContextBaseJavaModule要求派生类实现getName方法。
     * 这个函数用于返回一个字符串名字，这个名字在JavaScript端标记这个模块。
     * 这里我们把这个模块叫做ToastExample，
     * 这样就可以在JavaScript中通过React.NativeModules.ToastExample访问到这个模块
     *
     * @return
     */
    @Nonnull
    @Override
    public String getName() {
        return NAME;
    }

    /**
     * 方法getContants返回了需要导出给JavaScript使用的常量。
     * 它并不一定需要实现，但在定义一些可以被JavaScript同步访问到的预定义的值时非常有用。
     *
     * @return
     */
    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put(DURATION_SHORT_KEY, Toast.LENGTH_SHORT);
        constants.put(DURATION_LONG_KEY, Toast.LENGTH_LONG);
        return constants;
    }

    /**
     * 要导出一个方法给JavaScript使用，
     * Java方法需要使用注解@ReactMethod。
     * 方法的返回类型必须为void。
     * React Native的跨语言访问是异步进行的，所以想要给JavaScript返回一个值的唯一办法是使用回调函数或者发送事件
     *
     * @param message
     * @param duration
     */
    @ReactMethod
    public void show(String message, int duration, Promise promise) {
        Toast.makeText(getReactApplicationContext(), message, duration).show();
        if (duration == Toast.LENGTH_SHORT) {
            /**
             * JS模块的回调
             */
            promise.resolve(DURATION_SHORT_KEY);
            WritableMap params = new WritableNativeMap();
            params.putString("key", DURATION_SHORT_KEY);
            params.putString("msg", message);
            /**
             * 向JS模块发送事件
             */
            getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("toast_event", params);
        } else if (duration == Toast.LENGTH_LONG) {
            promise.reject("500", DURATION_LONG_KEY);
            WritableMap params = new WritableNativeMap();
            params.putString("key", DURATION_LONG_KEY);
            params.putString("msg", message);
            getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("toast_event", params);
        }
    }
}
