import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";

import * as jwt from "jsonwebtoken";


export class UserInterceptor implements NestInterceptor{
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const req=context.switchToHttp().getRequest();

    const token = req?.headers?.authorization;
    console.log("xyz: ", req.headers);
    
    const user=await jwt.decode(token?.split(" ")[1]);
    console.log(user);
    req.user=user;

    return next.handle();
  }
}