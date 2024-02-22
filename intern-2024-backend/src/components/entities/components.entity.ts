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
// @Index('idx_component_page_id', ['pageId'])
export class ComponentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'double precision' })
  top: number;

  @Column({ type: 'double precision' })
  left: number;

  @Column({ type: 'double precision' })
  width: number;

  @Column({ type: 'double precision' })
  height: number;

  @Column()
  name: string;

  @Column()
  component: string;

  @Column()
  description: string;

  @Column()
  displayName: string;

  // @Column({ nullable: true })
  // parent: string;



  @Column('simple-json')
  properties: any;

  @Column('simple-json', { name: 'general_properties', nullable: true })
  general: any;

  @Column('simple-json')
  others: any;

  @Column('simple-json')
  events: any;

  @Column('simple-json')
  styles: any;

  @Column('simple-json')
  validate: any;

  @Column('simple-json', { name: 'general_styles', nullable: true })
  generalStyles: any;

  @Column('simple-json')
  definition: any;

  @Column('simple-json')
  defaultSize: any;

  @Column('simple-json')
  exposedVariables: any;

  @Column('simple-json')
  actions: any;

  @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
  updatedAt: Date;



}
