import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ReviewDocument, Review } from './review.model';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private readonly review: Model<Review>,
  ) {}

  async create(dto: CreateReviewDto): Promise<ReviewDocument> {
    return this.review.create(dto);
  }

  async delete(id: string): Promise<ReviewDocument | null> {
    return this.review.findByIdAndDelete(id).exec();
  }

  async findByProductId(productId: string): Promise<ReviewDocument[]> {
    return this.review
      .find({ productId: new Types.ObjectId(productId) })
      .exec();
  }

  async deleteByProductId(productId: string): Promise<object> {
    return this.review
      .deleteMany({ productId: new Types.ObjectId(productId) })
      .exec();
  }
}
