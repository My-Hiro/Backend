import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import {
  PostgrestResponse,
  PostgrestSingleResponse,
} from '@supabase/supabase-js';

export interface Product {
  id: string;
  merchant_id: string;
  category_id?: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  discounted_price?: number;
  sku?: string;
  status: 'draft' | 'published' | 'archived';
  images?: string[];
  created_at?: string;
  updated_at?: string;
}

@Injectable()
export class ProductsService {
  constructor(private supabaseService: SupabaseService) {}

  async findAll(query: {
    category?: string;
    merchant?: string;
    status?: string;
  }): Promise<Product[]> {
    const client = this.supabaseService.getClient();
    let supabaseQuery = client
      .from('products')
      .select('*, merchants(name), categories(name)');

    if (query.category) {
      supabaseQuery = supabaseQuery.eq('category_id', query.category);
    }

    if (query.merchant) {
      supabaseQuery = supabaseQuery.eq('merchant_id', query.merchant);
    }

    if (query.status) {
      supabaseQuery = supabaseQuery.eq('status', query.status);
    } else {
      supabaseQuery = supabaseQuery.eq('status', 'published');
    }

    const { data, error }: PostgrestResponse<Product> = await supabaseQuery;

    if (error) throw error;
    return data || [];
  }

  async findOne(id: string): Promise<Product> {
    const client = this.supabaseService.getClient();
    const { data, error }: PostgrestSingleResponse<Product> = await client
      .from('products')
      .select('*, merchants(*), categories(*)')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundException('Product not found');
    return data;
  }

  async create(createProductDto: Partial<Product>): Promise<Product> {
    const client = this.supabaseService.getClient();
    const { data, error }: PostgrestSingleResponse<Product> = await client
      .from('products')
      .insert([createProductDto])
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to create product');
    return data;
  }

  async update(
    id: string,
    updateProductDto: Partial<Product>,
  ): Promise<Product> {
    const client = this.supabaseService.getClient();
    const { data, error }: PostgrestSingleResponse<Product> = await client
      .from('products')
      .update(updateProductDto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to update product');
    return data;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const client = this.supabaseService.getClient();
    const { error } = await client.from('products').delete().eq('id', id);

    if (error) throw error;
    return { deleted: true };
  }
}
