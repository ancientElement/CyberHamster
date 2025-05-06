import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { MemosService } from './memos.service';
import { CreateMemoDto, UpdateMemoDto, MemoType, UpdateTagDto } from '../client-server-public/types';
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

  @Get('tags')
  async getTags() {
    return this.memosService.getTags();
  }

  @Get('tagstree')
  async getTagsTree() {
    return this.memosService.getTagsTree();
  }


  @Get('search')
  async searchMemos(@Query('q') query: string) {
    return this.memosService.searchMemos(query);
  }

  @Post()
  async createMemo(@Body() createMemoDto: CreateMemoDto) {
    return this.memosService.createMemo(createMemoDto);
  }

  @Get(':id')
  async getMemo(@Param('id') id: string) {
    return this.memosService.getMemo(parseInt(id));
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

  @Get('type/:type')
  async getMemosByType(@Param('type') type: string) {
    return this.memosService.getMemosByType(parseInt(type) as MemoType);
  }

  @Get('memobytagid/:ids')
  async getMemosByTagIds(@Param('ids') ids: string) {
    const tagIds = ids.split('&').map(id => parseInt(id));
    return this.memosService.getMemosByTagIds(tagIds);
  }

  @Put('tags/:id')
  async updateTag(
    @Param('id') id: string,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    return this.memosService.updateTag(parseInt(id), updateTagDto);
  }

  @Delete('tags/:id')
  async deleteTag(@Param('id') id: string) {
    return this.memosService.deleteTag(parseInt(id));
  }

  @Get('tags/fix-format')
  async fixTagFormat() {
    return this.memosService.fixTagFormat();
  }
}