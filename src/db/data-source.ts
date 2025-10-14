import { DataSource } from 'typeorm';
import 'dotenv/config';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: Number(process.env.MYSQL_DB_PORT) || 3306,
  username: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'test',
  entities: ['src/**/entities/*.entity{.ts,.js}'],
  synchronize: false,
  migrations: ['src/**/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  migrationsRun: false,
});
