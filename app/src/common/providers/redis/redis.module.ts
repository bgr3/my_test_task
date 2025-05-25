import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';
import { AppCoreModule } from '../../settings/core/app.core.module';
import { AppCoreConfig } from '../../settings/core/app.core.config';

@Module({
  imports: [AppCoreModule],
  providers: [
    {
      inject: [AppCoreConfig],
      provide: 'REDIS_CLIENT',
      useFactory: (appCoreConfig: AppCoreConfig) => {
        return new Redis(appCoreConfig.environmentVariables.REDIS_URL);
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
