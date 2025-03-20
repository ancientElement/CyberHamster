import { ApiResponse } from './types';

export class BaseApi {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
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
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || '请求失败');
      }

      return result;
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