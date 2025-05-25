import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function DeleteArticleSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Удаление статьи',
    }),
    ApiResponse({
      status: 200,
      description: 'Статья удалена',
    }),
    ApiNotFoundResponse({ description: 'Если статья не найдена' }),
    ApiUnauthorizedResponse({
      description: 'Если пользователь не авторизован.',
    }),
    ApiForbiddenResponse({
      description: 'Если пользователь пытается удалить не свою статью.',
    }),
    ApiBearerAuth(),
  );
}
