import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { MerchantsService } from '../merchants/merchants.service';
import { ProductsService } from '../products/products.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('stores')
@Controller('stores')
export class StoresController {
  constructor(
    private readonly merchantsService: MerchantsService,
    private readonly productsService: ProductsService,
  ) {}

  @Get(':id/profile')
  @ApiOperation({ summary: 'Get store profile by ID' })
  getStoreProfile(@Param('id') id: string) {
    return this.merchantsService.findOne(id);
  }

  @Patch(':id/profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update store profile' })
  updateStoreProfile(
    @Param('id') id: string,
    @Body() updateMerchantDto: any,
  ) {
    return this.merchantsService.update(id, updateMerchantDto);
  }

  @Get(':id/products')
  @ApiOperation({ summary: 'Get all products for a store' })
  findByStore(@Param('id') id: string) {
    return this.productsService.findAll({ merchant: id });
  }

  @Post(':id/report-abuse')
  @ApiOperation({ summary: 'Report store abuse' })
  reportAbuse(@Param('id') id: string, @Body() body: any) {
    // In a real app, save to a 'reports' table
    return { success: true };
  }

  @Get(':id/verification-documents')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List verification documents' })
  listDocs(@Param('id') id: string) {
    return { rows: [] };
  }

  @Post(':id/verification-documents')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload verification document' })
  uploadDoc(@Param('id') id: string, @Body() body: any) {
    return { id: 'doc-1', ...body };
  }

  @Post(':id/verification/submit')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit verification' })
  submitVerification(@Param('id') id: string) {
    return { success: true };
  }
}
