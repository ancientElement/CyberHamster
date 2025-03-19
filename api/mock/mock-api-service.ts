import { IApiService } from '../i-api-service';
import {
  ApiResponse,
  Memo,
  MemoType,
  CreateMemoRequest,
  Tag,
  CreateTagRequest,
  BookMark,
  Note,
  MemoTag
} from '../types';
import { mockMemos, mockTags, mockMemoTags } from './mock-data';

// 模拟网络延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 生成API响应
const createResponse = <T>(data: T, status: number = 200, message?: string): ApiResponse<T> => ({
  data,
  status,
  message
});

export class MockApiService extends IApiService {
  private nextMemoId = mockMemos.length + 1;
  private nextTagId = mockTags.length + 1;
  private nextMemoTagId = mockMemoTags.length + 1;

  async getMemos(): Promise<ApiResponse<Memo[]>> {
    await delay(300);
    return createResponse(mockMemos);
  }

  async getMemo(id: string): Promise<ApiResponse<Memo>> {
    await delay(200);
    const memo = mockMemos.find(m => m.id === Number(id));
    if (!memo) {
      return createResponse({} as Memo, 404, '备忘录不存在');
    }
    return createResponse(memo);
  }

  async createMemo(data: CreateMemoRequest): Promise<ApiResponse<Memo>> {
    await delay(300);
    const newMemo: Memo = {
      id: this.nextMemoId++,
      type: data.type,
      relativeID: this.nextMemoId,
      data: data.data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockMemos.push(newMemo);
    return createResponse(newMemo, 201);
  }

  async updateMemo(id: string, data: Partial<CreateMemoRequest>): Promise<ApiResponse<Memo>> {
    await delay(300);
    const memo = mockMemos.find(m => m.id === Number(id));
    if (!memo) {
      return createResponse({} as Memo, 404, '备忘录不存在');
    }
    Object.assign(memo, {
      type: data.type ?? memo.type,
      data: data.data ?? memo.data,
      updatedAt: new Date().toISOString()
    });
    return createResponse(memo);
  }

  async deleteMemo(id: string): Promise<ApiResponse<void>> {
    await delay(200);
    const index = mockMemos.findIndex(m => m.id === Number(id));
    if (index === -1) {
      return createResponse(undefined, 404, '备忘录不存在');
    }
    mockMemos.splice(index, 1);
    // 删除相关的标签关联
    const memoTagIndexes = mockMemoTags.filter(mt => mt.memoId === Number(id));
    memoTagIndexes.forEach(mt => {
      const index = mockMemoTags.findIndex(item => item.id === mt.id);
      if (index !== -1) {
        mockMemoTags.splice(index, 1);
      }
    });
    return createResponse(undefined);
  }

  async searchMemos(query: string): Promise<ApiResponse<Memo[]>> {
    await delay(300);
    const results = mockMemos.filter(memo => {
      if (memo.type === MemoType.NOTE) {
        const bookmark = memo.data as Note;
        return bookmark.content.toLowerCase().includes(query.toLowerCase());
      } else {
        const bookmark = memo.data as BookMark;
        return (
          bookmark.title.toLowerCase().includes(query.toLowerCase()) ||
          bookmark.description.toLowerCase().includes(query.toLowerCase())
        );
      }
    });
    return createResponse(results);
  }

  async getMemosByType(type: MemoType): Promise<ApiResponse<Memo[]>> {
    await delay(200);
    const memos = mockMemos.filter(m => m.type === type);
    return createResponse(memos);
  }

  async getTags(): Promise<ApiResponse<Tag[]>> {
    await delay(200);
    return createResponse(mockTags);
  }

  async getTag(id: string): Promise<ApiResponse<Tag>> {
    await delay(200);
    const tag = mockTags.find(t => t.id === Number(id));
    if (!tag) {
      return createResponse({} as Tag, 404, '标签不存在');
    }
    return createResponse(tag);
  }

  async createTag(data: CreateTagRequest): Promise<ApiResponse<Tag>> {
    await delay(300);
    const newTag: Tag = {
      id: this.nextTagId++,
      path: data.path,
      parentId: data.parentId,
      createdAt: new Date().toISOString()
    };
    mockTags.push(newTag);
    return createResponse(newTag, 201);
  }

  async updateTag(id: string, data: Partial<CreateTagRequest>): Promise<ApiResponse<Tag>> {
    await delay(300);
    const tag = mockTags.find(t => t.id === Number(id));
    if (!tag) {
      return createResponse({} as Tag, 404, '标签不存在');
    }
    Object.assign(tag, {
      path: data.path ?? tag.path,
      parentId: data.parentId ?? tag.parentId
    });
    return createResponse(tag);
  }

  async deleteTag(id: string): Promise<ApiResponse<void>> {
    await delay(200);
    const index = mockTags.findIndex(t => t.id === Number(id));
    if (index === -1) {
      return createResponse(undefined, 404, '标签不存在');
    }
    mockTags.splice(index, 1);
    // 删除相关的标签关联
    const memoTagIndexes = mockMemoTags.filter(mt => mt.tagId === Number(id));
    memoTagIndexes.forEach(mt => {
      const index = mockMemoTags.findIndex(item => item.id === mt.id);
      if (index !== -1) {
        mockMemoTags.splice(index, 1);
      }
    });
    return createResponse(undefined);
  }

  async getChildTags(id: string): Promise<ApiResponse<Tag[]>> {
    await delay(200);
    const childTags = mockTags.filter(t => t.parentId === Number(id));
    return createResponse(childTags);
  }

  async getTagMemos(id: string): Promise<ApiResponse<Tag[]>> {
    await delay(300);
    const memoTags = mockMemoTags.filter(mt => mt.tagId === Number(id));
    const tags = memoTags.map(mt => {
      const memo = mockMemos.find(m => m.id === mt.memoId);
      return memo;
    }).filter(Boolean);
    return createResponse(tags as any);
  }

  async addTagToMemo(contentId: string, tagId: string): Promise<ApiResponse<void>> {
    await delay(200);
    const memo = mockMemos.find(m => m.id === Number(contentId));
    const tag = mockTags.find(t => t.id === Number(tagId));
    if (!memo || !tag) {
      return createResponse(undefined, 404, '备忘录或标签不存在');
    }
    const existingRelation = mockMemoTags.find(
      mt => mt.memoId === Number(contentId) && mt.tagId === Number(tagId)
    );
    if (existingRelation) {
      return createResponse(undefined, 400, '关联已存在');
    }
    const newMemoTag: MemoTag = {
      id: this.nextMemoTagId++,
      memoId: Number(contentId),
      tagId: Number(tagId),
      createdAt: new Date().toISOString()
    };
    mockMemoTags.push(newMemoTag);
    return createResponse(undefined, 201);
  }

  async removeTagFromMemo(contentId: string, tagId: string): Promise<ApiResponse<void>> {
    await delay(200);
    const index = mockMemoTags.findIndex(
      mt => mt.memoId === Number(contentId) && mt.tagId === Number(tagId)
    );
    if (index === -1) {
      return createResponse(undefined, 404, '关联不存在');
    }
    mockMemoTags.splice(index, 1);
    return createResponse(undefined);
  }

  async getMemoTags(contentId: string): Promise<ApiResponse<Tag[]>> {
    await delay(200);
    const memoTags = mockMemoTags.filter(mt => mt.memoId === Number(contentId));
    const tags = memoTags.map(mt => mockTags.find(t => t.id === mt.tagId)).filter(Boolean);
    return createResponse(tags as Tag[]);
  }
}