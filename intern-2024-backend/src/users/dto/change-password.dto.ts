import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class ChangePasswordDto {
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty()
    @MinLength(5)
    newPassword: string;
  }