import { Tabs, usePathname } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, useWindowDimensions } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol, IconSymbolName } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ScreenAdapt } from '@/constants/ScreenAdapt';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useApi } from '@/hooks/useApi';

type TabConfig = {
  name: string;
  title: string;
  icon: IconSymbolName;
};

const tabConfigs: TabConfig[] = [
  {
    name: 'index',
    title: 'Collection',
    icon: 'bookmark.fill'
  },
  {
    name: 'navigation',
    title: 'Navigation',
    icon: 'globe',
  },
  {
    name: 'settings',
    title: '设置',
    icon: 'gear',
  },
];

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();
  const [mediumScreen, setMediumScreen] = useState(false);
  const tabBarActiveColor = Colors[colorScheme ?? 'light'];
  const pathname = usePathname();  // 获取当前路径

  useEffect(() => {
    setMediumScreen(width > ScreenAdapt.smallScreen);
  }, [width]);

  // 提取 tabBarIcon 渲染函数
  const renderTabIcon = (tab: TabConfig, isActive: boolean) => {
    return (
      <IconSymbol
        size={28}
        name={tab.icon}
        color={isActive ? tabBarActiveColor.tabIconSelected : tabBarActiveColor.tabIconDefault}
      />
    );
  };

  // 提取 tabBarLabel 渲染函数
  const renderTabLabel = (tab: TabConfig, isActive: boolean) => {
    return (
      <ThemedText
        type={mediumScreen ? 'default' : 'small'}
        style={{
          marginLeft: mediumScreen ? 10 : 0,
          color: isActive ? tabBarActiveColor.tabIconSelected : tabBarActiveColor.tabIconDefault
        }}
      >
        {tab.title}
      </ThemedText>
    );
  };

  return (
    <ThemedView style={[{
      backgroundColor: 'f2f2f2',
      height: '100%',
    }]}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarPosition: mediumScreen ? 'left' : 'bottom',
          tabBarActiveTintColor: tabBarActiveColor.tabIconSelected,
          tabBarInactiveTintColor: tabBarActiveColor.tabIconDefault,
          tabBarStyle: {
            minWidth: 150,
            marginVertical: mediumScreen ? 20 : 0,
            marginLeft: mediumScreen ? 8 : 0,
            borderRadius: mediumScreen ? 16 : 0,
            borderColor: '#e0e0e0',
            elevation: 2,
            ...Platform.select({
              web: {
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                transition: '0.3s',
              },
              ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              },
            }),
          },
        }}>
        {tabConfigs.map((tab) => {
          // 检查当前路径是否匹配此标签
          let isActive = false;
          if (pathname == '/' && tab.name == 'index') {
            isActive = true;
          } else if (pathname.startsWith(`/${tab.name}`)) {
            isActive = true;
          }
          return (
            <Tabs.Screen
              key={tab.name}
              name={tab.name}
              options={{
                title: tab.title,
                tabBarIcon: () => renderTabIcon(tab, isActive),
                tabBarLabel: () => renderTabLabel(tab, isActive),
                tabBarItemStyle: {
                  backgroundColor: isActive ? '#e6f7fc' : 'transparent',
                },
              }}
            />
          )
        })}
      </Tabs>
    </ThemedView>
  );
}