import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { Note } from '@/api/types';

type Props = {
  data: Note,
};

export function NoteCard({ data }: Props) {
  const { createdAt, content } = data;
  return (
    <ThemedView style={styles.card}>
      <ThemedView style={styles.cardHeader}>
        <ThemedText style={styles.cardDate}>{createdAt}</ThemedText>
        <TouchableOpacity onPress={() => {}} style={styles.editButton}>
          <Ionicons name="pencil" size={16} color="#666" />
        </TouchableOpacity>
      </ThemedView>
      <ThemedText>{content}</ThemedText>
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