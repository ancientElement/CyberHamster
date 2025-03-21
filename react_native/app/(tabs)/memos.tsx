import { StyleSheet, TextInput, useWindowDimensions, ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { MemoCard } from '@/components/MemoCard';
import { MemoEditor } from '@/components/MemoEditor';
import { ScreenAdapt } from '@/constants/ScreenAdapt';
import MasonryList from '@react-native-seoul/masonry-list';
import { useApi } from '@/hooks/useApi';
import { useState, useEffect } from 'react';
import { Memo, MemoType } from '@/api/types';

export default function CollectionScreen() {
  const { width } = useWindowDimensions();
  const isWideScreen = width > ScreenAdapt.mediumScreen;
  const isMediumScreen = width > ScreenAdapt.smallScreen;
  const api = useApi();

  const [memos, setMemos] = useState<Memo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadMemos();
  }, []);

  const loadMemos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getMemos();
      if (response.status === 200 && response.data) {
        setMemos(response.data);
      } else {
        setError('获取备忘录失败');
      }
    } catch (err) {
      setError('加载数据时发生错误');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      await loadMemos();
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await api.searchMemos(searchQuery);
      if (response.status === 200 && response.data) {
        setMemos(response.data);
      } else {
        setError('搜索失败');
      }
    } catch (err) {
      setError('搜索时发生错误');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMemo = async (content: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.createMemo({
        data:{
          type: MemoType.NOTE,
          noteContent: content
        }
      });
      if (response.status === 200) {
        await loadMemos();
      } else {
        setError('创建备忘录失败');
      }
    } catch (err) {
      setError('创建备忘录时发生错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.brand}>CyberHamster</ThemedText>
        <TextInput
          style={styles.searchInput}
          placeholder="搜索收藏..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
      </ThemedView>

      <MemoEditor onSubmit={handleCreateMemo} />
      {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
      {loading && <ActivityIndicator style={styles.loading} />}
      <MasonryList
        data={memos}
        keyExtractor={(item) => item.id}
        numColumns={isMediumScreen ? (isWideScreen ? 3 : 2) : 1}
        contentContainerStyle={styles.cardGrid}
        renderItem={({ item, i }) => {
          const memo = item as Memo;
          return <MemoCard data={memo} />
        }
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center'
  },
  loading: {
    marginVertical: 10
  },
  container: {
    flex: 1,
    padding: 16
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 20
  },
  brand: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  searchInput: {
    flex: 1,
    marginLeft: 16,
    height: 36,
    borderRadius: 18,
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0'
  },

  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  }
});