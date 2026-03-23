import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private clientInstance: SupabaseClient;

  constructor(private configService: ConfigService) {}

  getClient() {
    if (this.clientInstance) {
      return this.clientInstance;
    }

    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    // Using the new naming convention: Public Key (anon) and Secret Key (service_role)
    const supabaseKey = this.configService.get<string>('SUPABASE_SECRET_KEY') || this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      this.logger.error('Supabase URL or Secret Key is missing!');
      throw new Error('Supabase credentials are not configured.');
    }

    this.clientInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    return this.clientInstance;
  }
}
