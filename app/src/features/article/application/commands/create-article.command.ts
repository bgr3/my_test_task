import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ObjResult } from '../../../../common/utils/result/object-result';
import { InternalServerError } from '../../../../common/utils/result/custom-error';
import { ArticleInputModel } from '../../api/dto/input/create-article.dto';
import { Article } from '../../domain/article.entity';
import { ArticleRepository } from '../../repository/article.repository';
import { UserRepository } from '../../../user/repository/user.repository';
import { ArticleOutputModel } from '../../api/dto/output/article-output.dto';

export class CreateArticleCommand {
  constructor(
    public inputModel: ArticleInputModel,
    public userId: string,
  ) {}
}

@CommandHandler(CreateArticleCommand)
export class CreateArticleHandler implements ICommandHandler<CreateArticleCommand> {
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: CreateArticleCommand): Promise<ObjResult<ArticleOutputModel>> {
    const user = await this.userRepository.findUserById({ userId: command.userId });

    if (!user) return ObjResult.Err(new InternalServerError('Internal server error'));

    const { title, description } = command.inputModel;

    try {
      const newArticle = Article.createArticle({
        title,
        description,
        user,
      });

      const result = await this.articleRepository.save(newArticle);

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
