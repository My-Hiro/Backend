import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ProductsService {
  constructor(private supabaseService: SupabaseService) {}

  async findAll(query: any) {
    const client = this.supabaseService.getClient();
    let supabaseQuery = client.from('products').select('*, merchants(name), categories(name)');

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

    const { data, error } = await supabaseQuery;

    if (error) throw error;
    return data;
  }

  async findOne(id: string) {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('products')
      .select('*, merchants(*), categories(*)')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundException('Product not found');
    return data;
  }

  async create(createProductDto: any) {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('products')
      .insert([createProductDto])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updateProductDto: any) {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('products')
      .update(updateProductDto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async remove(id: string) {
    const client = this.supabaseService.getClient();
    const { error } = await client.from('products').delete().eq('id', id);

    if (error) throw error;
    return { deleted: true };
  }
}
