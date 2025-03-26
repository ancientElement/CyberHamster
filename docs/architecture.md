# CyberHamster 项目架构文档

## 项目概述

CyberHamster 是一个跨平台的个人知识管理系统，包含浏览器扩展和移动应用两个主要客户端，以及一个中心化的服务器端。项目采用现代化的技术栈和最佳实践，实现了高效的数据同步和良好的用户体验。

## 技术栈

- 前端：React Native、Browser Extension (Edge/Chrome)
- 后端：NestJS
- 数据库：Sqlitete数据库

## 系统架构

### 1. 客户端架构

![](F:\WorkPlace\GithubWork\CyberHamster\docs\image.png)

### 1. API服务设计模式

项目采用依赖注入和接口分离的设计模式，主要体现在API服务的实现上：

```typescript
// 接口定义（i-api-service.ts）
export interface IApiService {
  login(username: string, password: string): Promise<ApiResponse<{ access_token: string}>>;
  getMemos(): Promise<ApiResponse<Memo[]>>;
  // ...
}
```

这种设计带来以下优势：

- 解耦：通过接口定义与实现分离，降低了代码耦合度
- 可测试性：便于编写单元测试和mock测试
- 可扩展性：可以轻松添加新的API实现，如Mock服务

### 2. 通用组件设计

#### SimpleCenterCardModal 组件

这是一个通用的模态框组件，解决了以下问题：

- 统一的模态框样式和交互行为
- 处理了点击事件冒泡问题，避免误触关闭
- 支持自定义内容，保持了组件的灵活性

关键实现：

```typescript
export function SimpleCenterCardModal({ visible, onClose, children }: SimpleModalProps) {
  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={e => e.stopPropagation()}
        >
          {children}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
```

#### NoOutlineTextInput 组件

这是一个跨平台文本输入组件，主要解决了以下问题：

- Web平台输入框样式统一
- 去除默认的输入框轮廓，提供更好的视觉体验
- 保持了原生TextInput的所有功能

关键实现：

```typescript
export function NoOutlineTextInput (props:TextInputProps) {
  return (
    <TextInput
      {...props}
      style={[props.style, {
        ...Platform.select({
          web: {
            outline: 'none',
            border: 'none'
          }
        })
      }]}
    />
  );
}
```

## 技术难点及解决方案

### 1. 跨平台兼容性

- 问题：Web和Native平台的样式和行为差异
- 解决：使用Platform.select进行平台特定代码处理，封装通用组件

### 2. 状态管理

- 问题：多端数据同步和状态一致性
- 解决：采用集中式的状态管理，通过API服务统一管理数据流

### 3. 性能优化

- 问题：大量数据渲染和实时搜索的性能问题
- 解决：实现了虚拟列表、防抖搜索等优化策略

## 最佳实践

1. 组件设计原则
- 保持组件的单一职责
- 提供良好的类型定义
- 处理边界情况
2. API设计原则
- RESTful API设计
- 统一的错误处理
- 类型安全
3. 代码组织
- 清晰的目录结构
- 模块化设计
- 统一的代码风格

## 未来规划

1. 功能增强
- 离线支持
- 数据加密
- 多设备同步
2. 性能优化
- 缓存策略优化
- 首屏加载优化
- 网络请求优化
3. 开发体验
- 完善开发文档
- 增加自动化测试
- 优化构建流程