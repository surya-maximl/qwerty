import { Organization } from '../../organization/entities/organization.entity';
import {User} from "../../users/entities/user.entity"
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    BaseEntity,
    Unique,
    BeforeInsert,
    PrimaryColumn,
  } from 'typeorm';
import * as uuid from 'uuid';

  @Entity({ name: 'organization_users' })
  @Unique(['userId', 'organizationId'])
  export class OrganizationUser extends BaseEntity {
    // @BeforeInsert() 
    // genarate(){ 
    //     this.id=uuid.v4();
    // }
    
    @PrimaryGeneratedColumn('uuid')
    id:string;
  
    @Column()
    role: string;
  
    @Column({ type: 'enum', name:'status', enumName: 'status', enum: ['invited', 'active', 'archived'] })
    status: string;
  
    @Column({ name: 'organization_id' })
    organizationId: string;
  
    @Column({ name: 'user_id' })
    userId: string;
  
    @Column({ name: 'invitation_token' })
    invitationToken: string;
  
    @CreateDateColumn({ default: new Date(), name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ default: new Date(), name: 'updated_at' })
    updatedAt: Date;
  
    @ManyToOne(() => Organization, (organization) => organization.id)
    @JoinColumn({ name: 'organization_id' })
    organization: Organization;
  
    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'user_id' })
    user: User;
  }
  