import { StyleSheet, TextInput, View, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';


interface MemoEditorProps {
  onSubmit: (content: string) => void;
  placeholder?: string;
  initText?: string;
  style?: StyleProp<ViewStyle> | undefined;
}

export function MemoEditor({ onSubmit, placeholder = '输入新的内容...', initText, style }: MemoEditorProps) {
  const [newContent, setNewContent] = useState(initText||'');

  const handleSubmit = () => {
    if (!newContent.trim()) return;
    onSubmit(newContent);
    setNewContent('');
  };

  return (
    <View style={[styles.container,style]}>
      <TextInput
        style={styles.mainInput}
        placeholder={placeholder}
        placeholderTextColor="#999"
        multiline
        textAlignVertical="top"
        value={newContent}
        onChangeText={setNewContent}
      />
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        activeOpacity={0.7}
      >
        <Ionicons name="send" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 20,
    gap: 12
  },
  mainInput: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#f0f0f0'
  },
  submitButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0a7ea4',
    justifyContent: 'center',
    alignItems: 'center'
  }
});