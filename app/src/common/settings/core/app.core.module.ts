import { Module } from '@nestjs/common';

import { AppCoreConfig } from './app.core.config';

@Module({
  providers: [AppCoreConfig],
  exports: [AppCoreConfig],
})
export class AppCoreModule {}
