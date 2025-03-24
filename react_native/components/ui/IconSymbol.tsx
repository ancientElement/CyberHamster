// This file is a fallback for using MaterialIcons on Android and web.

import { FontAwesome6 } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight } from 'expo-symbols';
import React from 'react';
import { OpaqueColorValue, StyleProp } from 'react-native';
import { TextStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

// Add your SFSymbol to MaterialIcons mappings here.
const MAPPING = {
  // See MaterialIcons here: https://icons.expo.fyi
  // See SF Symbols in the SF Symbols app on Mac.
  'house.fill': {name: 'home',lib:'material'},
  'paperplane.fill': {name:'send',lib:'material'},
  'chevron.left.forwardslash.chevron.right': {name:'code',lib:'material'},
  'chevron.right': {name:'chevron-right',lib:'material'},
  'bookmark.fill': {name:'collections-bookmark',lib:'material'},
  'pencil.line': {name:'edit',lib:'font-awesome'},
  'globe': {name:'public',lib:'material'},
  'trash': {name:'trash-can',lib:'font-awesome'},
  'text.document': {name:'copy',lib:'font-awesome'},
  'checkmark': {name:'check',lib:'font-awesome'},
  'link': {name:'link',lib:'font-awesome'},
  'bookmark': {name:'book-bookmark',lib:'font-awesome'},
  'chevron.up': {name:'chevron-up',lib:'font-awesome'},
  'chevron.down': {name:'chevron-down',lib:'font-awesome'},
} as Partial<
  Record<
    import('expo-symbols').SymbolViewProps['name'], {
      name: React.ComponentProps<typeof MaterialIcons>['name'] | React.ComponentProps<typeof FontAwesome6>['name'],
      lib: 'material' | 'font-awesome'
    }
  >
>;

export type IconSymbolName = keyof typeof MAPPING;

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to MaterialIcons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const iconlib = MAPPING[name]?.lib;
  if (iconlib === 'font-awesome') {
    return <FontAwesome6 color={color} size={size} name={MAPPING[name]?.name} style={style} />;
  }
  return <MaterialIcons color={color} size={size} name={MAPPING[name]?.name} style={style} />;
}
