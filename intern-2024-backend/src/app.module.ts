import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot(
    {
      type: 'postgres',
      host: "ep-gentle-king-a2bt7a21-pooler.eu-central-1.aws.neon.tech",
      port: 5432,
      username: "default",
      password: "KslXvpunw89D",
      database: "verceldb",
      entities: [],
      synchronize: true,
      ssl: true
    }
  ), TypeOrmModule.forFeature()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
