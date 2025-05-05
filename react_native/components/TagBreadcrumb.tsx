import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { NoOutlineTouchableOpacity } from './NoOutlineTouchableOpacity';
import { TagTreeNode } from '@/client-server-public/types';

interface TagBreadcrumbProps {
  selectedTags: TagTreeNode[];
  onClearTag?: (tag: TagTreeNode) => void;
}

export function TagBreadcrumb({ selectedTags, onClearTag }: TagBreadcrumbProps) {
  if (!selectedTags) return null;

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.breadcrumbContent}>
        {selectedTags.map((tag, index) => (
          <React.Fragment key={index}>
            <NoOutlineTouchableOpacity
              style={styles.clearButton}
              onPress={() => {
                if (onClearTag) {
                  onClearTag(tag);
                }
              }}
            >
              <ThemedText style={styles.breadcrumbText}>{tag.path}</ThemedText>
            </NoOutlineTouchableOpacity>
          </React.Fragment>
        ))}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
    paddingHorizontal: 12,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
  breadcrumbContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  breadcrumbText: {
    fontSize: 14,
    color: '#0a7ea4',
    marginLeft: 16,
  },
  clearButton: {
    marginLeft: 2,
  },
});