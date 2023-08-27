import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Product, ProductDocument } from './product.model';
import { ProductFindDto } from './dto/productFind.dto';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { IdValidationPipe } from '../pipes/id-validation.pipe';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  async create(@Body() dto: CreateProductDto): Promise<ProductDocument> {
    return this.productService.create(dto);
  }

  @Get(':id')
  async getOne(
    @Param('id', IdValidationPipe) id: string,
  ): Promise<ProductDocument> {
    const product = await this.productService.findById(id);
    if (!product) {
      throw new NotFoundException('not found Product');
    }
    return product;
  }

  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string): Promise<any> {
    const deletedProduct = await this.productService.deleteById(id);
    if (!deletedProduct) {
      throw new NotFoundException('not found Product');
    }
  }

  @Patch(':id')
  async patch(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: Product,
  ): Promise<ProductDocument> {
    const updatedProduct = await this.productService.updateById(id, dto);
    if (!updatedProduct) {
      throw new NotFoundException('not found Product');
    }
    return updatedProduct;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('find')
  async find(@Body() dto: ProductFindDto): Promise<any> {
    return this.productService.findWithReviews(dto);
  }
}
