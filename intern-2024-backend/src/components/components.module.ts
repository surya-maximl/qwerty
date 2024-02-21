import { Module } from '@nestjs/common';
import { ComponentsService } from './components.service';
import { ComponentsController } from './components.controller';
import { ComponentEntity } from './entities/components.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ComponentEntity])],
  providers: [ComponentsService],
  controllers: [ComponentsController]
})
export class ComponentsModule { }
