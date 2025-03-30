import { AlertHelper } from '@/components/AlertHelper';
import { useApi } from '@/hooks/useApi';
import { StorageKey, useStorage } from '@/hooks/useStorage';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { NoOutlineTextInput } from '@/components/NoOutlineTextInput';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

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
    <ThemedView style={styles.container}>
      <ThemedView style={[styles.card, styles.cardShadow]}>
        <ThemedView style={styles.header}>
          <IconSymbol name="person.circle" size={48} color="#0078D4" />
          <ThemedText style={styles.title}>登录</ThemedText>
          <ThemedText style={styles.subtitle}>欢迎使用 CyberHamster</ThemedText>
        </ThemedView>

        <ThemedView style={styles.inputContainer}>
          <ThemedView style={styles.inputWrapper}>
            <IconSymbol name="person" size={20} color="#666" />
            <NoOutlineTextInput
              style={styles.input}
              placeholder="用户名"
              value={username}
              onChangeText={setUsername}
              placeholderTextColor="#999"
            />
          </ThemedView>

          <ThemedView style={styles.inputWrapper}>
            <IconSymbol name="lock" size={20} color="#666" />
            <NoOutlineTextInput
              style={styles.input}
              placeholder="密码"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#999"
            />
          </ThemedView>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.loginButtonText}>登录</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    alignItems: 'center', // 修改为 alignItems
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 400,
    minWidth: 280,
  },
  cardShadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  inputContainer: {
    gap: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 5,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    padding: 0,
    height: 32,
  },
  loginButton: {
    backgroundColor: '#0b7699',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen;