import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Query,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiProperty,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IsEnum, IsString, IsOptional } from 'class-validator';

export enum BookmarkType {
  STORE = 'store',
  ITEM = 'item',
  SEARCH = 'search',
}

export class CreateBookmarkDto {
  @ApiProperty({ enum: BookmarkType }) @IsEnum(BookmarkType) type: BookmarkType;
  @ApiProperty() @IsString() target_id: string;
  @ApiProperty({ required: false }) @IsOptional() metadata?: any;
}

interface RequestWithUser {
  user: {
    userId: string;
    [key: string]: any;
  };
}

@ApiTags('bookmarks')
@Controller('bookmarks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post()
  @ApiOperation({ summary: 'Add a bookmark (store, item, or search)' })
  create(
    @Body()
    body: CreateBookmarkDto,
    @Request() req: RequestWithUser,
  ) {
    return this.bookmarksService.create(
      req.user.userId,
      body.type,
      body.target_id,
      body.metadata,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all my bookmarks' })
  findAll(@Query('type') type: BookmarkType, @Request() req: RequestWithUser) {
    return this.bookmarksService.findAll(req.user.userId, type);
  }

  @Delete(':type/:targetId')
  @ApiOperation({ summary: 'Remove a bookmark' })
  remove(
    @Param('type') type: string,
    @Param('targetId') targetId: string,
    @Request() req: RequestWithUser,
  ) {
    return this.bookmarksService.remove(req.user.userId, type, targetId);
  }
}
