import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/auth/entities/user.entity';
import { AppEntity } from 'src/apps/entities/apps.entity';
import { ComponentEntity } from 'src/component/entities/component.entity';
require('dotenv').config()


@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: async (configService: ConfigService) => ({
                type: 'postgres',
                url: process.env.NODE_ENV = 'dev' ? process.env.DEV_DATABASE_URL : process.env.PROD_DATABASE_URL,
                synchronize: true,
                entities: [User, AppEntity, ComponentEntity],
                migrations: [__dirname + '/migrations/*{.ts,.js}'],
                cli: {
                    migrationsDir: __dirname + '/migrations/',
                },
            }),
            inject: [ConfigService]
        })
    ]
})
export class DatabaseModule { }