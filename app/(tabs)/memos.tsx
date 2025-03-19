import { StyleSheet, TextInput, ScrollView, useWindowDimensions } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { MemoCard, CollectionItem } from '@/components/MemoCard';
import { ScreenAdapt } from '@/constants/ScreenAdapt';
import MasonryList from '@react-native-seoul/masonry-list';

const testData: CollectionItem[] = [
  { id: "1", date: "2024-01-20 14:30", content: "这是一个示例内容卡片这是一个示例内容卡片这是一个示例内容卡片这是一个示例内容卡片这是一个示例内容卡片这是一个示例内容卡片" },
  { id: "2", date: "2024-01-19 09:15", content: "这是另一个示例内容卡片" },
  { id: "3", date: "2024-01-18 16:45", content: "第三个示例内容卡片" },
  { id: "4", date: "2024-01-17 11:20", content: "第四个示例内容卡片" },
  { id: "5", date: "2024-01-16 15:30", content: "第五个示例内容卡片" },
  { id: "6", date: "2024-01-15 10:10", content: "第六个示例内容卡片第六个示例内容卡片第六个示例内容卡片第六个示例内容卡片第六个示例内容卡片第六个示例内容卡片第六个示例内容卡片" },
  { id: "7", date: "2024-01-15 10:10", content: "第柒个示例内容卡片第柒个示例内容卡片第柒个示例内容卡片" },
  { id: "8", date: "2024-01-15 10:10", content: "第八个示例内容卡片第八个示例内容卡片第八个示例内容卡片" },
]

export default function CollectionScreen() {
  const { width } = useWindowDimensions();
  const isWideScreen = width > ScreenAdapt.mediumScreen;
  const isMediumScreen = width > ScreenAdapt.smallScreen;

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.brand}>CyberHamster</ThemedText>
        <TextInput
          style={styles.searchInput}
          placeholder="搜索收藏..."
          placeholderTextColor="#999"
        />
      </ThemedView>

      <TextInput
        style={styles.mainInput}
        placeholder="输入新的内容..."
        placeholderTextColor="#999"
        multiline
      />
      <MasonryList
        style={styles.cardContainer}
        data={testData}
        keyExtractor={(item) => item.id}
        numColumns={isMediumScreen ? (isWideScreen ? 3 : 2) : 1}
        contentContainerStyle={styles.cardGrid}
        renderItem={({ item, i }) => <MemoCard data={item as CollectionItem} />}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 20
  },
  brand: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  searchInput: {
    flex: 1,
    marginLeft: 16,
    height: 36,
    borderRadius: 18,
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0'
  },
  mainInput: {
    height: 100,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    backgroundColor: '#f0f0f0'
  },
  cardContainer: {
    flex: 1
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  }
});