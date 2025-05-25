import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ArticleInputModel } from '../dto/input/create-article.dto';
import { ArticleOutputModel } from '../dto/output/article-output.dto';
import { CreateArticleCommand } from '../../application/commands/create-article.command';
import { JwtAuthGuard } from '../../../../common/guards/jwt.auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { UserIdFromRequest } from '../../../user/decorators/swagger/userIdFromRequest';
import { Paginator } from '../../../../common/models/paginator';
import { GetArticlesQuery } from '../../application/queries/get-articles.query';
import { GetArticlesSwagger } from '../../decorators/swagger/get-articles.swagger.decorator';
import { GetArticles } from '../dto/input/get-articles.query';
import { CreateArticleSwagger } from '../../decorators/swagger/create-article.swagger.decorator';
import { UpdateArticleCommand } from '../../application/commands/update-article.command';
import { DeleteArticleCommand } from '../../application/commands/delete-article.command';
import { UpdateArticleSwagger } from '../../decorators/swagger/update-article.swagger.decorator';
import { DeleteArticleSwagger } from '../../decorators/swagger/delete-article.swagger.decorator';
import { CustomCacheInterceptor } from '../../../../common/interceptors/cache.interceptor';
import { CacheInvalidationService } from '../../../../common/providers/redis/cache-invalidation.service';

@ApiTags('article')
@Controller('article')
export class ArticleController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly cacheInvalidationService: CacheInvalidationService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @CreateArticleSwagger()
  async createArticle(
    @UserIdFromRequest() userInfo: { userId: string },
    @Body() dto: ArticleInputModel,
  ): Promise<ArticleOutputModel> {
    const result = await this.commandBus.execute(new CreateArticleCommand(dto, userInfo.userId));

    if (!result.isSuccess) throw result.error;

    await this.cacheInvalidationService.invalidateCacheByPrefix('GET:/article');

    return result.value;
  }

  @Get()
  @UseInterceptors(CustomCacheInterceptor)
  @GetArticlesSwagger()
  async getArticles(@Query() query: GetArticles): Promise<Paginator<ArticleOutputModel>> {
    const result = await this.queryBus.execute(new GetArticlesQuery(query));

    if (!result.isSuccess) throw result.error;

    return result.value;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UpdateArticleSwagger()
  async updateArticle(
    @UserIdFromRequest() userInfo: { userId: string },
    @Param('id') id: string,
    @Body() dto: ArticleInputModel,
  ): Promise<ArticleOutputModel> {
    const result = await this.commandBus.execute(new UpdateArticleCommand(dto, id, userInfo.userId));

    if (!result.isSuccess) throw result.error;

    await this.cacheInvalidationService.invalidateCacheByPrefix('GET:/article');

    return result.value;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @DeleteArticleSwagger()
  async deleteArticle(@UserIdFromRequest() userInfo: { userId: string }, @Param('id') id: string): Promise<void> {
    const result = await this.commandBus.execute(new DeleteArticleCommand(id, userInfo.userId));
    if (!result.isSuccess) throw result.error;

    await this.cacheInvalidationService.invalidateCacheByPrefix('GET:/article');

    return;
  }
}
