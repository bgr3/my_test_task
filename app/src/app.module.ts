import { DynamicModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './features/user/user.module';
import { ArticleModule } from './features/article/article.module';
import { AppCoreModule } from './common/settings/core/app.core.module';
import { CqrsModule } from '@nestjs/cqrs';
import { configModule } from './config';
import { AppCoreConfig } from './common/settings/core/app.core.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';

@Module({
  imports: [configModule, AppCoreModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static async forRoot(appCoreConfig: AppCoreConfig): Promise<DynamicModule> {
    const modules: any[] = [
      CqrsModule.forRoot(),
      TypeOrmModule.forRoot(appCoreConfig.databaseSettings),
      ArticleModule,
      UserModule,
      CacheModule.registerAsync({
        isGlobal: true,
        useFactory: async (appCoreConfig: AppCoreConfig) => ({
          stores: createKeyv(appCoreConfig.environmentVariables.REDIS_URL),
          ttl: 300000,
        }),
        imports: [AppCoreModule],
        inject: [AppCoreConfig],
      }),
    ];

    return {
      module: AppModule,
      imports: modules,
    };
  }
}
