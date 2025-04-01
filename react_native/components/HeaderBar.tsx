import { StyleSheet, Animated, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { NoOutlineTouchableOpacity } from './NoOutlineTouchableOpacity';
import { NoOutlineTextInput } from './NoOutlineTextInput';

interface HeaderBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
  onRefresh: () => void;
  rotateAnim: Animated.Value;
  onLayoutChange?: () => void;
  currentColumns?: number;
}

export function HeaderBar({ searchQuery, onSearchChange, onSearch, onRefresh, rotateAnim, onLayoutChange, currentColumns = 0 }: HeaderBarProps) {
  // const handleLayoutChange = () => {
  //   if (onLayoutChange) {
  //     // 根据当前列数和屏幕尺寸限制列数切换
  //     // 使用window.innerWidth获取当前屏幕宽度
  //     const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
  //     const isSmallScreen = screenWidth <= 768; // ScreenAdapt.smallScreen
  //     const isMediumScreen = screenWidth > 768 && screenWidth <= 992; // ScreenAdapt.mediumScreen

  //     let nextColumns = currentColumns;

  //     if (isSmallScreen) {
  //       // 小屏幕固定为1列
  //       nextColumns = 1;
  //     } else if (isMediumScreen) {
  //       // 中屏幕只允许1-2列
  //       nextColumns = currentColumns >= 2 ? 1 : 2;
  //     } else {
  //       // 大屏幕允许1-3列
  //       nextColumns = currentColumns >= 3 ? 1 : currentColumns + 1;
  //     }

  //     onLayoutChange(nextColumns);
  //   }
  // };

  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        <View style={styles.logoBorder}></View>
        <ThemedText type='title' style={styles.brand}>松果</ThemedText>
        <Animated.View style={[styles.refreshButton, {
          transform: [{
            rotate: rotateAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '360deg']
            })
          }],
        }]}>
          <NoOutlineTouchableOpacity onPress={onRefresh}>
            <IconSymbol name="car.side.air.fresh" weight='light' size={20} color="#000" />
          </NoOutlineTouchableOpacity>
        </Animated.View>
      </View>

      <View style={styles.rightContainer}>
        <NoOutlineTextInput
          style={styles.searchInput}
          placeholder="搜索收藏..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={onSearchChange}
          onSubmitEditing={onSearch}
        />
        {onLayoutChange && (
          <NoOutlineTouchableOpacity style={styles.layoutButton} onPress={onLayoutChange}>
            <ThemedText style={styles.layoutButtonText}>{currentColumns}</ThemedText>
          </NoOutlineTouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBorder: {
    width: 4,
    height: 20,
    backgroundColor: '#0a7ea4',
    borderRadius: 2,
    marginRight: 8,
  },
  brand: {
    fontSize: 15,
  },
  refreshButton: {
    marginLeft: 5,
  },
  searchInput: {
    height: 36,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cccccc',
    width: 150,
    fontSize: 14,
    shadowColor: '#888',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  layoutButton: {
    height: 36,
    width: 36,
    borderRadius: 8,
    backgroundColor: '#0a7ea4',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#888',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  layoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});