import { Inject, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { Organization } from 'src/organization/entities/organization.entity';
import { OrganizationUser } from 'src/organization_users/entities/organization_user.entity';

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
                entities:[ User, Organization, OrganizationUser],
                synchronize: true,
                ssl: true,
            }),
            inject:[ConfigService]
        })
    ]
})
export class DatabaseModule {}
