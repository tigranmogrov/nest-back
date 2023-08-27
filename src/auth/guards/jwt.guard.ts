import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from '../../token/token.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.headers.authorization) {
      throw new UnauthorizedException('Token is required');
    }
    const token = request.headers.authorization.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Ошибка авторизации');
    }

    const validToken = await this.tokenService.verifyToken(token);
    if (validToken?.error) {
      throw new UnauthorizedException(`${validToken.error}`);
    }
    return (request.token = token);
  }
}
