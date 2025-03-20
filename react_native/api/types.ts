// API通用响应格式，用于统一处理服务器返回的数据
export interface ApiResponse<T = any> {
  data?: T;            // 响应数据，可选
  message?: string;     // 响应消息，可选
  status: number;       // 响应状态码
  error?: any;           // 错误信息，可选
}

// 内容类型枚举，用于区分不同类型的备忘录
export enum MemoType {
  BOOKMARK = 1,         // 书签类型
  NOTE = 2,            // 笔记类型
}

// 备忘录基础信息接口，包含共同的元数据
export interface Memo {
  id: number,          // 唯一标识符
  type: MemoType,      // 备忘录类型
  relativeID: number,  // 关联ID
  data: Note | Bookmark, // 具体内容数据
  createdAt: string;   // 创建时间
}

// 笔记内容接口，用于存储文本类型的备忘录
export interface Note {
  id: number;          // 笔记ID
  content: string;     // 笔记内容
  createdAt: string;   // 创建时间
}

// 书签内容接口，用于存储网页链接类型的备忘录
export interface Bookmark {
  id: number;          // 书签ID
  title: string;       // 书签标题
  url: string;         // 书签URL地址
  description: string; // 书签描述信息
  icon: string;        // 书签图标，base64编码的图片数据
  createdAt: string;   // 创建时间
}

// 标签接口，用于组织和分类备忘录
export interface Tag {
  id: number;          // 标签ID
  path: string;        // 标签路径，表示标签的层级结构
  parentId?: number;   // 父标签ID，可选，用于构建标签树
  createdAt: string;   // 创建时间
}

// 备忘录和标签的关联接口，用于实现多对多关系
export interface MemoTag {
  id: number;          // 关联记录ID
  memoId: number;      // 关联的备忘录ID
  tagId: number;       // 关联的标签ID
  createdAt: string;   // 创建时间
}

// 创建备忘录的请求接口
export interface CreateMemoRequest {
  type: MemoType;      // 要创建的备忘录类型
  data: Note | Bookmark; // 备忘录具体内容
}

// 创建标签的请求接口
export interface CreateTagRequest {
  path: string;        // 标签路径
  parentId?: number;   // 父标签ID，可选
}