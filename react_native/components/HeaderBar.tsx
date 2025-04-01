import { StyleSheet, TextInput, Animated,View } from 'react-native';
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
}

export function HeaderBar({ searchQuery, onSearchChange, onSearch, onRefresh, rotateAnim }: HeaderBarProps) {
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

      <NoOutlineTextInput
        style={styles.searchInput}
        placeholder="搜索收藏..."
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={onSearchChange}
        onSubmitEditing={onSearch}
      />
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
  }
});