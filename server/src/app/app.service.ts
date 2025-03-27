import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private configService: ConfigService) { }
  onModuleInit() {
    if (!this.configService.getOrThrow('JWT_SECRET_KEY')) {
      console.error('JWT_SECRET_KEY is not set in environment variables, make sure you have set it in .env file');
      process.exit(1);//失败退出
    }
  }
}
