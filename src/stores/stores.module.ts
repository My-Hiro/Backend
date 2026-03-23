import { Module } from '@nestjs/common';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';
import { MerchantsModule } from '../merchants/merchants.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [MerchantsModule, ProductsModule],
  controllers: [StoresController],
  providers: [StoresService],
  exports: [StoresService],
})
export class StoresModule {}
