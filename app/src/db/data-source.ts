import dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config({ path: 'app_environments/.local.env' });

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_APP_URL,
  synchronize: false,
  entities: ['app/src/**/*entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
});
