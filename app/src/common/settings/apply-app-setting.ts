import { INestApplication, ValidationPipe } from '@nestjs/common';
import { BadRequestError } from '../utils/result/custom-error';
import { CustomExceptionFilter, ErrorExceptionFilter, HttpExceptionFilter } from '../utils/result/exceprion-filter';

export const appSettings = (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const result = errors.map((e) => ({
          message: Object.values(e.constraints!)[0],
          field: e.property,
        }));

        throw new BadRequestError('incorrect input dto', result);
      },
    }),
  );

  app.enableCors({
    credentials: true,
    origin: ['http://localhost:3000'],
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
  });

  app.useGlobalFilters(new ErrorExceptionFilter(), new HttpExceptionFilter(), new CustomExceptionFilter());
};
