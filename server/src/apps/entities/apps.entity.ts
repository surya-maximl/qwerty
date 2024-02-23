import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';


@Entity({ name: 'apps' })
export class AppEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name' })
  name: string;

  // @Column({ name: 'slug', unique: true })
  // slug: string;
  @Column({ name: 'icon', default: null })
  icon: string;

  @Column({ name: 'is_public', default: true })
  isPublic: boolean;

  @Column({ name: 'is_maintenance_on', default: false })
  isMaintenanceOn: boolean;

  @Column({ name: 'current_version_id', default: "v1" })
  currentVersionId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
  updatedAt: Date;

  // @ManyToOne(() => User, (user) => user.id)
  // @JoinColumn({ name: 'user_id' })
  // user: User;

  // @OneToMany(() => AppVersion, (appVersion) => appVersion.app, {
  //   onDelete: 'CASCADE',
  // })
  // appVersions: AppVersion[];
}
