import { StyleSheet, Image, useWindowDimensions } from 'react-native';
import { useState } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ExternalLink } from './ExternalLink';
import { MemoCardToolbox } from './MemoCardToolbox';
import { ConfirmCardModal } from './ConfirmCardModal';
import { SimpleCenterCardModal } from './SimpleCenterCardModal';
import { EditorMode, MemoEditor } from './MemoEditor';
import { TextRenderer } from './TextRenderer';
import { noImage } from '@/constants/NoImagesBase64';

export function BookmarkCard({
  createdAt,
  title,
  url,
  description,
  icon,
  onDelete,
  onUpdateBookmark
}: {
  createdAt: string;
  title: string | undefined;
  url: string;
  description: string | undefined;
  icon: string | undefined;
  onDelete: () => void;
  onUpdateBookmark: (bookmark: { bookmarkTitle: string, bookmarkUrl: string, bookmarkDescription: string, bookmarkIcon?: string }) => void;
}) {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const { width } = useWindowDimensions();

  return (
    <>
      <ThemedView style={styles.cardHeader}>
        <ThemedText style={styles.cardDate}>{createdAt}</ThemedText>
        <MemoCardToolbox
          copyContet={url}
          onEdit={() => setEditModalVisible(true)}
          onDelete={() => setDeleteModalVisible(true)}
        />
      </ThemedView>
      <ThemedView style={styles.bookmarkContent}>
        <ThemedView style={styles.titleRow}>
          {<Image source={{ uri: icon ? icon : noImage}} style={styles.icon} />}
          <ThemedView style={styles.titleContainer}>
            <ThemedText style={styles.title}>{title || '未填写标题'}</ThemedText>
            <ExternalLink href={url}>
              <ThemedText style={styles.url}>{url}</ThemedText>
            </ExternalLink>
          </ThemedView>
        </ThemedView>
        <TextRenderer text={description || '未填写描述'} style={styles.description} />
      </ThemedView>

      <ConfirmCardModal
        visible={deleteModalVisible}
        message={'确定要删除这个书签吗？\n此操作无法撤销'}
        cancelText='取消'
        confirmText='删除'
        onClose={() => { setDeleteModalVisible(false) }}
        onConfirm={onDelete}>
      </ConfirmCardModal>

      <SimpleCenterCardModal visible={editModalVisible} onClose={() => { setEditModalVisible(false) }}>
        <MemoEditor
          style={[
            { width: Math.min(width * 0.8, 500) }
          ]}
          onSubmit={(type, context, bookmark) => {
            onUpdateBookmark(bookmark!);
            setEditModalVisible(false);
          }}
          initBookmark={{
            bookmarkTitle: title || '',
            bookmarkUrl: url,
            bookmarkDescription: description || '',
            bookmarkIcon: icon
          }}
          initMode={EditorMode.BOOKMARK}
          always
        />
      </SimpleCenterCardModal>
    </>
  );
}

const styles = StyleSheet.create({
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  cardDate: {
    fontSize: 12,
    color: '#666'
  },
  editButton: {
    padding: 4
  },
  bookmarkContent: {
    flexDirection: 'column'
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  titleContainer: {
    flex: 1,
    marginLeft: 12
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 4
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4
  },
  url: {
    fontSize: 12,
    color: '#0066cc',
    marginBottom: 4
  },
  description: {
    fontSize: 14,
    color: '#666'
  }
});