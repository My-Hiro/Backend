import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { PostgrestResponse } from '@supabase/supabase-js';

@Injectable()
export class DiscoveryService {
  constructor(private supabaseService: SupabaseService) {}

  async getHome() {
    const client = this.supabaseService.getClient();
    
    // In a real app, these would be separate optimized queries
    const { data: suggested } = await client.from('merchants').select('*').limit(10);
    const { data: sections } = await client.from('categories').select('*, stores:merchants(*)').limit(5);
    const { data: popularProducts } = await client.from('products').select('*, stores:merchants(name)').limit(20);

    return {
      hero: {
        title: 'Discover nearby trusted stores',
        subtitle: 'Find items fast with live inventory signals',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=70',
      },
      suggested: suggested || [],
      sections: (sections || []).map(s => ({
        category_id: s.id,
        category: s.name,
        stores: s.stores || []
      })),
      popular_products: (popularProducts || []).map(p => ({
        ...p,
        store_name: p.stores?.name,
        price_label: `GHS ${p.price}`
      }))
    };
  }

  async getBanners(placement: string) {
    const client = this.supabaseService.getClient();
    // For now, return some mock banners or fetch from a 'banners' table if it existed
    return [
      {
        id: 'banner-1',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=70',
        title: 'Sponsored Promo',
        subtitle: 'Great deals near you',
        label: 'Sponsored',
        link_type: 'none'
      }
    ];
  }

  async getCategoryStores(categoryId: string) {
    const client = this.supabaseService.getClient();
    const { data, error }: PostgrestResponse<any> = await client
      .from('merchants')
      .select('*')
      .eq('category', categoryId); // Adjust based on your schema

    if (error) throw error;
    return data || [];
  }

  async search(query: string, type: string, page: number) {
    const client = this.supabaseService.getClient();
    
    if (type === 'store') {
      const { data } = await client.from('merchants').select('*').ilike('name', `%${query}%`);
      return { rows: data || [], total: data?.length || 0 };
    }

    const { data } = await client.from('products').select('*, stores:merchants(*)').ilike('name', `%${query}%`);
    return { 
      rows: (data || []).map(p => ({
        product_id: p.id,
        productName: p.name,
        image_url: p.images?.[0],
        stores: [{
          store_id: p.stores?.id,
          store_name: p.stores?.name,
          price: p.price
        }]
      })), 
      total: data?.length || 0 
    };
  }
}
