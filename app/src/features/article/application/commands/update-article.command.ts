import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ObjResult } from '../../../../common/utils/result/object-result';
import { ForbiddenError, InternalServerError, NotFoundError } from '../../../../common/utils/result/custom-error';
import { ArticleInputModel } from '../../api/dto/input/create-article.dto';
import { ArticleRepository } from '../../repository/article.repository';
import { ArticleOutputModel } from '../../api/dto/output/article-output.dto';

export class UpdateArticleCommand {
  constructor(
    public inputModel: ArticleInputModel,
    public id: string,
    public userId: string,
  ) {}
}

@CommandHandler(UpdateArticleCommand)
export class UpdateArticleHandler implements ICommandHandler<UpdateArticleCommand> {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async execute(command: UpdateArticleCommand): Promise<ObjResult<ArticleOutputModel>> {
    try {
      const article = await this.articleRepository.getArticleById(command.id);

      if (!article) return ObjResult.Err(new NotFoundError(''));

      // если user пытается изменить не свой post
      if (command.userId !== article.userId) {
        return ObjResult.Err(new ForbiddenError('User is trying to update a article that is not his own'));
      }

      article.updateArticle(command.inputModel);

      const result = await this.articleRepository.save(article);

      // Маппинг доменной сущности Article в DTO для ответа клиенту
      const outputResult: ArticleOutputModel = {
        id: result.id,
        title: result.title,
        description: result.description,
        createdAt: result.createdAt.toISOString(), // дата в ISO-формате
        authorName: result.user.login,
      };

      return ObjResult.Ok(outputResult);
    } catch (e) {
      return ObjResult.Err(new InternalServerError('Internal server error'));
    }
  }
}
