const DEFAULT_API_URL = 'http://localhost:3000';

class BaseApi {
  constructor() {
    // 默认API地址
    // 从storage中获取API地址
    let apiUrl = DEFAULT_API_URL;
    chrome.storage.sync.get(['apiUrl'], (result) => {
      if (result.apiUrl) {
        apiUrl = result.apiUrl;
      }
    });

    this.baseUrl = apiUrl;
  }

  async request(method, path, data) {
    const url = `${this.baseUrl}${path}`;
    const options = {
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
      const contentType = response.headers.get('content-type');
      let responseData;

      if (contentType?.includes('application/json')) {
        const text = await response.text();
        responseData = text ? JSON.parse(text) : null;
      }

      if (!response.ok) {
        throw new Error(response.statusText || '请求失败');
      }

      const success = response.status === 200 || response.status === 201;

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

  get(path) {
    return this.request('GET', path);
  }

  post(path, data) {
    return this.request('POST', path, data);
  }

  put(path, data) {
    return this.request('PUT', path, data);
  }

  delete(path) {
    return this.request('DELETE', path);
  }
}

export class ApiService extends BaseApi {
  async createMemo(data) {
    return this.post('/memos', data);
  }
}
