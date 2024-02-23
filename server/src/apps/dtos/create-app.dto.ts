import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateAppDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50, { message: 'Maximum length is 50 characters' })
  name: string;
}