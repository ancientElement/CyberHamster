import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useApi } from '@/hooks/useApi';
import { TagTreeNode } from '@/client-server-public/types';
import { SimpleCenterCardModal } from '@/components/SimpleCenterCardModal';
import { ConfirmCardModal } from '@/components/ConfirmCardModal';
import { NoOutlineTextInput } from '@/components/NoOutlineTextInput';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { eventManager } from '@/events/event-manager';

export default function TagsScreen() {
  const api = useApi();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const navigation = useNavigation();
  const [tagsTree, setTagsTree] = useState<TagTreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedTag, setSelectedTag] = useState<TagTreeNode | null>(null);
  const [newPath, setNewPath] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // 加载标签树
  const loadTags = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getTagsTree();
      if (response.success && response.data) {
        setTagsTree(response.data);
      } else {
        setError('加载标签失败');
      }
    } catch (err) {
      setError('加载标签时发生错误');
    } finally {
      setLoading(false);
    }
  };

  // 使用 useFocusEffect 在页面获得焦点时刷新数据
  useFocusEffect(
    React.useCallback(() => {
      loadTags();
    }, [])
  );

  // 递归搜索标签树
  const searchTags = (tags: TagTreeNode[], query: string): TagTreeNode[] => {
    return tags.reduce((results: TagTreeNode[], tag) => {
      if (tag.path.toLowerCase().includes(query.toLowerCase())) {
        results.push(tag);
      }
      if (tag.children && tag.children.length > 0) {
        results.push(...searchTags(tag.children, query));
      }
      return results;
    }, []);
  };

  // 使用 useMemo 优化搜索性能
  const filteredTags = useMemo(() => {
    if (!searchQuery.trim()) {
      return tagsTree;
    }
    return searchTags(tagsTree, searchQuery);
  }, [tagsTree, searchQuery]);

  // 处理标签编辑
  const handleEditTag = async () => {
    if (!selectedTag || !newPath) return;

    try {
      const response = await api.updateTag(selectedTag.id, { path: newPath });
      if (response.success) {
        await loadTags(); // 重新加载标签树
        setEditModalVisible(false);
        setSelectedTag(null);
        setNewPath('');
      } else {
        Alert.alert('错误', response.message || '更新标签失败');
      }
    } catch (err) {
      Alert.alert('错误', '更新标签时发生错误');
    }
  };

  // 处理标签删除
  const handleDeleteTag = async (tag: TagTreeNode) => {
    setSelectedTag(tag);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedTag) return;

    try {
      const response = await api.deleteTag(selectedTag.id);
      if (response.success) {
        await loadTags(); // 重新加载标签树
      } else {
        Alert.alert('错误', response.message || '删除标签失败');
      }
    } catch (err) {
      Alert.alert('错误', '删除标签时发生错误');
    }
  };

  // 处理标签点击
  const handleTagClick = (tag: TagTreeNode) => {
    // 触发标签点击事件
    eventManager.dispatchEvent('tagClick', tag.path);
    // 导航到主页
    navigation.navigate('index' as never);
  };

  // 渲染标签项
  const renderTagItem = (tag: TagTreeNode, level: number = 0) => {
    return (
      <ThemedView key={tag.id}>
        <ThemedView style={[styles.tagItem, { paddingLeft: 16 + level * 20 }]}>
          <TouchableOpacity 
            style={styles.tagContent}
            onPress={() => handleTagClick(tag)}
          >
            <ThemedText style={styles.tagName}>{tag.path}</ThemedText>
            <ThemedText style={styles.tagNumber}>({tag.number})</ThemedText>
          </TouchableOpacity>
          <ThemedView style={styles.tagActions}>
            <TouchableOpacity
              onPress={() => {
                setSelectedTag(tag);
                setNewPath(tag.path);
                setEditModalVisible(true);
              }}
              style={styles.actionButton}
            >
              <IconSymbol name="pencil.line" size={16} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDeleteTag(tag)}
              style={styles.actionButton}
            >
              <IconSymbol name="trash" size={16} color="#666" />
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
        {tag.children.map(child => renderTagItem(child, level + 1))}
      </ThemedView>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.headerTitle}>标签管理</ThemedText>
      </ThemedView>

      <ThemedView style={styles.searchContainer}>
        <IconSymbol name="magnifyingglass" size={16} color="#666" style={styles.searchIcon} />
        <NoOutlineTextInput
          style={styles.searchInput}
          placeholder="搜索标签..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <IconSymbol name="xmark.circle.fill" size={16} color="#666" />
          </TouchableOpacity>
        ) : null}
      </ThemedView>

      {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}

      <ScrollView style={styles.tagList}>
        {filteredTags.map(tag => renderTagItem(tag))}
      </ScrollView>

      {/* 编辑标签模态框 */}
      <SimpleCenterCardModal
        visible={editModalVisible}
        onClose={() => {
          setEditModalVisible(false);
          setSelectedTag(null);
          setNewPath('');
        }}
      >
        <ThemedView style={styles.modalContent}>
          <ThemedView style={styles.modalHeader}>
            <ThemedText style={styles.modalTitle}>编辑标签</ThemedText>
            <TouchableOpacity
              onPress={() => setEditModalVisible(false)}
              style={styles.closeButton}
            >
              <IconSymbol name="xmark" size={20} color={colors.tabIconDefault} />
            </TouchableOpacity>
          </ThemedView>

          <ThemedView style={styles.inputContainer}>
            <ThemedText style={styles.inputLabel}>标签路径</ThemedText>
            <NoOutlineTextInput
              style={styles.input}
              value={newPath}
              onChangeText={setNewPath}
              placeholder="输入标签路径"
              placeholderTextColor="#999"
            />
          </ThemedView>

          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.tabIconSelected }]}
            onPress={handleEditTag}
          >
            <ThemedText style={styles.saveButtonText}>保存</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </SimpleCenterCardModal>

      {/* 删除确认模态框 */}
      <ConfirmCardModal
        visible={deleteModalVisible}
        message={`确定要删除标签 "${selectedTag?.path}" 吗？`}
        cancelText="取消"
        confirmText="删除"
        onClose={() => {
          setDeleteModalVisible(false);
          setSelectedTag(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
    padding: 16,
    borderRadius: 16,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 36,
    fontSize: 14,
    color: '#333',
  },
  clearButton: {
    padding: 4,
  },
  errorText: {
    color: '#ff3b30',
    marginBottom: 10,
  },
  tagList: {
    flex: 1,
  },
  tagItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tagContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagName: {
    fontSize: 16,
  },
  tagNumber: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  tagActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  modalContent: {
    width: 320,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  inputContainer: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    margin: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 