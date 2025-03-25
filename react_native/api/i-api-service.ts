import { ApiResponse, BaseApi } from './base-api';
import {
  Memo,
  CreateMemoDto,
  UpdateMemoDto,
} from '../client-server-public/types';

export interface IApiService {
  // Memo APIs
  getMemos(): Promise<ApiResponse<Memo[]>>;
  getMemo(id: number): Promise<ApiResponse<Memo>>;
  createMemo(data: CreateMemoDto): Promise<ApiResponse<Memo>>;
  updateMemo(id: number, data: UpdateMemoDto): Promise<ApiResponse<Memo>>;
  deleteMemo(id: number): Promise<ApiResponse<void>>;
  searchMemos(query: string): Promise<ApiResponse<Memo[]>>;
  getMemosByType(type: number): Promise<ApiResponse<Memo[]>>;
}