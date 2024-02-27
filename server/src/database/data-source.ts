import * as dotenv from 'dotenv';
import { AppEntity } from 'src/apps/entities/apps.entity';
import { ComponentEntity } from 'src/component/entities/component.entity';
import { User } from 'src/user/auth/entities/user.entity';
dotenv.config();
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  url: process.env.NODE_ENV = 'dev' ? process.env.DEV_DATABASE_URL : process.env.PROD_DATABASE_URL,
  synchronize: true,
  entities: [User, AppEntity, ComponentEntity],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migration_table',
});