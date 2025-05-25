import { ApiProperty } from '@nestjs/swagger';

export const titleApiProperty = () =>
  ApiProperty({
    type: String,
    description: 'Название статьи',
    example: 'В зоопарке впервые родился детеныш панды',
    required: true,
    pattern: '^[a-zA-Z0-9_-]+$',
    minLength: 5,
    maxLength: 100,
  });

export const descriptionApiProperty = () =>
  ApiProperty({
    type: String,
    description: 'Описание статьи',
    example:
      'Большие панды находятся под угрозой исчезновения в мире в основном из-за потери среды обитания ― бамбуковых лесов, необходимых пандам для питания и проживания',
    required: true,
    pattern: '^[a-zA-Z0-9_-]+$',
    minLength: 5,
    maxLength: 1000,
  });
