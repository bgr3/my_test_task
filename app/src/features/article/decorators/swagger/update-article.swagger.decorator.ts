import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ArticleOutputModel } from '../../api/dto/output/article-output.dto';
import { ArticleBadRequestOutputType } from '../../api/dto/output/article-badquest.output.type';

export function UpdateArticleSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Обновление статьи',
    }),
    ApiResponse({
      status: 200,
      description: 'Статья обновлена',
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
    ApiForbiddenResponse({
      description: 'Если пользователь пытается изменить не свою статью.',
    }),
    ApiBearerAuth(),
  );
}
