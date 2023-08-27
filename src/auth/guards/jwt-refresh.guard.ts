import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtRefreshGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { access_token, email } = request.body;

    if (!access_token) {
      throw new UnauthorizedException('Поле refresh_token обязательно');
    }

    if (!email) {
      throw new UnauthorizedException('Поле username обязательно');
    }

    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Пользователя не существует');
    }

    return true;
  }
}
