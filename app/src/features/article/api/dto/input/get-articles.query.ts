import { IsIn, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { QueryFilter } from '../../../../../common/models/query_filter';

//поля по которым можно проводить сортировку
enum sortFieldsEnum {
  title = 'title',
  description = 'description',
  createdAt = 'createdAt',
  authorName = 'authorName',
}

export class GetArticles extends QueryFilter {
  @ApiProperty({
    type: String,
    description: 'Поле для сортировки',
    example: sortFieldsEnum.createdAt,
    required: false,
    default: sortFieldsEnum.createdAt,
    enum: sortFieldsEnum,
  })
  @IsOptional()
  @IsString()
  @IsIn([...Object.values(sortFieldsEnum)])
  sortBy: string = sortFieldsEnum.createdAt;
}
