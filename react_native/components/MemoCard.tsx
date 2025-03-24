import { StyleSheet, Platform, Pressable } from 'react-native';
import { bookmarkProps, Memo, MemoType, noteProps } from '@/client-server-public/types';
import { NoteCard } from './NoteCard';
import { BookmarkCard } from './BookmarkCard';
import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';
import { EditorMode } from './MemoEditor';

// 类型定义
interface BookmarkData {
  bookmarkTitle: string;
  bookmarkUrl: string;
  bookmarkDescription: string;
}

interface MemoCardProps {
  data: Memo;
  onDelete: () => void;
  onUpdate: (type: EditorMode, content?: string, bookmark?: BookmarkData) => void;
}

// 渲染函数
const renderCardContent = (
  data: Memo,
  onDelete: () => void,
  onUpdate: MemoCardProps['onUpdate']
) => {
  switch (data.type) {
    case MemoType.NOTE:
      return (
        <NoteCard
          onUpdateContext={(content) => onUpdate(EditorMode.NOTE, content)}
          onDelete={onDelete}
          {...noteProps(data)}
        />
      );
    case MemoType.BOOKMARK:
      return (
        <BookmarkCard
          onUpdateBookmark={(bookmark) => onUpdate(EditorMode.BOOKMARK, undefined, bookmark)}
          onDelete={onDelete}
          {...bookmarkProps(data)}
        />
      );
    default:
      return null;
  }
};

// 主组件
export function MemoCard({ data, onDelete, onUpdate }: MemoCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const cardContent = renderCardContent(data, onDelete, onUpdate);
  if (!cardContent) return null;

  return (
    <Pressable
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={({ pressed }) => [
        styles.card,
        isHovered && styles.cardHovered,
        pressed && styles.cardPressed
      ]}
    >
      <ThemedView style={styles.cardContent}>
        {cardContent}
      </ThemedView>
    </Pressable>
  );
}

const hoverStyles = {
  web: {
    transform: [{ translateY: -5 }],
    boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.15)',
  },
};

export const styles = StyleSheet.create({
  card: {
    padding: 16,
    margin: 5,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 2,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
        transition: '0.3s',
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  cardHovered: {
    ...Platform.select(hoverStyles),
  },
  cardPressed: {
    opacity: 0.9,
  },
  cardContent: {
    flex: 1,
  }
});
