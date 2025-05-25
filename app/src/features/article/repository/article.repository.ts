import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from '../domain/article.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArticleRepository {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  async save(article: Article): Promise<Article> {
    const articleResult = await this.articleRepository.save(article);

    return articleResult;
  }

  async getArticleById(articleId: string): Promise<Article | null> {
    const article = await this.articleRepository.findOne({
      where: { id: articleId },
    });

    return article;
  }

  async deleteArticleById(articleId: string): Promise<void> {
    await this.articleRepository.delete({
      id: articleId,
    });

    return;
  }
}
