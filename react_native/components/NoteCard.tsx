import { StyleSheet, useWindowDimensions } from 'react-native';
import { useState } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { TextRenderer } from './TextRenderer';
import { ConfirmCardModal } from './ConfirmCardModal';
import { SimpleCenterCardModal } from './SimpleCenterCardModal';
import { EditorMode, MemoEditor } from './MemoEditor';
import { MemoCardToolbox } from './MemoCardToolbox';

export function NoteCard({ createdAt, content, onDelete, onUpdateContext }: {
  createdAt: string,
  content: string,
  onDelete: () => void
  onUpdateContext: (content: string) => void,
}) {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const { width } = useWindowDimensions();

  return (
    <>
      <ThemedView style={styles.cardHeader}>
        <ThemedText style={styles.cardDate}>{createdAt}</ThemedText>
        <MemoCardToolbox
          copyContet={content}
          onEdit={() => setEditModalVisible(true)}
          onDelete={() => setDeleteModalVisible(true)}
        />
      </ThemedView>
      <TextRenderer text={content}></TextRenderer>
      <ConfirmCardModal
        visible={deleteModalVisible}
        message={'确定要删除这条笔记吗？\n此操作无法撤销'}
        cancelText='取消'
        confirmText='删除'
        onClose={() => { setDeleteModalVisible(false) }}
        onConfirm={onDelete}>
      </ConfirmCardModal>
      <SimpleCenterCardModal
        visible={editModalVisible}
        onClose={() => { setEditModalVisible(false) }}>
        <MemoEditor
          style={[
            { width: Math.min(width * 0.8, 300) }
          ]}
          onSubmit={(type,content) => {
            onUpdateContext(content!);
            setEditModalVisible(false);
          }}
          initText={content}
          initMode={EditorMode.NOTE}
          always
        >
        </MemoEditor>
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
  modalContent: {
    padding: 5,
    alignItems: 'center',
  },
  modalMessage: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E2E8F0',
  },
  deleteButton: {
    backgroundColor: '#F56565',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});
