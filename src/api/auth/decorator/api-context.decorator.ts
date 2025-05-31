import { ExecutionContext, createParamDecorator, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/entities/user.entity';

export const ApiContext = createParamDecorator((_data: { required: boolean } = { required: true }, ctx: ExecutionContext): User | null => {
  const request = ctx.switchToHttp().getRequest();

  if (!request.user && _data.required) {
    throw new UnauthorizedException('No profile found');
  }

  return request.user;
});
