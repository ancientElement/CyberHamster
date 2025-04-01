export type SUCCESS = boolean;

export enum STATUS_CODE {
  SUCCESS = 200,
  POST_SUCCESS = 201,
}

// API通用响应格式，用于统一处理服务器返回的数据
export interface ApiResponse<T = any> {
  data?: T;            // 响应数据，可选
  message?: string;    // 响应消息，可选
  success: SUCCESS;    // 请求是否成功
  status: number;      // 响应状态码
  error?: any;         // 错误信息，可选
}

export class BaseApi {
  private baseUrl: string;
  private getToken:  () => Promise<string | null>;

  constructor(baseUrl: string = '/api', getToken: () => Promise<string | null>) {
    this.baseUrl = baseUrl;
    this.getToken = getToken;
  }

  protected async request<T>(
    method: string,
    path: string,
    data?: any
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${path}`;
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await this.getToken()}`,
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);

      // 检查响应内容类型和长度
      const contentType = response.headers.get('content-type');
      let responseData;

      if (contentType?.includes('application/json')) {
        const text = await response.text();
        responseData = text ? JSON.parse(text) : null;
      }

      if (!response.ok) {
        throw new Error(response.statusText || '请求失败');
      }

      const success = response.status === STATUS_CODE.SUCCESS ||
        response.status === STATUS_CODE.POST_SUCCESS;

      return {
        success,
        message: response.statusText,
        data: responseData,
        status: response.status,
      };
    } catch (error) {
      throw error instanceof Error ? error : new Error('网络请求错误');
    }
  }

  protected get<T>(path: string): Promise<ApiResponse<T>> {
    return this.request<T>('GET', path);
  }

  protected post<T>(path: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>('POST', path, data);
  }

  protected put<T>(path: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', path, data);
  }

  protected delete<T>(path: string): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', path);
  }
}