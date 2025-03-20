import React, { createContext, useContext } from 'react';
import { IApiService } from '../api/i-api-service';

// 创建ApiContext
const ApiContext = createContext<IApiService | null>(null);

// 创建Provider组件
export const ApiProvider: React.FC<{ children: React.ReactNode, api: IApiService}> = ({children,api}) => {

  return (
    <ApiContext.Provider value={api}>
      {children}
    </ApiContext.Provider>
  );
};

// 创建自定义Hook以便于使用ApiContext
export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi必须在ApiProvider内部使用');
  }
  return context;
};