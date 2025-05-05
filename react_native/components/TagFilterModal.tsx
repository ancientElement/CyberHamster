import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { SimpleCenterCardModal } from '@/components/SimpleCenterCardModal';
import { IconSymbol } from '@/components/ui/IconSymbol';

// 标签树节点类型定义
interface TagTreeNode {
  id: number;
  name: string;
  path: string;
  children: TagTreeNode[];
  createdAt: string;
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
  return (
    <SimpleCenterCardModal visible={visible} onClose={onClose}>
      <ThemedView style={styles.modalContent}>
        <ThemedView style={styles.header}>
          <ThemedText style={styles.title}>标签筛选</ThemedText>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <IconSymbol name="xmark" size={20} color="#666" />
          </TouchableOpacity>
        </ThemedView>

        <ScrollView style={styles.tagList}>
          {tagsTree.map((tag) => (
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
    width: 320,
    maxHeight: 500,
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
  },
  closeButton: {
    padding: 4,
  },
  tagList: {
    maxHeight: 400,
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
  },
  checkIcon: {
    marginLeft: 8,
  }
});