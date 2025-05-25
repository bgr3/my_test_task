import { Injectable } from '@nestjs/common';
import { IsEnum, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { configValidationUtility } from '../config-validation-utility';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export enum Environments {
  DEVELOPMENT = 'DEVELOPMENT',
  STAGING = 'STAGING',
  PRODUCTION = 'PRODUCTION',
  LOCAL = 'LOCAL',
  TEST = 'test',
}

@Injectable()
export class AppCoreConfig {
  @IsNotEmpty({ message: configValidationUtility.errorString('NODE_ENV') })
  @IsEnum(Environments)
  private readonly _NODE_ENV: string = this.configService.get('NODE_ENV');

  @IsNumber()
  @Min(0)
  @Max(65535)
  private readonly _PORT: number = parseInt(this.configService.get('PORT'));

  @IsNotEmpty({ message: configValidationUtility.errorString('DATABASE_APP_URL') })
  private readonly _DATABASE_APP_URL: string = this.configService.get('DATABASE_APP_URL');

  @IsNotEmpty({ message: configValidationUtility.errorString('JWT_LIFE_TIME_ACCESS') })
  private readonly _JWT_LIFE_TIME_ACCESS: string = this.configService.get('JWT_LIFE_TIME_ACCESS');

  @IsNotEmpty({ message: configValidationUtility.errorString('JWT_SECRET_ACCESS') })
  private readonly _JWT_SECRET_ACCESS: string = this.configService.get('JWT_SECRET_ACCESS');

  @IsNotEmpty({ message: configValidationUtility.errorString('REDIS_URL') })
  private readonly _REDIS_URL: string = this.configService.get('REDIS_URL');

  //добавлять переменные выше с валидацией и тут для доступа к ним из приложения
  environmentVariables = {
    NODE_ENV: this._NODE_ENV,
    PORT: this._PORT,
    DATABASE_APP_URL: this._DATABASE_APP_URL,
    JWT_SECRET_ACCESS: this._JWT_SECRET_ACCESS,
    JWT_LIFE_TIME_ACCESS: this._JWT_LIFE_TIME_ACCESS,
    REDIS_URL: this._REDIS_URL,
  };

  databaseSettings: TypeOrmModuleOptions = {
    type: 'postgres',
    url: this.environmentVariables.DATABASE_APP_URL,
    autoLoadEntities: true,
    synchronize: false,
  };

  jwtSetting = {
    accessTokenSecret: this.environmentVariables.JWT_SECRET_ACCESS as string,
    accessTokenLifeTime: this.environmentVariables.JWT_LIFE_TIME_ACCESS as string,
  };

  constructor(private readonly configService: ConfigService<Record<string, string>, true>) {
    configValidationUtility.validateConfig(this);
  }
}
