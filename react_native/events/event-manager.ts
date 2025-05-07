type EventHandler = (...args: any[]) => void;

class EventManager {
  private static instance: EventManager;
  // 第一层Map: listener -> 第二层Map
  // 第二层Map: eventName -> handler
  private listeners: Map<any, Map<string, EventHandler>>;

  private constructor() {
    this.listeners = new Map();
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
    return true;
  }

  /**
   * 触发事件
   * @param eventName 事件名称
   * @param args 传递给处理函数的参数
   */
  dispatchEvent(eventName: string, ...args: any[]): void {
    for (const [_, listenerEvents] of this.listeners.entries()) {
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
  }

  /**
   * 移除特定监听者的所有事件
   * @param listener 监听者对象
   */
  removeEventAll(listener: any): void {
    this.listeners.delete(listener);
  }

  /**
   * 清除所有事件
   */
  clearAll(): void {
    this.listeners.clear();
  }
}

export const eventManager = EventManager.getInstance();