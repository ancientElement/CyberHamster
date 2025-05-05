import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
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
            <Pressable
              style={({ hovered }) => [
                styles.clearButton,
                hovered && styles.hoveredButton
              ]}
              onPress={() => {
                if (onClearTag) {
                  onClearTag(tag);
                }
              }}
            >
              {({ hovered }) => (
                <ThemedText style={[
                  styles.breadcrumbText,
                  hovered && styles.hoveredText
                ]}>{tag.path}</ThemedText>
              )}
            </Pressable>
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
  hoveredButton: {
    opacity: 0.8,
  },
  hoveredText: {
    textDecorationLine: 'line-through',
  },
});