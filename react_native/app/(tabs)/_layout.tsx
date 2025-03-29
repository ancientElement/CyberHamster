import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, useWindowDimensions, Text } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol, IconSymbolName } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ScreenAdapt } from '@/constants/ScreenAdapt';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

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

  useEffect(() => {
    setMediumScreen(width > ScreenAdapt.smallScreen);
  }, [width]);

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
      }}>
      {tabConfigs.map((tab) => {
        return (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              title: tab.title,
              tabBarIcon:
                ({ focused, color, size }: { focused: boolean, color: string, size: number }) => {
                  return <IconSymbol size={28} name={tab.icon} color={focused ? tabBarActiveColor.background : tabBarActiveColor.tabIconDefault}
                  />
                },
              tabBarLabel: ({ focused, color }: { focused: boolean, color: string }) => {
                return <Text style={
                  [
                    {
                      color: focused ? tabBarActiveColor.background : tabBarActiveColor.tabIconDefault,
                      fontSize: mediumScreen ? 14 : 10,
                      marginLeft: mediumScreen ? 10 : 0,
                      fontWeight: 'bold',
                    },
                  ]
                }>{tab.title}</Text>
              }
            }}
          />
        )
      })}
    </Tabs>
  );
}
