type EventHandler = (...args: any[]) => void;

class EventManager {
  private static instance: EventManager;
  // 第一层Map: listener -> 第二层Map
  // 第二层Map: eventName -> handler
  private listeners: Map<any, Map<string, EventHandler>>;
  // 新增：事件名称到监听者列表的映射
  private eventListeners: Map<string, Set<any>>;

  private constructor() {
    this.listeners = new Map();
    this.eventListeners = new Map();
  }

  static getInstance(): EventManager {
    if (!EventManager.instance) {
      EventManager.instance = new EventManager();
    }
    return EventManager.instance;
  }

  /**
   * 添加事件监听
   * @param eventName 事件名称
   * @param handler 处理函数
   * @param listener 监听者对象（作为key）
   * @returns 是否添加成功（如果已存在则返回false）
   */
  addEvent(eventName: string, handler: EventHandler, listener: any): boolean {
    if (!this.listeners.has(listener)) {
      this.listeners.set(listener, new Map());
    }

    const listenerEvents = this.listeners.get(listener)!;
    if (listenerEvents.has(eventName)) {
      return false;
    }

    listenerEvents.set(eventName, handler);

    // 更新事件监听者映射
    if (!this.eventListeners.has(eventName)) {
      this.eventListeners.set(eventName, new Set());
    }
    this.eventListeners.get(eventName)!.add(listener);

    return true;
  }

  /**
   * 触发事件
   * @param eventName 事件名称
   * @param args 传递给处理函数的参数
   */
  dispatchEvent(eventName: string, ...args: any[]): void {
    const listeners = this.eventListeners.get(eventName);
    if (!listeners) return;

    for (const listener of listeners) {
      const listenerEvents = this.listeners.get(listener);
      if (listenerEvents) {
        const handler = listenerEvents.get(eventName);
        if (handler) {
          try {
            handler(...args);
          } catch (error) {
            console.error(`Error in event handler for ${eventName}:`, error);
          }
        }
      }
    }
  }

  /**
   * 移除特定事件的特定监听者
   * @param eventName 事件名称
   * @param listener 监听者对象
   */
  removeEvent(eventName: string, listener: any): void {
    const listenerEvents = this.listeners.get(listener);
    if (listenerEvents) {
      listenerEvents.delete(eventName);
      if (listenerEvents.size === 0) {
        this.listeners.delete(listener);
      }
    }

    // 更新事件监听者映射
    const eventListeners = this.eventListeners.get(eventName);
    if (eventListeners) {
      eventListeners.delete(listener);
      if (eventListeners.size === 0) {
        this.eventListeners.delete(eventName);
      }
    }
  }

  /**
   * 移除特定监听者的所有事件
   * @param listener 监听者对象
   */
  removeEventAll(listener: any): void {
    const listenerEvents = this.listeners.get(listener);
    if (listenerEvents) {
      // 更新事件监听者映射
      for (const [eventName, _] of listenerEvents) {
        const eventListeners = this.eventListeners.get(eventName);
        if (eventListeners) {
          eventListeners.delete(listener);
          if (eventListeners.size === 0) {
            this.eventListeners.delete(eventName);
          }
        }
      }
    }
    this.listeners.delete(listener);
  }

  /**
   * 清除所有事件
   */
  clearAll(): void {
    this.listeners.clear();
    this.eventListeners.clear();
  }
}

export const eventManager = EventManager.getInstance();