import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppsController } from './apps.controller';
import { AppsService } from './apps.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppEntity } from './entities/apps.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports:[TypeOrmModule.forFeature([AppEntity])],
  controllers: [AppsController],
  providers: [AppsService,{
    provide:APP_INTERCEPTOR,
    useClass:ClassSerializerInterceptor
  }]
})
export class AppsModule {}
