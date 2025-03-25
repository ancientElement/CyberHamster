import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MemosModule } from '../memos/memos.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule,MemosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
