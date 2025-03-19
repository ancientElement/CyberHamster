import { StyleSheet, TouchableOpacity, Linking, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface NavigationCardProps {
  id: string;
  icon: string;
  title: string;

  url: string;
}

export function NavigationCard({ id, icon, title, url }: NavigationCardProps) {
  const handlePress = () => {
    Linking.openURL(url);
  };

  return (
    <TouchableOpacity key={id} style={styles.gridItem} onPress={handlePress}>
      <ThemedView style={styles.itemContent}>
        <Image source={{ uri: icon }} style={styles.icon} />
        <ThemedText type="defaultSemiBold" style={styles.title}>
          {title}
        </ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  gridItem: {
    padding: 6,
  },
  itemContent: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
  },
  icon: {
    width: 32,
    height: 32,
    marginBottom: 8,
  },
  title: {
    textAlign: 'center',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.8,
  },
});