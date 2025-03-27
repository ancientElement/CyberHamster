import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { MemosService } from './memos.service';
import { CreateMemoDto, UpdateMemoDto, MemoType } from '../client-server-public/types';
import { AuthGuard } from '@nestjs/passport';
import { Throttle } from '@nestjs/throttler';

@Throttle({ default: { limit: 60, ttl: 60000 } })
@Controller('memos')
@UseGuards(AuthGuard('cyberhamster-jwt'))
export class MemosController {
  constructor(private readonly memosService: MemosService) {}

  @Get()
  async getMemos() {
    return this.memosService.getMemos();
  }

  @Get(':id')
  async getMemo(@Param('id') id: string) {
    return this.memosService.getMemo(parseInt(id));
  }

  @Post()
  async createMemo(@Body() createMemoDto: CreateMemoDto) {
    return this.memosService.createMemo(createMemoDto);
  }

  @Put(':id')
  async updateMemo(
    @Param('id') id: string,
    @Body() updateMemoDto: UpdateMemoDto,
  ) {
    return this.memosService.updateMemo(parseInt(id), updateMemoDto);
  }

  @Delete(':id')
  async deleteMemo(@Param('id') id: string) {
    return this.memosService.deleteMemo(parseInt(id));
  }

  @Get('search')
  async searchMemos(@Query('q') query: string) {
    return this.memosService.searchMemos(query);
  }

  @Get('type/:type')
  async getMemosByType(@Param('type') type: string) {
    return this.memosService.getMemosByType(parseInt(type) as MemoType);
  }
}