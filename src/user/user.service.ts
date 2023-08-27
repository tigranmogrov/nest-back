import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, User } from './user.model';
import { genSaltSync, hashSync } from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { TokenService } from '../token/token.service';
import { AuthUserResponse } from '../auth/dto/auth-login.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly user: Model<User>,
    private readonly tokenService: TokenService,
  ) {}

  async createUser(dto: CreateUserDto): Promise<CreateUserDto> {
    dto.password = await this.hashPassword(dto.password);
    const newUser = new this.user({
      email: dto.email,
      password: dto.password,
    });
    return newUser.save();
  }

  async findUserByEmail(email: string): Promise<UserDocument | undefined> {
    return this.user.findOne({ email }).exec();
  }

  async publicUser(email: string): Promise<AuthUserResponse> {
    const user = await this.user.findOne({ email }, { password: false });
    const access_token = await this.tokenService.generateJwtToken(user);

    return { user, access_token };
  }

  async hashPassword(password: string): Promise<string> {
    const salt = genSaltSync(8);
    return hashSync(password, salt);
  }
}
