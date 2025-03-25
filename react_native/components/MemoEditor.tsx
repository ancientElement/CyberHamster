import { StyleSheet, View, TouchableOpacity, StyleProp, ViewStyle, Platform } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import AutoExpandingTextInput from './AutoExpandingTextInput';
import { IconSymbol } from './ui/IconSymbol';
import { BookmarkForm } from './BookmarkForm';
import { AlertHelper } from './AlertHelper';

// 类型定义
export enum EditorMode {
  NOTE = 'note',
  BOOKMARK = 'bookmark'
}

interface BookmarkData {
  bookmarkTitle: string;
  bookmarkUrl: string;
  bookmarkDescription: string;
  bookmarkIcon?: string;
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
  const [bookmarkIcon, setBookmarkIcon] = useState(initBookmark?.bookmarkIcon || '');

  // 辅助函数
  const isBookmarkMode = editorMode === EditorMode.BOOKMARK;

  const clearForm = () => {
    if (isBookmarkMode) {
      setBookmarkTitle('');
      setBookmarkUrl('');
      setBookmarkDescription('');
      setBookmarkIcon('');
    } else {
      setNewContent('');
    }
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = () => {
    if (isBookmarkMode) {
      const trimmedUrl = bookmarkUrl.trim();

      if(trimmedUrl.trim()==='') {
        AlertHelper('网址不能为空');
      }

      if (!isValidUrl(trimmedUrl)) {
        AlertHelper('请输入有效的网址');
        return;
      }

      if (initBookmark) {
        const hasBookmarkChanges =
          bookmarkTitle.trim() !== (initBookmark?.bookmarkTitle) ||
          trimmedUrl !== (initBookmark?.bookmarkUrl) ||
          bookmarkDescription.trim() !== (initBookmark?.bookmarkDescription) ||
          bookmarkIcon.trim() !== (initBookmark?.bookmarkIcon);

        if (!hasBookmarkChanges) {
          AlertHelper('内容没有变化');
          return;
        }
      }

      onSubmit(EditorMode.BOOKMARK, undefined, {
        bookmarkTitle: bookmarkTitle.trim(),
        bookmarkUrl: trimmedUrl,
        bookmarkDescription: bookmarkDescription.trim(),
        bookmarkIcon: bookmarkIcon.trim()
      });
      clearForm();
    } else {
      const trimmedContent = newContent.trim();

      if (trimmedContent.trim() === '') {
        AlertHelper('内容不能为空');
        return;
      }

      if (initText && trimmedContent.trim() === initText) {
        AlertHelper('内容没有变化');
        return;
      }

      onSubmit(EditorMode.NOTE, trimmedContent, undefined);
      clearForm();
    }
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
            bookmarkIcon={bookmarkIcon}
            onTitleChange={setBookmarkTitle}
            onUrlChange={setBookmarkUrl}
            onDescriptionChange={setBookmarkDescription}
            onBookmarkIconChange={setBookmarkIcon}
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
  },
});
