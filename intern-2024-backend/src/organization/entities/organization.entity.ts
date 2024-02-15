import { OrganizationUser } from '../../organization_users/entities/organization_user.entity';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    JoinColumn,
    BaseEntity,
  } from 'typeorm';
  
  @Entity({ name: 'organizations' })
  export class Organization extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ name: 'name', unique: true })
    name: string;
  
    @Column({ name: 'slug', unique: true })
    slug: string;
  
    @Column({ name: 'domain' })
    domain: string;
  
    @Column({ name: 'enable_sign_up' })
    enableSignUp: boolean;
  
    @Column({ name: 'inherit_sso' })
    inheritSSO: boolean;
  
    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => OrganizationUser, (organizationUser) => organizationUser.organization)
    organizationUsers: OrganizationUser[];
  }
  
