import { View, TouchableOpacity, Animated, StyleSheet, Image } from 'react-native';
import { useState } from 'react';
import { IconSymbol } from './ui/IconSymbol';
import { ThemedText } from './ThemedText';
import { NoOutlineTextInput } from './NoOutlineTextInput';
import { noImage } from '@/constants/NoImagesBase64';

interface BookmarkFormProps {
  title: string;
  url: string;
  description: string;
  bookmarkIcon?: string;
  onTitleChange: (text: string) => void;
  onUrlChange: (text: string) => void;
  onDescriptionChange: (text: string) => void;
  onBookmarkIconChange?: (text: string) => void;
}

export function BookmarkForm({
  title,
  url,
  description,
  bookmarkIcon,
  onTitleChange,
  onUrlChange,
  onDescriptionChange,
  onBookmarkIconChange
}: BookmarkFormProps) {
  const [expanded, setExpanded] = useState(false);
  const animatedHeight = useState(new Animated.Value(0))[0];

  const toggleExpand = () => {
    setExpanded(!expanded);
    Animated.timing(animatedHeight, {
      toValue: expanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.bookmarkForm}>
      <View style={styles.urlContainer}>
        <NoOutlineTextInput
          style={styles.urlInput}
          placeholder="输入网址"
          placeholderTextColor="#999"
          value={url}
          onChangeText={onUrlChange}
          autoCapitalize="none"
          keyboardType="url"
        />
        <TouchableOpacity
          style={styles.expandButton}
          onPress={toggleExpand}
        >
          <IconSymbol
            name={expanded ? "chevron.up" : "chevron.down"}
            size={16}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      <Animated.View style={[
        styles.expandableContent,
        {
          opacity: animatedHeight,
          maxHeight: animatedHeight.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 200]
          }),
        }
      ]}>
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
          <ThemedText style={styles.fieldLabel}>图标</ThemedText>
          <View style={styles.iconInputContainer}>
            <NoOutlineTextInput
              style={[styles.textInput, styles.iconInput]}
              placeholder="输入图标URL"
              placeholderTextColor="#999"
              value={bookmarkIcon}
              onChangeText={onBookmarkIconChange}
            />
            {(
              <Image
                source={{ uri: bookmarkIcon && bookmarkIcon === '' ? noImage : bookmarkIcon}}
                style={styles.iconPreview}
                resizeMode="contain"
              />
            )}
          </View>
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
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  iconInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconInput: {
    flex: 1,
  },
  iconPreview: {
    width: 24,
    height: 24,
    borderRadius: 4,
  },
  bookmarkForm: {
    width: '100%',
  },
  urlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  urlInput: {
    flex: 1,
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#f0f0f0',
    fontSize: 14,
  },
  formField: {
    marginBottom: 8,
    flexDirection: 'row',
    gap: 12,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    width: 40,
    textAlign: 'right',
    textAlignVertical: 'top',
  },
  textInput: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f0f0f0',
    fontSize: 14,
  },
  descriptionInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  expandButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  expandableContent: {
    overflow: 'hidden',
  },
});