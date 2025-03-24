import { StyleSheet, View, TouchableOpacity, StyleProp, ViewStyle, Platform } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import AutoExpandingTextInput from './AutoExpandingTextInput';
import { IconSymbol } from './ui/IconSymbol';
import { ThemedText } from './ThemedText';
import { NoOutlineTextInput } from './NoOutlineTextInput';

// 类型定义
export enum EditorMode {
  NOTE = 'note',
  BOOKMARK = 'bookmark'
}

interface BookmarkData {
  bookmarkTitle: string;
  bookmarkUrl: string;
  bookmarkDescription: string;
}

interface MemoEditorProps {
  onSubmit: (type: EditorMode, content?: string, bookmark?: BookmarkData) => void;
  placeholder?: string;
  initText?: string;
  initBookmark?: BookmarkData;
  style?: StyleProp<ViewStyle>;
  always: boolean;
  initMode: EditorMode;
}

// 子组件：书签表单
function BookmarkForm({
  title,
  url,
  description,
  onTitleChange,
  onUrlChange,
  onDescriptionChange
}: {
  title: string;
  url: string;
  description: string;
  onTitleChange: (text: string) => void;
  onUrlChange: (text: string) => void;
  onDescriptionChange: (text: string) => void;
}) {
  return (
    <View style={styles.bookmarkForm}>
      <View style={styles.formField}>
        <ThemedText style={styles.fieldLabel}>标题</ThemedText>
        <NoOutlineTextInput
          style={styles.textInput}
          placeholder="输入书签标题"
          placeholderTextColor="#999"
          value={title}
          onChangeText={onTitleChange}
        />
      </View>

      <View style={styles.formField}>
        <ThemedText style={styles.fieldLabel}>网址</ThemedText>
        <NoOutlineTextInput
          style={styles.textInput}
          placeholder="输入网址"
          placeholderTextColor="#999"
          value={url}
          onChangeText={onUrlChange}
          autoCapitalize="none"
          keyboardType="url"
        />
      </View>

      <View style={styles.formField}>
        <ThemedText style={styles.fieldLabel}>描述</ThemedText>
        <NoOutlineTextInput
          style={[styles.textInput, styles.descriptionInput]}
          placeholder="输入描述"
          placeholderTextColor="#999"
          value={description}
          onChangeText={onDescriptionChange}
          multiline
        />
      </View>
    </View>
  );
}

// 主组件
export function MemoEditor({
  onSubmit,
  placeholder = '输入新的内容...',
  initText,
  initBookmark,
  style,
  always,
  initMode
}: MemoEditorProps) {
  // 状态管理
  const [editorMode, setEditorMode] = useState<EditorMode>(initMode);
  const [newContent, setNewContent] = useState(initText || '');
  const [bookmarkTitle, setBookmarkTitle] = useState(initBookmark?.bookmarkTitle || '');
  const [bookmarkUrl, setBookmarkUrl] = useState(initBookmark?.bookmarkUrl || '');
  const [bookmarkDescription, setBookmarkDescription] = useState(initBookmark?.bookmarkDescription || '');

  // 辅助函数
  const isBookmarkMode = editorMode === EditorMode.BOOKMARK;

  const clearForm = () => {
    if (isBookmarkMode) {
      setBookmarkTitle('');
      setBookmarkUrl('');
      setBookmarkDescription('');
    } else {
      setNewContent('');
    }
  };

  // 事件处理
  const handleSubmit = () => {
    if (isBookmarkMode) {
      if (!bookmarkUrl.trim()) return;

      onSubmit(EditorMode.BOOKMARK, undefined, {
        bookmarkTitle: bookmarkTitle.trim(),
        bookmarkUrl: bookmarkUrl.trim(),
        bookmarkDescription: bookmarkDescription.trim()
      });
    } else {
      if (!newContent.trim()) return;
      onSubmit(EditorMode.NOTE, newContent, undefined);
    }
    clearForm();
  };

  const toggleMode = () => {
    if (always) return;
    setEditorMode(prevMode =>
      prevMode === EditorMode.NOTE ? EditorMode.BOOKMARK : EditorMode.NOTE
    );
  };

  // 渲染
  return (
    <View style={[styles.container, styles.cardShadow, style]}>
      <View style={styles.inputContainer}>
        {isBookmarkMode ? (
          <BookmarkForm
            title={bookmarkTitle}
            url={bookmarkUrl}
            description={bookmarkDescription}
            onTitleChange={setBookmarkTitle}
            onUrlChange={setBookmarkUrl}
            onDescriptionChange={setBookmarkDescription}
          />
        ) : (
          <AutoExpandingTextInput
            style={styles.mainInput}
            placeholder={placeholder}
            placeholderTextColor="#999"
            multiline
            value={newContent}
            onChangeText={setNewContent}
          />
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.modeButton}
            onPress={toggleMode}
            activeOpacity={0.7}
          >
            <IconSymbol
              name={isBookmarkMode ? "link" : "bookmark"}
              size={16}
              color={isBookmarkMode ? "#0a7ea4" : "#f5b642"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            activeOpacity={0.7}
          >
            <Ionicons name="send" size={14} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginBottom: 10,
    maxHeight: 400,
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cardShadow: {
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
  inputContainer: {
    flexDirection: 'column',
    width: '100%',
  },
  mainInput: {
    width: '100%',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#f0f0f0',
    marginBottom: 8,
  },
  bookmarkForm: {
    width: '100%',
    marginBottom: 8,
  },
  formField: {
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 14,
    marginBottom: 4,
    fontWeight: '500',
  },
  textInput: {
    width: '100%',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f0f0f0',
    fontSize: 14,
  },
  descriptionInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  modeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    borderRadius: 6,
    width: 56,
    height: 26,
    backgroundColor: '#0a7ea4',
    justifyContent: 'center',
    alignItems: 'center'
  }
});