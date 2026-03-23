import { Controller, Get, Query, UseGuards, SetMetadata } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('analytics/platform')
  @ApiOperation({ summary: 'Get platform analytics' })
  getPlatformAnalytics() {
    return this.adminService.getPlatformAnalytics();
  }

  @Get('moderation/overview')
  @ApiOperation({ summary: 'Get moderation overview' })
  getModerationOverview() {
    return this.adminService.getModerationOverview();
  }

  @Get('stores')
  @ApiOperation({ summary: 'List all stores for admin' })
  listStores(@Query() query: any) {
    return this.adminService.listStores(query);
  }

  @Get('accounts')
  @ApiOperation({ summary: 'List all user accounts' })
  listAccounts() {
    return this.adminService.listAccounts();
  }
}
