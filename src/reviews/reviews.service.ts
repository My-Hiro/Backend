import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ReviewsService {
  constructor(private supabaseService: SupabaseService) {}

  async create(createReviewDto: any, buyerId: string) {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('reviews')
      .insert([{ ...createReviewDto, buyer_id: buyerId }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async findByProduct(productId: string) {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('reviews')
      .select('*, buyer:profiles(full_name, avatar_url)')
      .eq('product_id', productId);

    if (error) throw error;
    return data;
  }

  async remove(id: string, userId: string) {
    const client = this.supabaseService.getClient();
    const { error } = await client
      .from('reviews')
      .delete()
      .match({ id, buyer_id: userId });

    if (error) throw error;
    return { success: true };
  }
}
