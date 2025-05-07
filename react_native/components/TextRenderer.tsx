import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ExternalLink } from './ExternalLink';
import { ThemedText } from './ThemedText';
import { eventManager } from '@/events/event-manager';

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
  // 解析文本，将其分割为不同类型的段落
  const parseText = (text: string): TextSegment[] => {
    const segments: TextSegment[] = [];
    let currentIndex = 0;

    // URL和标签的正则表达式
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const tagRegex = /#[\w\u4e00-\u9fa5\/]+/g;

    // 收集所有匹配项
    const matches = [];
    let match;

    // 收集URL匹配
    while ((match = urlRegex.exec(text)) !== null) {
      matches.push({ type: 'link', index: match.index, length: match[0].length, content: match[0] });
    }

    // 收集标签匹配
    while ((match = tagRegex.exec(text)) !== null) {
      matches.push({ type: 'tag', index: match.index, length: match[0].length, content: match[0] });
    }

    // 按索引排序
    matches.sort((a, b) => a.index - b.index);

    // 处理所有匹配项和文本
    for (const match of matches) {
      if (match.index > currentIndex) {
        // 处理匹配项之前的文本
        processTextWithLineBreaks(text.slice(currentIndex, match.index), segments);
      }

      segments.push({
        type: match.type as SegmentType,
        content: match.content,
        url: match.type === 'link' ? match.content : undefined
      });

      currentIndex = match.index + match.length;
    }

    // 处理剩余文本
    if (currentIndex < text.length) {
      processTextWithLineBreaks(text.slice(currentIndex), segments);
    }

    return segments;
  };

  // 处理包含换行符的文本
  const processTextWithLineBreaks = (text: string, segments: TextSegment[]) => {
    if (text.includes('\n')) {
      const parts = text.split('\n');
      for (let i = 0; i < parts.length; i++) {
        if (parts[i] !== '') {
          segments.push({
            type: SegmentType.Text,
            content: parts[i]
          });
        }

        // 除了最后一部分，每部分后面都添加一个换行符
        if (i < parts.length - 1) {
          segments.push({
            type: SegmentType.Text,
            content: '\n'
          });
        }
      }
    } else if (text !== '') {
      segments.push({
        type: SegmentType.Text,
        content: text
      });
    }
  };

  // 渲染单个文本段落
  const renderSegment = (segment: TextSegment, index: number, segments: TextSegment[]) => {
    switch (segment.type) {
      case SegmentType.Link:
        return (
          <ExternalLink key={index} href={segment.url || ''}>
            <ThemedText style={[style, styles.link]}>{segment.content}</ThemedText>
          </ExternalLink>
        );
      case SegmentType.Tag:
        return (
          <TouchableOpacity
            key={index}
            onPress={() => {
              // 去掉#号后发送tagPath
              const tagPath = segment.content.substring(1);
              eventManager.dispatchEvent('tagClick', tagPath);
            }}
          >
            <ThemedText style={[style, styles.tag]}>
              {segment.content}
            </ThemedText>
          </TouchableOpacity>
        );
      default:
        // 处理换行符
        if (segment.content === '\n') {
          // 检查下一个segment是否为空内容
          const nextSegment = segments[index + 1];
          const isEmptyLine = !nextSegment || nextSegment.content === '' || nextSegment.content === '\n';

          if (isEmptyLine) {
            // 如果是空行，使用占满整行的View
            return <View key={index} style={styles.emptyLine} />;
          } else {
            // 如果不是空行，使用占满整行的View确保换行
            return <View key={index} style={styles.lineBreak} />;
          }
        }
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
      {segments.map((segment, index) => renderSegment(segment, index, segments))}
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
    marginVertical: 1,
  },
  emptyLine: {
    width: '100%',
    height: 20, // 空行高度,
  },
  lineBreak: {
    width: '100%',
    height: 1, // 换行高度
  },
});