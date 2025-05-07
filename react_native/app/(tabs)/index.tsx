import { StyleSheet, useWindowDimensions, ActivityIndicator, Platform, Animated } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { MemoCard } from '@/components/MemoCard';
import { EditorMode, MemoEditor } from '@/components/MemoEditor';
import MasonryList from '@react-native-seoul/masonry-list';
import { useApi } from '@/hooks/useApi';
import { useState, useEffect } from 'react';
import { CreateMemoDto, Memo, MemoType, TagTreeNode } from '@/client-server-public/types';
import { HeaderBar } from '@/components/HeaderBar';
import { TagFilterModal } from '@/components/TagFilterModal';
import { TagBreadcrumb } from '@/components/TagBreadcrumb';
import { eventManager } from '@/events/event-manager';


export default function CollectionScreen() {
  const { width } = useWindowDimensions();
  const api = useApi();

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
    await loadMemosWithTags(selectedTags);
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


  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [tagsTree, setTagsTree] = useState<TagTreeNode[]>([]);
  const [selectedTags, setSelectedTags] = useState<TagTreeNode[]>([]);

  // 处理筛选按钮点击
  const handleFilter = async () => {
    try {
      // 获取标签树数据
      const response = await api.getTagsTree();
      if (response.success && response.data) {
        setTagsTree(response.data);
        setFilterModalVisible(true);
      } else {
        setError(`获取标签树失败: ${response.message}`);
      }
    } catch (err) {
      setError(`加载标签树时发生错误: ${err}`);
    }
  };

  // 处理标签选择
  const handleTagSelect = async (tag: TagTreeNode, hasChildren: boolean) => {
    // 检查标签是否已经被选中
    const tagIndex = selectedTags.findIndex(t => t.id === tag.id);
    if (tagIndex === -1) {
      // 如果标签不在列表中，添加它
      const newTags = [...selectedTags, tag];
      setSelectedTags(newTags);
      // 使用新的标签列表加载数据
      await loadMemosWithTags(newTags);
    } else {
      // 如果标签已在列表中，移除它
      const newTags = [...selectedTags];
      newTags.splice(tagIndex, 1);
      setSelectedTags(newTags);
      // 使用新的标签列表加载数据
      await loadMemosWithTags(newTags);
    }
  };

  // 清除选中的标签
  const handleClearTag = async (tag: TagTreeNode) => {
    // 如果标签已在列表中，移除它
    const tagIndex = selectedTags.findIndex(t => t.id === tag.id);
    if (tagIndex !== -1) {
      const newTags = [...selectedTags];
      newTags.splice(tagIndex, 1);
      setSelectedTags(newTags);
      // 使用新的标签列表加载数据
      await loadMemosWithTags(newTags);
    }
  };

  // 使用指定标签列表加载数据
  const loadMemosWithTags = async (tags: TagTreeNode[]) => {
    try {
      setLoading(true);
      setError(null);
      let response;

      if (tags.length > 0) {
        // 如果有选中的标签，使用标签ID数组进行筛选
        const tagIds = tags.map(tag => tag.id);
        response = await api.getMemosByTagIds(tagIds);
      } else {
        // 如果没有选中的标签，获取所有备忘录
        response = await api.getMemos();
      }

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

  // 添加tag点击事件监听
  useEffect(() => {
    const handleTagClick = async (tagPath: string) => {
      try {
        const response = await api.getTagByTagPath({ path: tagPath });
        if (response.success && response.data) {
          // 将tag转换为TagTreeNode格式
          const tagNode: TagTreeNode = {
            id: response.data.id,
            name: response.data.path.split('/').pop() || '',
            path: response.data.path,
            children: [],
            createdAt: response.data.createdAt,
            number: 0 // 这里可能需要从其他地方获取number
          };

          // 检查标签是否已经被选中
          const tagIndex = selectedTags.findIndex(t => t.id === tagNode.id);
          if (tagIndex === -1) {
            // 如果标签不在列表中，添加它
            const newTags = [...selectedTags, tagNode];
            setSelectedTags(newTags);
            // 使用新的标签列表加载数据
            await loadMemosWithTags(newTags);
          }
        }
      } catch (err) {
        setError(`处理标签点击时发生错误: ${err}`);
      }
    };

    // 添加事件监听
    eventManager.addEvent('tagClick', handleTagClick, CollectionScreen);

    // 清理函数
    return () => {
      eventManager.removeEvent('tagClick', CollectionScreen);
    };
  }, [selectedTags]); // 依赖selectedTags以确保使用最新的状态

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
        onFilter={handleFilter}
      />

      {/* 标签筛选模态框 */}
      <TagFilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        tagsTree={tagsTree}
        onSelectTag={handleTagSelect}
        selectedTags={selectedTags}
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

      {/* 标签面包屑导航 */}
      <TagBreadcrumb
        selectedTags={selectedTags}
        onClearTag={handleClearTag}
      />

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