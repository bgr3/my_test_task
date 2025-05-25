import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiOperation, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { AccessTokenOutputModel } from '../../api/dto/output/login.output.dto';
import { LoginUserInputModel } from '../../api/dto/input/user-login.dto';
import { BasicBadRequestOutputType } from '../../../../common/models/basic-badquest.output.type';

export function LoginSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Вход в систему' }),
    ApiBody({ type: () => LoginUserInputModel }),
    ApiResponse({
      status: 201,
      description: 'Login произведён. JWT accessToken возвращается в body.',
      type: () => AccessTokenOutputModel,
    }),
    ApiBadRequestResponse({
      description: 'В случае ввода некорректных данных.',
      type: () => BasicBadRequestOutputType,
    }),
    ApiUnauthorizedResponse({ description: 'В случае неправильного логина или пароля.' }),
  );
}
