import { ApiResponse, BaseApi } from './base-api';
import {
  Memo,
  MemoType,
  CreateMemoDto,
  UpdateMemoDto,
} from './types';

export abstract class IApiService extends BaseApi {
  // Memo APIs
  abstract getMemos(): Promise<ApiResponse<Memo[]>>;
  abstract getMemo(id: number): Promise<ApiResponse<Memo>>;
  abstract createMemo(data: CreateMemoDto): Promise<ApiResponse<Memo>>;
  abstract updateMemo(id: number, data: UpdateMemoDto): Promise<ApiResponse<Memo>>;
  abstract deleteMemo(id: number): Promise<ApiResponse<void>>;
  abstract searchMemos(query: string): Promise<ApiResponse<Memo[]>>;
  abstract getMemosByType(type: number): Promise<ApiResponse<Memo[]>>;
}