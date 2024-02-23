import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports:[
        TypeOrmModule.forRootAsync({
            useFactory:async(configService: ConfigService)=> ({
                type: 'postgres',
                host: "ep-gentle-king-a2bt7a21-pooler.eu-central-1.aws.neon.tech",
                port: 5432,
                username: "default",
                password: "KslXvpunw89D",
                database: "verceldb",
                autoLoadEntities:true,
                synchronize: true,
                ssl: true,
            }),
            inject:[ConfigService]
        })
    ]
})
export class DatabaseModule {}