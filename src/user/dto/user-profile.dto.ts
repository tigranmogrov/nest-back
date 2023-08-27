import { Document } from 'mongoose';
import { IsEmail, MinLength, IsString, IsOptional } from 'class-validator';

export class UserProfileDto {
  @IsEmail()
  email: string;
  @IsOptional()
  @IsString()
  name?: string;
  @IsString()
  @MinLength(8)
  passwordHash: string;
  @IsString()
  access_token: string;
}
