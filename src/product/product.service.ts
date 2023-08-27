import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductFindDto } from './dto/productFind.dto';
import { Review } from '../review/review.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly product: Model<Product>,
  ) {}

  async create(dto: CreateProductDto): Promise<ProductDocument> {
    return this.product.create(dto);
  }

  async findById(id: string): Promise<ProductDocument> {
    return this.product.findById(id).exec();
  }

  async deleteById(id: string): Promise<ProductDocument> {
    return this.product.findByIdAndDelete(id).exec();
  }

  async updateById(id: string, dto: CreateProductDto) {
    return this.product.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  findWithReviews(dto: ProductFindDto) {
    return this.product
      .aggregate([
        {
          $match: {
            categories: dto.category,
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
        {
          $limit: dto.limit,
        },
        {
          $lookup: {
            from: 'reviews',
            localField: '_id',
            foreignField: 'productId',
            as: 'reviews',
          },
        },
        {
          $addFields: {
            reviewCount: { $size: '$reviews' },
            reviewAvg: { $avg: '$reviews.rating' },
          },
        },
      ])
      .exec();
  }
}
