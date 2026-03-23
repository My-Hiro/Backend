import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { PostgrestResponse, PostgrestSingleResponse } from '@supabase/supabase-js';

export interface Inventory {
  id?: string;
  product_id: string;
  quantity: number;
  low_stock_threshold?: number;
  updated_at?: string;
  // Additional fields for merchant UI
  sku?: string;
  name?: string;
  category?: string;
  status?: string;
}

@Injectable()
export class InventoryService {
  constructor(private supabaseService: SupabaseService) {}

  async findAll(storeId: string, limit = 200): Promise<Inventory[]> {
    const client = this.supabaseService.getClient();
    // In our schema, inventory is linked to products, which are linked to merchants (stores)
    const { data, error }: PostgrestResponse<any> = await client
      .from('inventory')
      .select('*, products!inner(*)')
      .eq('products.merchant_id', storeId)
      .limit(limit);

    if (error) throw error;
    return (data || []).map((item: any) => ({
      ...item,
      name: item.products.name,
      sku: item.products.sku,
      category: item.products.category_id,
      status: item.products.status,
    }));
  }

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

  async upsert(updateDto: Partial<Inventory>): Promise<Inventory> {
    const client = this.supabaseService.getClient();
    const { data, error }: PostgrestSingleResponse<Inventory> = await client
      .from('inventory')
      .upsert([updateDto], {
        onConflict: 'product_id',
      })
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to update inventory');
    return data;
  }

  async remove(productId: string): Promise<{ deleted: boolean }> {
    const client = this.supabaseService.getClient();
    const { error } = await client
      .from('inventory')
      .delete()
      .eq('product_id', productId);

    if (error) throw error;
    return { deleted: true };
  }
}
