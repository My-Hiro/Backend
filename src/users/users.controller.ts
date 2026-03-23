import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService, UserProfile } from './users.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  getMe(@Req() req: any) {
    return this.usersService.findOne(req.user.userId);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile' })
  updateProfile(@Req() req: any, @Body() updateProfileDto: Partial<UserProfile>) {
    return this.usersService.update(req.user.userId, updateProfileDto);
  }
}
