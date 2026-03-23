import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MerchantsService, Merchant } from './merchants.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface RequestWithUser {
  user: {
    userId: string;
    [key: string]: any;
  };
}

@ApiTags('merchants')
@Controller('merchants')
export class MerchantsController {
  constructor(private readonly merchantsService: MerchantsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all merchants' })
  findAll(@Query() query: { status?: string }) {
    return this.merchantsService.findAll(query);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current merchant profile' })
  findMe(@Request() req: RequestWithUser) {
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
  create(
    @Body() createMerchantDto: Partial<Merchant>,
    @Request() req: RequestWithUser,
  ) {
    return this.merchantsService.create({
      ...createMerchantDto,
      owner_id: req.user.userId,
    });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update merchant profile' })
  update(
    @Param('id') id: string,
    @Body() updateMerchantDto: Partial<Merchant>,
  ) {
    // In a real app, verify the user owns the merchant
    return this.merchantsService.update(id, updateMerchantDto);
  }
}
