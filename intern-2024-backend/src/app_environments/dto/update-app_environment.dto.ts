import { PartialType } from '@nestjs/mapped-types';
import { CreateAppEnvironmentDto } from './create-app_environment.dto';

export class UpdateAppEnvironmentDto extends PartialType(CreateAppEnvironmentDto) {}
