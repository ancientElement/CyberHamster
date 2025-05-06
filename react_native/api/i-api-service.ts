import { ApiResponse, BaseApi } from './base-api';
import {
  Memo,
  CreateMemoDto,
  UpdateMemoDto,
  TagTreeNode,
  LoginDot,
  UpdateTagDto,
} from '../client-server-public/types';

export interface IApiService {
  // Auth APIs
  login(username: string, password: string): Promise<ApiResponse<LoginDot>>;
  register(username: string, password: string): Promise<ApiResponse<void>>;

  // Memo APIs
  getMemos(): Promise<ApiResponse<Memo[]>>;
  getMemo(id: number): Promise<ApiResponse<Memo>>;
  createMemo(data: CreateMemoDto): Promise<ApiResponse<Memo>>;
  updateMemo(id: number, data: UpdateMemoDto): Promise<ApiResponse<Memo>>;
  deleteMemo(id: number): Promise<ApiResponse<void>>;
  searchMemos(query: string): Promise<ApiResponse<Memo[]>>;
  getMemosByType(type: number): Promise<ApiResponse<Memo[]>>;
  getMemosByTagIds(ids: number[]): Promise<ApiResponse<Memo[]>>;
  getTags(): Promise<ApiResponse<string[]>>;
  getTagsTree(): Promise<ApiResponse<TagTreeNode[]>>;

  // Tag APIs
  updateTag(id: number, data: UpdateTagDto): Promise<ApiResponse<TagTreeNode>>;
  deleteTag(id: number): Promise<ApiResponse<void>>;
  fixTagFormat(): Promise<ApiResponse<void>>;

  // Base HTTP methods
  post<T>(path: string, data?: any): Promise<ApiResponse<T>>;
  get<T>(path: string): Promise<ApiResponse<T>>;
  put<T>(path: string, data?: any): Promise<ApiResponse<T>>;
  delete<T>(path: string): Promise<ApiResponse<T>>;
}