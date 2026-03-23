import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AdminService {
  constructor(private supabaseService: SupabaseService) {}

  async getPlatformAnalytics() {
    const client = this.supabaseService.getClient();
    const { count: totalStores } = await client.from('merchants').select('*', { count: 'exact', head: true });
    const { count: totalSkus } = await client.from('products').select('*', { count: 'exact', head: true });

    return {
      total_stores: totalStores || 0,
      active_stores: totalStores || 0,
      total_skus: totalSkus || 0,
      low_stock_incidents: 0,
      discovery_searches: 0,
      no_result_rate: 0,
      call_direction_conversions: 0,
    };
  }

  async getModerationOverview() {
    return {
      verification_queue: 0,
      abuse_reports_open: 0,
      suspicious_listings: 0,
    };
  }

  async listStores(query: any) {
    const client = this.supabaseService.getClient();
    let q = client.from('merchants').select('*');
    if (query.q) q = q.ilike('name', `%${query.q}%`);
    const { data } = await q;
    return {
      rows: (data || []).map(m => ({
        store_id: m.id,
        store_name: m.name,
        verification: m.status === 'active' ? 'Verified' : 'Unverified',
        verification_submitted: false,
        open_reports: 0,
        city: m.address || '',
        region: '',
        lat: m.latitude,
        lng: m.longitude,
        last_inventory_update: m.updated_at
      }))
    };
  }

  async listAccounts() {
    const client = this.supabaseService.getClient();
    const { data } = await client.from('profiles').select('*');
    return {
      rows: (data || []).map(p => ({
        id: p.id,
        platform: 'discovery',
        role: p.role,
        status: 'active',
        email: p.email,
        phone_e164: null,
        whatsapp_e164: null,
        created_at: p.created_at,
        updated_at: p.updated_at
      }))
    };
  }
}
