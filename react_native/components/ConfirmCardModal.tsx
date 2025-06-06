import { StyleSheet, useWindowDimensions } from "react-native";
import { SimpleCenterCardModal } from "./SimpleCenterCardModal";
import { ThemedText } from "./ThemedText";
import { NoOutlineTouchableOpacity } from "./NoOutlineTouchableOpacity";
import { ThemedView } from "./ThemedView";

interface Props {
  visible: boolean;
  message: string;
  cancelText: string;
  confirmText: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmCardModal({ visible: visible, message, cancelText, confirmText, onClose, onConfirm }: Props) {
  const { width } = useWindowDimensions();

  return <SimpleCenterCardModal
    visible={visible}
    onClose={onClose}
  >
    <ThemedView style={[styles.modalContent, { width: Math.min(width * 0.8, 300) }]}>
      <ThemedText style={styles.modalMessage}>
        {message}
      </ThemedText>
      <ThemedView style={styles.modalButtons}>
        <NoOutlineTouchableOpacity
          style={[styles.modalButton, styles.cancelButton]}
          onPress={onClose}
        >
          <ThemedText>{cancelText}</ThemedText>
        </NoOutlineTouchableOpacity>
        <NoOutlineTouchableOpacity
          style={[styles.modalButton, styles.deleteButton]}
          onPress={() => {
            onConfirm();
            onClose();
          }}
        >
          <ThemedText style={styles.deleteButtonText}>{confirmText}</ThemedText>
        </NoOutlineTouchableOpacity>
      </ThemedView>
    </ThemedView>
  </SimpleCenterCardModal>;
}
const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
    elevation: 5,
    position: 'relative',
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
    backgroundColor: '#0a7ea4',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});