import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  full_name?: string;
  role?: string;
  avatar_url?: string;
  updated_at?: string;
  created_at?: string;
}

@Injectable()
export class UsersService {
  constructor(private supabaseService: SupabaseService) {}

  async findOne(id: string): Promise<UserProfile> {
    const client = this.supabaseService.getClient();
    const { data, error }: PostgrestSingleResponse<UserProfile> = await client
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundException('User profile not found');
    return data;
  }

  async update(
    id: string,
    updateProfileDto: Partial<UserProfile>,
  ): Promise<UserProfile> {
    const client = this.supabaseService.getClient();
    const { data, error }: PostgrestSingleResponse<UserProfile> = await client
      .from('profiles')
      .update(updateProfileDto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to update user profile');
    return data;
  }

  async createProfile(profile: UserProfile): Promise<UserProfile> {
    const client = this.supabaseService.getClient();
    const { data, error }: PostgrestSingleResponse<UserProfile> = await client
      .from('profiles')
      .upsert([profile])
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to create user profile');
    return data;
  }
}
