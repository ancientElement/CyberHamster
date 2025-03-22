import { StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { TextRenderer } from './TextRenderer';
import { IconSymbol } from './ui/IconSymbol';


export function NoteCard({ createdAt, content, onDelete } : {
  createdAt: string,
  content: string,
  onDelete?: () => void
}) {
  return (
    <ThemedView style={styles.card}>
      <ThemedView style={styles.cardHeader}>
        <ThemedText style={styles.cardDate}>{createdAt}</ThemedText>
        <ThemedView style={styles.buttonGroup}>
          <TouchableOpacity onPress={() => {}} style={styles.iconButton}>
            <IconSymbol name="trash" size={16} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}} style={styles.iconButton}>
            <IconSymbol name="pencil.line" size={16} color="#666" />
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
      <TextRenderer text={content}></TextRenderer>
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
  }
});