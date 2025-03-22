import { ApiResponse } from './base-api';
import { IApiService } from './i-api-service';
import {
  Memo,
  MemoType,
  CreateMemoDto,
} from './types';

export class ApiService extends IApiService {
  async getMemos(): Promise<ApiResponse<Memo[]>> {
    return this.get<Memo[]>('/memos');
  }

  async getMemo(id: string): Promise<ApiResponse<Memo>> {
    return this.get<Memo>(`/memos/${id}`);
  }

  async createMemo(data: CreateMemoDto): Promise<ApiResponse<Memo>> {
    return this.post<Memo>('/memos', data);
  }

  async updateMemo(id: string, data: CreateMemoDto): Promise<ApiResponse<Memo>> {
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
}