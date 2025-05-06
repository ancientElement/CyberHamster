import { ApiResponse, BaseApi } from './base-api';
import { IApiService } from './i-api-service';
import {
  Memo,
  MemoType,
  CreateMemoDto,
  TagTreeNode,
  LoginDot,
  UpdateTagDto,
} from '../client-server-public/types';

export class ApiService extends BaseApi implements IApiService {

  login(username: string, password: string): Promise<ApiResponse<LoginDot>> {
    return this.post('/auth/login', { username, password });
  }

  register(username: string, password: string): Promise<ApiResponse<void>> {
    throw new Error('Method not implemented.');
  }

  async getMemos(): Promise<ApiResponse<Memo[]>> {
    return this.get<Memo[]>('/memos');
  }

  async getMemo(id: number): Promise<ApiResponse<Memo>> {
    return this.get<Memo>(`/memos/${id}`);
  }

  async createMemo(data: CreateMemoDto): Promise<ApiResponse<Memo>> {
    return this.post<Memo>('/memos', data);
  }

  async updateMemo(id: number, data: CreateMemoDto): Promise<ApiResponse<Memo>> {
    return this.put<Memo>(`/memos/${id}`, data);
  }

  async deleteMemo(id: number): Promise<ApiResponse<void>> {
    return this.delete<void>(`/memos/${id}`);
  }

  async searchMemos(query: string): Promise<ApiResponse<Memo[]>> {
    return this.get<Memo[]>(`/memos/search?q=${encodeURIComponent(query)}`);
  }

  async getMemosByType(type: MemoType): Promise<ApiResponse<Memo[]>> {
    return this.get<Memo[]>(`/memos/type/${type}`);
  }

  async getTags(): Promise<ApiResponse<string[]>> {
    return this.get<string[]>(`/memos/tags`);
  }

  async getTagsTree(): Promise<ApiResponse<TagTreeNode[]>> {
    return this.get<TagTreeNode[]>(`/memos/tagstree`);
  }

  async getMemosByTagIds(ids: number[]): Promise<ApiResponse<Memo[]>> {
    return this.get<Memo[]>(`/memos/memobytagid/${ids.join('&')}`);
  }

  async updateTag(id: number, data: UpdateTagDto): Promise<ApiResponse<TagTreeNode>> {
    return this.put<TagTreeNode>(`/memos/tags/${id}`, data);
  }

  async deleteTag(id: number): Promise<ApiResponse<void>> {
    return this.delete<void>(`/memos/tags/${id}`);
  }
}