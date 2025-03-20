import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, useWindowDimensions } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol, IconSymbolName } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ScreenAdapt } from '@/constants/ScreenAdapt';

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
  }
];

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();
  const mediumScreen = width >  ScreenAdapt.smallScreen;
  const tabBarActiveColor = Colors[colorScheme ?? 'light'];
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tabBarActiveColor.tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarPosition: mediumScreen ? 'left' : 'bottom',
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {
            minWidth: mediumScreen ? 100 : undefined,
          },
        }),
      }}>
      {tabConfigs.map((tab) => {
        return (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon:
            ({ focused }) => {
              return <IconSymbol size={28} name={tab.icon} color={ focused ? tabBarActiveColor.tabIconSelected : tabBarActiveColor.tabIconDefault }
              />},
          }}
        />
      )})}
    </Tabs>
  );
}
