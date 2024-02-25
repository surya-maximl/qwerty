import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';



@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name' })
  name: string;

  @Column()
  email: string;

  @Column({ name: 'password_digest' })
  password: string;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string;

  @Column({ default: false })
  validated: boolean

  @Column({ nullable: true })
  company: string;

  @CreateDateColumn({ default: new Date(), name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ default: new Date(), name: 'updated_at' })
  updatedAt: Date;
}

