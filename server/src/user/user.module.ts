import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { User } from './auth/entities/user.entity';
import { DatabaseModule } from 'src/config/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';



@Module({
  imports:[TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService]
})
export class UserModule {}
