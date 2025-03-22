// 内容类型枚举，用于区分不同类型的备忘录
export enum MemoType {
  BOOKMARK = 1,         // 书签类型
  NOTE = 2,            // 笔记类型
}

export function noteProps(memo: Memo) {
  return {
    id: memo.id,                  // 唯一标识符
    type: memo.type,              // 备忘录类型
    createdAt: memo.createdAt,    // 创建时间
    content: memo.noteContent!,
  };
}

export function bookmarkProps(memo: Memo) {
  return {
    id: memo.id,                  // 唯一标识符
    type: memo.type,              // 备忘录类型
    createdAt: memo.createdAt,    // 创建时间
    title: memo.bookmarkTitle!,
    url: memo.bookmarkUrl!,
    description: memo.bookmarkDescription,
    icon: memo.bookmarkIcon,
  };
}

// 备忘录基础信息接口，包含共同的元数据
export interface Memo {
  id: number,          // 唯一标识符
  type: MemoType,      // 备忘录类型
  createdAt: string;   // 创建时间
  //------------------
  noteContent?: string;     // 笔记内容
  //------------------
  bookmarkTitle?: string;       // 书签标题
  bookmarkUrl?: string;         // 书签URL地址
  bookmarkDescription?: string; // 书签描述信息
  bookmarkIcon?: string;        // 书签图标，base64编码的图片数据
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

export interface NoteUniFields {
    type: MemoType.NOTE,
    noteContent: string;
}

export interface BookmarkUniFields {
  type: MemoType.BOOKMARK,
  bookmarkTitle: string;
  bookmarkUrl: string;
  bookmarkDescription?: string;
  bookmarkIcon?: string;
}

// 创建备忘录的请求接口
export interface CreateMemoDto {
  data: NoteUniFields | BookmarkUniFields; // 备忘录具体内容
}

// 更新备忘录的请求接口
export interface UpdateMemoDto {
  data: NoteUniFields | BookmarkUniFields; // 备忘录具体内容
}