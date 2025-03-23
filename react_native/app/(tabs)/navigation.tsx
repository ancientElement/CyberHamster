import { StyleSheet, useWindowDimensions, ActivityIndicator } from 'react-native';
import { NavigationCard } from '@/components/NavigationCard';
import { ScreenAdapt } from '@/constants/ScreenAdapt';
import { FlatGrid } from 'react-native-super-grid';
import { useApi } from '@/hooks/useApi';
import { useState, useEffect } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { bookmarkProps, Memo, MemoType } from '@/client-server-public/types';

export default function NavigationScreen() {
  const { width } = useWindowDimensions();
  const isMediumScreen = width > ScreenAdapt.smallScreen;
  const api = useApi();

  const [bookmarks, setBookmarks] = useState<Memo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <ThemedView style={styles.container}>
      {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
      {loading && <ActivityIndicator style={styles.loading} />}
      <FlatGrid
        itemDimension={isMediumScreen ? 200 : 120}
        spacing={isMediumScreen ? 16 : 12}
        style={styles.grid}
        data={bookmarks}
        renderItem={({ item }) => {
          return <NavigationCard {...bookmarkProps(item)}/>
        }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  grid: {
    flex: 1
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