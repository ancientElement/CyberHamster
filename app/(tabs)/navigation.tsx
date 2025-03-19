import { StyleSheet, ScrollView, useWindowDimensions, ViewStyle, StyleProp } from 'react-native';
import { NavigationData } from '@/constants/NavigationData';
import { NavigationCard } from '@/components/NavigationCard';
import { ScreenAdapt } from '@/constants/ScreenAdapt';
import { FlatGrid } from 'react-native-super-grid';

export default function NavigationScreen() {
  const { width } = useWindowDimensions();
  const isMediumScreen = width > ScreenAdapt.smallScreen;

  const gridStyle = {
    ...styles.grid,
    gap: isMediumScreen ? 16 : 12,
  };

  const cardStyle: StyleProp<ViewStyle> = {
    width: isMediumScreen ? '25%' : '33.33%',
  };

  return (
    <FlatGrid
      itemDimension={isMediumScreen ? 200 : 120}
      spacing={isMediumScreen ? 16 : 12}
      style={styles.container}
      data={NavigationData}
      renderItem={({ item }) => (
        <NavigationCard
          id={item.id}
          icon={item.icon}
          title={item.title}
          url={item.url}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});