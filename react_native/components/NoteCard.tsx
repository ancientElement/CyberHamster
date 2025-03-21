import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { TextRenderer } from './TextRenderer';
import { IconSymbol } from './ui/IconSymbol';


export function NoteCard({ createdAt, content } : {
  createdAt: string,content: string}) {
  return (
    <ThemedView style={styles.card}>
      <ThemedView style={styles.cardHeader}>
        <ThemedText style={styles.cardDate}>{createdAt}</ThemedText>
        <TouchableOpacity onPress={() => {}} style={styles.editButton}>
          <IconSymbol name="pencil.line" size={16} color="#666" />
        </TouchableOpacity>
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
  editButton: {
    padding: 4
  }
});