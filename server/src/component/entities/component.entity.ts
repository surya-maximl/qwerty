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

  @Column()
  appId: string;

  @Column()
  userId: string;

  @Column({ type: 'double precision', nullable: true })
  top: number;

  @Column({ type: 'double precision', nullable: true })
  left: number;

  @Column({ type: 'double precision', nullable: true })
  width: number;

  @Column({ type: 'double precision', nullable: true })
  height: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  component: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  displayName: string;

  // @Column({ nullable: true })
  // parent: string;



  @Column('simple-json', { nullable: true })
  properties: any;

  @Column('simple-json', { name: 'general_properties', nullable: true })
  general: any;

  @Column('simple-json', { nullable: true })
  others: any;

  @Column('simple-json', { nullable: true })
  events: any;

  @Column('simple-json', { nullable: true })
  styles: any;

  @Column('simple-json', { nullable: true })
  validate: any;

  @Column('simple-json', { name: 'general_styles', nullable: true })
  generalStyles: any;

  @Column('simple-json', { nullable: true })
  definition: any;

  @Column('simple-json', { nullable: true })
  defaultSize: any;

  @Column('simple-json', { nullable: true })
  exposedVariables: any;

  @Column('simple-json', { nullable: true })
  actions: any;

  @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
  updatedAt: Date;



}
