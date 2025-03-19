import { StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { Bookmark } from '@/api/types';

type Props = {
  data: Bookmark,
};

export function BookmarkCard({ data }: Props) {
  const { createdAt, title, url, description, icon } = data;
  return (
    <ThemedView style={styles.card}>
      <ThemedView style={styles.cardHeader}>
        <ThemedText style={styles.cardDate}>{createdAt}</ThemedText>
        <TouchableOpacity onPress={() => {}} style={styles.editButton}>
          <Ionicons name="pencil" size={16} color="#666" />
        </TouchableOpacity>
      </ThemedView>
      <ThemedView style={styles.bookmarkContent}>
        <ThemedView style={styles.titleRow}>
          <Image
            source={{ uri: icon }}
            style={styles.icon}
          />
          <ThemedView style={styles.titleContainer}>
            <ThemedText style={styles.title}>{title}</ThemedText>
            <TouchableOpacity onPress={() => Linking.openURL(url)}>
              <ThemedText style={styles.url}>{url}</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
        <ThemedText style={styles.description}>{description}</ThemedText>
      </ThemedView>
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