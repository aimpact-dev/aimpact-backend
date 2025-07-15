import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY, AUTH_ALLOWED_KEY } from './decorator/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const isAuthAllowed = this.reflector.getAllAndOverride<boolean>(AUTH_ALLOWED_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic && isAuthAllowed) {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.header('Authorization') || '';
      if (authHeader.split(' ')[0] === 'Bearer') {
        return super.canActivate(context);
      }
      return true;
    } else if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
