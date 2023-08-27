import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthLoginDto, AuthUserResponse } from './dto/auth-login.dto';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { TokenDto } from '../token/dto/token.dto';
import { TokenService } from '../token/token.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() dto: CreateUserDto): Promise<AuthUserResponse> {
    return this.authService.registerUser(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(
    @Body() dto: AuthLoginDto,
  ): Promise<AuthUserResponse | BadRequestException> {
    return this.authService.login(dto);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refreshToken(@Body() tokenDto: TokenDto, @Res() res: Response) {
    return this.authService.refreshToken(tokenDto, res);
  }
}
