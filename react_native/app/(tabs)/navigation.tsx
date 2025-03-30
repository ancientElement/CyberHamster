import { StyleSheet, ActivityIndicator, RefreshControl, Platform, Animated } from 'react-native';
import { defaultWidth, NavigationCard } from '@/components/NavigationCard';
import { FlatGrid } from 'react-native-super-grid';
import { useApi } from '@/hooks/useApi';
import { useState, useEffect } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { bookmarkProps, Memo, MemoType } from '@/client-server-public/types';
import { HeaderBar } from '@/components/HeaderBar';

export default function NavigationScreen() {
  const api = useApi();

  const [bookmarks, setBookmarks] = useState<Memo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const rotateAnim = useState(new Animated.Value(0))[0];

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBookmarks();
    setRefreshing(false);
  };

  useEffect(() => {
      loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getMemosByType(MemoType.BOOKMARK);
      if (response.success && response.data) {
        setBookmarks(response.data);
      } else {
        setError(`获取数据时发生错误${response.message}`);
      }
    } catch (err) {
      setError(`获取数据时发生错误${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      await loadBookmarks();
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await api.searchMemos(searchQuery);
      if (response.success && response.data) {
        setBookmarks(response.data.filter(memo => memo.type === MemoType.BOOKMARK));
      } else {
        setError(`搜索失败${response.message}`);
      }
    } catch (err) {
      setError(`搜索时发生错误${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <HeaderBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
        onRefresh={() => {
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: Platform.OS !== 'web'
          }).start(() => rotateAnim.setValue(0));
          loadBookmarks();
        }}
        rotateAnim={rotateAnim}
      />
      {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
      {loading && <ActivityIndicator style={styles.loading} />}
      <FlatGrid
        itemDimension={defaultWidth}
        spacing={5}
        style={styles.grid}
        data={bookmarks}
        renderItem={({ item }) => {
          return <NavigationCard {...bookmarkProps(item)} />
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#0a7ea4']}
            tintColor="#0a7ea4"
          />
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      ios: {
        paddingTop: 30
      },
      android: {
        paddingTop: 30
      }
    }),
    paddingHorizontal: 16,
    backgroundColor: '#f2f2f2',
  },
  grid: {
    flex: 1,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center'
  },
  loading: {
    marginVertical: 10
  }
});