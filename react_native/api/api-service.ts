import { ApiResponse } from './base-api';
import { IApiService } from './i-api-service';
import {
  Memo,
  MemoType,
  CreateMemoDto,
} from '../client-server-public/types';

export class ApiService extends IApiService {
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
}