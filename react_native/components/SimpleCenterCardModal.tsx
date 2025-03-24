import { StyleSheet, Modal, TouchableOpacity } from 'react-native';

interface SimpleModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function SimpleCenterCardModal({ visible, onClose, children }: SimpleModalProps) {
  return (
    <Modal
      animationType="fade"
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
          {children}
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
});