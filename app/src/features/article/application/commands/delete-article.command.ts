import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ObjResult } from '../../../../common/utils/result/object-result';
import { ForbiddenError, InternalServerError, NotFoundError } from '../../../../common/utils/result/custom-error';
import { ArticleRepository } from '../../repository/article.repository';
import { ArticleOutputModel } from '../../api/dto/output/article-output.dto';

export class DeleteArticleCommand {
  constructor(
    public id: string,
    public userId: string,
  ) {}
}

@CommandHandler(DeleteArticleCommand)
export class DeleteArticleHandler implements ICommandHandler<DeleteArticleCommand> {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async execute(command: DeleteArticleCommand): Promise<ObjResult<ArticleOutputModel>> {
    try {
      const article = await this.articleRepository.getArticleById(command.id);

      if (!article) return ObjResult.Err(new NotFoundError(''));

      // если user пытается удалить не свой post
      if (command.userId !== article.userId) {
        return ObjResult.Err(new ForbiddenError('User is trying to delete a article that is not his own'));
      }

      await this.articleRepository.deleteArticleById(command.id);

      return ObjResult.Ok();
    } catch (e) {
      return ObjResult.Err(new InternalServerError('Internal server error'));
    }
  }
}
