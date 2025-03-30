import { Tabs, usePathname } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, useWindowDimensions, Text } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol, IconSymbolName } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ScreenAdapt } from '@/constants/ScreenAdapt';
import { ThemedText } from '@/components/ThemedText';

type TabConfig = {
  name: string;
  title: string;
  icon: IconSymbolName;
};

const tabConfigs: TabConfig[] = [
  {
    name: 'index',
    title: 'Home',
    icon: 'house.fill'
  },
  {
    name: 'explore',
    title: 'Explore',
    icon: 'paperplane.fill'
  },
  {
    name: 'memos',
    title: 'Collection',
    icon: 'bookmark.fill'
  },
  {
    name: 'navigation',
    title: 'Navigation',
    icon: 'globe',
  },
  {
    name: 'login',
    title: 'Login',
    icon: 'house',
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
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarPosition: mediumScreen ? 'left' : 'bottom',
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {
            minWidth: mediumScreen ? 200 : undefined,
            backgroundColor: Colors[colorScheme ?? 'light'].background,
          },
        }),
        tabBarActiveTintColor: tabBarActiveColor.tabIconSelected,
        tabBarInactiveTintColor: tabBarActiveColor.tabIconDefault,
      }}>
      {tabConfigs.map((tab) => {
        // 检查当前路径是否匹配此标签
        const isActive = pathname.includes(`/${tab.name}`);
        return (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              title: tab.title,
              tabBarIcon: () => renderTabIcon(tab, isActive),
              tabBarLabel: () => renderTabLabel(tab, isActive),
            }}
          />
        )
      })}
    </Tabs>
  );
}
