import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from '../domain/article.entity';
import { Repository } from 'typeorm';
import { QueryFilter } from '../../../common/models/query_filter';
import { ArticleOutputModel } from '../api/dto/output/article-output.dto';
import { Paginator } from '../../../common/models/paginator';

@Injectable()
export class ArticleQueryRepository {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  async findArticles(filter: QueryFilter): Promise<Paginator<ArticleOutputModel>> {
    const skip = (filter.pageNumber - 1) * filter.pageSize;

    //это необходимо, т.к. сортировка может происходить по присоединённой сущности
    const sortBy = filter.sortBy === 'authorName' ? 'u.login' : `a.${filter.sortBy}`;

    let queryBuilder;
    let dbResult;
    try {
      queryBuilder = await this.articleRepository
        .createQueryBuilder('a')
        .select()
        .leftJoin('a.user', 'u')
        .addSelect('u.login');

      dbResult = await queryBuilder
        .orderBy(sortBy, filter.sortDirection == 'asc' ? 'ASC' : 'DESC')
        .offset(skip)
        .limit(filter.pageSize)
        .getManyAndCount();
    } catch (err) {
      console.log(err);
      dbResult = [[], 0];
    }

    const dbCount = dbResult[1];

    const paginator = {
      pagesCount: Math.ceil(dbCount / filter.pageSize),
      page: filter.pageNumber,
      pageSize: filter.pageSize,
      totalCount: dbCount,
      items: dbResult[0].map((a: Article) => articleMapper(a)),
    };

    return paginator;
  }
}

const articleMapper = (article: Article): ArticleOutputModel => {
  return {
    id: article.id,
    title: article.title,
    description: article.description,
    createdAt: article.createdAt.toISOString(),
    authorName: article.user.login,
  };
};
