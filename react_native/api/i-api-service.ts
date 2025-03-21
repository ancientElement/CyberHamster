import { BaseApi } from './base-api';
import {
  ApiResponse,
  Memo,
  MemoType,
  CreateMemoDto,
  UpdateMemoDto,
} from './types';

export abstract class IApiService extends BaseApi {
  // Memo APIs
  abstract getMemos(): Promise<ApiResponse<Memo[]>>;
  abstract getMemo(id: string): Promise<ApiResponse<Memo>>;
  abstract createMemo(data: CreateMemoDto): Promise<ApiResponse<Memo>>;
  abstract updateMemo(id: string, data: UpdateMemoDto): Promise<ApiResponse<Memo>>;
  abstract deleteMemo(id: string): Promise<ApiResponse<void>>;
  abstract searchMemos(query: string): Promise<ApiResponse<Memo[]>>;
  abstract getMemosByType(type: MemoType): Promise<ApiResponse<Memo[]>>;
}