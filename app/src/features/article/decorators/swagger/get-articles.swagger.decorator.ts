import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { PaginatorArticleOutputModel } from '../../api/dto/output/article-output.dto';

export function GetArticlesSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Получение всех статей с пагинацией',
    }),
    ApiResponse({
      status: 200,
      type: PaginatorArticleOutputModel,
    }),
    ApiResponse({
      status: 400,
      description: 'В случае не валидных query параметров',
    }),
    ApiBearerAuth(),
  );
}
