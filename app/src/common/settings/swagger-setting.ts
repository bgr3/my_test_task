/* eslint-disable @typescript-eslint/explicit-function-return-type,@typescript-eslint/ban-ts-comment */
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

export const swaggerSetting = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setVersion('0.1')
    .addBearerAuth()
    .addServer(``)
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.use(
    `/scalar`,
    apiReference({
      themes: 'saturn',
      spec: {
        content: document,
      },
    }),
  );

  console.log('swagger is enabled, /swagger ');
  SwaggerModule.setup(`/swagger`, app, document, {
    jsonDocumentUrl: `/swagger/json`,
  });
};
