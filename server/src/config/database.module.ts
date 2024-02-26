import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
require('dotenv').config()


@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: async (configService: ConfigService) => ({
                type: 'postgres',
                url: process.env.NODE_ENV = 'dev' ? process.env.DEV_DATABASE_URL : process.env.PROD_DATABASE_URL
            }),
            inject: [ConfigService]
        })
    ]
})
export class DatabaseModule { }