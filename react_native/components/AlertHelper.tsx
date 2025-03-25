import { Alert, Platform, ToastAndroid } from "react-native";

// 事件处理
export const AlertHelper = (message: string) => {
  if (Platform.OS === 'web') {
    window.alert(message);
  } else if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert('提示', message);
  }
};
