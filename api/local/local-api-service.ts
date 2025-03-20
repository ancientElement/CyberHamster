import { IApiService } from "../i-api-service";
import { ApiResponse, Memo, CreateMemoRequest, MemoType, Tag, CreateTagRequest } from "../types";
import * as SQLite from 'expo-sqlite';

export class LocalApiService extends IApiService {
  getMemos(): Promise<ApiResponse<Memo[]>> {
    throw new Error("Method not implemented.");
  }
  getMemo(id: string): Promise<ApiResponse<Memo>> {
    throw new Error("Method not implemented.");
  }
  createMemo(data: CreateMemoRequest): Promise<ApiResponse<Memo>> {
    throw new Error("Method not implemented.");
  }
  updateMemo(id: string, data: Partial<CreateMemoRequest>): Promise<ApiResponse<Memo>> {
    throw new Error("Method not implemented.");
  }
  deleteMemo(id: string): Promise<ApiResponse<void>> {
    throw new Error("Method not implemented.");
  }
  searchMemos(query: string): Promise<ApiResponse<Memo[]>> {
    throw new Error("Method not implemented.");
  }
  getMemosByType(type: MemoType): Promise<ApiResponse<Memo[]>> {
    throw new Error("Method not implemented.");
  }
  getTags(): Promise<ApiResponse<Tag[]>> {
    throw new Error("Method not implemented.");
  }
  getTag(id: string): Promise<ApiResponse<Tag>> {
    throw new Error("Method not implemented.");
  }
  createTag(data: CreateTagRequest): Promise<ApiResponse<Tag>> {
    throw new Error("Method not implemented.");
  }
  updateTag(id: string, data: Partial<CreateTagRequest>): Promise<ApiResponse<Tag>> {
    throw new Error("Method not implemented.");
  }
  deleteTag(id: string): Promise<ApiResponse<void>> {
    throw new Error("Method not implemented.");
  }
  getChildTags(id: string): Promise<ApiResponse<Tag[]>> {
    throw new Error("Method not implemented.");
  }
  getTagMemos(id: string): Promise<ApiResponse<Tag[]>> {
    throw new Error("Method not implemented.");
  }
  addTagToMemo(memoId: string, tagId: string): Promise<ApiResponse<void>> {
    throw new Error("Method not implemented.");
  }
  removeTagFromMemo(memoId: string, tagId: string): Promise<ApiResponse<void>> {
    throw new Error("Method not implemented.");
  }
  getMemoTags(memoId: string): Promise<ApiResponse<Tag[]>> {
    throw new Error("Method not implemented.");
  }

}