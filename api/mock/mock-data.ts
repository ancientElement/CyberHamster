import { MemoType, Memo, Note, Bookmark, Tag, MemoTag } from '../types';

// 模拟笔记数据
export const mockNotes: Note[] = [
  {
    id: 0,
    content: '需要学习React Native的基本概念和组件。 #学习/编程 #React',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 1,
    content: '需要复习TypeScript的高级特性，特别是泛型和装饰器。 #学习/编程 #TypeScript',
    createdAt: '2024-01-16T14:30:00Z'
  },
  {
    id: 2,
    content: '#React #学习 #React/ReactNative #编程/学习 http://localhost:8081/memos',
    createdAt: '2024-01-15T10:00:00Z'
  },
];

// 模拟书签数据
export const mockBookmarks: Bookmark[] = [
  {
    id: 0,
    title: 'React Native官方文档',
    url: 'https://reactnative.dev/docs/getting-started',
    description: 'React Native的官方文档，包含完整的入门指南和API参考。React Native的官方文档，包含完整的入门指南和API参考。React Native的官方文档，包含完整的入门指南和API参考。React Native的官方文档，包含完整的入门指南和API参考。React Native的官方文档，包含完整的入门指南和API参考。React Native的官方文档，包含完整的入门指南和API参考。React Native的官方文档，包含完整的入门指南和API参考。',
    icon: 'https://github.com/favicon.ico',
    createdAt: '2024-01-15T08:00:00Z'
  },
  {
    id: 1,
    title: 'TypeScript Handbook',
    url: 'https://www.typescriptlang.org/docs/',
    description: 'TypeScript官方手册，详细介绍了TypeScript的所有特性。',
    icon: 'https://github.com/favicon.ico',
    createdAt: '2024-01-16T09:00:00Z'
  }
];

// 模拟备忘录数据
export const mockMemos: Memo[] = [
  {
    id: 0,
    type: MemoType.NOTE,
    relativeID: 0,
    data: mockNotes[0],
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 1,
    type: MemoType.BOOKMARK,
    relativeID: 0,
    data: mockBookmarks[0],
    createdAt: '2024-01-15T08:00:00Z',
  },
  {
    id: 2,
    type: MemoType.NOTE,
    relativeID: 1,
    data: mockNotes[1],
    createdAt: '2024-01-16T14:30:00Z',
  },
  {
    id: 3,
    type: MemoType.BOOKMARK,
    relativeID: 1,
    data: mockBookmarks[1],
    createdAt: '2024-01-16T09:00:00Z',
  },
  {
    id: 4,
    type: MemoType.NOTE,
    relativeID: 2,
    data: mockNotes[2],
    createdAt: '2024-01-16T09:00:00Z',
  }
];

// 模拟标签数据
export const mockTags: Tag[] = [
  {
    id: 0,
    path: 'Learning',
    createdAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 1,
    path: 'Learning/Programming',
    parentId: 0,
    createdAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 2,
    path: 'Learning/Programming/React',
    parentId: 1,
    createdAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 3,
    path: 'Learning/Programming/TypeScript',
    parentId: 1,
    createdAt: '2024-01-16T00:00:00Z'
  }
];

// 模拟备忘录和标签的关联数据
export const mockMemoTags: MemoTag[] = [
  {
    id: 1,
    memoId: 0,
    tagId: 2,
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    memoId: 1,
    tagId: 2,
    createdAt: '2024-01-15T08:00:00Z'
  },
  {
    id: 3,
    memoId: 2,
    tagId: 3,
    createdAt: '2024-01-16T14:30:00Z'
  },
  {
    id: 4,
    memoId: 3,
    tagId: 3,
    createdAt: '2024-01-16T09:00:00Z'
  }
];