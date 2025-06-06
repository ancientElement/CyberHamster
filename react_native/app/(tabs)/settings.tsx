import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { IconSymbol, IconSymbolName } from '@/components/ui/IconSymbol';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { NoOutlineTouchableOpacity } from '@/components/NoOutlineTouchableOpacity';
import { useStorage, StorageKey } from '@/hooks/useStorage';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useApi } from '@/hooks/useApi';
import { ConfirmCardModal } from '@/components/ConfirmCardModal';

type TabItem = {
  key: string;
  title: string;
  icon: IconSymbolName;
};

const tabs: TabItem[] = [
  { key: 'account', title: '账户设置', icon: 'person.circle' },
  { key: 'general', title: '通用设置', icon: 'gear' },
  { key: 'about', title: '关于', icon: 'lock' },
];

export default function SettingsScreen() {
  const [activeTab, setActiveTab] = useState('account');
  const [username, setUsername] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    message: '',
    onConfirm: () => {},
  });
  const storage = useStorage();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const api = useApi();

  useEffect(() => {
    const fetchUsername = async () => {
      const storedUsername = await storage.getItem(StorageKey.USERNAME);
      setUsername(storedUsername);
    };
    fetchUsername();
  }, []);

  const handleLogout = async () => {
    await storage.deleteItem(StorageKey.USER_TOKEN);
    await storage.deleteItem(StorageKey.USERNAME);
    router.replace('/login');
  };

  const showModal = (title: string, message: string, onConfirm: () => void) => {
    setModalConfig({ message, onConfirm });
    setShowConfirmModal(true);
  };

  const renderTabBar = () => {
    return (
      <ThemedView style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabItem, activeTab === tab.key && styles.activeTabItem]}
            onPress={() => setActiveTab(tab.key)}
          >
            <IconSymbol
              name={tab.icon}
              size={20}
              color={activeTab === tab.key ? colors.tabIconSelected : colors.tabIconDefault}
            />
            <ThemedText
              style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}
            >
              {tab.title}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ThemedView>
    );
  };

  const renderAccountSettings = () => {
    return (
      <ThemedView style={styles.tabContent}>
        <ThemedView style={styles.settingItem}>
          <ThemedText style={styles.settingLabel}>用户名</ThemedText>
          <ThemedText style={styles.settingValue}>{username || '未登录'}</ThemedText>
        </ThemedView>
        <ThemedView style={styles.settingItem}>
          <NoOutlineTouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <ThemedText style={styles.logoutButtonText}>退出登录</ThemedText>
          </NoOutlineTouchableOpacity>
        </ThemedView>
      </ThemedView>
    );
  };

  const renderGeneralSettings = () => {
    return (
      <ThemedView style={styles.tabContent}>
        <ThemedView style={styles.settingItem}>
          <ThemedText style={styles.settingLabel}>修复标签格式</ThemedText>
          <NoOutlineTouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.tabIconSelected }]}
            onPress={() => {
              showModal(
                '确认修复',
                '确定要修复所有标签的格式吗？',
                async () => {
                  try {
                    const response = await api.fixTagFormat();
                    if (response.success) {
                      showModal('成功', '标签格式修复完成', () => {});
                    } else {
                      showModal('错误', response.message || '修复标签格式失败', () => {});
                    }
                  } catch (err) {
                    showModal('错误', '修复标签格式时发生错误', () => {});
                  }
                }
              );
            }}
          >
            <ThemedText style={styles.actionButtonText}>修复</ThemedText>
          </NoOutlineTouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.settingItem}>
          <ThemedText style={styles.settingLabel}>删除空标签</ThemedText>
          <NoOutlineTouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.tabIconSelected }]}
            onPress={() => {
              showModal(
                '确认删除',
                '确定要删除所有没有关联备忘录的标签吗？',
                async () => {
                  try {
                    const response = await api.deleteEmptyTags();
                    if (response.success) {
                      showModal('成功', '空标签删除完成', () => {});
                    } else {
                      showModal('错误', response.message || '删除空标签失败', () => {});
                    }
                  } catch (err) {
                    showModal('错误', '删除空标签时发生错误', () => {});
                  }
                }
              );
            }}
          >
            <ThemedText style={styles.actionButtonText}>删除</ThemedText>
          </NoOutlineTouchableOpacity>
        </ThemedView>

        <ConfirmCardModal
          visible={showConfirmModal}
          message={modalConfig.message}
          cancelText="取消"
          confirmText="确认"
          onClose={() => setShowConfirmModal(false)}
          onConfirm={() => {
            modalConfig.onConfirm();
            setShowConfirmModal(false);
          }}
        />
      </ThemedView>
    );
  };

  const renderAboutSettings = () => {
    return (
      <ThemedView style={styles.tabContent}>
        <ThemedText>关于内容</ThemedText>
      </ThemedView>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return renderAccountSettings();
      case 'general':
        return renderGeneralSettings();
      case 'about':
        return renderAboutSettings();
      default:
        return renderAccountSettings();
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.headerTitle}>设置</ThemedText>
      </ThemedView>
      {renderTabBar()}
      {renderContent()}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
    padding: 16,
    borderRadius: 16,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabBar: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    gap: 8,
  },
  activeTabItem: {
    backgroundColor: '#e6f7fc',
  },
  tabText: {
    fontSize: 14,
  },
  activeTabText: {
    fontWeight: 'bold',
  },
  tabContent: {
    flex: 1,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingLabel: {
    fontSize: 16,
  },
  settingValue: {
    fontSize: 16,
    color: '#666',
  },
  logoutButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});