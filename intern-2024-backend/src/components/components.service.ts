import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ComponentEntity } from './entities/components.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ComponentsService {
  constructor(
    @InjectRepository(ComponentEntity) private components: Repository<ComponentEntity>
  ) { }

  async getAllComponents() {

  }
}
