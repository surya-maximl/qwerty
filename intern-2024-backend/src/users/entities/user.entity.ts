import { BaseEntity, BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { OrganizationUser } from "../../organization_users/entities/organization_user.entity";
import { Organization } from "../../organization/entities/organization.entity";


import * as bcrypt from "bcrypt";
import { SourceTypes, StatusTypes } from "../enum/data.enum";

@Entity({name: 'users'})
export class User extends BaseEntity{

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword(){
        if(this.password){
            this.password = await bcrypt.hashSync(this.password,10);
        }
    }
    
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({name:'first_name'})
    firstName:string;

    @Column({name:'last_name'})
    lastName:string;

    @Column()
    email:string;

    @Column({ name: 'phone_number' })
    phoneNumber: string;

    @Column({
        type:'enum',
        enumName:'status',
        name:'status',
        enum:StatusTypes,
        default:StatusTypes.INVITED
    })
    status:string;

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

    @Column({ name: 'invitation_token' })
    invitationToken: string;

    @Column({ name: 'forgot_password_token' })
    forgotPasswordToken: string;

    @Column({ name: 'password_digest' })
    password: string;

    @Column({ name: 'organization_id' })
    defaultOrganizationId: string;

    @Column({ name: 'company_name' })
    companyName: string;

    @Column({ name: 'role' })
    role: string;

    @Column({ name: 'company_size' })
    companySize: string;

    @Column({ name: 'password_retry_count' })
    passwordRetryCount: number;

    @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => OrganizationUser, (organizationUser) => organizationUser.user, { eager: true })
    organizationUsers: OrganizationUser[];

    // @ManyToOne(() => Organization, (organization) => organization.id)
    // @JoinColumn({ name: 'organization_id' })
    // organization: Organization;;

}

