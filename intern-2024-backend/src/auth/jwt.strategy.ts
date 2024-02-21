import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { SessionService } from 'src/users/session.service';
import { UsersService } from 'src/users/users.service';

type JWTPayload = {
    sessionId: string;
    username: string;
    email: string;
    organizationId?: string;
    organizationIds?: Array<string>;
    isPasswordLogin: boolean;
    isSSOLogin: boolean;
  };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly sessionService: SessionService,
  ) {
    super({
      jwtFromRequest: (req) => {
        return req?.headers?.cookie?.split('=')[1];
      },
      ignoreExpiration: true,
      secretOrKey: 'jisusjdbcudsic',
      passReqToCallback: true,
    });
  }

  async validate(req:Request, payload:JWTPayload){
    await this.sessionService.validateUserSession(payload.username,payload.sessionId);
    const user = await this.usersService.findByEmail(payload.email);
    user.organizationIds = payload.organizationIds;
    // console.log(user);
    return user;
  }
}
