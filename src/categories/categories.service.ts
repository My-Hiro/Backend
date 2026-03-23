import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class CategoriesService {
  constructor(private supabaseService: SupabaseService) {}

  async findAll() {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('categories')
      .select('*, subcategories:categories(*)');
    if (error) throw error;
    return data;
  }

  async findOne(id: string) {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('categories')
      .select('*, subcategories:categories(*)')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundException('Category not found');
    return data;
  }

  async create(createCategoryDto: any) {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('categories')
      .insert([createCategoryDto])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
