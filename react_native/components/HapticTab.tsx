import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export function HapticTab(props: BottomTabBarButtonProps) {
  const { style, onPressIn, children, accessibilityState, ...otherProps } = props;
  return (
    <PlatformPressable
      {...otherProps}
      style={[
        Platform.OS === 'web' ? { outlineStyle: 'none' } as any : null,
        style,
        { backgroundColor: accessibilityState?.selected ? '#0a7ea4' : 'transparent' },
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
