import { Image, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { useState } from 'react';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { CustomModal } from '@/components/CustomModal';

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      
      {/* 添加模态框打开按钮 */}
      <ThemedView style={styles.stepContainer}>
        <TouchableOpacity 
          style={styles.modalButton} 
          onPress={() => setModalVisible(true)}
        >
          <ThemedText type="defaultSemiBold">打开模态框</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12'
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          Tap the Explore tab to learn more about what's included in this starter app.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          When you're ready, run{' '}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
      
      {/* 添加模态框组件 */}
      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="模态框示例"
      >
        <ThemedView style={styles.modalContent}>
          <ThemedText>这是一个悬浮于界面之上的模态框示例。</ThemedText>
          <ThemedText>你可以在这里添加任何内容。</ThemedText>
          <TouchableOpacity 
            style={styles.closeModalButton} 
            onPress={() => setModalVisible(false)}
          >
            <ThemedText style={styles.closeModalButtonText}>关闭</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </CustomModal>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  modalButton: {
    backgroundColor: '#4299E1',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  modalContent: {
    alignItems: 'center',
    gap: 15,
  },
  closeModalButton: {
    backgroundColor: '#F56565',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginTop: 10,
  },
  closeModalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
