import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { InventoryService, Inventory } from './inventory.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { SetMetadata } from '@nestjs/common';

const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@ApiTags('inventory')
@Controller()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('merchant/inventory')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('merchant', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List inventory for a store' })
  findAll(@Query('store_id') storeId: string, @Query('limit') limit?: number) {
    return this.inventoryService.findAll(storeId, limit);
  }

  @Post('merchant/inventory/upsert')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('merchant', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upsert inventory item' })
  upsert(@Body() updateDto: Partial<Inventory>) {
    return this.inventoryService.upsert(updateDto);
  }

  @Get('inventory/:productId')
  @ApiOperation({ summary: 'Get inventory for a product' })
  findByProduct(@Param('productId') productId: string) {
    return this.inventoryService.findByProduct(productId);
  }

  @Patch('inventory/:productId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('merchant', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update inventory for a product' })
  update(
    @Param('productId') productId: string,
    @Body() updateDto: Partial<Inventory>,
  ) {
    return this.inventoryService.upsert({ ...updateDto, product_id: productId });
  }

  @Delete('merchant/inventory/:productId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('merchant', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete inventory for a product' })
  remove(@Param('productId') productId: string) {
    return this.inventoryService.remove(productId);
  }
}
