import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSettings } from './common/settings/apply-app-setting';
import { AppCoreConfig } from './common/settings/core/app.core.config';
import { swaggerSetting } from './common/settings/swagger-setting';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const appConfig = appContext.get<AppCoreConfig>(AppCoreConfig);
  const DynamicAppModule = await AppModule.forRoot(appConfig);
  const app = await NestFactory.create(DynamicAppModule);

  await appContext.close();

  const port = appConfig.environmentVariables.PORT;

  console.log(port);

  appSettings(app);

  swaggerSetting(app);

  await app.listen(port);
}
bootstrap();
