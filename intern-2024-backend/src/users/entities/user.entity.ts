import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { OrganizationUser } from '../../organization_users/entities/organization_user.entity';
import { Organization } from '../../organization/entities/organization.entity';

import * as bcrypt from 'bcrypt';
import { SourceTypes, StatusTypes } from '../enum/data.enum';
import * as uuid from 'uuid';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hashSync(this.password, 10);
    }
  }

  // @BeforeInsert()
  // genarate(){
  //     this.id=uuid.v4();
  // }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column()
  email: string;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string;

  @Column({
    type: 'enum',
    enumName: 'user_status',
    name: 'status',
    enum: StatusTypes,
    default: StatusTypes.INVITED,
  })
  status: string;

  @Column({
    type: 'enum',
    enumName: 'source',
    name: 'source',
    enum: SourceTypes,
    default: SourceTypes.INVITE,
  })
  source: string;

  @Column({ name: 'avatar_id', nullable: true, default: null })
  avatarId?: string;

  @Column({ name: 'invitation_token', nullable: true, default: null })
  invitationToken?: string;

  @Column({ name: 'forgot_password_token', nullable: true, default: null })
  forgotPasswordToken?: string;

  @Column({ name: 'password_digest' })
  password: string;

  @Column({ name: 'organization_id' })
  defaultOrganizationId: string;

  @Column({ name: 'company_name', nullable: true, default: null })
  companyName?: string;

  @Column({ name: 'role', nullable: true, default: null })
  role?: string;

  @Column({ name: 'company_size', nullable: true, default: null })
  companySize?: string;

  @Column({ name: 'password_retry_count', default: 5 })
  passwordRetryCount: number;

  @CreateDateColumn({ default: new Date(), name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ default: new Date(), name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(
    () => OrganizationUser,
    (organizationUser) => organizationUser.user,
    { eager: true },
  )
  organizationUsers: OrganizationUser[];

  @ManyToOne(() => Organization, (organization) => organization.id)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  organizationId: string;
  organizationIds?: Array<string>;
  isPasswordLogin: boolean;
  isSSOLogin: boolean;
  sessionId: string;
}
