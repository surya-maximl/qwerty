import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';


@Entity({ name: 'components' })
@Index('idx_component_page_id', ['pageId'])
export class ComponentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column({ nullable: true })
  parent: string;

  @Column('simple-json')
  properties: any;

  @Column('simple-json', { name: 'general_properties', nullable: true })
  general: any;

  @Column('simple-json')
  styles: any;

  @Column('simple-json', { name: 'general_styles', nullable: true })
  generalStyles: any;

  @Column('simple-json', { name: 'display_preferences', nullable: true })
  displayPreferences: any;

  @Column('simple-json')
  validation: any;

  @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'double precision' })
  top: number;

  @Column({ type: 'double precision' })
  left: number;

  @Column({ type: 'double precision' })
  width: number;

  @Column({ type: 'double precision' })
  height: number;

}
