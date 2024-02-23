import { Module } from '@nestjs/common';
import { ComponentController } from './component.controller';
import { ComponentService } from './component.service';
import { ComponentEntity } from './entities/component.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([ComponentEntity])],
  controllers: [ComponentController],
  providers: [ComponentService]
})
export class ComponentModule {}
