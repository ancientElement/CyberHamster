import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { MemoApiServiceAdaptor } from 'src/client-server-public/memo-api-service-adaptor';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { AI_KEY, TAG_PROMPT_MAX_TOKENS, TAG_PROMPT_RULES, TAG_PROMPT_TEMPERATURE } from 'src/const';

@Injectable()
export class MemosService extends MemoApiServiceAdaptor {
  constructor(private readonly databaseService: DatabaseService, private readonly configService: ConfigService) {
    super();
  }

  onModuleInit() {
    this.setDd(this.databaseService.db);
    // 配置OpenAI客户端
    this.setOpenai(new OpenAI({
      apiKey: this.configService.get(AI_KEY),
      baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1"
    }));
    this.setTemperature(this.configService.get(TAG_PROMPT_TEMPERATURE, 0.3));
    this.setMaxTokens(this.configService.get(TAG_PROMPT_MAX_TOKENS, 100));
  }
}