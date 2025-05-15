import { ExecutionContext, createParamDecorator, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/entities/user.entity';

export const ApiContext = createParamDecorator((_data: unknown, ctx: ExecutionContext): User => {
  const request = ctx.switchToHttp().getRequest();

  if (!request.user) {
    throw new UnauthorizedException('No profile found');
  }

  return request.user;
});
