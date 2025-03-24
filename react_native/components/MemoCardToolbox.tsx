import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useState, useRef, useCallback } from 'react';
import { IconSymbol } from './ui/IconSymbol';
import * as Clipboard from 'expo-clipboard';
import { ThemedView } from '@/components/ThemedView';

interface MemoCardToolboxProps {
  copyContet: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function MemoCardToolbox({ copyContet, onEdit, onDelete }: MemoCardToolboxProps) {
  const [copySuccess, setCopySuccess] = useState(false);
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isCopyingRef = useRef(false);

  const handleCopy = useCallback(async () => {
    // 如果正在复制中，则不执行
    if (isCopyingRef.current) return;

    isCopyingRef.current = true;

    try {
      await Clipboard.setStringAsync(copyContet);

      // 清除之前的定时器
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }

      setCopySuccess(true);

      // 设置新的定时器
      copyTimeoutRef.current = setTimeout(() => {
        setCopySuccess(false);
        isCopyingRef.current = false;
      }, 2000); // 2秒后隐藏成功提示
    } catch (err) {
      console.error('复制失败:', err);
      isCopyingRef.current = false;
    }
  }, [copyContet]);

  return (
    <ThemedView style={styles.buttonGroup}>
      <TouchableOpacity
        onPress={handleCopy}
        style={styles.iconButton}
      >
        <IconSymbol name={copySuccess ? "checkmark" : "text.document"} size={14} color={copySuccess ? "#4CAF50" : "#666"} />
      </TouchableOpacity>

      {onDelete && (
        <TouchableOpacity
          onPress={onDelete}
          style={styles.iconButton}
        >
          <IconSymbol name="trash" size={14} color="#666" />
        </TouchableOpacity>
      )}

      {onEdit && (
        <TouchableOpacity
          onPress={onEdit}
          style={styles.iconButton}
        >
          <IconSymbol name="pencil.line" size={14} color="#666" />
        </TouchableOpacity>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  buttonGroup: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconButton: {
    padding: 4,
    marginLeft: 8
  }
});