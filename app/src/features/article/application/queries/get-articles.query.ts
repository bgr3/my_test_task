import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ObjResult } from '../../../../common/utils/result/object-result';
import { InternalServerError } from '../../../../common/utils/result/custom-error';
import { QueryFilter } from '../../../../common/models/query_filter';
import { ArticleQueryRepository } from '../../repository/article.query.repository';
import { Paginator } from '../../../../common/models/paginator';
import { ArticleOutputModel } from '../../api/dto/output/article-output.dto';

export class GetArticlesQuery {
  constructor(public filter: QueryFilter) {}
}

@QueryHandler(GetArticlesQuery)
export class GetArticlesHandler implements IQueryHandler<GetArticlesQuery> {
  constructor(private readonly articleQueryRepository: ArticleQueryRepository) {}

  async execute(command: GetArticlesQuery): Promise<ObjResult<Paginator<ArticleOutputModel>>> {
    try {
      const articles = await this.articleQueryRepository.findArticles(command.filter);

      return ObjResult.Ok(articles);
    } catch (e) {
      return ObjResult.Err(new InternalServerError('Internal server error'));
    }
  }
}
