import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class UsersService {
  constructor(private supabaseService: SupabaseService) {}

  async findOne(id: string) {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundException('User profile not found');
    return data;
  }

  async update(id: string, updateProfileDto: any) {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('profiles')
      .update(updateProfileDto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async createProfile(profile: { id: string, full_name?: string, role?: string, avatar_url?: string }) {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('profiles')
      .upsert([profile])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
