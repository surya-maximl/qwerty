import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserInterceptor } from './user/interceptors/user.interceptor';
import { ConfigModule} from '@nestjs/config';
import { DatabaseModule } from './config/database.module';
import { AppsModule } from './apps/apps.module';
import { ComponentModule } from './component/component.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),UserModule,DatabaseModule, AppsModule, ComponentModule],
  controllers: [AppController],
  providers: [AppService,
  {
    provide:APP_INTERCEPTOR,
    useClass:UserInterceptor
  }],
})
export class AppModule {}
