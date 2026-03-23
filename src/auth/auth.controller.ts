import { Controller, Post, Body, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { UsersService } from '../users/users.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private supabaseService: SupabaseService,
    private usersService: UsersService,
  ) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up a new user' })
  async signUp(@Body() body: any) {
    const client = this.supabaseService.getClient();
    const { data, error } = await client.auth.signUp({
      email: body.email,
      password: body.password,
    });

    if (error) throw new BadRequestException(error.message);

    if (data.user) {
      await this.usersService.createProfile({
        id: data.user.id,
        full_name: body.full_name,
        role: body.role || 'buyer',
      });
    }

    return data;
  }

  @Post('signin')
  @ApiOperation({ summary: 'Sign in a user' })
  async signIn(@Body() body: any) {
    const client = this.supabaseService.getClient();
    const { data, error } = await client.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    });

    if (error) throw new UnauthorizedException(error.message);

    return data;
  }

  @Post('signout')
  @ApiOperation({ summary: 'Sign out a user' })
  async signOut() {
    const client = this.supabaseService.getClient();
    const { error } = await client.auth.signOut();
    if (error) throw new BadRequestException(error.message);
    return { success: true };
  }
}
