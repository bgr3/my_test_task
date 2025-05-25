import { ConfigModule } from '@nestjs/config';

import { Environments } from './common/settings/core/app.core.config';
import { getEnvFilePath } from './common/settings/determinate-env-path';

const environment = process.env.NODE_ENV as Environments;

export const configModule = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: getEnvFilePath(environment),
  ignoreEnvFile: false,
});
