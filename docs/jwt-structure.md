# JWT (JSON Web Token) 结构图

## JWT 基本结构

JWT由三部分组成，每部分用点号(.)分隔：

```
header.payload.signature
```

## 详细结构图

```mermaid
graph TD
    A[JWT Token] --> B[Header]
    A --> C[Payload]
    A --> D[Signature]
    
    B --> B1[typ: JWT]
    B --> B2[alg: HS256/RS256]
    
    C --> C1[Registered Claims]
    C --> C2[Custom Claims]
    
    C1 --> C11[iss: 签发者]
    C1 --> C12[sub: 主题]
    C1 --> C13[aud: 接收者]
    C1 --> C14[exp: 过期时间]
    C1 --> C15[iat: 签发时间]
    
    D --> D1[HMACSHA256<br/>base64UrlEncode(header) + "." +<br/>base64UrlEncode(payload),<br/>secret]
```

## 各部分说明

### 1. Header（头部）
- 包含token的类型和使用的加密算法
- 使用Base64URL编码
- 示例：
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### 2. Payload（负载）
- 包含声明（claims）
- 使用Base64URL编码
- 包含标准字段和自定义字段
- 示例：
```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022,
  "exp": 1516242622
}
```

### 3. Signature（签名）
- 使用指定的算法对前两部分进行签名
- 确保token的完整性和真实性
- 计算公式：
```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

## 完整JWT示例

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
``` 