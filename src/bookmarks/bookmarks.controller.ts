import { Controller, Get, Post, Delete, Body, Query, UseGuards, Request, Param } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('bookmarks')
@Controller('bookmarks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post()
  @ApiOperation({ summary: 'Add a bookmark (store, item, or search)' })
  create(@Body() body: { type: 'store' | 'item' | 'search', target_id: string, metadata?: any }, @Request() req: any) {
    return this.bookmarksService.create(req.user.userId, body.type, body.target_id, body.metadata);
  }

  @Get()
  @ApiOperation({ summary: 'Get all my bookmarks' })
  findAll(@Query('type') type: 'store' | 'item' | 'search', @Request() req: any) {
    return this.bookmarksService.findAll(req.user.userId, type);
  }

  @Delete(':type/:targetId')
  @ApiOperation({ summary: 'Remove a bookmark' })
  remove(@Param('type') type: string, @Param('targetId') targetId: string, @Request() req: any) {
    return this.bookmarksService.remove(req.user.userId, type, targetId);
  }
}
