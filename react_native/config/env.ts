// 环境配置文件

export interface ApiConfig {
  baseUrl: string;
}

const devConfig: ApiConfig = {
  baseUrl: 'http://localhost:3000',
};

const prodConfig: ApiConfig = {
  baseUrl: 'http://47.101.61.188:8552',
};

export const getApiConfig = (): ApiConfig => {
  if (__DEV__) {
    return devConfig;
  }
  return prodConfig;
};