import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SessionService } from './session.service';
import { UserSessions } from './entities/user_sessions.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User, UserSessions])],
  controllers: [UsersController],
  providers: [UsersService, SessionService],
  exports:[UsersService, SessionService]
})
export class UsersModule {}
