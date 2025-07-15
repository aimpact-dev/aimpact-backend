import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest()
    const auth = req.headers['authorization'] as string
    if (!auth?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing token')
    }
    const token = auth.slice(7).trim()
    const envToken = this.config.get<string>('GUARD_TOKEN')
    if (token !== envToken) {
      throw new UnauthorizedException('Invalid token')
    }
    return true
  }
}