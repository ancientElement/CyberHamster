import { StyleSheet, TextInput, Animated } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { NoOutlineTouchableOpacity } from './NoOutlineTouchableOpacity';

interface HeaderBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
  onRefresh: () => void;
  rotateAnim: Animated.Value;
}

export function HeaderBar({ searchQuery, onSearchChange, onSearch, onRefresh, rotateAnim }: HeaderBarProps) {
  return (
    <ThemedView style={styles.header}>
      <ThemedText type='title' style={styles.brand}>松果</ThemedText>
      <Animated.View style={[{
        transform: [{
          rotate: rotateAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
          })
        }],
        transformOrigin: 'center'
      }]}>
        <NoOutlineTouchableOpacity onPress={onRefresh}>
          <IconSymbol name="car.side.air.fresh" weight='light' size={20} color="#000" />
        </NoOutlineTouchableOpacity>
      </Animated.View>
      <TextInput
        style={styles.searchInput}
        placeholder="搜索收藏..."
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={onSearchChange}
        onSubmitEditing={onSearch}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 20,
    gap: 5
  },
  brand: {
    fontSize: 15,
  },
  searchInput: {
    flex: 1,
    marginLeft: 16,
    height: 36,
    borderRadius: 18,
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0'
  }
});