import { StyleSheet, useWindowDimensions, ActivityIndicator, Platform, Animated } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { MemoCard } from '@/components/MemoCard';
import { EditorMode, MemoEditor } from '@/components/MemoEditor';
import { ScreenAdapt } from '@/constants/ScreenAdapt';
import MasonryList from '@react-native-seoul/masonry-list';
import { useApi } from '@/hooks/useApi';
import { useState, useEffect } from 'react';
import { CreateMemoDto, Memo, MemoType } from '@/client-server-public/types';
import { HeaderBar } from '@/components/HeaderBar';
import { StorageKey, useStorage } from '@/hooks/useStorage';


export default function CollectionScreen() {
  const { width } = useWindowDimensions();
  const isWideScreen = width > ScreenAdapt.mediumScreen;
  const isMediumScreen = width > ScreenAdapt.smallScreen;
  const api = useApi();
  const storage = useStorage();

  const [memos, setMemos] = useState<Memo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const rotateAnim = useState(new Animated.Value(0))[0];
  // 根据屏幕尺寸设置初始列数，并遵循限制规则
  // 小屏幕：固定为1列
  // 中屏幕：最多2列
  // 大屏幕：最多3列
  const [columnCount, setColumnCount] = useState<number>(1);

  useEffect(() => {
    handleLayoutChange(false);
  }, [width]);

  useEffect(() => {
    loadMemos();
  }, []);


  const loadMemos = async () => {
    try {
      console.log(await api.getTags());
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

  const handleLayoutChange = (click?: boolean) => {
    // 根据当前列数和屏幕尺寸限制列数切换
    // 使用window.innerWidth获取当前屏幕宽度
    const screenWidth = width;
    const isSmallScreen = screenWidth <= 768; // ScreenAdapt.smallScreen
    const isMediumScreen = screenWidth > 768 && screenWidth <= 992; // ScreenAdapt.mediumScreen

    let nextColumns = columnCount;

    if (isSmallScreen) {
      // 小屏幕固定为1列
      nextColumns = 1;
    } else if (isMediumScreen) {
      // 中屏幕只允许1-2列
      if (click) { //点击
        nextColumns = columnCount >= 2 ? 1 : 2;
      } else { //屏幕大小变化
        nextColumns = columnCount;
      }
    } else {
      // 大屏幕允许1-3列
      if (click) {
        nextColumns = columnCount >= 3 ? 1 : columnCount + 1;
      } else {
        nextColumns = columnCount;
      }
    }
    setColumnCount(nextColumns);
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
          loadMemos();
        }}
        rotateAnim={rotateAnim}
        onLayoutChange={handleLayoutChange}
        currentColumns={columnCount}
      />

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
        numColumns={columnCount}
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
    backgroundColor: '#f2f2f2',
    flex: 1,
    ...Platform.select({
      ios: {
        paddingTop: 30
      },
      android: {
        paddingTop: 30
      }
    }),
    paddingHorizontal: 16
  },

  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  }
});