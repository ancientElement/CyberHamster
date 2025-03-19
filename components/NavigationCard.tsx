import { StyleSheet, TouchableOpacity, Linking, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ExternalLink } from './ExternalLink';

interface NavigationCardProps {
  icon: string;
  title: string;

  url: string;
}

export function NavigationCard({ icon, title, url }: NavigationCardProps) {
  return (
    <ExternalLink style={styles.gridItem} href={url}>
      <ThemedView style={styles.itemContent}>
        <Image source={{ uri: icon }} style={styles.icon} />
        <ThemedText type="defaultSemiBold" style={styles.title}>
          {title}
        </ThemedText>
      </ThemedView>
    </ExternalLink>
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