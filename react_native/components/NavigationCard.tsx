import { StyleSheet, Image, View, Platform, Text } from 'react-native';
import { ExternalLink } from './ExternalLink';

interface NavigationCardProps {
  icon: string | undefined;
  title: string;
  url: string;
}

export function NavigationCard({ icon, title, url }: NavigationCardProps) {
  return (
    <ExternalLink style={styles.container} href={url}>
      <View style={styles.iconContainer}>
        {icon && <Image source={{ uri: icon }} style={styles.icon} />}
      </View>
      <View style={{ width: 58, height: 20, overflow: 'hidden' }}>
        <Text style={{ textAlign: 'center'}}>
          {title}
        </Text>
      </View>
    </ExternalLink>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 58,
    flex: 1, justifyContent: "center",
  },
  iconContainer: {
    width: 58,
    height: 58,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 2,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  icon: {
    width: 32,
    height: 32,
  },
});