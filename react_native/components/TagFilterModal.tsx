import React, { useState, useMemo } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, ViewStyle, TextStyle, View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { SimpleCenterCardModal } from '@/components/SimpleCenterCardModal';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { NoOutlineTextInput } from './NoOutlineTextInput';
import { TagTreeNode } from '@/client-server-public/types';

interface TagFilterModalProps {
  visible: boolean;
  onClose: () => void;
  tagsTree: TagTreeNode[];
  selectedTags?: TagTreeNode[];
  onSelectTag?: (tag: TagTreeNode, hasChildren: boolean) => void;
}

// 扁平化标签树，父标签在前，子标签紧跟其后
function flattenTags(tags: TagTreeNode[], prefix = ''): TagTreeNode[] {
  let result: TagTreeNode[] = [];
  for (const tag of tags) {
    result.push(tag);
    if (tag.children && tag.children.length > 0) {
      result = result.concat(flattenTags(tag.children, tag.path + '/'));
    }
  }
  return result;
}

// 按首字母分组
function groupTagsByInitial(flatTags: TagTreeNode[]): Record<string, TagTreeNode[]> {
  const groups: Record<string, TagTreeNode[]> = {};
  for (const tag of flatTags) {
    const initial = tag.path[0] ? tag.path[0].toUpperCase() : '#';
    if (!groups[initial]) groups[initial] = [];
    groups[initial].push(tag);
  }
  return groups;
}

export function TagFilterModal({ visible, onClose, tagsTree, selectedTags = [], onSelectTag }: TagFilterModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  // 扁平化所有标签
  const flatTags = useMemo(() => flattenTags(tagsTree), [tagsTree]);

  // 搜索过滤
  const filteredTags = useMemo(() => {
    if (!searchQuery.trim()) return flatTags;
    return flatTags.filter(tag => tag.path.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [flatTags, searchQuery]);

  // 按首字母分组排序，但不显示首字母
  const groupedTags = useMemo(() => groupTagsByInitial(filteredTags), [filteredTags]);
  const sortedTags: TagTreeNode[] = useMemo(() => {
    return Object.keys(groupedTags)
      .sort()
      .flatMap(initial => groupedTags[initial]);
  }, [groupedTags]);

  // 计算模态框宽高
  const modalWidth = Math.min(windowWidth * 0.9, 400);
  const modalHeight = windowHeight * 0.8;
  const tagListHeight = modalHeight - 120;

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
          <View style={styles.groupTagsRow}>
            {sortedTags.map((tag: TagTreeNode) => (
              <TouchableOpacity
                key={tag.id}
                style={styles.flatTagBtn}
                onPress={() => onSelectTag && onSelectTag(tag, !!(tag.children && tag.children.length > 0))}
              >
                <ThemedText style={styles.flatTagText}>{tag.path}</ThemedText>
                {selectedTags.some(t => t.id === tag.id) && (
                  <IconSymbol name="checkmark" size={14} color="#0a7ea4" style={styles.checkIcon} />
                )}
              </TouchableOpacity>
            ))}
          </View>
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
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
  } as TextStyle,
  closeButton: {
    padding: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchIcon: {
    marginRight: 4,
  },
  searchInput: {
    flex: 1,
    height: 28,
    fontSize: 13,
    color: '#333',
  } as TextStyle,
  clearButton: {
    padding: 2,
  },
  tagList: {
    flex: 1,
    paddingLeft: 12,
  },
  groupTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    flex: 1,
    gap: 6,
  },
  flatTagBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 0,
    marginBottom: 4,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
    minHeight: undefined,
  },
  flatTagText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#008080',
    fontWeight: '400',
  },
  checkIcon: {
    marginLeft: 3,
  },
});