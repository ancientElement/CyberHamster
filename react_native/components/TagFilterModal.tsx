import React, { useState, useMemo } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, TextInput, useWindowDimensions, ViewStyle, TextStyle } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { SimpleCenterCardModal } from '@/components/SimpleCenterCardModal';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { NoOutlineTextInput } from './NoOutlineTextInput';

// 标签树节点类型定义
interface TagTreeNode {
  id: number;
  name: string;
  path: string;
  children: TagTreeNode[];
  createdAt: string;
  number: number;
}

interface TagFilterModalProps {
  visible: boolean;
  onClose: () => void;
  tagsTree: TagTreeNode[];
  selectedTags?: TagTreeNode[];
  onSelectTag?: (tag: TagTreeNode, hasChildren: boolean) => void;
}

// 单个标签项组件
const TagItem = ({ tag, level = 0, onSelect, selectedTags}: {
  tag: TagTreeNode;
  level?: number;
  selectedTags: TagTreeNode[];
  onSelect?: (tag: TagTreeNode, hasChildren: boolean) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = tag.children && tag.children.length > 0;

  return (
    <ThemedView>
      <TouchableOpacity
        style={[styles.tagItem, { paddingLeft: 16 + level * 20 }]}
        onPress={() => {
          if (onSelect) {
            onSelect(tag, hasChildren);
          }
        }}
      >
        <ThemedView style={styles.tagItemContent}>
          {hasChildren && (
            <TouchableOpacity
              onPress={() => setExpanded(!expanded)}
            >
              <IconSymbol
                name={expanded ? "chevron.down" : "chevron.right"}
                size={16}
                color="#666"
                style={styles.expandIcon}
              />
            </TouchableOpacity>
          )}
          <ThemedText style={styles.tagName}>{tag.name}</ThemedText>
          {selectedTags && selectedTags.some(t => t.id === tag.id) && (
            <IconSymbol
              name="checkmark"
              size={16}
              color="#0a7ea4"
              style={styles.checkIcon}
            />
          )}
          <ThemedText style={styles.tagNumber}>({tag.number})</ThemedText>
        </ThemedView>
      </TouchableOpacity>

      {expanded && hasChildren && (
        <ThemedView>
          {tag.children.map((child) => (
            <TagItem
              key={child.id}
              tag={child}
              level={level + 1}
              onSelect={onSelect}
              selectedTags={selectedTags}
            />
          ))}
        </ThemedView>
      )}
    </ThemedView>
  );
};

export function TagFilterModal({ visible, onClose, tagsTree, selectedTags = [], onSelectTag }: TagFilterModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  // 递归搜索标签树
  const searchTags = (tags: TagTreeNode[], query: string): TagTreeNode[] => {
    return tags.reduce((results: TagTreeNode[], tag) => {
      if (tag.name.toLowerCase().includes(query.toLowerCase())) {
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

  // 计算模态框宽度和高度
  const modalWidth = Math.min(windowWidth * 0.9, 400);
  const modalHeight = windowHeight * 0.8;
  const tagListHeight = modalHeight - 120; // 减去头部和搜索框的高度

  return (
    <SimpleCenterCardModal visible={visible} onClose={onClose}>
      <ThemedView style={[styles.modalContent, { width: modalWidth, maxHeight: modalHeight }]}>
        <ThemedView style={styles.header}>
          <ThemedText style={styles.title}>标签筛选</ThemedText>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <IconSymbol name="xmark" size={20} color="#666" />
          </TouchableOpacity>
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

        <ScrollView style={[styles.tagList, { maxHeight: tagListHeight }]}>
          {filteredTags.map((tag) => (
            <TagItem
              key={tag.id}
              tag={tag}
              selectedTags={selectedTags}
              onSelect={(selectedTag, hasChildren) => {
                if (onSelectTag) {
                  onSelectTag(selectedTag, hasChildren);
                }
              }}
            />
          ))}
        </ScrollView>
      </ThemedView>
    </SimpleCenterCardModal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  } as TextStyle,
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 36,
    fontSize: 14,
    color: '#333',
  } as TextStyle,
  clearButton: {
    padding: 4,
  },
  tagList: {
    flex: 1,
  },
  tagItem: {
    paddingVertical: 12,
    paddingRight: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tagItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expandIcon: {
    marginRight: 8,
  },
  tagName: {
    fontSize: 16,
  } as TextStyle,
  checkIcon: {
    marginLeft: 8,
  },
  tagNumber: {
    marginLeft: 8,
  } as TextStyle
});