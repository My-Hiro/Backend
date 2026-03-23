import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import {
  PostgrestResponse,
  PostgrestSingleResponse,
} from '@supabase/supabase-js';

export interface Review {
  id: string;
  product_id: string;
  buyer_id: string;
  rating: number;
  comment?: string;
  created_at?: string;
}

@Injectable()
export class ReviewsService {
  constructor(private supabaseService: SupabaseService) {}

  async create(
    createReviewDto: Partial<Review>,
    buyerId: string,
  ): Promise<Review> {
    const client = this.supabaseService.getClient();
    const { data, error }: PostgrestSingleResponse<Review> = await client
      .from('reviews')
      .insert([{ ...createReviewDto, buyer_id: buyerId }])
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to create review');
    return data;
  }

  async findByProduct(productId: string): Promise<Review[]> {
    const client = this.supabaseService.getClient();
    const { data, error }: PostgrestResponse<Review> = await client
      .from('reviews')
      .select('*, buyer:profiles(full_name, avatar_url)')
      .eq('product_id', productId);

    if (error) throw error;
    return data || [];
  }

  async remove(id: string, userId: string): Promise<{ success: boolean }> {
    const client = this.supabaseService.getClient();
    const { error } = await client
      .from('reviews')
      .delete()
      .match({ id, buyer_id: userId });

    if (error) throw error;
    return { success: true };
  }
}
