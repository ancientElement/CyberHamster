import { StyleSheet, useWindowDimensions, ActivityIndicator, RefreshControl, Platform } from 'react-native';
import { defaultWidth, NavigationCard } from '@/components/NavigationCard';
import { ScreenAdapt } from '@/constants/ScreenAdapt';
import { FlatGrid } from 'react-native-super-grid';
import { useApi } from '@/hooks/useApi';
import { useState, useEffect } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { bookmarkProps, Memo, MemoType } from '@/client-server-public/types';
import { useIsFocused } from '@react-navigation/native';

export default function NavigationScreen() {
  const { width } = useWindowDimensions();
  const isMediumScreen = width > ScreenAdapt.smallScreen;
  const api = useApi();

  const [bookmarks, setBookmarks] = useState<Memo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBookmarks();
    setRefreshing(false);
  };

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      loadBookmarks();
    }
  }, [isFocused]);

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

  return (
    <ThemedView style={styles.container}>
      {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
      {loading && <ActivityIndicator style={styles.loading} />}
      <FlatGrid
        itemDimension={defaultWidth}
        spacing={isMediumScreen ? 16 : 12}
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