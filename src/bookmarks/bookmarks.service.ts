import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { PostgrestResponse } from '@supabase/supabase-js';

export interface Bookmark {
  id: string;
  user_id: string;
  type: 'store' | 'item' | 'search';
  target_id: string;
  metadata?: any;
  created_at?: string;
}

@Injectable()
export class BookmarksService {
  constructor(private supabaseService: SupabaseService) {}

  async create(
    userId: string,
    type: 'store' | 'item' | 'search',
    targetId: string,
    metadata?: any,
  ): Promise<Bookmark> {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('bookmarks')
      .upsert(
        [
          {
            user_id: userId,
            type,
            target_id: targetId,
            metadata,
          },
        ],
        { onConflict: 'user_id, type, target_id' },
      )
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to create bookmark');
    return data as Bookmark;
  }

  async findAll(
    userId: string,
    type?: 'store' | 'item' | 'search',
  ): Promise<Bookmark[]> {
    const client = this.supabaseService.getClient();
    let query = client.from('bookmarks').select('*').eq('user_id', userId);

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = (await query) as PostgrestResponse<Bookmark>;
    if (error) throw error;
    return data || [];
  }

  async remove(
    userId: string,
    type: string,
    targetId: string,
  ): Promise<{ success: boolean }> {
    const client = this.supabaseService.getClient();
    const { error } = await client
      .from('bookmarks')
      .delete()
      .match({ user_id: userId, type, target_id: targetId });

    if (error) throw error;
    return { success: true };
  }
}
