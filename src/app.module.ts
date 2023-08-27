import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ReviewModule } from './review/review.module';
import { ProductModule } from './product/product.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { TokenModule } from './token/token.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      `mongodb+srv://admin:admin@cluster0.2gexi.mongodb.net/my-db?retryWrites=true&w=majority`,
    ),
    UserModule,
    AuthModule,
    TokenModule,
    ReviewModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
