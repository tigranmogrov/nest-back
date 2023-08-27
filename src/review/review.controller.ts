import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';
import { ReviewDocument } from './review.model';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserEmail } from '../decorators/user-email.decorator';
import { IdValidationPipe } from '../pipes/id-validation.pipe';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: CreateReviewDto): Promise<ReviewDocument> {
    return this.reviewService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string): Promise<any> {
    const deleteDoc = await this.reviewService.delete(id);
    if (!deleteDoc) {
      throw new HttpException('not found id', HttpStatus.NOT_FOUND);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteByProductId(
    @Param('id', IdValidationPipe) id: string,
  ): Promise<any> {
    const deleteDoc = await this.reviewService.deleteByProductId(id);
    if (!deleteDoc) {
      throw new HttpException('not found id', HttpStatus.NOT_FOUND);
    }
  }

  @Get('byProduct/:productId')
  async getByProduct(
    @Param('productId', IdValidationPipe) productId: string,
  ): Promise<ReviewDocument[]> {
    return this.reviewService.findByProductId(productId);
  }
}
