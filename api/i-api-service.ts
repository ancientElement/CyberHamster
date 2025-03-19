import { BaseApi } from './base-api';
import {
  ApiResponse,
  Memo,
  MemoType,
  CreateMemoRequest,
  Tag,
  CreateTagRequest
} from './types';

export abstract class IApiService extends BaseApi {
  // Memo APIs
  abstract getMemos(): Promise<ApiResponse<Memo[]>>;
  abstract getMemo(id: string): Promise<ApiResponse<Memo>>;
  abstract createMemo(data: CreateMemoRequest): Promise<ApiResponse<Memo>>;
  abstract updateMemo(id: string, data: Partial<CreateMemoRequest>): Promise<ApiResponse<Memo>>;
  abstract deleteMemo(id: string): Promise<ApiResponse<void>>;
  abstract searchMemos(query: string): Promise<ApiResponse<Memo[]>>;
  abstract getMemosByType(type: MemoType): Promise<ApiResponse<Memo[]>>;

  // Tag APIs
  abstract getTags(): Promise<ApiResponse<Tag[]>>;
  abstract getTag(id: string): Promise<ApiResponse<Tag>>;
  abstract createTag(data: CreateTagRequest): Promise<ApiResponse<Tag>>;
  abstract updateTag(id: string, data: Partial<CreateTagRequest>): Promise<ApiResponse<Tag>>;
  abstract deleteTag(id: string): Promise<ApiResponse<void>>;
  abstract getChildTags(id: string): Promise<ApiResponse<Tag[]>>;
  abstract getTagMemos(id: string): Promise<ApiResponse<Tag[]>>;

  // Relation APIs
  abstract addTagToMemo(contentId: string, tagId: string): Promise<ApiResponse<void>>;
  abstract removeTagFromMemo(contentId: string, tagId: string): Promise<ApiResponse<void>>;
  abstract getMemoTags(contentId: string): Promise<ApiResponse<Tag[]>>;
}