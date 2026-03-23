import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { InventoryService, Inventory } from './inventory.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@ApiTags('inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get(':productId')
  @ApiOperation({ summary: 'Get inventory for a product' })
  findByProduct(@Param('productId') productId: string) {
    return this.inventoryService.findByProduct(productId);
  }

  @Patch(':productId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('merchant', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update inventory for a product' })
  update(
    @Param('productId') productId: string,
    @Body() updateDto: Partial<Inventory>,
  ) {
    return this.inventoryService.update(productId, updateDto);
  }
}
