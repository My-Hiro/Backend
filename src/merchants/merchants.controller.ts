import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards, Request } from '@nestjs/common';
import { MerchantsService } from './merchants.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { SetMetadata } from '@nestjs/common';

const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@ApiTags('merchants')
@Controller('merchants')
export class MerchantsController {
  constructor(private readonly merchantsService: MerchantsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all merchants' })
  findAll(@Query() query: any) {
    return this.merchantsService.findAll(query);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current merchant profile' })
  findMe(@Request() req: any) {
    return this.merchantsService.findByOwner(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get merchant by ID' })
  findOne(@Param('id') id: string) {
    return this.merchantsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register a new merchant' })
  create(@Body() createMerchantDto: any, @Request() req: any) {
    return this.merchantsService.create({ ...createMerchantDto, owner_id: req.user.userId });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update merchant profile' })
  update(@Param('id') id: string, @Body() updateMerchantDto: any) {
    // In a real app, verify the user owns the merchant
    return this.merchantsService.update(id, updateMerchantDto);
  }
}
