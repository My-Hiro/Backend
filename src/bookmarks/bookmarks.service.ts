import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class BookmarksService {
  constructor(private supabaseService: SupabaseService) {}

  async create(userId: string, type: 'store' | 'item' | 'search', targetId: string, metadata?: any) {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('bookmarks')
      .upsert([{ 
        user_id: userId, 
        type, 
        target_id: targetId,
        metadata 
      }], { onConflict: 'user_id, type, target_id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async findAll(userId: string, type?: 'store' | 'item' | 'search') {
    const client = this.supabaseService.getClient();
    let query = client.from('bookmarks').select('*').eq('user_id', userId);

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async remove(userId: string, type: string, targetId: string) {
    const client = this.supabaseService.getClient();
    const { error } = await client
      .from('bookmarks')
      .delete()
      .match({ user_id: userId, type, target_id: targetId });

    if (error) throw error;
    return { success: true };
  }
}
