import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class StoresService {
  private readonly logger = new Logger(StoresService.name);

  constructor(private supabaseService: SupabaseService) {}

  async reportAbuse(storeId: string, body: any) {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('store_reports')
      .insert([{ store_id: storeId, ...body }])
      .select()
      .single();

    if (error) {
      this.logger.error(`Failed to report abuse: ${error.message}`);
      throw error;
    }
    return { success: true, data };
  }

  async listVerificationDocuments(storeId: string) {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('store_documents')
      .select('*')
      .eq('store_id', storeId);

    if (error) {
      this.logger.error(`Failed to list docs: ${error.message}`);
      throw error;
    }
    return { rows: data || [] };
  }

  async uploadVerificationDocument(storeId: string, body: any) {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('store_documents')
      .insert([{ store_id: storeId, ...body }])
      .select()
      .single();

    if (error) {
      this.logger.error(`Failed to upload doc: ${error.message}`);
      throw error;
    }
    return data;
  }

  async submitVerification(storeId: string) {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('merchants')
      .update({ status: 'pending' })
      .eq('id', storeId)
      .select()
      .single();

    if (error) {
      this.logger.error(`Failed to submit verification: ${error.message}`);
      throw error;
    }
    return { success: true, data };
  }
}
