import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as requestIp from 'request-ip';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({credentials: true});
  // app.use(cookieParser());
  app.use(requestIp.mw());
  await app.listen(3000);
}
bootstrap();
