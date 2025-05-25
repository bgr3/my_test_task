import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppCoreConfig } from '../settings/core/app.core.config';

@Injectable()
export class JwtAdapter {
  private readonly jwtConfiguration;

  constructor(
    private readonly jwtService: JwtService,
    private readonly appCoreConfig: AppCoreConfig,
  ) {
    this.jwtConfiguration = this.appCoreConfig.jwtSetting;
  }

  async createAccessToken({ userId }: { userId: string }) {
    const accessToken = await this.createToken({
      payload: { userId },
      secret: this.jwtConfiguration.accessTokenSecret,
      expiresIn: this.jwtConfiguration.accessTokenLifeTime,
    });

    return accessToken;
  }

  private async createToken({
    payload,
    secret,
    expiresIn,
  }: {
    payload: object;
    secret: string;
    expiresIn: string;
  }): Promise<string> {
    return this.jwtService.signAsync(payload, { secret, expiresIn });
  }
}
