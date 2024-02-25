import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: async (configService: ConfigService) => ({
                type: 'postgres',
                host: "dpg-cnborled3nmc73ai33l0-a.oregon-postgres.render.com",
                port: 5432,
                username: "tooljet_nusq_user",
                password: "ISIrcjg6p1HbBB5AgZjYnP4VpKjl84DO",
                database: "tooljet_nusq",
                autoLoadEntities: true,
                synchronize: true,
                ssl: true,
            }),
            inject: [ConfigService]
        })
    ]
})
export class DatabaseModule { }