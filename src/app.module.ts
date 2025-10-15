import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistrationModule } from './registration/registration.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST || '127.0.0.1',
      port: Number(process.env.MYSQL_DB_PORT) || 3306,
      username: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'test',
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
      logging: false,
    }),
    RegistrationModule,
  ],
})
export class AppModule {}
