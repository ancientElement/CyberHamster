import { StyleSheet, Image, View, Platform, Text, Pressable } from 'react-native';
import { useState } from 'react';
import { ExternalLink } from './ExternalLink';
import { noImage } from '@/constants/NoImagesBase64';

interface NavigationCardProps {
  icon: string | undefined;
  title?: string;
  url: string;
}

export const defaultWidth = 70;

export function NavigationCard({ icon, title, url }: NavigationCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Pressable
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
    >
      <ExternalLink style={styles.container} href={url}>
        <View style={[styles.iconContainer, isHovered && styles.iconContainerHovered]}>
          <Image
            source={{ uri: icon || noImage }}
            style={styles.icon}
          />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title || '未填写标题'}
          </Text>
        </View>
      </ExternalLink>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: defaultWidth,
    textAlign: 'center',
  },
  iconContainer: {
    textAlign: 'center',
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
        transition: '0.3s',
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
  iconContainerHovered: {
    ...Platform.select({
      web: {
        transform: [{ translateY: -5 }],
        boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.15)',
      },
    }),
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 12,
  },
  titleContainer: {
    width: defaultWidth,
    height: 20,
    overflow: 'hidden',
  },
  title: {
    textAlign: 'center',
    fontSize: 12,
  },
});