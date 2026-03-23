import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class InventoryService {
  constructor(private supabaseService: SupabaseService) {}

  async findByProduct(productId: string) {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('inventory')
      .select('*')
      .eq('product_id', productId)
      .single();

    if (error) return { quantity: 0, low_stock_threshold: 5 };
    return data;
  }

  async update(productId: string, updateDto: any) {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('inventory')
      .upsert([{ product_id: productId, ...updateDto }], { onConflict: 'product_id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
