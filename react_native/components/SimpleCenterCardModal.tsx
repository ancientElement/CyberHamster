import { Children } from 'react';
import { StyleSheet, View, Modal, Text, Pressable, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';

interface SimpleModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function SimpleCenterCardModal({ visible, onClose, children }: SimpleModalProps) {
  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          // 阻止事件冒泡，防止点击内部区域时触发外层的关闭事件
          onPress={e => e.stopPropagation()}
        >
          <View style={[styles.modalView]}>
            {children}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'relative',
  },
});