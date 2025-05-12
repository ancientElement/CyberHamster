class BaseApi {
  constructor(baseUrl,apiToken) {
    this.baseUrl = baseUrl;
    this.apiToken = apiToken;
  }

  async request(method, path, data) {
    const url = `${this.baseUrl}${path}`;
    let headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiToken}`
    };

    console.log(headers);

    const options = {
      method,
      headers,
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

  async getAllMemos() {
    return this.get('/memos');
  }

  async updateMemo(id, data) {
    return this.put(`/memos/${id}`, data);
  }

  async deleteMemo(id) {
    return this.delete(`/memos/${id}`);
  }
}
