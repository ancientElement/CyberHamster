import { IApiService } from './i-api-service';
import {
  ApiResponse,
  Memo,
  MemoType,
  CreateMemoRequest,
  Tag,
  CreateTagRequest
} from './types';

export class ApiService extends IApiService {
  async getMemos(): Promise<ApiResponse<Memo[]>> {
    return this.get<Memo[]>('/memos');
  }

  async getMemo(id: string): Promise<ApiResponse<Memo>> {
    return this.get<Memo>(`/memos/${id}`);
  }

  async createMemo(data: CreateMemoRequest): Promise<ApiResponse<Memo>> {
    return this.post<Memo>('/memos', data);
  }

  async updateMemo(id: string, data: Partial<CreateMemoRequest>): Promise<ApiResponse<Memo>> {
    return this.put<Memo>(`/memos/${id}`, data);
  }

  async deleteMemo(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/memos/${id}`);
  }

  async searchMemos(query: string): Promise<ApiResponse<Memo[]>> {
    return this.get<Memo[]>(`/memos/search?q=${encodeURIComponent(query)}`);
  }

  async getMemosByType(type: MemoType): Promise<ApiResponse<Memo[]>> {
    return this.get<Memo[]>(`/memos/type/${type}`);
  }

  // Tag APIs
  async getTags(): Promise<ApiResponse<Tag[]>> {
    return this.get<Tag[]>('/tags');
  }

  async getTag(id: string): Promise<ApiResponse<Tag>> {
    return this.get<Tag>(`/tags/${id}`);
  }

  async createTag(data: CreateTagRequest): Promise<ApiResponse<Tag>> {
    return this.post<Tag>('/tags', data);
  }

  async updateTag(id: string, data: Partial<CreateTagRequest>): Promise<ApiResponse<Tag>> {
    return this.put<Tag>(`/tags/${id}`, data);
  }

  async deleteTag(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/tags/${id}`);
  }

  async getChildTags(id: string): Promise<ApiResponse<Tag[]>> {
    return this.get<Tag[]>(`/tags/${id}/children`);
  }

  async getTagMemos(id: string): Promise<ApiResponse<Tag[]>> {
    return this.get<Tag[]>(`/tags/${id}/memos`);
  }

  // Relation APIs
  async addTagToMemo(memoId: string, tagId: string): Promise<ApiResponse<void>> {
    return this.post<void>(`/memos/${memoId}/tags/${tagId}`, {});
  }

  async removeTagFromMemo(memoId: string, tagId: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/memos/${memoId}/tags/${tagId}`);
  }

  async getMemoTags(memoId: string): Promise<ApiResponse<Tag[]>> {
    return this.get<Tag[]>(`/memos/${memoId}/tags`);
  }
}