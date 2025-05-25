import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { ArticleOutputModel } from '../../api/dto/output/article-output.dto';
import { ArticleBadRequestOutputType } from '../../api/dto/output/article-badquest.output.type';

export function CreateArticleSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Создание статьи',
    }),
    ApiResponse({
      status: 201,
      description: 'Статья создана',
      type: ArticleOutputModel,
    }),
    ApiResponse({
      status: 400,
      description: 'В случае не валидных данных',
      type: ArticleBadRequestOutputType,
    }),
    ApiUnauthorizedResponse({
      description: 'Если пользователь не авторизован.',
    }),
    ApiBearerAuth(),
  );
}
