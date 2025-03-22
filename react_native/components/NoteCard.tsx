import { StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useState } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { TextRenderer } from './TextRenderer';
import { IconSymbol } from './ui/IconSymbol';
import { ConfirmCardModal } from './ConfirmCardModal';

export function NoteCard({ createdAt, content, onDelete }: {
  createdAt: string,
  content: string,
  onDelete: () => void
}) {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const { width } = useWindowDimensions();
  return (
    <ThemedView style={styles.card}>
      <ThemedView style={styles.cardHeader}>
        <ThemedText style={styles.cardDate}>{createdAt}</ThemedText>
        <ThemedView style={styles.buttonGroup}>
          <TouchableOpacity
            onPress={() => setDeleteModalVisible(true)}
            style={styles.iconButton}
          >
            <IconSymbol name="trash" size={10} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { }} style={styles.iconButton}>
            <IconSymbol name="pencil.line" size={10} color="#666" />
          </TouchableOpacity>
        </ThemedView>
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    margin: 5,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 2
  },
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
  buttonGroup: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconButton: {
    padding: 4,
    marginLeft: 8
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
