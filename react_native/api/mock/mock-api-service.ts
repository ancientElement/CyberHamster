import { ApiResponse } from '../base-api';
import { IApiService } from '../i-api-service';
import {
  Memo,
  MemoType,
  CreateMemoDto,
  UpdateMemoDto,
} from '../types';

// 模拟数据存储
class MockDatabase {
  private memos: Map<number, Memo> = new Map();
  private currentId = 1;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // 添加笔记类型的备忘录
    const note1: Memo = {
      id: this.currentId++,
      type: MemoType.NOTE,
      createdAt: new Date().toISOString(),
      noteContent: "今天学习了React Native的基础知识，包括组件、状态管理和导航。需要继续深入学习动画和性能优化。"
    };
    this.memos.set(note1.id, note1);

    const note2: Memo = {
      id: this.currentId++,
      type: MemoType.NOTE,
      createdAt: new Date().toISOString(),
      noteContent: "完成了项目的首页设计，使用了新的UI组件库。下一步需要实现数据持久化功能。"
    };
    this.memos.set(note2.id, note2);

    // 添加书签类型的备忘录
    const bookmark1: Memo = {
      id: this.currentId++,
      type: MemoType.BOOKMARK,
      createdAt: new Date().toISOString(),
      bookmarkTitle: "React Native官方文档",
      bookmarkUrl: "https://reactnative.dev/docs/getting-started",
      bookmarkDescription: "React Native的官方文档，包含完整的API参考和指南。",
      bookmarkIcon: "data:image/svg+xml,<svg>...</svg>"
    };
    this.memos.set(bookmark1.id, bookmark1);

    const bookmark2: Memo = {
      id: this.currentId++,
      type: MemoType.BOOKMARK,
      createdAt: new Date().toISOString(),
      bookmarkTitle: "TypeScript手册",
      bookmarkUrl: "https://www.typescriptlang.org/docs/",
      bookmarkDescription: "TypeScript官方文档，提供了完整的语言特性说明和最佳实践。",
      bookmarkIcon: "data:image/svg+xml,<svg>...</svg>"
    };
    this.memos.set(bookmark2.id, bookmark2);
  }

  addMemo(memo: CreateMemoDto): Memo {
    const newMemo: Memo = {
      ...memo.data,
      id: this.currentId++,
      createdAt: new Date().toISOString(),
    };
    this.memos.set(newMemo.id, newMemo);
    return newMemo;
  }

  getMemo(id: number): Memo | undefined {
    return this.memos.get(id);
  }

  updateMemo(id: number, data: Partial<Memo>): Memo | undefined {
    const memo = this.memos.get(id);
    if (memo) {
      const updatedMemo = { ...memo, ...data };
      this.memos.set(id, updatedMemo);
      return updatedMemo;
    }
    return undefined;
  }

  deleteMemo(id: number): boolean {
    return this.memos.delete(id);
  }

  getAllMemos(): Memo[] {
    return Array.from(this.memos.values());
  }
}

export class MockApiService extends IApiService {
  private db = new MockDatabase();

  // 模拟网络延迟
  private async delay(ms: number = 200): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 构造成功响应
  private success<T>(data: T): ApiResponse<T> {
    return {
      success: true,
      data,
      message: '操作成功',
      status: 200,
    };
  }

  // 构造错误响应
  private error(message: string): ApiResponse<any> {
    return {
      success: true,
      status: 200,
      message,
      error: new Error(message),
    };
  }

  async getMemos(): Promise<ApiResponse<Memo[]>> {
    await this.delay();
    const res = this.db.getAllMemos().map(memo=>memo);
    return this.success(res.reverse());
  }

  async getMemo(id: number): Promise<ApiResponse<Memo>> {
    await this.delay();
    const memo = this.db.getMemo(Number(id));
    if (!memo) {
      return this.error('备忘录不存在');
    }
    return this.success(memo);
  }

  async createMemo(request: CreateMemoDto): Promise<ApiResponse<Memo>> {
    await this.delay();
    try {
      const newMemo = this.db.addMemo(request);
      return this.success(newMemo);
    } catch (error) {
      return this.error('创建备忘录失败');
    }
  }

  async updateMemo(id: number, request: UpdateMemoDto): Promise<ApiResponse<Memo>> {
    await this.delay();
    const updatedMemo = this.db.updateMemo(Number(id), request.data);
    if (!updatedMemo) {
      return this.error('更新备忘录失败');
    }
    return this.success(updatedMemo);
  }

  async deleteMemo(id: number): Promise<ApiResponse<void>> {
    await this.delay();
    const success = this.db.deleteMemo(Number(id));
    if (!success) {
      return this.error('删除备忘录失败');
    }
    return this.success(undefined);
  }

  async searchMemos(query: string): Promise<ApiResponse<Memo[]>> {
    await this.delay();
    const allMemos = this.db.getAllMemos();
    const results = allMemos.filter(memo => {
      if (memo.type === MemoType.NOTE) {
        return memo.noteContent?.toLowerCase().includes(query.toLowerCase());
      } else {
        return (
          memo.bookmarkTitle?.toLowerCase().includes(query.toLowerCase()) ||
          memo.bookmarkDescription?.toLowerCase().includes(query.toLowerCase())
        );
      }
    });
    return this.success(results);
  }

  async getMemosByType(type: MemoType): Promise<ApiResponse<Memo[]>> {
    await this.delay();
    const allMemos = this.db.getAllMemos();
    const results = allMemos.filter(memo => memo.type === type);
    return this.success(results);
  }
}