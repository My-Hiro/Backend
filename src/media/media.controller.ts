import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';

@ApiTags('media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        path: {
          type: 'string',
          description: 'Optional path inside the bucket',
        },
        preset: {
          type: 'string',
          description: 'Alias for path',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Upload a file' })
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('path') path?: string,
    @Body('preset') preset?: string,
  ) {
    return this.mediaService.upload(file, path || preset);
  }
}
