import { IsString, IsOptional, IsNotEmpty, MinLength, IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';
import { lowercaseString, sanitizeInput } from 'src/helpers/utils.helper';

export class CreateUserDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }) => sanitizeInput(value))
  firstName: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => sanitizeInput(value))
  lastName: string;

  @IsEmail()
  @Transform(({ value }) => lowercaseString(value))
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MinLength(5, { message: 'Password should contain more than 5 letters' })
  password: string;

  @IsString()
  @IsOptional()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }) => sanitizeInput(value))
  companyName: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  companySize: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  organizationToken: string;

  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => sanitizeInput(value))
  role: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => sanitizeInput(value))
  source: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => sanitizeInput(value))
  status: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  organizationId: string;
}