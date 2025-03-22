import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { TextRenderer } from './TextRenderer';
import { IconSymbol } from './ui/IconSymbol';
import { CustomModal } from './CustomModal';

export function NoteCard({ createdAt, content, onDelete }: {
  createdAt: string,
  content: string,
  onDelete?: () => void
}) {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

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

      {/* 使用 CustomModal 作为删除确认框 */}
      <CustomModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        title="确认删除"
      >
        <View style={styles.modalContent}>
          <ThemedText style={styles.modalMessage}>
            您确定要删除这条笔记吗？此操作无法撤销。
          </ThemedText>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setDeleteModalVisible(false)}
            >
              <ThemedText style={styles.buttonText}>取消</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.deleteButton]}
              onPress={() => {
                if (onDelete) {
                  onDelete();
                }
                setDeleteModalVisible(false);
              }}
            >
              <ThemedText style={styles.deleteButtonText}>删除</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </CustomModal>
    </ThemedView>
  );
}

// 在现有的 styles 中添加以下样式
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
    alignItems: 'center',
    paddingTop: 10,
  },
  modalMessage: {
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E2E8F0',
  },
  deleteButton: {
    backgroundColor: '#F56565',
  },
  buttonText: {
    fontWeight: '600',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});