import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService, ConfigType } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { jwtEnvConfig } from 'src/shared/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtEnvConfig.KEY) private readonly jwtConfig: ConfigType<typeof jwtEnvConfig>,
    private readonly usersService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.JWT_SECRET,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    Logger.log('JWT payload', payload);
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }

    return { ...user }; // Attach user object to request
  }
}
