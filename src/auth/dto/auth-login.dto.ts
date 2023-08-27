import { IsEmail, MinLength, IsString } from 'class-validator';

export class AuthLoginDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  @MinLength(8)
  readonly password: string;
}

export class AuthUserResponse {
  readonly user: AuthLoginDto;

  @IsString()
  readonly access_token: string;
}
