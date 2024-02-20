import { Module } from '@nestjs/common';
import { AppEnvironmentsService } from './app_environments.service';
import { AppEnvironmentsController } from './app_environments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppEnvironment } from './entities/app_environment.entity';

@Module({
  imports:[TypeOrmModule.forFeature([AppEnvironment])],
  controllers: [AppEnvironmentsController],
  providers: [AppEnvironmentsService],
  exports:[AppEnvironmentsService]
})
export class AppEnvironmentsModule {}
