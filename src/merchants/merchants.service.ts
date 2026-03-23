import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import {
  PostgrestResponse,
  PostgrestSingleResponse,
} from '@supabase/supabase-js';

export interface Merchant {
  id: string;
  owner_id: string;
  name: string;
  description?: string;
  logo_url?: string;
  banner_url?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  contact_email?: string;
  contact_phone?: string;
  status: 'active' | 'inactive' | 'pending';
  created_at?: string;
  updated_at?: string;
}

@Injectable()
export class MerchantsService {
  constructor(private supabaseService: SupabaseService) {}

  async findAll(query: { status?: string }): Promise<Merchant[]> {
    const client = this.supabaseService.getClient();
    let supabaseQuery = client
      .from('merchants')
      .select('*, owner:profiles(full_name, email)');

    if (query.status) {
      supabaseQuery = supabaseQuery.eq('status', query.status);
    }

    const { data, error }: PostgrestResponse<Merchant> = await supabaseQuery;
    if (error) throw error;
    return data || [];
  }

  async findOne(id: string): Promise<Merchant> {
    const client = this.supabaseService.getClient();
    const { data, error }: PostgrestSingleResponse<Merchant> = await client
      .from('merchants')
      .select('*, owner:profiles(*)')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundException('Merchant not found');
    return data;
  }

  async findByOwner(ownerId: string): Promise<Merchant | null> {
    const client = this.supabaseService.getClient();
    const { data, error }: PostgrestSingleResponse<Merchant> = await client
      .from('merchants')
      .select('*')
      .eq('owner_id', ownerId)
      .single();

    if (error) return null;
    return data;
  }

  async create(createMerchantDto: Partial<Merchant>): Promise<Merchant> {
    const client = this.supabaseService.getClient();
    const { data, error }: PostgrestSingleResponse<Merchant> = await client
      .from('merchants')
      .insert([createMerchantDto])
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to create merchant');
    return data;
  }

  async update(
    id: string,
    updateMerchantDto: Partial<Merchant>,
  ): Promise<Merchant> {
    const client = this.supabaseService.getClient();
    const { data, error }: PostgrestSingleResponse<Merchant> = await client
      .from('merchants')
      .update(updateMerchantDto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to update merchant');
    return data;
  }
}
