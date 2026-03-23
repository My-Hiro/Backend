import { Controller, Get, Query, Param } from '@nestjs/common';
import { DiscoveryService } from './discovery.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('discovery')
@Controller('discovery')
export class DiscoveryController {
  constructor(private readonly discoveryService: DiscoveryService) {}

  @Get('home')
  @ApiOperation({ summary: 'Get home page data' })
  getHome() {
    return this.discoveryService.getHome();
  }

  @Get('banners')
  @ApiOperation({ summary: 'Get banners by placement' })
  getBanners(@Query('placement') placement: string) {
    return this.discoveryService.getBanners(placement);
  }

  @Get('categories/:categoryId/stores')
  @ApiOperation({ summary: 'Get stores by category' })
  getCategoryStores(@Param('categoryId') categoryId: string) {
    return this.discoveryService.getCategoryStores(categoryId);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search stores and products' })
  search(
    @Query('q') q: string,
    @Query('type') type: string,
    @Query('page') page: number,
  ) {
    return this.discoveryService.search(q, type, page || 1);
  }
}
