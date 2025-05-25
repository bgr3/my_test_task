import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AppCoreConfig } from '../settings/core/app.core.config';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly appCoreConfig: AppCoreConfig) {
    const jwtSetting = appCoreConfig.jwtSetting;
    const accessSecretKey = jwtSetting.accessTokenSecret as string;

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: accessSecretKey,
    });
  }

  async validate(payload: any) {
    return { userId: payload.userId };
  }
}
