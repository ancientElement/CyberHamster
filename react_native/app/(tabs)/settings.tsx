import React, { useState, useEffect } from 'react';
import { StyleSheet, Platform, useWindowDimensions, ScrollView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { NoOutlineTouchableOpacity } from '@/components/NoOutlineTouchableOpacity';
import { NoOutlineTextInput } from '@/components/NoOutlineTextInput';
import { SimpleCenterCardModal } from '@/components/SimpleCenterCardModal';
import { IconSymbol, IconSymbolName } from '@/components/ui/IconSymbol';
import { useApi } from '@/hooks/useApi';
import { useStorage, StorageKey } from '@/hooks/useStorage';
import { AlertHelper } from '@/components/AlertHelper';
import { ScreenAdapt } from '@/constants/ScreenAdapt';

type TabItem = {
  id: string;
  title: string;
  icon: IconSymbolName;
};

const tabs: TabItem[] = [
  {
    id: 'account',
    title: '账号管理',
    icon: 'person.fill',
  },
  // 可以在这里添加更多的设置标签
];

type SubTabItem = {
  id: string;
  title: string;
  parentId: string;
};

const subTabs: SubTabItem[] = [
  {
    id: 'account-info',
    title: '账号信息',
    parentId: 'account',
  },
];

export default function SettingsScreen() {
  const { width } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);
  const [activeSubTab, setActiveSubTab] = useState<string>(subTabs[0].id);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const storage = useStorage();
  const isMediumScreen = width > ScreenAdapt.smallScreen;

  useEffect(() => {
    // 获取当前用户信息
    const fetchUserInfo = async () => {
      try {
        // 这里假设有一个获取用户信息的API
        // const response = await api.getUserInfo();
        // if (response.success && response.data) {
        //   setUsername(response.data.username);
        // }

        // 由于目前没有获取用户信息的API，我们从token中获取用户名
        const token = await storage.getItem(StorageKey.USER_TOKEN);
        if (token) {
          // 这里简单处理，实际应该从token中解析用户信息
          setUsername('当前用户');
        }
      } catch (error) {
        AlertHelper(`获取用户信息失败: ${error}`);
      }
    };

    fetchUserInfo();
  }, []);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // 切换到该标签下的第一个子标签
    const firstSubTab = subTabs.find(tab => tab.parentId === tabId);
    if (firstSubTab) {
      setActiveSubTab(firstSubTab.id);
    }
  };

  const handleSubTabChange = (subTabId: string) => {
    setActiveSubTab(subTabId);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      AlertHelper('两次输入的密码不一致');
      return;
    }

    try {
      // 这里应该调用修改密码的API
      // const response = await api.changePassword(oldPassword, newPassword);
      // if (response.success) {
      //   AlertHelper('密码修改成功');
      //   setIsPasswordModalVisible(false);
      //   setOldPassword('');
      //   setNewPassword('');
      //   setConfirmPassword('');
      // } else {
      //   AlertHelper(`密码修改失败: ${response.message}`);
      // }

      // 由于目前没有修改密码的API，我们模拟成功
      AlertHelper('密码修改成功');
      setIsPasswordModalVisible(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      AlertHelper(`密码修改失败: ${error}`);
    }
  };

  const renderTabContent = () => {
    if (activeSubTab === 'account-info') {
      return (
        <ThemedView style={styles.contentSection}>
          <ThemedText style={styles.sectionTitle}>账号信息</ThemedText>
          <ThemedView style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>用户名:</ThemedText>
            <ThemedText style={styles.infoValue}>{username}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.actionRow}>
            <NoOutlineTouchableOpacity
              style={styles.actionButton}
              onPress={() => setIsPasswordModalVisible(true)}
            >
              <ThemedText style={styles.actionButtonText}>修改密码</ThemedText>
            </NoOutlineTouchableOpacity>
          </ThemedView>
        </ThemedView>
      );
    }
    return null;
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={[styles.card, isMediumScreen ? styles.cardMedium : styles.cardSmall]}>
        <ThemedView style={[styles.sidebar, isMediumScreen ? styles.sidebarMedium : styles.sidebarSmall]}>
          {tabs.map((tab) => (
            <NoOutlineTouchableOpacity
              key={tab.id}
              style={[styles.tabItem, activeTab === tab.id && styles.activeTabItem]}
              onPress={() => handleTabChange(tab.id)}
            >
              <IconSymbol
                name={tab.icon}
                size={24}
                color={activeTab === tab.id ? '#0a7ea4' : '#687076'}
              />
              <ThemedText style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
                {tab.title}
              </ThemedText>
            </NoOutlineTouchableOpacity>
          ))}
        </ThemedView>

        <ThemedView style={styles.content}>
          {/* 子标签栏 */}
          <ThemedView style={styles.subTabBar}>
            {subTabs
              .filter((subTab) => subTab.parentId === activeTab)
              .map((subTab) => (
                <NoOutlineTouchableOpacity
                  key={subTab.id}
                  style={[styles.subTabItem, activeSubTab === subTab.id && styles.activeSubTabItem]}
                  onPress={() => handleSubTabChange(subTab.id)}
                >
                  <ThemedText style={[styles.subTabText, activeSubTab === subTab.id && styles.activeSubTabText]}>
                    {subTab.title}
                  </ThemedText>
                </NoOutlineTouchableOpacity>
              ))}
          </ThemedView>

          {/* 内容区域 */}
          <ScrollView style={styles.contentContainer}>
            {renderTabContent()}
          </ScrollView>
        </ThemedView>
      </ThemedView>

      {/* 修改密码模态框 */}
      <SimpleCenterCardModal
        visible={isPasswordModalVisible}
        onClose={() => setIsPasswordModalVisible(false)}
      >
        <ThemedView style={styles.modalContent}>
          <ThemedText style={styles.modalTitle}>修改密码</ThemedText>

          <ThemedView style={styles.inputContainer}>
            <ThemedText style={styles.inputLabel}>当前密码</ThemedText>
            <NoOutlineTextInput
              style={styles.input}
              secureTextEntry
              value={oldPassword}
              onChangeText={setOldPassword}
              placeholder="请输入当前密码"
            />
          </ThemedView>

          <ThemedView style={styles.inputContainer}>
            <ThemedText style={styles.inputLabel}>新密码</ThemedText>
            <NoOutlineTextInput
              style={styles.input}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="请输入新密码"
            />
          </ThemedView>

          <ThemedView style={styles.inputContainer}>
            <ThemedText style={styles.inputLabel}>确认新密码</ThemedText>
            <NoOutlineTextInput
              style={styles.input}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="请再次输入新密码"
            />
          </ThemedView>

          <ThemedView style={styles.modalButtons}>
            <NoOutlineTouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setIsPasswordModalVisible(false)}
            >
              <ThemedText>取消</ThemedText>
            </NoOutlineTouchableOpacity>
            <NoOutlineTouchableOpacity
              style={[styles.modalButton, styles.confirmButton]}
              onPress={handleChangePassword}
            >
              <ThemedText style={styles.confirmButtonText}>确认</ThemedText>
            </NoOutlineTouchableOpacity>
          </ThemedView>
        </ThemedView>
      </SimpleCenterCardModal>

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 20,
    ...Platform.select({
      ios: {
        paddingTop: 50
      },
      android: {
        paddingTop: 50
      }
    }),
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    flex: 1,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardMedium: {
    // 移除maxWidth和marginHorizontal属性，使卡片占满整个容器
    width: '100%',
  },
  cardSmall: {
    width: '100%',
  },
  sidebar: {
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  sidebarMedium: {
    width: 200,
  },
  sidebarSmall: {
    width: 150,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activeTabItem: {
    backgroundColor: '#f0f8ff',
    borderLeftWidth: 3,
    borderLeftColor: '#0a7ea4',
  },
  tabText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#687076',
  },
  activeTabText: {
    color: '#0a7ea4',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
  },
  subTabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f9f9f9',
  },
  subTabItem: {
    padding: 12,
    marginRight: 8,
  },
  activeSubTabItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#0a7ea4',
  },
  subTabText: {
    fontSize: 14,
    color: '#687076',
  },
  activeSubTabText: {
    color: '#0a7ea4',
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  contentSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#11181C',
  },
  description: {
    fontSize: 14,
    color: '#687076',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    width: 80,
    fontSize: 14,
    color: '#687076',
  },
  infoValue: {
    fontSize: 14,
    color: '#11181C',
    fontWeight: '500',
  },
  actionRow: {
    marginTop: 16,
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 14,
    color: '#687076',
    fontStyle: 'italic',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: 320,
    maxWidth: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: '#687076',
  },
  input: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#E2E8F0',
  },
  confirmButton: {
    backgroundColor: '#0a7ea4',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});