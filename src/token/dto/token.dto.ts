import { IsEmail, IsNotEmpty } from 'class-validator';

export class TokenDto {
  @IsNotEmpty()
  readonly access_token: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}
