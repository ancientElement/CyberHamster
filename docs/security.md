# 安全性改进文档

## CORS 配置优化

为了增强应用程序的安全性，我们对CORS（跨源资源共享）配置进行了优化。当前的CORS配置如下：

```typescript
app.enableCors({
  origin: ['http://localhost:8081', 'http://10.152.119.107:8081', 'http://47.101.61.188:6531'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});
```

### 主要改进点

1. **严格的源控制**
   - 明确指定了允许访问的域名，避免使用通配符
   - 包含了开发环境和生产环境的地址

2. **HTTP方法限制**
   - 仅允许必要的HTTP方法
   - 包含OPTIONS以支持预检请求

3. **请求头控制**
   - 仅允许必要的请求头
   - 支持Authorization头以实现身份验证

4. **凭证支持**
   - 启用credentials支持，允许跨域请求携带认证信息

## 配置管理

使用ConfigService进行配置管理，提高了安全性和可维护性：

```typescript
const configService = app.get(ConfigService);
const port = configService.get<number>('PORT', 3000);
```

### 改进点

1. **环境变量管理**
   - 敏感配置通过环境变量管理
   - 提供默认值作为fallback

2. **类型安全**
   - 使用TypeScript泛型确保配置值类型正确
   - 减少运行时错误

## 安全最佳实践

1. **配置隔离**
   - 开发和生产环境配置分离
   - 敏感信息不直接硬编码在代码中

2. **错误处理**
   - 生产环境中不暴露详细错误信息
   - 实现统一的错误处理机制

3. **持续改进**
   - 定期审查安全配置
   - 及时更新依赖包以修复已知漏洞

## JWT安全防御机制

为了增强JWT（JSON Web Token）的安全性，我们实施了以下防御措施：

### Token黑名单机制

```typescript
class TokenBlacklistService {
  private blacklist: Set<string> = new Set();

  addToBlacklist(token: string, expiresIn: number) {
    this.blacklist.add(token);
    setTimeout(() => this.blacklist.delete(token), expiresIn);
  }

  isBlacklisted(token: string): boolean {
    return this.blacklist.has(token);
  }
}
```

1. **主动失效机制**
   - 用户登出时将token加入黑名单
   - 密码修改时使相关token失效
   - 定期清理过期token

2. **并发控制**
   - 使用Redis实现分布式token黑名单
   - 设置合理的token过期时间

### 签名算法安全

```typescript
const jwtOptions = {
  algorithms: ['HS256', 'RS256'], // 仅允许安全的算法
  issuer: 'cyber-hamster',
  audience: 'web-client',
  expiresIn: '1h'
};
```

1. **算法白名单**
   - 禁用不安全的'none'算法
   - 限制使用强密码学算法

2. **密钥管理**
   - 使用足够长度的密钥
   - 定期轮换密钥

### 请求频率限制

```typescript
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15分钟窗口
    max: 100, // 限制100次请求
    message: '请求过于频繁，请稍后再试'
  })
);
```

1. **防暴力破解**
   - 实现请求频率限制
   - 特殊接口更严格的限制

2. **IP追踪**
   - 记录可疑IP活动
   - 实现IP黑名单机制

### 额外安全验证

1. **请求验证**
   - 验证token的签发时间和过期时间
   - 检查token的使用范围（作用域）

2. **环境绑定**
   - 将token与用户IP绑定
   - 设备指纹验证