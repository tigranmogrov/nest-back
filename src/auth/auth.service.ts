import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { compareSync } from 'bcryptjs';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthLoginDto, AuthUserResponse } from './dto/auth-login.dto';
import { UserDocument } from '../user/user.model';
import { TokenService } from '../token/token.service';
import { TokenDto } from '../token/dto/token.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async registerUser(dto: CreateUserDto): Promise<AuthUserResponse> {
    const existUser = await this.userService.findUserByEmail(dto.email);
    if (existUser) throw new BadRequestException('Such user exists');
    await this.userService.createUser(dto);
    return this.userService.publicUser(dto.email);
  }

  async login(dto: AuthLoginDto): Promise<AuthUserResponse> {
    const existUser: UserDocument = await this.userService.findUserByEmail(
      dto.email,
    );
    if (!existUser)
      throw new HttpException('user not exists', HttpStatus.NOT_FOUND);
    const validatePassword: boolean = compareSync(
      dto.password,
      existUser.password,
    );
    if (!validatePassword) throw new BadRequestException('AppError.WRONG_DATA');

    return this.userService.publicUser(dto.email);
  }

  async refreshToken(tokenDto: TokenDto, res: Response) {
    const validToken = await this.tokenService.verifyToken(
      tokenDto.access_token,
    );
    const user = await this.userService.findUserByEmail(tokenDto.email);
    if (validToken?.error) {
      if (validToken.error === 'jwt expired') {
        const refresh_token = await this.tokenService.generateJwtToken(user);
        res.statusCode = HttpStatus.OK;
        return res.send({ refresh_token });
      } else {
        res.statusCode = HttpStatus.BAD_REQUEST;
        return res.send({ error: validToken?.error });
      }
    } else {
      res.statusCode = HttpStatus.OK;
      return res.send({
        token: tokenDto.access_token,
      });
    }
  }
}
