import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('media')
@Controller('media')
export class MediaController {
  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload a file' })
  upload(@Body() body: any) {
    // In a real app, integrate with Supabase Storage
    return { url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=70' };
  }
}
