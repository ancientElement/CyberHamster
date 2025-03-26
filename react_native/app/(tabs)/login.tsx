import { AlertHelper } from '@/components/AlertHelper';
import { useApi } from '@/hooks/useApi';
import { StorageKey, useStorage } from '@/hooks/useStorage';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const api = useApi();
  const storage = useStorage();
  const handleLogin = async () => {
    try {
      const response = await api.login(username, password);
      if (response.success && response.data && response.data.access_token) {
        await storage.setItem(StorageKey.USER_TOKEN, response.data.access_token);
        router.replace('/');
      } else {
        AlertHelper(`登录失败, ${response.message}`);
      }
    } catch (error) {
      AlertHelper(`登录失败', ${error}`);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="用户名"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="密码"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="登录" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default LoginScreen;