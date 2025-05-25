import { Module } from '@nestjs/common';
import { ArticleRepository } from './repository/article.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './domain/article.entity';
import { CreateArticleHandler } from './application/commands/create-article.command';
import { ArticleController } from './api/controller/article.controller';
import { ArticleQueryRepository } from './repository/article.query.repository';
import { GetArticlesHandler } from './application/queries/get-articles.query';
import { JwtAuthStrategy } from '../../common/strategies/jwt.auth.strategy';
import { AppCoreModule } from '../../common/settings/core/app.core.module';
import { JwtModule } from '@nestjs/jwt';
import { UserRepository } from '../user/repository/user.repository';
import { User } from '../user/domain/user.entity';
import { UpdateArticleHandler } from './application/commands/update-article.command';
import { DeleteArticleHandler } from './application/commands/delete-article.command';
import { CustomCacheInterceptor } from '../../common/interceptors/cache.interceptor';
import { RedisModule } from '../../common/providers/redis/redis.module';
import { CacheInvalidationService } from '../../common/providers/redis/cache-invalidation.service';

const handlers = [CreateArticleHandler, GetArticlesHandler, UpdateArticleHandler, DeleteArticleHandler];

@Module({
  imports: [AppCoreModule, JwtModule.register({}), TypeOrmModule.forFeature([Article, User]), RedisModule],
  controllers: [ArticleController],
  providers: [
    ArticleRepository,
    ArticleQueryRepository,
    UserRepository,
    JwtAuthStrategy,
    CustomCacheInterceptor,
    CacheInvalidationService,
    ...handlers,
  ],
})
export class ArticleModule {}
