import { ApiProperty } from '@nestjs/swagger';
import { BasicBadRequestOutputType } from '../../../../../common/models/basic-badquest.output.type';

class ArticleBadReqField {
  @ApiProperty({ description: 'причина', example: 'title must be longer than or equal to 5 characters' })
  'message': string;
  @ApiProperty({ description: 'поле вызвавшее ошибку', example: 'title' })
  'field': string;
}

export class ArticleBadRequestOutputType extends BasicBadRequestOutputType {
  @ApiProperty({ description: 'эндпнойт с ошибкой', example: '/article' })
  'path': string;

  @ApiProperty({ type: () => [ArticleBadReqField] })
  'fields': ArticleBadReqField[];
}
