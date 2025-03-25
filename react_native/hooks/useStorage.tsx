import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export enum StorageKey {
  USER_TOKEN = 'userToken',
}

export function useStorage() {
  const getItem = async (key: string) => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  };

  const setItem = async (key: string, value: string) => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  };

  const deleteItem = async (key: string) => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  };

  return {
    getItem,
    setItem,
    deleteItem,
  };
};
