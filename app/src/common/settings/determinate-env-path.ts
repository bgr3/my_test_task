import { join } from 'path';

import { Environments } from './core/app.core.config';

export function getEnvFilePath(env: Environments): string[] {
  const defaultEnvFilePath = [join('app_environments', '.local.env'), join('app_environments', '.development.env')];

  if (env === Environments.TEST)
    return [join('app_environments', '.local.test.env'), join('app_environments', '.test.env'), ...defaultEnvFilePath];

  return defaultEnvFilePath;
}
