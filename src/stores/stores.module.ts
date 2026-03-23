import { Module } from '@nestjs/common';
import { StoresController } from './stores.controller';
import { MerchantsModule } from '../merchants/merchants.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [MerchantsModule, ProductsModule],
  controllers: [StoresController],
})
export class StoresModule {}
