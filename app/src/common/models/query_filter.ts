import { Transform, TransformFnParams } from 'class-transformer';
import { IsIn, IsOptional, IsPositive, IsString, Max } from 'class-validator';
import {
  PageNumberProperty,
  PageSizeInputProperty,
  SortByInputProperty,
  SortDirectionInputProperty,
} from '../decorators/query.input.swagger.decorator';

export class QueryFilter {
  @PageNumberProperty()
  @IsOptional()
  @Transform((value: TransformFnParams) => parseInt(value.value, 10))
  @IsPositive()
  @Max(10000)
  pageNumber: number = 1;

  @PageSizeInputProperty()
  @IsOptional()
  @Transform((value: TransformFnParams) => parseInt(value.value, 10))
  @IsPositive()
  @Max(10000)
  pageSize: number = 10;

  @SortByInputProperty()
  @IsOptional()
  @IsString()
  sortBy: string = 'createdAt';

  @SortDirectionInputProperty()
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortDirection: sortDirectionType = 'desc';
}

type sortDirectionType = 'asc' | 'desc';
