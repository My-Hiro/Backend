import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class MerchantsService {
  constructor(private supabaseService: SupabaseService) {}

  async findAll(query: any) {
    const client = this.supabaseService.getClient();
    let supabaseQuery = client.from('merchants').select('*, owner:profiles(full_name, email)');

    if (query.status) {
      supabaseQuery = supabaseQuery.eq('status', query.status);
    }

    const { data, error } = await supabaseQuery;
    if (error) throw error;
    return data;
  }

  async findOne(id: string) {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('merchants')
      .select('*, owner:profiles(*)')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundException('Merchant not found');
    return data;
  }

  async findByOwner(ownerId: string) {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('merchants')
      .select('*')
      .eq('owner_id', ownerId)
      .single();

    if (error) return null;
    return data;
  }

  async create(createMerchantDto: any) {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('merchants')
      .insert([createMerchantDto])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updateMerchantDto: any) {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('merchants')
      .update(updateMerchantDto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
