import { StyleSheet, TextInput, useWindowDimensions, ActivityIndicator, Platform } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { MemoCard } from '@/components/MemoCard';
import { EditorMode, MemoEditor } from '@/components/MemoEditor';
import { ScreenAdapt } from '@/constants/ScreenAdapt';
import MasonryList from '@react-native-seoul/masonry-list';
import { useApi } from '@/hooks/useApi';
import { useState, useEffect } from 'react';
import { CreateMemoDto, Memo, MemoType } from '@/client-server-public/types';

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
      if (response.success && response.data) {
        setMemos(response.data);
      } else {
        setError(`获取备忘录失败${response.message}`);
      }
    } catch (err) {
      setError(`加载数据时发生错误${err}`);
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
      if (response.success && response.data) {
        setMemos(response.data);
      } else {
        setError(`搜索失败${response.message}`);
      }
    } catch (err) {
      setError(`搜索时发生错误${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMemo = async (memo: CreateMemoDto) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.createMemo(memo);
      if (response.success) {
        await loadMemos();
      } else {
        setError(`创建备忘录失败${response.message}`);
      }
    } catch (err) {
      setError(`创建备忘录时发生错误${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMemo = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.deleteMemo(id);
      if (response.success) {
        await loadMemos();
      } else {
        setError(`删除备忘录失败${response.message}`);
      }
    } catch (err) {
      setError(`删除备忘录时发生错误${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMemo = async (id: number, memo: CreateMemoDto) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.updateMemo(id, memo);
      if (response.success) {
        await loadMemos();
      } else {
        setError(`更新备忘录失败${response.message}`);
      }
    } catch (err) {
      setError(`更新备忘录时发生错误${err}`);
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

      <MemoEditor
        initMode={EditorMode.NOTE}
        always={false}
        onSubmit={(type, content, bookmark) => {
          handleCreateMemo({
            data: type === EditorMode.NOTE ? {
              type: MemoType.NOTE,
              noteContent: content!
            } : {
              type: MemoType.BOOKMARK,
              ...bookmark,
            }
          });
        }}
      />
      {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
      {loading && <ActivityIndicator style={styles.loading} />}
      <MasonryList
        onRefresh={loadMemos}
        data={memos}
        keyExtractor={(item) => item.id}
        numColumns={isMediumScreen ? (isWideScreen ? 3 : 2) : 1}
        contentContainerStyle={styles.cardGrid}
        renderItem={({ item, i }) => {
          const memo = item as Memo;
          return <MemoCard
            data={memo}
            onDelete={() => handleDeleteMemo(memo.id)}
            onUpdate={(type, content, bookmark) => handleUpdateMemo(memo.id, {
              data: type == EditorMode.NOTE ? {
                type: MemoType.NOTE,
                noteContent: content!
              } : {
                type: MemoType.BOOKMARK,
                ...bookmark
              }
            })} />
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
    ...Platform.select({
      ios: {
        paddingTop: 30
      },
      android: {
        paddingTop: 0
      }
    }),
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