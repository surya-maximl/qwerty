import { CanActivate, ExecutionContext } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/auth/entities/user.entity";
import { Repository } from "typeorm";

interface jwtPayload {
  name: string;
  id: string;
  iat: number;
  exp: number;
}

export class AuthGuard implements CanActivate {
  constructor(
    @InjectRepository(User) private readonly user: Repository<User>) { }

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const token = req?.headers?.authorization;
    try {
      // const user = await jwt.decode(token) as jwtPayload;
      const user = await jwt.verify(token?.split(" ")[1], process.env.JWT_TOKEN) as jwtPayload;
      console.log("sss", user);
      const findUser = await this.user.findOne({ where: { id: user.id } })
      if (!findUser) return false;
      return true;
    } catch (err) {
      return false;
    }
  }
}