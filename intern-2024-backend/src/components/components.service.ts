import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ComponentEntity } from './entities/components.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from 'rxjs';

@Injectable()
export class ComponentsService {
  constructor(
    @InjectRepository(ComponentEntity) private components: Repository<ComponentEntity>
  ) { }

  async getAllComponents() {
    const components = await this.components.find();
    if (!components.length) throw new NotFoundException("Components not found");
    return components;
  }

  async getComponent(id: string) {
    const component = await this.components.findOne({ where: { id } });
    if (!component) throw new NotFoundException("No Component Found");
    return component;
  }

  async createComponent(content) {
    const name = content.name;
    const type = content.component;
    const component = await this.components.create({ name, component: type });
    Object.assign(component, content);
    // console.log(component);
    const componentSave = await this.components.save(component);
    // console.log(componentSave);

    return componentSave
  }

  async updateComponent(id: string, attr: Partial<ComponentEntity>) {
    const findComponent = await this.components.exists({ where: { id } })
    if (!findComponent) throw new NotFoundException("No Component Found");
    const component = await this.components.findOne({ where: { id } });
    // console.log(attr);
    Object.assign(component, attr);
    // console.log(component);
    return await this.components.save(component);
  }

  async deleteComponent(id: string) {
    const findComponent = await this.components.exists({ where: { id } })
    if (!findComponent) throw new NotFoundException("No Component Found");
    const deleteComponent = await this.components.delete(id);
    return { msg: "Component Deleted Successfully" };
  }
}
