import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppsController } from './apps.controller';
import { AppsService } from './apps.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppEntity } from './entities/apps.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { User } from 'src/user/auth/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AppEntity, User])],
  controllers: [AppsController],
  providers: [AppsService, {
    provide: APP_INTERCEPTOR,
    useClass: ClassSerializerInterceptor
  }]
})
export class AppsModule { }
