import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtBlacklistService {
  private blacklist: Set<string> = new Set();
  private readonly CLEANUP_INTERVAL = 1000 * 60 * 60; // 1小时清理一次

  constructor(private configService: ConfigService) {
    // 定期清理过期的token
    setInterval(() => this.cleanup(), this.CLEANUP_INTERVAL);
  }

  // 添加token到黑名单
  addToBlacklist(token: string, expiresIn: number) {
    this.blacklist.add(token);
    setTimeout(() => {
      this.blacklist.delete(token);
    }, expiresIn);
  }

  // 检查token是否在黑名单中
  isBlacklisted(token: string): boolean {
    return this.blacklist.has(token);
  }

  // 清理过期的token
  private cleanup() {
    // 由于使用了setTimeout自动清理，这里不需要额外的清理逻辑
  }

  // 验证IP地址
  validateIpAddress(requestIp: string, tokenIp: string): boolean {
    return requestIp === tokenIp;
  }
}