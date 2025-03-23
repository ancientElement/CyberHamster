import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { MemoApiServiceAdaptor } from 'src/client-server-public/memo-api-service-adaptor';

@Injectable()
export class MemosService extends MemoApiServiceAdaptor {
  constructor(private readonly databaseService: DatabaseService) {
    super();
  }

  onModuleInit() {
    this.setDd(this.databaseService.db);
  }
}