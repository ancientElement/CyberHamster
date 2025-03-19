import { MemoType, Memo, Note, BookMark, Tag, MemoTag } from '../types';

// 模拟笔记数据
export const mockNotes: Note[] = [
  {
    id: 1,
    content: '今天学习了React Native的基础知识，感觉很有趣。',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    content: '需要复习TypeScript的高级特性，特别是泛型和装饰器。',
    createdAt: '2024-01-16T14:30:00Z'
  }
];

// 模拟书签数据
export const mockBookmarks: BookMark[] = [
  {
    title: 'React Native官方文档',
    url: 'https://reactnative.dev/docs/getting-started',
    description: 'React Native的官方文档，包含完整的入门指南和API参考。',
    icon: '',
    createdAt: '2024-01-15T08:00:00Z'
  },
  {
    title: 'TypeScript Handbook',
    url: 'https://www.typescriptlang.org/docs/',
    description: 'TypeScript官方手册，详细介绍了TypeScript的所有特性。',
    icon: '',
    createdAt: '2024-01-16T09:00:00Z'
  }
];

// 模拟备忘录数据
export const mockMemos: Memo[] = [
  {
    id: 1,
    type: MemoType.NOTE,
    relativeID: 1,
    data: mockNotes[0],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    type: MemoType.BOOKMARK,
    relativeID: 1,
    data: mockBookmarks[0],
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z'
  },
  {
    id: 3,
    type: MemoType.NOTE,
    relativeID: 2,
    data: mockNotes[1],
    createdAt: '2024-01-16T14:30:00Z',
    updatedAt: '2024-01-16T14:30:00Z'
  },
  {
    id: 4,
    type: MemoType.BOOKMARK,
    relativeID: 2,
    data: mockBookmarks[1],
    createdAt: '2024-01-16T09:00:00Z',
    updatedAt: '2024-01-16T09:00:00Z'
  }
];

// 模拟标签数据
export const mockTags: Tag[] = [
  {
    id: 1,
    path: 'Learning',
    createdAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 2,
    path: 'Learning/Programming',
    parentId: 1,
    createdAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 3,
    path: 'Learning/Programming/React',
    parentId: 2,
    createdAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 4,
    path: 'Learning/Programming/TypeScript',
    parentId: 2,
    createdAt: '2024-01-16T00:00:00Z'
  }
];

// 模拟备忘录和标签的关联数据
export const mockMemoTags: MemoTag[] = [
  {
    id: 1,
    memoId: 1,
    tagId: 3,
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    memoId: 2,
    tagId: 3,
    createdAt: '2024-01-15T08:00:00Z'
  },
  {
    id: 3,
    memoId: 3,
    tagId: 4,
    createdAt: '2024-01-16T14:30:00Z'
  },
  {
    id: 4,
    memoId: 4,
    tagId: 4,
    createdAt: '2024-01-16T09:00:00Z'
  }
];