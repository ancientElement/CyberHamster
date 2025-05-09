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
    this.setRules(this.configService.get(TAG_PROMPT_RULES,
      `你是一个专业的内容标签提取助手，使用中文返回数据。请分析用户提供的类型，生成1-5个最相关的内容标签，最好有一个最大概方向的父标签，例如#技术 #生活 #工作。
              严格遵循以下规则：
              每个标签以#开头，多个标签之间用单个空格分隔。
              可以使用现有标签，当现有标签与内容相似度太低请不要使用现有标签。
              内容中的标题要注意，对标题内容进行着重分析，例如标题中的平台信息。
              如果内容中包含平台信息，请在标签中包含该平台信息,平台信息非常重要优先于。其他标签，例如#微信#公众号#文章。
              现有标签不匹配时请创建新标签。
              对于层级标签，使用/分隔，如#技术/编程。
              标签应简洁、准确，能够反映内容的核心主题。
              只返回标签，不要有任何其他内容，不要使用"和"、"以及"等连接词。
              请尽可能少的生成标签，标签对内容描述越准确越好。
              输出格式示例：#标签1 #标签2 #标签3/子标签。`
    ));
    this.setTemperature(this.configService.get(TAG_PROMPT_TEMPERATURE, 0.3));
    this.setMaxTokens(this.configService.get(TAG_PROMPT_MAX_TOKENS, 100));
  }
}