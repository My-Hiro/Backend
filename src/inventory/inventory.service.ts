import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

export interface Inventory {
  id?: string;
  product_id: string;
  quantity: number;
  low_stock_threshold?: number;
  updated_at?: string;
}

@Injectable()
export class InventoryService {
  constructor(private supabaseService: SupabaseService) {}

  async findByProduct(productId: string): Promise<Inventory> {
    const client = this.supabaseService.getClient();
    const { data, error }: PostgrestSingleResponse<Inventory> = await client
      .from('inventory')
      .select('*')
      .eq('product_id', productId)
      .single();

    if (error)
      return { product_id: productId, quantity: 0, low_stock_threshold: 5 };
    return data;
  }

  async update(
    productId: string,
    updateDto: Partial<Inventory>,
  ): Promise<Inventory> {
    const client = this.supabaseService.getClient();
    const { data, error }: PostgrestSingleResponse<Inventory> = await client
      .from('inventory')
      .upsert([{ product_id: productId, ...updateDto }], {
        onConflict: 'product_id',
      })
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to update inventory');
    return data;
  }
}
