import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ExternalLink } from './ExternalLink';
import { ThemedText } from './ThemedText';

interface TextRendererProps {
  text: string;
  style?: any;
}

enum SegmentType {
  Text = 'text',
  Link = 'link',
  Tag = 'tag',
}

interface TextSegment {
  type: SegmentType;
  content: string;
  url?: string;
}

export function TextRenderer({ text, style }: TextRendererProps) {
  const parseText = (text: string): TextSegment[] => {
    const segments: TextSegment[] = [];
    let currentIndex = 0;

    // URL正则表达式
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    // 标签正则表达式
    const tagRegex = /#[\w\u4e00-\u9fa5\/]+/g;

    // 合并所有匹配
    const matches = [];
    let match;

    // 收集所有URL匹配
    while ((match = urlRegex.exec(text)) !== null) {
      matches.push({ type: 'link', index: match.index, length: match[0].length, content: match[0] });
    }

    // 收集所有标签匹配
    while ((match = tagRegex.exec(text)) !== null) {
      matches.push({ type: 'tag', index: match.index, length: match[0].length, content: match[0] });
    }

    // 按索引排序
    matches.sort((a, b) => a.index - b.index);

    // 处理所有匹配
    for (const match of matches) {
      if (match.index > currentIndex) {
        segments.push({
          type: SegmentType.Text,
          content: text.slice(currentIndex, match.index)
        });
      }

      segments.push({
        type: match.type as TextSegment['type'],
        content: match.content,
        url: match.type === 'link' ? match.content : undefined
      });

      currentIndex = match.index + match.length;
    }

    // 添加剩余文本
    if (currentIndex < text.length) {
      segments.push({
        type: SegmentType.Text,
        content: text.slice(currentIndex)
      });
    }

    return segments;
  };

  const renderSegment = (segment: TextSegment, index: number) => {
    switch (segment.type) {
      case SegmentType.Link:
        return (
          <ExternalLink key={index} href={segment.url || ''}>
            <ThemedText style={[style, styles.link]}>{segment.content}</ThemedText>
          </ExternalLink>
        );
      case SegmentType.Tag:
        return (
          <ThemedText key={index} style={[style, styles.tag]}>
            {segment.content}
          </ThemedText>
        );
      default:
        return (
          <ThemedText key={index} style={style}>
            {segment.content}
          </ThemedText>
        );
    }
  };

  const segments = parseText(text);

  return (
    <View style={styles.container}>
      {segments.map((segment, index) => renderSegment(segment, index))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  link: {
    color: '#0052cc',
    textDecorationLine: 'underline',
  },
  tag: {
    backgroundColor: '#e6f3ff',
    color: '#2196F3',
    fontWeight: '600',
    paddingHorizontal: 10,
    borderRadius: 6,
    marginHorizontal: 1,
    fontSize: 14,
  },
});