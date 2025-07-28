import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigType } from '@nestjs/config';
import { Inject } from '@nestjs/common';
import { servicesEnvConfig } from 'src/shared/config';

/**
 * Guard that validates requests coming to internal API endpoints.
 *
 * The guard ensures that the request has a `x-api-key` header and the value of that header
 * matches the `INTERNAL_API_KEY` value defined in environment variables.
 */
@Injectable()
export class InternalApiKeyGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(servicesEnvConfig.KEY) private readonly servicesConfig: ConfigType<typeof servicesEnvConfig>,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey: string | undefined = request.headers['x-api-key'] || request.headers['X-API-KEY'];

    if (!apiKey) {
      throw new UnauthorizedException('x-api-key header is missing');
    }

    if (apiKey !== this.servicesConfig.INTERNAL_API_KEY) {
      throw new UnauthorizedException('Invalid x-api-key');
    }

    return true;
  }
}
