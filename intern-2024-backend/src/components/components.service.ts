import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ComponentEntity } from './entities/components.entity';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class ComponentsService {
  constructor(
    @InjectRepository(ComponentEntity) private components: Repository<ComponentEntity>
  ) { }

  async getAllComponents(userId: string) {
    const components = await this.components.find({ where: { userId } });
    if (!components.length) throw new NotFoundException("Components not found");
    return components;
  }

  async getComponent(id: string, userId: string) {
    const component = await this.components.findOne({ where: { id, userId } });
    if (!component) throw new NotFoundException("No Component Found");
    return component;
  }

  async createComponent(content, id: string) {
    const name = content.name;
    const type = content.component;
    const component = await this.components.create({ name, component: type, userId: id });
    Object.assign(component, content);
    // console.log(component);
    const componentSave = await this.components.save(component);
    // console.log(componentSave);

    return componentSave
  }

  async updateComponent(id: string, attr: Partial<ComponentEntity>, userId: string) {
    const findComponent = await this.components.exists({ where: { id, userId } })
    if (!findComponent) throw new NotFoundException("No Component Found");
    const component = await this.components.findOne({ where: { id, userId } });
    // console.log(attr);
    Object.assign(component, attr);
    // console.log(component);
    return await this.components.save(component);
  }

  async deleteComponent(id: string, userId: string) {
    const findComponent = await this.components.exists({ where: { id, userId } })
    if (!findComponent) throw new NotFoundException("No Component Found");
    const deleteComponent = await this.components.delete(id);
    return { msg: "Component Deleted Successfully" };
  }
}
