import { ApiProperty } from '@nestjs/swagger';

export const PageNumberProperty = () =>
  ApiProperty({
    type: Number,
    description: 'Номер страницы',
    example: 0,
    required: false,
    default: 0,
  });

export const PageSizeInputProperty = () =>
  ApiProperty({
    type: Number,
    description: 'Размер страницы',
    example: 10,
    required: false,
    default: 10,
  });

export const SortByInputProperty = () =>
  ApiProperty({
    type: String,
    description: 'Поле для сортировки',
    example: 'createdAt',
    required: false,
    default: 'createdAt',
  });

export const SortDirectionInputProperty = () =>
  ApiProperty({
    type: String,
    description: 'направление сортировки',
    example: 'desc',
    required: false,
    default: 'desc',
    enum: ['asc', 'desc'],
  });
