import { Module } from '@nestjs/common';
import { AppsController } from './apps.controller';
import { AppsService } from './apps.service';
import { AppEntity } from './entities/app.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AppEntity])],
  controllers: [AppsController],
  providers: [AppsService]
})
export class AppsModule { }
