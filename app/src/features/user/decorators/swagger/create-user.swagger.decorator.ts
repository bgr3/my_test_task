import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserRegistrationOutputModel } from '../../api/dto/output/registratio.output.dto';
import { BasicBadRequestOutputType } from '../../../../common/models/basic-badquest.output.type';

export function CreateUserSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Регистрация пользователя',
    }),
    ApiResponse({
      status: 201,
      type: UserRegistrationOutputModel,
    }),
    ApiResponse({
      status: 400,
      description: 'В случае не валидных данных',
      type: BasicBadRequestOutputType,
    }),
    ApiBearerAuth(),
  );
}
