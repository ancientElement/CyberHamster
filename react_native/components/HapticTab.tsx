import { ScreenAdapt } from '@/constants/ScreenAdapt';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Platform, useWindowDimensions } from 'react-native';

export function HapticTab(props: BottomTabBarButtonProps) {
  const { style, onPressIn, children, accessibilityState, ...otherProps } = props;
  const { width } = useWindowDimensions();
  const [mediumScreen, setMediumScreen] = useState(false);

  useEffect(() => {
    setMediumScreen(width > ScreenAdapt.smallScreen);
  }, [width]);

  return (
    <PlatformPressable
      {...otherProps}
      style={[
        Platform.OS === 'web' ? { outlineStyle: 'none' } as any : null,
        { backgroundColor: 'transparent' },
        {
          padding: mediumScreen?10:0,
          flexDirection: mediumScreen?'row':'column',
          alignItems: 'center',
        }
      ]}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === 'ios') {
          // Add a soft haptic feedback when pressing down on the tabs.
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}
    >
      {children}
    </PlatformPressable>
  );
}
