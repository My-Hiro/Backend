import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import {
  PostgrestResponse,
  PostgrestSingleResponse,
} from '@supabase/supabase-js';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  created_at?: string;
  subcategories?: Category[];
}

@Injectable()
export class CategoriesService {
  constructor(private supabaseService: SupabaseService) {}

  async findAll(): Promise<Category[]> {
    const client = this.supabaseService.getClient();
    const { data, error }: PostgrestResponse<Category> = await client
      .from('categories')
      .select('*, subcategories:categories(*)');
    if (error) throw error;
    return data || [];
  }

  async findOne(id: string): Promise<Category> {
    const client = this.supabaseService.getClient();
    const { data, error }: PostgrestSingleResponse<Category> = await client
      .from('categories')
      .select('*, subcategories:categories(*)')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundException('Category not found');
    return data;
  }

  async create(createCategoryDto: Partial<Category>): Promise<Category> {
    const client = this.supabaseService.getClient();
    const { data, error }: PostgrestSingleResponse<Category> = await client
      .from('categories')
      .insert([createCategoryDto])
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to create category');
    return data;
  }
}
