import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { SupabaseStrategy } from './supabase.strategy';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [PassportModule, ConfigModule, UsersModule],
  providers: [AuthService, SupabaseStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
