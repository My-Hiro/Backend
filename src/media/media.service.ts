import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);
  private readonly BUCKET_NAME = 'Media';

  constructor(private supabaseService: SupabaseService) {}

  async upload(file: Express.Multer.File, path?: string): Promise<{ url: string }> {
    const client = this.supabaseService.getClient();
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = path ? `${path}/${fileName}` : fileName;

    const { data, error } = await client.storage
      .from(this.BUCKET_NAME)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      this.logger.error(`Failed to upload file to Supabase: ${error.message}`);
      throw error;
    }

    const { data: publicUrlData } = client.storage
      .from(this.BUCKET_NAME)
      .getPublicUrl(data.path);

    return { url: publicUrlData.publicUrl };
  }
}
